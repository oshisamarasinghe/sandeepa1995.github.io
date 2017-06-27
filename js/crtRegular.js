/**
 * Created by Damitha on 6/27/2017.
 */
function doTarget() {
    if (document.getElementById("rbSpc").checked)
    {
        showSpeci();
    }
    else
    {
        hideSpeci();
    }

}

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
    }
}