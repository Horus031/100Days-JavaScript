var mouse = false;
function mousedown() {
    mouse = true;
    callEvent();
}
function mouseup() {
    mouse =false;
}
function callEvent() {
    if(mouse) {
    // do whatever you want
    // it will continue executing until mouse is not released


        setTimeout("callEvent()",1);
    } else {
        return;
    }
}