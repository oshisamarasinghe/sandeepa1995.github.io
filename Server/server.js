/**
 * Created by Damitha on 6/30/2017.
 */
const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port=process.env.PORT||3000;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User');

    socket.on('disconnect',()=>{
       console.log('User disconnected');
    });

    socket.on(('createMessage'),(message)=>{
        console.log('createMessage',message);
    });

    socket.on('createNotice',(newRegNotice)=>{
        console.log('New notice successfully created',newRegNotice);
    });

    socket.emit('newNotice',{
        sender: 'drox2014@github.io',
        title: 'test',
        id:123
    });
});

server.listen(port,()=>{
    console.log('Server is up');
}) ;

