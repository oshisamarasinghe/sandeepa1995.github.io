/**
 * Created by Damitha on 6/30/2017.
 */
const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Successfully connected to  MongoDB server.');

    db.close();
});

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

        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server.');

            db.collection('Notices').insertOne({
                title:newRegNotice.title,
                contenct: newRegNotice.content
            }, (err,result)=>{
                if(err){
                return console.log('Unale to insert',err);
                }
                console.log(JSON.stringify(result.ops,undefined,2));
            });

            db.close();
            });
    });

    // socket.emit('newNotice',{
    //     sender: 'drox2014@github.io',
    //     title: 'test',
    //     id:123
    // });
});

server.listen(port,()=>{
    console.log('Server is up');
}) ;

