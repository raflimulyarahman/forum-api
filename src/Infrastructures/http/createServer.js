const express = require('express');
const rateLimit = require('express-rate-limit');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/utils/DomainErrorTranslator');

const createServer = (container) => {
  const app = express();

  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Rate limiting middleware for /threads (90 requests per minute)
  const threadsLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 90, // limit each IP to 90 requests per minute
    message: {
      status: 'fail',
      message: 'Terlalu banyak permintaan. Silakan coba lagi setelah beberapa saat.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
      // Skip rate limiting for non-thread routes or certain endpoints
      return !req.path.startsWith('/threads');
    },
  });

  app.use(threadsLimiter);

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

  app.get('/v1/health_check', (req, res) => {
    res.json({ status: 'ok', code: 200, message: 'OK' });
  });

  // Error handling middleware
  app.use((err, req, res, _next) => {
    console.error('ERROR:', err.message, err.stack);
    if (err instanceof ClientError) {
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }

    // Handle domain errors via DomainErrorTranslator
    const errorMessage = err.message;
    if (DomainErrorTranslator.isTranslatableError(errorMessage)) {
      const translatedMessage = DomainErrorTranslator.translate(errorMessage);
      return res.status(400).json({
        status: 'fail',
        message: translatedMessage,
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
