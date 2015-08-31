var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(88);

function handler (req, res) {
  
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html'+__dirname);
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection',function(socket)
  {
    //socket
    socket.on('join',function(data)
      {
          // console.log('type',socket.rooms);
          if(data.type=='desktop')
          {//Desktop return new room id
            
            var randRoom = Math.floor((Math.random() * 100000) + 1);
            if(data.room)
            {
                randRoom = data.room;
            }
             // console.log('rand',socket.id);
            socket.join(randRoom,function(){
              socket.emit('joined',{'room':randRoom}); 
              // console.log('type',socket.rooms); 
            });
            
          }else
          {//Mobile
            if(data.room)
            {
              socket.join(data.room,function(){
                socket.emit('joined',{'room':data.room});
                // console.log('typeMobile',socket.rooms);  
              });
            }
          }
          
      });
      
      //Data from mobile
      socket.on('changes',function(data)
        {
          if(socket.rooms.length > 1)
          {
            socket.broadcast.to(socket.rooms[1]).emit('changes',data);
              // console.log('sent Changes',data);  
            
          }
          
        });
    
  });
