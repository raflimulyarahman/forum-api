const LikeCommentUseCase = require('../LikeCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository');

describe('LikeCommentUseCase', () => {
  it('should add like when user has not liked the comment', async () => {
    // Arrange
    const userId = 'user-123';
    const commentId = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.checkLikeExists = vi.fn().mockResolvedValue(false);
    mockCommentLikeRepository.addLike = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.removeLike = vi.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(userId, commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(commentId);
    expect(mockCommentLikeRepository.checkLikeExists).toHaveBeenCalledWith(userId, commentId);
    expect(mockCommentLikeRepository.addLike).toHaveBeenCalledWith(userId, commentId);
    expect(mockCommentLikeRepository.removeLike).not.toHaveBeenCalled();
  });

  it('should remove like when user has already liked the comment', async () => {
    // Arrange
    const userId = 'user-123';
    const commentId = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.checkLikeExists = vi.fn().mockResolvedValue(true);
    mockCommentLikeRepository.removeLike = vi.fn().mockResolvedValue();
    mockCommentLikeRepository.addLike = vi.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(userId, commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(commentId);
    expect(mockCommentLikeRepository.checkLikeExists).toHaveBeenCalledWith(userId, commentId);
    expect(mockCommentLikeRepository.removeLike).toHaveBeenCalledWith(userId, commentId);
    expect(mockCommentLikeRepository.addLike).not.toHaveBeenCalled();
  });

  it('should throw error when comment does not exist', async () => {
    // Arrange
    const userId = 'user-123';
    const commentId = 'comment-invalid';

    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.verifyCommentExists = vi
      .fn()
      .mockRejectedValue(new Error('COMMENT_REPOSITORY.COMMENT_NOT_FOUND'));

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute(userId, commentId))
      .rejects
      .toThrow('COMMENT_REPOSITORY.COMMENT_NOT_FOUND');
  });
});
