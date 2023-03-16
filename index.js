const express = require('express');
const bodyParser = require("body-parser");
const authRouter = require('./routes/auth');
var cors = require('cors');

const app = express();
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.set('io', io);

//isso tem que ficar antes das rotas
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
//isso tem que ficar antes das rotas

app.use('/', authRouter);

io.on('connection', socket => {
  socket.on("getUsers", (arg, callback) => {
    var db = require('./db');
    var User   = require('./models/user');
    User.find({ _id : { $nin: arg }}).then((users) => {
      callback(users);
    });
  });
  socket.on('sendMsg', (arg, callback) => {
    var db = require('./db');
    var MsgChat = require('./models/msgChat');
    var msgChat = new MsgChat({
      from: arg.from,
      to: arg.to,
      dtSent: arg.dtMsgSent,
      drRead: null,
      msg: arg.msg
    });

    msgChat.save(function(err) {
      if (err) {
        callback(err.message);    
      }
      else{
        callback('Msg Received');
      }

      //server chama client pelo id e manda atualiza msgs
      //io.sockets.socket(savedSocketId).emit(...)
      //io.clients
    });
  });
  socket.on('updateActive', (arg, callback) => {
    var db = require('./db');
    var ActiveUser = require('./models/activeUsers');
    var activeUser = new ActiveUser({
      email: arg.email,
      socketId: arg.socketId,
      dtActive: new Date(Date.now() - (360*60*1000)),
      ipActive: '147.168.155.10'
    });
    //console.log(arg.dtActive);
    activeUser.save(function(err) {
      if (err) {
        callback(err.message);    
      }
      else{
        callback('User Activated');
      }
    });
  });
  socket.on('getMsgs', (arg, callback) => {
    var db = require('./db');
    var MsgChat = require('./models/msgChat');
    MsgChat.find({ $or: [ 
      { from: arg.me, to: arg.userChat }, 
      { to: arg.me, from: arg.userChat } 
    ]}).then((msgs) => {
      callback(msgs);
    });
  });
});

server.listen(4000, () => {
  console.log(`Example app listening on port 4000`)
});

module.exports = app;