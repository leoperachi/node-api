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
    });
  });
});

server.listen(4000, () => {
  console.log(`Example app listening on port 4000`)
});

module.exports = app;