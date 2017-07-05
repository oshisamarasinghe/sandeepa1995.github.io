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
            console.log('Successfully connected to  MongoDB server. - refreshNotices');

            db.collection('Users').find({iD:user.index}).toArray().then((docs)=>{
                //console.log(docs[0].intended_ID);
                socket.emit('loadNoticesList',{
                    intended: docs[0].intended_ID,
                    sent: docs[0].sent,
                });
                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    //Refresh Authorizable
    socket.on('refreshAuthNotices',(user)=>{
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - refreshNotices');

            db.collection('Users').find({iD:user.index}).toArray().then((docs)=>{
                //console.log(docs[0].w8nApproval);
                socket.emit('loadAuthNoticesList',{
                    intended: docs[0].intended_ID,
                    sent: docs[0].sent,
                    toApprove:docs[0].w8nApproval
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
            console.log('Successfully connected to  MongoDB server. - getNDetails');

            db.collection('Notices').find({_id: ObjectID(notice.iD)}).toArray().then((docs)=>{
                var dateN =dateFromObjectId(notice.iD);

                socket.emit('giveNDetails',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    sender:docs[0].sender,
                    date:(dateN.toLocaleString()),
                    state: docs[0].state
                });
                //console.log(dateFromObjectId(notice.iD).toISOString());
                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    socket.on('getSDetails',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - getNDetails');

            db.collection('Notices').find({_id: ObjectID(notice.iD)}).toArray().then((docs)=>{
                var dateN =dateFromObjectId(notice.iD);

                socket.emit('giveSDetails',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    date:(dateN.toLocaleString()),
                    state: docs[0].state
                });
                //console.log(dateFromObjectId(notice.iD).toISOString());
                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    socket.on('getADetails',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - getNDetails');

            db.collection('Notices').find({_id: ObjectID(notice.iD)}).toArray().then((docs)=>{
                var dateN =dateFromObjectId(notice.iD);

                socket.emit('giveADetails',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    date:(dateN.toLocaleString())
                });
                //console.log(dateFromObjectId(notice.iD).toISOString());
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
            console.log('Successfully connected to  MongoDB server. - getNoticeDis');

            db.collection('Notices').find({_id: ObjectID(notice.iD)}).toArray().then((docs)=>{
                socket.emit('giveNoticeDis',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    sender:docs[0].sender,
                    date:dateFromObjectId(notice.iD).toLocaleString(),
                    content:docs[0].content
                });

                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    socket.on('getSentDis',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - getNoticeDis');

            db.collection('Notices').find({_id: ObjectID(notice.iD)}).toArray().then((docs)=>{
                socket.emit('giveSentDis',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    receivers:docs[0].receivers,
                    date:dateFromObjectId(notice.iD).toLocaleString(),
                    content:docs[0].content
                });

                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    //Authorize notice
    socket.on('authApprove',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - createNotice');

            db.collection('Notices').findOneAndUpdate({
                _id:ObjectID(notice.iD)
            },{
                $set:{
                    state:"approved"
                }
            },{
                returnOriginal:false
            });
        });
    });

    //Disapprove notice
    socket.on('authDisapprove',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - createNotice');

            db.collection('Notices').findOneAndUpdate({
                _id:ObjectID(notice.iD)
            },{
                $set:{
                    state:"disapproved"
                }
            },{
                returnOriginal:false
            });
        });
    });

    //Remove Notice
    socket.on('removeSentNotice',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - createNotice');

            db.collection('Notices').findOneAndUpdate({
                _id:ObjectID(notice.iD)
            },{
                $set:{
                    state:"removed"
                }
            },{
                returnOriginal:false
            });
        });
    });

    //Remove Authorization handled notice
    socket.on('removeNoticeAprvl',(item)=>{
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - removeNoticeAprvl');

            db.collection('Users').findOneAndUpdate({
                iD:item.iD
            },{
                $pull:{
                    w8nApproval: ObjectID(item.noticeiD)
                }
            },{
                returnOriginal:false
            });

            db.close();
        });
    });


    //Notice Creation Related

    socket.on('createNotice',(newRegNotice)=>{
        //console.log('New notice successfully created',newRegNotice);
        var noticeID;

        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - createNotice');

            db.collection('Notices').insertOne({
                title:newRegNotice.title,
                state:"new",
                content: newRegNotice.content,
                sender: newRegNotice.sender,
                receivers: newRegNotice.receivers
            }, (err,result)=>{
                if(err){
                    return console.log('Unable to insert',err);
                }
                //console.log(JSON.stringify(result.ops,undefined,2));
                console.log(result.ops[0]._id,"BBBBB");
                updateUseronCreate(newRegNotice.receivers,result.ops[0]._id);
                updateSenderonCreate(newRegNotice.senderID,result.ops[0]._id);
                updateApproveronCreate(newRegNotice.approver,result.ops[0]._id);
                // db.collection('Users').findOneAndUpdate({
                //     iD:newRegNotice.senderID
                // },{
                //     $push:{
                //         sent: (result.ops[0]._id),
                //         intended_ID: (result.ops[0]._id)
                //     }
                // },{
                //     returnOriginal:false
                // });

            });

            // console.log(noticeID,"AAAA");
            // db.collection('Users').findOneAndUpdate({
            //     iD:newRegNotice.senderID
            // },{
            //     $push:{
            //         sent: (noticeID),
            //         intended_ID: (noticeID)
            //     }
            // },{
            //     returnOriginal:false
            // });

            db.close();
        });
    });


    socket.on('getNCreator',(user)=>{
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - getNCreator');

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
            console.log('Successfully connected to  MongoDB server. - loadAllUsers');

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

    //Get details for editing a notice
    socket.on('getEditNotice',(notice)=>{
        // console.log(JSON.stringify(notice.iD),"A");
        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - getEditNotice');

            db.collection('Notices').find({_id: ObjectID(notice.iD)}).toArray().then((docs)=>{
                var dateN =dateFromObjectId(notice.iD);

                socket.emit('giveEditDetails',{
                    id:docs[0]._id,
                    title:docs[0].title,
                    sender:docs[0].sender,
                    content: docs[0].content,
                    receivers: docs[0].receivers,
                    //date:(dateN.toLocaleString())
                });
                //console.log(dateFromObjectId(notice.iD).toISOString());
                // console.log(docs[0].sent);
            }, (err)=>{
                console.log('Unable to find user',err);
            });

            db.close();
        });
    });

    //Edit Notice
    socket.on('editNotice',(editRegNotice)=>{
        //console.log('New notice successfully created',newRegNotice);
        var noticeID;

        MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
            if(err){
                return console.log('Unable to connect to MongoDB server.');
            }
            console.log('Successfully connected to  MongoDB server. - createNotice');

            db.collection('Notices').findOneAndUpdate({
                _id:ObjectID(editRegNotice.iD)
            },{
                $set:{
                    title: editRegNotice.title,
                    content: editRegNotice.content
                }
            },{
                returnOriginal:false
            });



            //     .insertOne({
            //     title:editRegNotice.title,
            //     content: editRegNotice.content,
            // }, (err,result)=>{
            //     if(err){
            //         return console.log('Unable to insert',err);
            //     }
            //     //console.log(JSON.stringify(result.ops,undefined,2));
            //     console.log(result.ops[0]._id,"BBBBB");
            //     updateUseronCreate(newRegNotice.receivers,result.ops[0]._id);
            //     updateSenderonCreate(newRegNotice.senderID,result.ops[0]._id);
            //
            // });

            // console.log(noticeID,"AAAA");
            // db.collection('Users').findOneAndUpdate({
            //     iD:newRegNotice.senderID
            // },{
            //     $push:{
            //         sent: (noticeID),
            //         intended_ID: (noticeID)
            //     }
            // },{
            //     returnOriginal:false
            // });

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

function updateUseronCreate(receivers,noticeID) {
    for (var indx1 = 0; indx1 < receivers.length; ++indx1) {
        var recei=receivers[indx1];
        updateSeparteUsers(recei,noticeID);
        // MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
        //     if(err){
        //         return console.log('Unable to connect to MongoDB server.');
        //     }
        //     console.log('Successfully connected to  MongoDB server. - updateUseronCreate',indx1);
        //
        //     db.collection('Users').findOneAndUpdate({
        //         iD:recei
        //     },{
        //         $push:{
        //             intended_ID: ObjectID(noticeID)
        //         }
        //     },{
        //         returnOriginal:false
        //     });
        //
        //     db.close();
        // });
    }

}

function updateSeparteUsers(recei,noticeID) {
    console.log(recei);
    MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
        if(err){
            return console.log('Unable to connect to MongoDB server.');
        }
        console.log('Successfully connected to  MongoDB server. - updateUseronCreate');

        db.collection('Users').findOneAndUpdate({
            iD:recei
        },{
            $push:{
                intended_ID: ObjectID(noticeID)
            }
        },{
            returnOriginal:false
        });

        db.close();
    });

}

function updateSenderonCreate(senderID,noticeID) {
    MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
        if(err){
            return console.log('Unable to connect to MongoDB server.');
        }
        console.log('Successfully connected to  MongoDB server. - updateUseronCreate');

        db.collection('Users').findOneAndUpdate({
            iD:senderID
        },{
            $push:{
                sent: ObjectID(noticeID)
            }
        },{
            returnOriginal:false
        });

        db.close();
    });

}

function updateApproveronCreate(approverID,noticeID) {
    MongoClient.connect('mongodb://localhost:27017/NoticesDB',(err,db)=>{
        if(err){
            return console.log('Unable to connect to MongoDB server.');
        }
        console.log('Successfully connected to  MongoDB server. - updateApproveronCreate');

        db.collection('Users').findOneAndUpdate({
            iD:approverID
        },{
            $push:{
                w8nApproval: ObjectID(noticeID)
            }
        },{
            returnOriginal:false
        });

        db.close();
    });
}

