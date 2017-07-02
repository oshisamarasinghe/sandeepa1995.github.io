/**
 * Created by Damitha on 6/27/2017.
 */

var socket=io();

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
            content: newContent
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