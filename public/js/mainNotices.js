// /**
//  * Created by Damitha on 6/27/2017.
//  */
// // Get the modal
var modal = document.getElementById('newTypeModal');

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

var socket=io();

socket.on('connect',function(){
    console.log('Connected aaa');
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});


socket.on('newNotice',function(notice) {
    console.log('New Notice has Arrived!',notice);
    // location.href='index.html';
})
