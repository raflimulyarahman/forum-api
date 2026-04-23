const CommentLike = require('../CommentLike');

describe('CommentLike entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      commentId: 'comment-123',
      // owner is missing
      date: '2024-01-01T00:00:00.000Z',
    };

    // Action & Assert
    expect(() => new CommentLike(payload)).toThrow('COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      commentId: 'comment-123',
      owner: 'user-123',
      date: '2024-01-01T00:00:00.000Z',
    };

    // Action & Assert
    expect(() => new CommentLike(payload)).toThrow('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentLike object correctly', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      commentId: 'comment-123',
      owner: 'user-123',
      date: '2024-01-01T00:00:00.000Z',
    };

    // Action
    const commentLike = new CommentLike(payload);

    // Assert
    expect(commentLike.id).toEqual('like-123');
    expect(commentLike.commentId).toEqual('comment-123');
    expect(commentLike.owner).toEqual('user-123');
    expect(commentLike.date).toEqual('2024-01-01T00:00:00.000Z');
  });
});
