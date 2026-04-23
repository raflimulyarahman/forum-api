class CommentLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
    this.date = payload.date;
  }

  _verifyPayload(payload) {
    const { id, commentId, owner, date } = payload;

    if (!id || !commentId || !owner || !date) {
      throw new Error('COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLike;
