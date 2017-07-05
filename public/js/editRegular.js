/**
 * Created by Damitha on 7/5/2017.
 */
/**
 * Created by Damitha on 6/27/2017.
 */

var socket=io();
var thiseidtuser;
var targeteditgrp=[];
var alledittargets=[];
var checkEditNum=0;
var noticeID = sessionStorage.getItem('editID');
var targetEditGrp;

function showSpeci() {
    document.getElementById("specificOptions").style.display='block';
}

function hideSpeci() {
    document.getElementById("specificOptions").style.display='none';
}

function finishEdit() {
    if(confirm('Do you want to finalize the notice?'))
    {
        location.href='index.html';
        var newTitile = document.getElementById("inputEditTitle").value;
        var newContent = quilledt.getContents();

        socket.emit('editNotice',{
            title: newTitile,
            content: newContent,
            iD:noticeID
        });
    }
}

function genText(){
    document.getElementById("typeText").innerHTML="Make a General Notice";
}

function spcText(){
    document.getElementById("typeText").innerHTML="Make a Specific Notice";
}

function doType() {
    if (document.getElementById("cbType").checked)
    {
        spcText();
        showSpeci()
    }
    else
    {
        genText();
        hideSpeci()
    }

}

function  getCreator() {
    socket.emit('getNCreator',{
        index:loggedEditID
    });
}

socket.on('giveNCreator',(user)=>{
    console.log('Got User',user);
    //var senderName='<p align="right" style="padding-right: 20px">'+user.name+'</p><p align="right" style="padding-right: 20px">'+user.typeO +' - '+user.batch.department +' '+ user.batch.year +'<br></p>'
    // $("#quillEdit").append(senderName);
    thiseidtuser=user;
    // var position = user.name+'\n'+user.typeO +' - '+user.batch.department +' '+ user.batch.year;
    // quilledt.setText( 'Notice\nMain content of the intended notice.\n'+ position );
    // quilledt.formatLine(1, 2, {'align': 'center', 'header':'h1' , 'bold':'bold'});
    // quilledt.formatText(0, 6, {'underline': true,'bold':true});
    // quilledt.formatLine(1, 2, 'underline',true);
    // quilledt.formatText(11, 9, {'bold':true});
    // quilledt.formatLine(8, 9, {'align': 'center'});
    // quilledt.formatLine(quilledt.getLength()- position.length - 1, quilledt.getLength()-1-1, {'align': 'right'});

});

// function setTitle() {
//     if ((quilledt.getLength() == 80)&&quilledt.getText().slice(0,6)=="Notice")
//     {
//         var position = thisedituser.name + '\n' + thisedituser.typeO + ' - ' + thisedituser.batch.department + ' ' + thisedituser.batch.year;
//         quilledt.setText(document.getElementById("inputEditTitle").value + '\nMain content of the intended notice.\n' + position);
//         quilledt.formatLine(1, 2, {'align': 'center', 'header': 'h1'});
//         quilledt.formatText(document.getElementById("inputEditTitle").value.length+5, 9, {'bold':true});
//         quilledt.formatText(0, document.getElementById("inputEditTitle").value.length, {'underline': true, 'bold': true});
//         quilledt.formatLine(1, document.getElementById("inputEditTitle").value.length + 1, {'align': 'center'});
//         quilledt.formatLine(quilledt.getLength() - position.length - 1, quilledt.getLength() - 1 - 1, {'align': 'right'});
//     }
// }


function  getEdtNotice() {
    socket.emit('getEditNotice',{
        iD: noticeID
    });
}

socket.on('giveEditDetails',(notice)=>{
    console.log('Got notice',notice);
    var editTitle = notice.title;
    // $("#inputEditTitle").append(editTitle);
    document.getElementById('inputEditTitle').value= editTitle;
    quilledt.setContents(notice.content);
    targetEditGrp=notice.receivers;
    // for (var indx = 0; indx < alledittargets.length; ++indx) {
    //     if (notice.receivers.indexOf(alledittargets[indx])==-1){
    //
    //     }
    // }
});

function loadAll() {
    socket.emit('loadAllUsers');
}

socket.on('giveAllUsers',(list)=>{
    console.log("All users",list);
    for (var indx = 0; indx < list.length; ++indx) {
        var userDetails=list[indx];
        console.log(list[indx].iD);
        targeteditgrp.push(userDetails.iD);
        alledittargets.push(userDetails.iD);
        //var toAdd = '<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes" checked>'+list[indx].iD +' - ' +list[indx].name+ '</label></div>';
        var toADD = "<tr onclick='selectRow(this,"+checkEditNum+")' data-toggle='modal' data-target='#displayModal' style='cursor: pointer'><td><input onclick='flipCheck(this,"+checkEditNum+")' type='checkbox' name='optionsCheckboxes' class='checkbox' checked></td><td>"+userDetails.iD+"</td><td>"+userDetails.name+"</td> <td>"+userDetails.batch.department+"</td><td>"+userDetails.batch.year+"</td><td>"+userDetails.type+"</td></tr>";
        checkEditNum+=1;
        $("#checkGrp").append(toADD);
        console.log(targeteditgrp);
        //checkGrp
        //$("#checkGrp").append(toAdd);
        //document.getElementById('checkGrp').innerHTML+=toADD;

    }
});

function selectRow(row,id)
{
    var firstInput = row.getElementsByTagName('input')[0];
    flipCheck(firstInput,id);
    //console.log(alledittargets[id]);
}

function flipCheck(firstInput,id) {
    firstInput.checked = !firstInput.checked;
    doTarget(alledittargets[id]);
}

function doTarget(inex){
    if (targeteditgrp.indexOf(inex)==-1){
        targeteditgrp.push(inex);
    }
    else{
        targeteditgrp.splice(targeteditgrp.indexOf(inex),1);
    }
    console.log(targeteditgrp);
}


