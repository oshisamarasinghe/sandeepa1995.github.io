/**
 * Created by Damitha on 6/27/2017.
 */

var socket=io();
var thisuser;
var targetgrp=[];
var alltargets=[];
var checkNum=0;

function showSpeci() {
    document.getElementById("specificOptions").style.display='block';
}

function hideSpeci() {
    document.getElementById("specificOptions").style.display='none';
}

function finish() {
    if(confirm('Do you want to finalize the notice?'))
    {
        location.href='index.html';
        var newTitile = document.getElementById("inputTitle").value;
        var newContent = quill.getContents();

        socket.emit('createNotice',{
            title: newTitile,
            content: newContent,
            sender:thisuser.name,
            senderID: loggedID,
            receivers: targetgrp,
            approver:sessionStorage.getItem('approverID')
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
        index:loggedID
    });
}

socket.on('giveNCreator',(user)=>{
    //console.log('Got User',user);
    //var senderName='<p align="right" style="padding-right: 20px">'+user.name+'</p><p align="right" style="padding-right: 20px">'+user.typeO +' - '+user.batch.department +' '+ user.batch.year +'<br></p>'
    // $("#quillEdit").append(senderName);
    thisuser=user;
    var position = user.name+'\n'+user.typeO +' - '+user.batch.department +' '+ user.batch.year;
    quill.setText( 'Notice\nMain content of the intended notice.\n'+ position );
    quill.formatLine(1, 2, {'align': 'center', 'header':'h1' , 'bold':'bold'});
    quill.formatText(0, 6, {'underline': true,'bold':true});
    quill.formatLine(1, 2, 'underline',true);
    quill.formatText(11, 9, {'bold':true});
    quill.formatLine(8, 9, {'align': 'center'});
    quill.formatLine(quill.getLength()- position.length - 1, quill.getLength()-1-1, {'align': 'right'});
    //console.log(quill.getLength()-position.length);

});

function setTitle() {
    var position = thisuser.name + '\n' + thisuser.typeO + ' - ' + thisuser.batch.department + ' ' + thisuser.batch.year;
    if (((quill.getLength()-position.length) == 45)&&quill.getText().slice(0,6)=="Notice")
    {
        //var position = thisuser.name + '\n' + thisuser.typeO + ' - ' + thisuser.batch.department + ' ' + thisuser.batch.year;
        quill.setText(document.getElementById("inputTitle").value + '\nMain content of the intended notice.\n' + position);
        quill.formatLine(1, 0, {'align': 'center', 'header': 'h1'});
        quill.formatText(document.getElementById("inputTitle").value.length+5, 9, {'bold':true});
        quill.formatText(0, document.getElementById("inputTitle").value.length, {'underline': true, 'bold': true});
        quill.formatLine(1, document.getElementById("inputTitle").value.length + 1, {'align': 'center'});
        quill.formatLine(quill.getLength() - position.length - 1, quill.getLength() - 1 - 1, {'align': 'right'});
    }
}

function loadAll() {
    socket.emit('loadAllUsers');
}

socket.on('giveAllUsers',(list)=>{
    console.log("All users",list);
    for (var indx = 0; indx < list.length; ++indx) {
        var userDetails=list[indx];
        //console.log(list[indx].iD);
        targetgrp.push(userDetails.iD);
        alltargets.push(userDetails.iD);
        //var toAdd = '<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes" checked>'+list[indx].iD +' - ' +list[indx].name+ '</label></div>';
        var toADD = "<tr onclick='selectRow(this,"+checkNum+")' data-toggle='modal' data-target='#displayModal' style='cursor: pointer'><td><input onclick='flipCheck(this,"+checkNum+")' type='checkbox' name='optionsCheckboxes' class='checkbox' checked></td><td>"+userDetails.iD+"</td><td>"+userDetails.name+"</td> <td>"+userDetails.batch.department+"</td><td>"+userDetails.batch.year+"</td><td>"+userDetails.type+"</td></tr>";
        checkNum+=1;
        $("#checkGrp").append(toADD);
        //console.log(targetgrp);
        //checkGrp
        //$("#checkGrp").append(toAdd);
        //document.getElementById('checkGrp').innerHTML+=toADD;

    }
});

function selectRow(row,id)
{
    var firstInput = row.getElementsByTagName('input')[0];
    flipCheck(firstInput,id);
    //console.log(alltargets[id]);
}

function flipCheck(firstInput,id) {
    firstInput.checked = !firstInput.checked;
    doTarget(alltargets[id]);
}

function doTarget(inex){
    if (targetgrp.indexOf(inex)==-1){
        targetgrp.push(inex);
    }
    else{
        targetgrp.splice(targetgrp.indexOf(inex),1);
    }
    console.log(targetgrp);
}


