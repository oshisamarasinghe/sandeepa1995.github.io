// /**
//  * Created by Damitha on 6/27/2017.
//  */
// // Get the modal
var modal = document.getElementById('newTypeModal');
// var numNot=0;
var indNum=0;
var indSent=0;
var indAuth=0;

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
var arraySentNotices=[];
var arrayAuthNotices=[];

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

    arraySentNotices=[];
    indSent=0;
    document.getElementById("sentDetailTable").innerHTML="";

    arrayAuthNotices=[];
    indAuth=0;
    document.getElementById("authDetailTable").innerHTML="";

    if(loggedID=="0000000"){
        socket.emit('refreshAuthNotices',{
            index:loggedID
        });
    }else{
        socket.emit('refreshNotices',{
            index:loggedID
        });
    }
    setTimeout(sortBoth,200);

}

socket.on('loadNoticesList',function(noticeList){
    for (var indx = 0; indx < noticeList.intended.length; ++indx) {
        //console.log(noticeList.intended[indx]);
        socket.emit('getNDetails', {
            iD: noticeList.intended[indx]
        });
    }

    for (var indx2 = 0; indx2 < noticeList.sent.length; ++indx2) {
        //console.log(noticeList.sent[indx]);
        socket.emit('getSDetails',{
            iD:noticeList.sent[indx2]
        });
    }
});

socket.on('loadAuthNoticesList',function(noticeList){
    //console.log(noticeList.toApprove);
    for (var indx = 0; indx < noticeList.intended.length; ++indx) {
        //console.log(noticeList.intended[indx]);
        socket.emit('getNDetails',{
            iD:noticeList.intended[indx]
        });
    }

    for (var indx2 = 0; indx2 < noticeList.sent.length; ++indx2) {
        //console.log(noticeList.sent[indx]);
        socket.emit('getSDetails',{
            iD:noticeList.sent[indx2]
        });
    }

    for (var indx3 = 0; indx3 < noticeList.toApprove.length; ++indx3) {
        //console.log(noticeList.toApprove[indx3]);
        socket.emit('getADetails',{
            iD:noticeList.toApprove[indx3]
        });
    }
});

socket.on('giveNDetails',(noticeDetails)=>{
    //console.log(noticeDetails);
    if (noticeDetails.state =="approved"){
        var noticeDetailItem = "<tr data-toggle='modal' data-target='#displayModal' style='cursor: pointer' onclick='clickDetail("+indNum+")'><td>"+noticeDetails.sender+"</td><td>"+noticeDetails.title+"</td> <td>"+noticeDetails.date+"</td> </tr>";
        $("#noticeDetailTable").append(noticeDetailItem);
        indNum+=1;
        arrayDetailNotices.push(noticeDetails.id);
    }
});

socket.on('giveSDetails',(noticeDetails)=>{
    //console.log(noticeDetails);
    if ((noticeDetails.state !="removed")&&(noticeDetails.state !="disapproved")) {
        var noticeDetailItem = "<tr style='cursor: pointer'><td>" + noticeDetails.title + "</td> <td>" + noticeDetails.date + "</td><td><button class='btn btn-success pull-right' data-toggle='modal' data-target='#displayModal' onclick='clickSentDetail("+indSent+")'>View</button></td><td><button class='btn btn-warning pull-right' onclick='gotoEdit(" + indSent + ")' >Edit</button></td><td><button class='btn btn-danger pull-right' onclick='noticeRemove(" + indSent + ")'>Remove</button></td></tr>";
        $("#sentDetailTable").append(noticeDetailItem);
        indSent += 1;
        arraySentNotices.push(noticeDetails.id);
    }
});

socket.on('giveADetails',(noticeDetails)=>{
    //console.log(noticeDetails);
    var noticeDetailItem = "<tr style='cursor: pointer' ><td>"+noticeDetails.title+"</td> <td>"+noticeDetails.date+"</td><td><button class='btn btn-success pull-right' data-toggle='modal' data-target='#displayModal' onclick='clickAuthDetail("+indAuth+")'>View</button></td><td><button class='btn btn-info pull-right' onclick='approveNotice("+indAuth+")'><i class='material-icons'>thumb_up</i> Approve</button></td><td><button class='btn btn-danger pull-right' onclick='diapproveNotice("+indAuth+")' ><i class='material-icons'>thumb_down</i> Disapprove</button></td></tr>";
    $("#authDetailTable").append(noticeDetailItem);
    indAuth+=1;
    arrayAuthNotices.push(noticeDetails.id);
});

function gotoEdit(ind) {
    if(confirm('Do you want to edit the notice?'))
    {
        location.href='editRegular.html';
        sessionStorage.setItem('editID',arraySentNotices[ind]);
    }
}

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});


socket.on('newNotice',function(notice) {
    console.log('New Notice has Arrived!',notice);
    // location.href='index.html';
});

function clickDetail(ind) {
    //console.log(arrayDetailNotices[ind]);
    socket.emit('getNoticeDis',{
        iD:arrayDetailNotices[ind]
    });
}

function noticeRemove(ind) {
    if(confirm('Do you want to remove the notice?')) {
        socket.emit('removeSentNotice', {
            iD: arraySentNotices[ind]
        });
        socket.emit('removeNoticeAprvl',{
            noticeiD:arraySentNotices[ind],
            iD:sessionStorage.getItem('approverID')
        });
        refresh();
    }
}

function clickSentDetail(ind) {

    //console.log(arrayDetailNotices[ind]);
    socket.emit('getSentDis',{
        iD:arraySentNotices[ind]
    });
}

function clickAuthDetail(ind) {
    //console.log(arrayDetailNotices[ind]);
    socket.emit('getSentDis',{
        iD:arrayAuthNotices[ind]
    });
}

function approveNotice(ind) {
    socket.emit('authApprove',{
        iD:arrayAuthNotices[ind]
    });
    removeFromApproval(ind);
}

function diapproveNotice(ind){
    socket.emit('authDisapprove',{
        iD:arrayAuthNotices[ind]
    });
    removeFromApproval(ind);
}

function removeFromApproval(ind){
    socket.emit('removeNoticeAprvl',{
        noticeiD:arrayAuthNotices[ind],
        iD:sessionStorage.getItem('approverID')
    })
}



socket.on('giveNoticeDis',(noticeDetails)=>{
    document.getElementById('noticeTitle').innerHTML="Title : ";
    document.getElementById('noticeSender').innerHTML="Sender : ";
    document.getElementById('noticeDate').innerHTML="Date : ";
    //console.log(noticeDetails);
    quillD.setContents(noticeDetails.content);
    notTitle=noticeDetails.title;
    $("#noticeTitle").append(notTitle);
    notSender=noticeDetails.sender;
    $("#noticeSender").append(notSender);
    notDate=noticeDetails.date;
    //console.log(new Date(notDate));
    $("#noticeDate").append(notDate);
});

socket.on('giveSentDis',(noticeDetails)=>{
    document.getElementById('noticeTitle').innerHTML="Title : ";
    document.getElementById('noticeSender').innerHTML="Receivers : ";
    document.getElementById('noticeDate').innerHTML="Date : ";
    //console.log(noticeDetails);
    quillD.setContents(noticeDetails.content);
    notTitle=noticeDetails.title;
    $("#noticeTitle").append(notTitle);
    notReceviers=noticeDetails.receivers.join(' , ');
    $("#noticeSender").append(notReceviers);
    notDate=noticeDetails.date;
    $("#noticeDate").append(notDate);
});


function sortNTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("noticeTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
     no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
             one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
             based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
             and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
             set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function sortNDateTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("noticeTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
     no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
             one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
             based on the direction, asc or desc:*/
            if (dir == "asc") {
                if ((new Date(x.innerHTML)) > (new Date(y.innerHTML))) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if ((new Date(x.innerHTML)) < (new Date(y.innerHTML))) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
             and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
             set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function sortSTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("sentTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
     no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
             one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
             based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
             and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
             set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function sortSDateTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("sentTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
     no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
             one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
             based on the direction, asc or desc:*/
            if (dir == "asc") {
                if ((new Date(x.innerHTML)) > (new Date(y.innerHTML))) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if ((new Date(x.innerHTML)) < (new Date(y.innerHTML))) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
             and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
             set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function sortATable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("authTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
     no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
             one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
             based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
             and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
             set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function sortADateTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("authTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
     no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
             one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
             based on the direction, asc or desc:*/
            if (dir == "asc") {
                if ((new Date(x.innerHTML)) > (new Date(y.innerHTML))) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if ((new Date(x.innerHTML)) < (new Date(y.innerHTML))) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
             and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
             set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}



