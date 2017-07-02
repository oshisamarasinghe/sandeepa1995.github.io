// /**
//  * Created by Damitha on 6/27/2017.
//  */
// // Get the modal
var modal = document.getElementById('newTypeModal');
// var numNot=0;

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
}

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

socket.on('loadNotices');

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});


socket.on('newNotice',function(notice) {
    console.log('New Notice has Arrived!',notice);
    // location.href='index.html';
})
