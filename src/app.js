require('dotenv').config();

const createServer = require('./Infrastructures/http/createServer');
const createContainer = require('./container');

const start = async () => {
  const container = createContainer();
  const app = createServer(container);

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`server start at http://localhost:${PORT}`);
  });
};

start();
