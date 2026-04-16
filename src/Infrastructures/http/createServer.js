const express = require('express');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/utils/DomainErrorTranslator');

const createServer = (container) => {
  const app = express();

  app.use(express.json());

  // JWT Authentication Middleware
  const authMiddleware = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: 'fail',
          message: 'Missing authentication',
        });
      }

      const token = authHeader.replace('Bearer ', '');
      const jwt = require('jsonwebtoken');

      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        req.auth = {
          credentials: {
            id: decoded.id,
            username: decoded.username,
          },
        };
        next();
      } catch (err) {
        return res.status(401).json({
          status: 'fail',
          message: 'access token tidak valid',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  // Register routes
  const { UsersHandler, routes: usersRoutes } = require('../../Interfaces/http/api/users');
  const { AuthenticationsHandler, routes: authRoutes } = require('../../Interfaces/http/api/authentications');
  const { ThreadsHandler, routes: threadsRoutes } = require('../../Interfaces/http/api/threads');

  const usersHandler = new UsersHandler(container);
  const authenticationsHandler = new AuthenticationsHandler(container);
  const threadsHandler = new ThreadsHandler(container);

  app.use('/users', usersRoutes(usersHandler));
  app.use('/authentications', authRoutes(authenticationsHandler));
  app.use('/threads', threadsRoutes(threadsHandler, authMiddleware));

  // Error handling middleware
  app.use((err, req, res, _next) => {
    if (err instanceof ClientError) {
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }

    // Handle domain errors thrown as plain Error
    const errorMessage = err.message;

    // Translate only REGISTER_USER and USER_LOGIN errors
    if (errorMessage.startsWith('REGISTER_USER') || errorMessage.startsWith('USER_LOGIN')) {
      const translatedMessage = DomainErrorTranslator.translate(errorMessage);
      return res.status(400).json({
        status: 'fail',
        message: translatedMessage,
      });
    }

    // Handle other domain errors without translation
    if (errorMessage.startsWith('NEW_THREAD')
        || errorMessage.startsWith('NEW_COMMENT')
        || errorMessage.startsWith('NEW_REPLY')
        || errorMessage.startsWith('DELETE_AUTHENTICATION_USE_CASE')
        || errorMessage.startsWith('REFRESH_AUTHENTICATION_USE_CASE')) {
      return res.status(400).json({
        status: 'fail',
        message: errorMessage,
      });
    }

    // Server error
    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  return app;
};

module.exports = createServer;
