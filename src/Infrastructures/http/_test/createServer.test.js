
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const BcryptPasswordHash = require('../../security/BcryptPasswordHash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

// Create a real container for functional tests
const UserRepositoryPostgres = require('../../repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('../../repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('../../repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../../repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../../repository/ReplyRepositoryPostgres');
const JwtTokenManager = require('../../security/JwtTokenManager');
const AddUserUseCase = require('../../../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../../Applications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadDetailUseCase = require('../../../Applications/use_case/GetThreadDetailUseCase');
const AddReplyUseCase = require('../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../Applications/use_case/DeleteReplyUseCase');

const createTestContainer = () => {
  const userRepository = new UserRepositoryPostgres(pool, nanoid);
  const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
  const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
  const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
  const passwordHash = new BcryptPasswordHash(bcrypt);
  const authenticationTokenManager = new JwtTokenManager(jwt);

  return {
    addUserUseCase: new AddUserUseCase({ userRepository, passwordHash }),
    loginUserUseCase: new LoginUserUseCase({
      userRepository, authenticationRepository, authenticationTokenManager, passwordHash,
    }),
    logoutUserUseCase: new LogoutUserUseCase({ authenticationRepository }),
    refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
      authenticationRepository, authenticationTokenManager,
    }),
    addThreadUseCase: new AddThreadUseCase({ threadRepository }),
    addCommentUseCase: new AddCommentUseCase({ commentRepository, threadRepository }),
    deleteCommentUseCase: new DeleteCommentUseCase({ commentRepository, threadRepository }),
    getThreadDetailUseCase: new GetThreadDetailUseCase({
      threadRepository, commentRepository, replyRepository,
    }),
    addReplyUseCase: new AddReplyUseCase({ replyRepository, commentRepository, threadRepository }),
    deleteReplyUseCase: new DeleteReplyUseCase({ replyRepository, commentRepository, threadRepository }),
  };
};

// Helper to make HTTP requests to Express app
const makeRequest = (app, { method, path, payload, headers = {} }) => {
  return new Promise((resolve) => {
    const http = require('http');
    const server = app.listen(0, () => {
      const port = server.address().port;
      const postData = payload ? JSON.stringify(payload) : '';
      const options = {
        hostname: 'localhost',
        port,
        path,
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          server.close();
          resolve({
            statusCode: res.statusCode,
            result: JSON.parse(data),
          });
        });
      });

      if (postData) req.write(postData);
      req.end();
    });
  });
};

describe('HTTP Server', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /users', () => {
    it('should respond 201 and persist user', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });

      expect(response.statusCode).toEqual(201);
      expect(response.result.status).toEqual('success');
      expect(response.result.data.addedUser).toBeDefined();
    });

    it('should respond 400 when request payload not contain needed property', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/users',
        payload: { username: 'dicoding', password: 'secret' },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.result.status).toEqual('fail');
      expect(response.result.message).toEqual('pendaftaran user baru gagal karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 400 when username has invalid data type', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/users',
        payload: { username: 123, password: 'secret', fullname: 'Dicoding Indonesia' },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.result.status).toEqual('fail');
      expect(response.result.message).toEqual('pendaftaran user baru gagal karena tipe data tidak sesuai spesifikasi');
    });

    it('should respond 400 when username exceeds 50 characters', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/users',
        payload: { username: 'a'.repeat(51), password: 'secret', fullname: 'Dicoding Indonesia' },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.result.status).toEqual('fail');
      expect(response.result.message).toEqual('pendaftaran user baru gagal karena username melebihi batas 50 karakter');
    });

    it('should respond 400 when username contains restricted characters', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/users',
        payload: { username: 'dico-ding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.result.status).toEqual('fail');
      expect(response.result.message).toEqual('pendaftaran user baru gagal karena username mengandung karakter terlarang');
    });
  });

  describe('POST /authentications', () => {
    it('should respond 201 with tokens', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      // Register first
      await makeRequest(app, {
        method: 'POST',
        path: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });

      expect(response.statusCode).toEqual(201);
      expect(response.result.status).toEqual('success');
      expect(response.result.data.accessToken).toBeDefined();
      expect(response.result.data.refreshToken).toBeDefined();
    });

    it('should respond 400 when login payload not contain needed property', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/authentications',
        payload: { username: 'dicoding' },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.result.status).toEqual('fail');
      expect(response.result.message).toEqual('login gagal karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 400 when login payload has invalid data type', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/authentications',
        payload: { username: 123, password: 'secret' },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.result.status).toEqual('fail');
      expect(response.result.message).toEqual('login gagal karena tipe data tidak sesuai spesifikasi');
    });
  });

  describe('POST /threads', () => {
    it('should respond 401 when no auth token', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/threads',
        payload: { title: 'sebuah thread', body: 'sebuah body thread' },
      });

      expect(response.statusCode).toEqual(401);
    });

    it('should respond 201 and persist thread', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const accessToken = ServerTestHelper.getAccessToken();

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/threads',
        payload: { title: 'sebuah thread', body: 'sebuah body thread' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(201);
      expect(response.result.status).toEqual('success');
      expect(response.result.data.addedThread).toBeDefined();
    });

    it('should respond 400 when request payload not contain needed property', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const accessToken = ServerTestHelper.getAccessToken();

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/threads',
        payload: { title: 'sebuah thread' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.result.status).toEqual('fail');
      // Verify other domain errors remain untranslated (not translated)
      expect(response.result.message).toEqual('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });

  describe('POST /threads/{threadId}/comments', () => {
    it('should respond 201 and persist comment', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const accessToken = ServerTestHelper.getAccessToken();

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/threads/thread-123/comments',
        payload: { content: 'sebuah comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(201);
      expect(response.result.status).toEqual('success');
      expect(response.result.data.addedComment).toBeDefined();
    });

    it('should respond 404 when thread not found', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const accessToken = ServerTestHelper.getAccessToken();

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/threads/thread-xxx/comments',
        payload: { content: 'sebuah comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(404);
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond 200', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const accessToken = ServerTestHelper.getAccessToken();

      const response = await makeRequest(app, {
        method: 'DELETE',
        path: '/threads/thread-123/comments/comment-123',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(200);
      expect(response.result.status).toEqual('success');
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('should respond 200 and return thread detail', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });

      const response = await makeRequest(app, {
        method: 'GET',
        path: '/threads/thread-123',
      });

      expect(response.statusCode).toEqual(200);
      expect(response.result.status).toEqual('success');
      expect(response.result.data.thread).toBeDefined();
      expect(response.result.data.thread.comments).toBeDefined();
    });

    it('should respond 404 when thread not found', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      const response = await makeRequest(app, {
        method: 'GET',
        path: '/threads/thread-xxx',
      });

      expect(response.statusCode).toEqual(404);
    });
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should respond 201 and persist reply', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const accessToken = ServerTestHelper.getAccessToken();

      const response = await makeRequest(app, {
        method: 'POST',
        path: '/threads/thread-123/comments/comment-123/replies',
        payload: { content: 'sebuah balasan' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(201);
      expect(response.result.status).toEqual('success');
      expect(response.result.data.addedReply).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should respond 200', async () => {
      const container = createTestContainer();
      const app = createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const accessToken = ServerTestHelper.getAccessToken();

      const response = await makeRequest(app, {
        method: 'DELETE',
        path: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(200);
      expect(response.result.status).toEqual('success');
    });
  });
});
