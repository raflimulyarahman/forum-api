
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply and return added reply correctly', async () => {
      const newReply = new NewReply({ content: 'sebuah balasan' });
      const fakeIdGenerator = () => '123';
      const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepo.addReply(newReply, 'comment-123', 'user-123');

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepo = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepo.verifyReplyExists('reply-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepo = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepo.verifyReplyExists('reply-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepo = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepo.verifyReplyOwner('reply-xxx', 'user-123')).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when not the owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepo = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepo.verifyReplyOwner('reply-123', 'user-456')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when is the owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepo = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepo.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should soft delete reply correctly', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepo = new ReplyRepositoryPostgres(pool, {});

      await replyRepo.deleteReplyById('reply-123');

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return replies for comments correctly', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', date: '2021-08-08T07:59:48.766Z' });
      await RepliesTableTestHelper.addReply({ id: 'reply-456', commentId: 'comment-123', date: '2021-08-08T08:07:01.522Z' });

      const replyRepo = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepo.getRepliesByCommentIds(['comment-123']);

      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[1].id).toEqual('reply-456');
    });

    it('should return empty array when no comment ids given', async () => {
      const replyRepo = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepo.getRepliesByCommentIds([]);
      expect(replies).toHaveLength(0);
    });
  });
});
