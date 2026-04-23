const { nanoid } = require('nanoid');
const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addLike(userId, commentId) {
    const id = `like-${nanoid(16)}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, owner, date) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, commentId, userId, date],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async removeLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async checkLikeExists(userId, commentId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }

  async getLikesByCommentIds(commentIds) {
    if (commentIds.length === 0) {
      return {};
    }

    const query = {
      text: `SELECT comment_id, COUNT(*) as count 
             FROM comment_likes 
             WHERE comment_id = ANY($1) 
             GROUP BY comment_id`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    const likeCounts = {};
    
    commentIds.forEach((commentId) => {
      likeCounts[commentId] = 0;
    });

    result.rows.forEach((row) => {
      likeCounts[row.comment_id] = parseInt(row.count, 10);
    });

    return likeCounts;
  }
}

module.exports = CommentLikeRepositoryPostgres;
