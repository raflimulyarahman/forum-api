class LikeCommentUseCase {
  constructor({ commentRepository, commentLikeRepository }) {
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(userId, commentId) {
    // Verify comment exists
    await this._commentRepository.verifyCommentExists(commentId);

    // Check if user already liked this comment
    const alreadyLiked = await this._commentLikeRepository.checkLikeExists(userId, commentId);

    if (alreadyLiked) {
      // Unlike the comment
      await this._commentLikeRepository.removeLike(userId, commentId);
    } else {
      // Like the comment
      await this._commentLikeRepository.addLike(userId, commentId);
    }
  }
}

module.exports = LikeCommentUseCase;
