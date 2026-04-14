
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const threadId = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'sebuah comment yang dihapus',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        comment_id: 'comment-123',
        is_delete: false,
      },
      {
        id: 'reply-456',
        content: 'balasan yang dihapus',
        date: '2021-08-08T08:07:01.522Z',
        username: 'dicoding',
        comment_id: 'comment-123',
        is_delete: true,
      },
    ];

    const mockThreadRepository = {};
    const mockCommentRepository = {};
    const mockReplyRepository = {};

    mockThreadRepository.getThreadById = vi.fn(() => Promise.resolve({ ...mockThread }));
    mockCommentRepository.getCommentsByThreadId = vi.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentIds = vi.fn(() => Promise.resolve(mockReplies));

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await useCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(['comment-123', 'comment-456']);

    expect(threadDetail.id).toEqual('thread-123');
    expect(threadDetail.title).toEqual('sebuah thread');
    expect(threadDetail.body).toEqual('sebuah body thread');
    expect(threadDetail.date).toEqual('2021-08-08T07:19:09.775Z');
    expect(threadDetail.username).toEqual('dicoding');

    expect(threadDetail.comments).toHaveLength(2);
    expect(threadDetail.comments[0].content).toEqual('sebuah comment');
    expect(threadDetail.comments[1].content).toEqual('**komentar telah dihapus**');

    expect(threadDetail.comments[0].replies).toHaveLength(2);
    expect(threadDetail.comments[0].replies[0].content).toEqual('sebuah balasan');
    expect(threadDetail.comments[0].replies[1].content).toEqual('**balasan telah dihapus**');

    expect(threadDetail.comments[1].replies).toHaveLength(0);
  });
});
