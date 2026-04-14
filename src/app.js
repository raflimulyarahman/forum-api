require('dotenv').config();

const createServer = require('./Infrastructures/http/createServer');
const createContainer = require('./container');

const start = async () => {
  const container = createContainer();
  const app = createServer(container);

  const port = process.env.PORT || 5000;
  const host = process.env.HOST || 'localhost';

  app.listen(port, host, () => {
    console.log(`server start at http://${host}:${port}`);
  });
};

start();
