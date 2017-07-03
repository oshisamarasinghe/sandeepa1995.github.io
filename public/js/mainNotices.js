// /**
//  * Created by Damitha on 6/27/2017.
//  */
// // Get the modal
var modal = document.getElementById('newTypeModal');
// var numNot=0;
var indNum=0;

// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");
//
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
//
// // When the user clicks the button, open the modal
// btn.onclick = function() {
//     modal.style.display = "block";
// }
//
// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }
//
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


var arrayDetailNotices=[];

function doNew() {
    if (document.getElementById("nTRBReg").checked)
    {
        location.href='crtRegular.html';
    }

}

// function loadList() {
//     var noticeItem =
//         <div class="item"> <div id="quillEdit">
//                 <h1 align="center"><u>Notice</u></h1><br>
//                 <p align="center">Main <strong>content</strong> of the intended notice</p><br><br>
//             <p align="right">Sender</p>
//                 <p><br></p>
//                 </div>
//
//                 <script>
//                 var quill = new Quill('#quillEdit', {
//                 modules : {
//                     toolbar: "false"
//                 },
//
//                 theme:'snow'
//                 });
//                 quill.enable(false);
//
//                 </script>
//         </div>;
//     document.getElementById("#carNotice").innerHTML+=noticeItem;
//
// }

// function loadList() {
//     var noticeItem = document.createElement("DIV");
//     noticeItem.setAttribute("class","item");
//     var noticeItemSub = document.createElement("DIV");
//     var notID = "quillEdit"+numNot.toString();
//     numNot+=1;
//     noticeItem.setAttribute("id",notID);
//     noticeItemSub.innerHTML = '<h1 align="center"><u>Notice</u></h1><br> <p align="center">Main <strong>content</strong> of the intended notice</p><br><br><p align="right">Sender</p><p><br></p>';
//     var quill = new Quill('#'+notID, {
//         modules : {
//             toolbar: "false"
//         },
//         theme:'snow'
//     });
//     quill.enable(false);
//     noticeItem.appendChild(noticeItemSub);
//     $("#carNotice").append(noticeItem);
// }

var socket=io();

socket.on('connect',function(){
    console.log('Connected aaa');
    // loadList();
});

function  refresh() {
    arrayDetailNotices=[];
    indNum=0;
    document.getElementById("noticeDetailTable").innerHTML="";
    socket.emit('refreshNotices',{
        index:loggedID
    });
}

socket.on('loadNoticesList',function(noticeList){
    for (var indx = 0; indx < noticeList.intended.length; ++indx) {
        console.log(noticeList.intended[indx]);
        socket.emit('getNDetails',{
            iD:noticeList.intended[indx]
        });
    }
});

socket.on('giveNDetails',(noticeDetails)=>{
    console.log(noticeDetails);
    var noticeDetailItem = "<tr data-toggle='modal' data-target='#displayModal' style='cursor: pointer' onclick='clickDetail("+indNum+")'><td>"+noticeDetails.sender+"</td><td>"+noticeDetails.title+"</td> <td>"+noticeDetails.date+"</td> </tr>";
    $("#noticeDetailTable").append(noticeDetailItem);
    indNum+=1;
    arrayDetailNotices.push(noticeDetails.id);
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});


socket.on('newNotice',function(notice) {
    console.log('New Notice has Arrived!',notice);
    // location.href='index.html';
});

function clickDetail(ind) {
    console.log(arrayDetailNotices[ind]);
    socket.emit('getNoticeDis',{
        iD:arrayDetailNotices[ind]
    });
}

socket.on('giveNoticeDis',(noticeDetails)=>{
    document.getElementById('noticeTitle').innerHTML="Title : ";
    document.getElementById('noticeSender').innerHTML="Sender : ";
    document.getElementById('noticeDate').innerHTML="Date : ";
    console.log(noticeDetails);
    quillD.setContents(noticeDetails.content);
    notTitle=noticeDetails.title;
    $("#noticeTitle").append(notTitle);
    notSender=noticeDetails.sender;
    $("#noticeSender").append(notSender);
    notDate=noticeDetails.date;
    $("#noticeDate").append(notDate);
});

