var express = require('express');
io = require('socket.io')();


io.on('connection', function (socket) {
  var path = './audio/';
  var query = Music.find(null);

  socket.on('play', function(socket) {
    query.exec(function(err,data){
      var p = new Player();
      for (var i=1;i<data.length;i++) {
        p.add(path + data[i].title);
      }
      p.play();
    })
  });

  socket.on('stop', function(socket) {
    PlayList.stop();
  });
});

modules.export = io;