/* istanbul ignore file */
const pool = require('./Infrastructures/database/postgres/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

// Repositories
const UserRepositoryPostgres = require('./Infrastructures/repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./Infrastructures/repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./Infrastructures/repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./Infrastructures/repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./Infrastructures/repository/ReplyRepositoryPostgres');

// Security
const BcryptPasswordHash = require('./Infrastructures/security/BcryptPasswordHash');
const JwtTokenManager = require('./Infrastructures/security/JwtTokenManager');

// Use Cases
const AddUserUseCase = require('./Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('./Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('./Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('./Applications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('./Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('./Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('./Applications/use_case/DeleteCommentUseCase');
const GetThreadDetailUseCase = require('./Applications/use_case/GetThreadDetailUseCase');
const AddReplyUseCase = require('./Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('./Applications/use_case/DeleteReplyUseCase');

const createContainer = () => {
  // Instantiate infrastructure
  const userRepository = new UserRepositoryPostgres(pool, nanoid);
  const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
  const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
  const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
  const passwordHash = new BcryptPasswordHash(bcrypt);
  const authenticationTokenManager = new JwtTokenManager(jwt);

  // Instantiate use cases
  const addUserUseCase = new AddUserUseCase({ userRepository, passwordHash });
  const loginUserUseCase = new LoginUserUseCase({
    userRepository, authenticationRepository, authenticationTokenManager, passwordHash,
  });
  const logoutUserUseCase = new LogoutUserUseCase({ authenticationRepository });
  const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
    authenticationRepository, authenticationTokenManager,
  });
  const addThreadUseCase = new AddThreadUseCase({ threadRepository });
  const addCommentUseCase = new AddCommentUseCase({ commentRepository, threadRepository });
  const deleteCommentUseCase = new DeleteCommentUseCase({ commentRepository, threadRepository });
  const getThreadDetailUseCase = new GetThreadDetailUseCase({
    threadRepository, commentRepository, replyRepository,
  });
  const addReplyUseCase = new AddReplyUseCase({ replyRepository, commentRepository, threadRepository });
  const deleteReplyUseCase = new DeleteReplyUseCase({ replyRepository, commentRepository, threadRepository });

  return {
    addUserUseCase,
    loginUserUseCase,
    logoutUserUseCase,
    refreshAuthenticationUseCase,
    addThreadUseCase,
    addCommentUseCase,
    deleteCommentUseCase,
    getThreadDetailUseCase,
    addReplyUseCase,
    deleteReplyUseCase,
  };
};

module.exports = createContainer;
