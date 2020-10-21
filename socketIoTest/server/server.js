const Koa = require('koa');//ajuda a lidar com as req
const http =require('http');//sobe servidor e escuta as req
const socket =require('socket.io');//aescutar os eventos

const SERVER_HOST = "localhost";
const SERVER_PORT = 3002;

const app = new Koa();
const server = http.createServer(app.callback()) // app.callback funcao do koa que lida com req
const io = socket(server);//socket fica escutando o servidor

io.on('connection', socket => {
  console.log(`[IO] Connection => server a new connection`);
  socket.on('chat.message', data => {
    console.log(`[SOCKET] Chat.message => `, data);
    io.emit('chat.message', data);
  })
  socket.on('disconnect', () => {
    console.log(`[SOCKET] Disconnect => A connection was disconnected `);
  })
})

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`[HTTP] Listen => server is running at http://${SERVER_HOST}:${SERVER_PORT}`)
  console.log(`[HTTP] Listen => Press CTRL-C to stop it`);
})