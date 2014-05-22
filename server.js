var app = require('http').createServer(handler),
    io  = require('socket.io').listen(app),
    fs  = require('fs')


app.listen(80);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
  function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("error loading index.html");
    }

    res.writeHead(200);
    res.end(data);
  });
}

var colors = ['red','green','yellow','orange','blue','purple','pink'];
var blocks = []
var index = 0;
io.sockets.on('connection', function(socket) {
  blocks.push(
    {id: index++,
     color:colors[parseInt(Math.random().toString().split('.')[1]) % colors.length],
     top: 0,
     left: 0,
    });
  if (blocks.length > 40) blocks.shift();

  socket.emit('blocks', blocks);
  socket.on('update', function(block) {
    console.log('update - ' + block);
    socket.broadcast.emit('update', block);
  });
});
