const darkModeBtn = document.querySelector('#dark-mode');
const htmlElement = document.documentElement;

darkModeBtn.addEventListener('click', function() {
    htmlElement.classList.toggle('dark');
})