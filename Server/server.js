/**
 * Created by Damitha on 6/30/2017.
 */
const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');

var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};


const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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


    // Notice browsing related

    socket.on('refreshNotices',(user)=>{
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server.');

            db.collection('Users').find({iD:user.index}).toArray().then((docs)=>{
                console.log(docs[0].intended_ID);
                socket.emit('loadNoticesList',{
                    intended: docs[0].intended_ID
                });
                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    socket.on('getNDetails',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server.');

            db.collection('Notices').find({_id: new ObjectID(notice.iD)}).toArray().then((docs)=>{
                socket.emit('giveNDetails',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    sender:docs[0].sender,
                    date:dateFromObjectId(notice.iD).toISOString().slice(0, 10)
                });

                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    socket.on('getNoticeDis',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server.');

            db.collection('Notices').find({_id: new ObjectID(notice.iD)}).toArray().then((docs)=>{
                socket.emit('giveNoticeDis',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    sender:docs[0].sender,
                    date:dateFromObjectId(notice.iD).toISOString().slice(0, 10),
                    content:docs[0].content
                });

                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    //Notice Creation Related

    socket.on('createNotice',(newRegNotice)=>{
        console.log('New notice successfully created',newRegNotice);

        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server.');

            db.collection('Notices').insertOne({
                title:newRegNotice.title,
                content: newRegNotice.content,
                sender: newRegNotice.sender
            }, (err,result)=>{
                if(err){
                    return console.log('Unable to insert',err);
                }
                console.log(JSON.stringify(result.ops,undefined,2));
            });

            db.close();
        });
    });


    socket.on('getNCreator',(user)=>{
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server.');

            db.collection('Users').find({iD:user.index}).toArray().then((docs)=>{
                // console.log(docs[0].name);
                socket.emit('giveNCreator',{
                    name: docs[0].name,
                    typeO: docs[0].type,
                    batch:docs[0].batch
                });
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    //Notice Creation Target Loaders
    socket.on('loadAllUsers',(user)=>{
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server.');

            db.collection('Users').find().toArray().then((docs)=>{
                // console.log(docs[0].name);
                socket.emit('giveAllUsers',
                    docs
                );
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    // socket.on('loadNoticesList');


    // socket.emit('newNotice',{
    //     sender: 'drox2014@github.io',
    //     title: 'test',
    //     id:123
    // });
});

server.listen(port,()=>{
    console.log('Server is up');
}) ;

