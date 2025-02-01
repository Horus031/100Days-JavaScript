const headerBlock = document.querySelector('#header');
const mainBlock = document.querySelector('#main');


function switchTab() {
    headerBlock.classList.add('animate-fadeSequence');
    mainBlock.classList.add('animate-fadeSequence');
    setTimeout(function() {
        window.location.href = "/home" || "./index.html";
    }, 1000);
}

