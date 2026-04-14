
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread and return added thread correctly', async () => {
      const newThread = new NewThread({ title: 'sebuah thread', body: 'sebuah body thread' });
      const fakeIdGenerator = () => '123';
      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepo.addThread(newThread, 'user-123');

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepo = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepo.verifyThreadExists('thread-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepo = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepo.verifyThreadExists('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepo = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepo.getThreadById('thread-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should return thread correctly', async () => {
      const date = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'sebuah thread', body: 'sebuah body', owner: 'user-123', date });
      const threadRepo = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepo.getThreadById('thread-123');

      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('sebuah thread');
      expect(thread.body).toEqual('sebuah body');
      expect(thread.username).toEqual('dicoding');
      expect(thread.date).toBeDefined();
    });
  });
});
