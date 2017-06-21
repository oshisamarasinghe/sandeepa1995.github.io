/**
 * Created by Damitha on 4/23/2017.
 */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}

function doNav() {
    if (document.getElementById("mySidenav").style.width=="250px")
    {
        closeNav();
    }
    else
    {
        openNav();
    }
}