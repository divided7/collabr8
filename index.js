const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port=process.env.PORT || 3000;
var bodyParser = require('body-parser');
var room = ''

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('static'))

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html')
})
app.post('/room',function(req,res){
  room= req.body.room
  res.sendFile(__dirname + '/draw.html')
})

io.on("connection", (socket) => {
  socket.join(room);
  console.log(`Connected :${socket.id} room: ${room}`);
  socket.on("disconnect", () => console.log(`${socket.id} has disconnected`));
  socket.on('mouse',
  function(data) {
    // Send it to all other clients
    socket.to(room).emit('mouse', data);
  }
);
  socket.on('touch',
  function(data) {
    // Send it to all other clients
    socket.to(room).emit('touch', data);
  }
  );
  socket.on("chat message", (msg) => {
    io.to(room).emit("chat message", msg);
  });
});
  
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
