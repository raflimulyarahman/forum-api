
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment and return added comment correctly', async () => {
      const newComment = new NewComment({ content: 'sebuah comment' });
      const fakeIdGenerator = () => '123';
      const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepo.addComment(newComment, 'thread-123', 'user-123');

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepo = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepo.verifyCommentExists('comment-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepo = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepo.verifyCommentExists('comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when not the owner', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepo = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepo.verifyCommentOwner('comment-123', 'user-456')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when is the owner', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepo = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepo.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should soft delete comment correctly', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepo = new CommentRepositoryPostgres(pool, {});

      await commentRepo.deleteCommentById('comment-123');

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments for thread correctly', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', date: '2021-08-08T07:22:33.555Z' });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId: 'thread-123', date: '2021-08-08T07:26:21.338Z' });

      const commentRepo = new CommentRepositoryPostgres(pool, {});
      const comments = await commentRepo.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[1].id).toEqual('comment-456');
    });
  });
});
