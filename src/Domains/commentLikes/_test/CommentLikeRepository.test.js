const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository abstract class', () => {
  it('should throw error when addLike method is not implemented', async () => {
    // Arrange
    const repository = new CommentLikeRepository();

    // Action & Assert
    await expect(repository.addLike('user-123', 'comment-123'))
      .rejects
      .toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when removeLike method is not implemented', async () => {
    // Arrange
    const repository = new CommentLikeRepository();

    // Action & Assert
    await expect(repository.removeLike('user-123', 'comment-123'))
      .rejects
      .toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when checkLikeExists method is not implemented', async () => {
    // Arrange
    const repository = new CommentLikeRepository();

    // Action & Assert
    await expect(repository.checkLikeExists('user-123', 'comment-123'))
      .rejects
      .toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getLikeCountByCommentId method is not implemented', async () => {
    // Arrange
    const repository = new CommentLikeRepository();

    // Action & Assert
    await expect(repository.getLikeCountByCommentId('comment-123'))
      .rejects
      .toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getLikesByCommentIds method is not implemented', async () => {
    // Arrange
    const repository = new CommentLikeRepository();

    // Action & Assert
    await expect(repository.getLikesByCommentIds(['comment-123']))
      .rejects
      .toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
