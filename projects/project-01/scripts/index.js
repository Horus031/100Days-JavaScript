const headerBlock = document.querySelector('#header');
const menuBlock = document.querySelector('#menu');
const darkButton = document.querySelector('#darkButton');
const darkIcon = document.querySelector('#darkIcon');
const htmlElement = document.documentElement;
const inputButton = document.querySelector('#inputButton');
// Lấy danh sách từ Local Storage hoặc tạo mảng mới nếu chưa có
const todos = JSON.parse(localStorage.getItem('todos')) || [];


function toggleMenu() {
    menuBlock.classList.toggle('hidden');
    menuBlock.classList.toggle('w-64');
    menuBlock.classList.toggle('w-full');
    menuBlock.classList.toggle('animate-menuTransition');
}

const app = {
    isDark: false,
    
    renderLists: function() {
        const todoList = document.getElementById('list');
        if (todoList) {
            const listContainer = document.querySelector('items');
            todos.forEach((todo, index) => {

            })
        }
    },

    handleEvents: function() {
        _this = this;

        // Bật/Tắt Dark Mode
        darkButton.onclick = function() {
            darkButton.classList.toggle('fill-white');
            darkButton.classList.toggle('fill-yellow-400')
            htmlElement.classList.toggle('dark');
        }

        // Thêm task
        inputButton.onclick = function() {
            let inputValue = document.getElementById('taskInput');
            let priorValue = document.getElementById('taskPriority');
            let typeValue = document.getElementById('taskType');
            if (inputValue.value.trim() !== '') {
                console.log(inputValue.value, priorValue.value, typeValue.value);
                inputValue.value = '';
            }
        }

    },

    start: function() {
        this.handleEvents();

    }
};


app.start();