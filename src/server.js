require('module-alias/register');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = require('./app');

const http = require('http');
const { init } = require('./socket');

const PORT = process.env.PORT;

const server = http.createServer(app);
init(server);

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});