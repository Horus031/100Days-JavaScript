const headerBlock = document.querySelector('#header');
const menuBlock = document.querySelector('#menu');
const darkButton = document.querySelector('#darkButton');
const darkIcon = document.querySelector('#darkIcon');
const htmlElement = document.documentElement;
const listBlock = document.querySelector('#list');
const inputButton = document.querySelector('#inputButton');
const searchInput = document.querySelector('#searchInput');
const userKey = 'User';
// Lấy danh sách từ Local Storage hoặc tạo mảng mới nếu chưa có
const todos = JSON.parse(localStorage.getItem('todos')) || [];


// Bật/tắt menu
function toggleMenu() {
    menuBlock.classList.toggle('hidden');
    menuBlock.classList.toggle('w-64');
    menuBlock.classList.toggle('w-full');
    menuBlock.classList.toggle('animate-menuTransition');
}

const app = {
    isDark: false,
    config: JSON.parse(localStorage.getItem(userKey)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(userKey, JSON.stringify(this.config));
    },
    renderLists: function() {
        const htmls = todos.map((todo, index) => {
            return `
                <div id="task-${index + 1}" class="bg-white dark:bg-slate-800 dark:border-gray-500 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div class="flex items-center justify-between ">
                        <div class="flex space-x-4 items-center">
                            <input type="checkbox" name="" id="" class="size-5">
                            <div id="item-info">
                                <h3 id="todoName-${index + 1}" class="dark:text-white text-sm font-medium text-gray-900">${todo.name}</h3>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="dark:text-gray-400 text-xs text-gray-500">${todo.deadline}</span>
                                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span = class="priority px-2 py-0.5 text-xs font-medium rounded-full">${todo.priority}</span>
                                    <span = class="type px-2 py-0.5 text-xs font-medium rounded-full">${todo.type}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <button id="saveTaskBtn" class="hidden hover:bg-gray-100 rounded-md mr-3 p-1">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                                    <path stroke-width="2" d="M 42.875 8.625 C 42.84375 8.632813 42.8125 8.644531 42.78125 8.65625 C 42.519531 8.722656 42.292969 8.890625 42.15625 9.125 L 21.71875 40.8125 L 7.65625 28.125 C 7.410156 27.8125 7 27.675781 6.613281 27.777344 C 6.226563 27.878906 5.941406 28.203125 5.882813 28.597656 C 5.824219 28.992188 6.003906 29.382813 6.34375 29.59375 L 21.25 43.09375 C 21.46875 43.285156 21.761719 43.371094 22.050781 43.328125 C 22.339844 43.285156 22.59375 43.121094 22.75 42.875 L 43.84375 10.1875 C 44.074219 9.859375 44.085938 9.425781 43.875 9.085938 C 43.664063 8.746094 43.269531 8.566406 42.875 8.625 Z"></path>
                                </svg>
                            </button>

                            <button id="adjustTaskBtn" class=" hover:bg-gray-100 rounded-md p-1">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                            </button>

                            <button id="deleteTaskBtn" class="hover:bg-gray-100 rounded-md ml-3 p-1">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `
        }).join('');
        listBlock.innerHTML = htmls;

        // Xử lý các loại priority và type
        this.checkPriority();
        
        this.checkType();
        
    },

    checkPriority: function() {
        const priorityLists = document.querySelectorAll('.priority');
        const priorityArray = Array.from(priorityLists);
        
        priorityArray.forEach(elem => {
            switch(elem.textContent) {
                case 'High Priority':
                    elem.classList.add('bg-red-100', 'text-red-700');
                    break;
                case 'Medium Priority':
                    elem.classList.add('bg-yellow-100', 'text-yellow-700');
                    break;
                case 'Low Priority':
                    elem.classList.add('bg-green-100', 'text-green-700');
                    break;
            }
        })
    },

    checkType: function() {
        const typeLists = document.querySelectorAll('.type');
        const typeArray = Array.from(typeLists);

        typeArray.forEach(elem => {
            switch(elem.textContent) {
                case 'Personal':
                    elem.classList.add('bg-blue-100', 'text-blue-700');
                    break;
                case 'Work':
                    elem.classList.add('bg-orange-100', 'text-orange-700');
                    break;
                case 'Shopping':
                    elem.classList.add('bg-purple-100', 'bg-purple-700');
            }
        })
    },

    defineProperties: function() {
        Object.defineProperty(String.prototype, 'capitalize', {
            value: function() {
                return this.charAt(0).toUpperCase() + this.slice(1);
            },
            enumerable: false
        });
    },

    handleEvents: function() {
        const _this = this;
        const inputValue = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput')
        const priorValue = document.getElementById('taskPriority');
        const typeValue = document.getElementById('taskType');
        document.addEventListener('DOMContentLoaded', function() {
            
            // Bật/Tắt Dark Mode
            darkButton.onclick = function() {
                _this.isDark = !_this.isDark;
                _this.setConfig('isDark', _this.isDark);
                darkButton.classList.toggle('fill-white');
                darkButton.classList.toggle('fill-yellow-400');
                htmlElement.classList.toggle('dark', _this.isDark);
            }


            headerBlock.oninput = function(e) {
                if(e.target.id === 'searchInput') {
                    let searchValue = searchInput.value.toLowerCase().trim();
                    const listItems = Array.from(listBlock.children);
                    listItems.forEach(item => {
                        const todoName = item.querySelector('h3').textContent.toLowerCase();
                        item.style.display = todoName.includes(searchValue) ? 'block' : 'none';
                    });
                }
            }

            // Thêm task
            inputButton.onclick = function() {
                if (inputValue.value.trim() !== '') {
                    todos.push({
                        id: todos.length + 1,
                        name: inputValue.value,
                        deadline: `Due ${dateInput.value}`,
                        priority: `${priorValue.value.capitalize()} Priority`,
                        type: `${typeValue.value.capitalize()}`
                    })
                    localStorage.setItem('todos', JSON.stringify(todos));
                    inputValue.value = '';
                    _this.renderLists();
                }
            }

            

            // Sửa/xóa task
            listBlock.addEventListener('click', function(e) {
                const taskElement = e.target.closest('div[id^="task-"]');
                const taskId = parseInt(taskElement.id.replace('task-', ''), 10) - 1;
                const saveTaskButton = taskElement.querySelector('#saveTaskBtn');
                const adjustTaskButton = taskElement.querySelector('#adjustTaskBtn');
                let taskText = taskElement.querySelector('h3[id^="todoName-"]');
                // Nếu ấn nút xóa task
                if (e.target.closest('#deleteTaskBtn')) {
                    todos.splice(taskId, 1);
                    localStorage.setItem('todos', JSON.stringify(todos));
                    _this.renderLists();
                }

                // Nếu ấn nút chỉnh sửa task
                if (e.target.closest('#adjustTaskBtn')) {
                    // Tìm đến task cần chỉnh sửa
                    let taskItem = taskText.parentElement;
                    let currentText = taskText.textContent;

                    // Tạo ra ô input
                    let inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.className = 'border border-gray-300 rounded-lg p-1 pl-2 text-gray-300 bg-transparent'
                    inputField.value = currentText;

                    // Thoát focus của phần tử hiện tại
                    if (document.activeElement) {
                        document.activeElement.blur();
                    }
                    
                    // Thay thế nội dung bằng input
                    taskItem.replaceChild(inputField, taskText);
                    inputField.focus(); // Thêm focus vào input sửa task
                    saveTaskButton.classList.remove('hidden');
                    adjustTaskButton.classList.add('hidden');
                } else if (e.target.closest('#saveTaskBtn')) {
                    let newInputField = taskElement.querySelector('input[type="text"]');
                    let taskItem = newInputField.parentElement;
                    let newValue = newInputField.value;

                    // Tạo ra heading chứa thông tin sau khi sửa
                    let newTextTask = document.createElement('h3');
                    newTextTask.id = `todoName-${taskId + 1}`;
                    newTextTask.className = 'dark:text-white text-sm font-medium text-gray-900';
                    newTextTask.textContent = newValue;

                    _this.updateNewInfo(taskId, newValue);

                    // Thay thế input bằng heading
                    taskItem.replaceChild(newTextTask, newInputField);
                    saveTaskButton.classList.add('hidden');
                    adjustTaskButton.classList.remove('hidden');
                }
            });
        })
    },

    updateNewInfo: function(taskId, newName) {
        let updatedTodos = todos.map(todo => {
            if (todo.id == taskId + 1) {
                todo.name = newName;
            }
            return todo;
        });

        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    },

    loadConfig: function() {
        let darkMode = JSON.parse(this.config.isDark);
        console.log(darkMode);
        if (darkMode) {
            this.isDark = true;
            darkButton.classList.add('fill-white');
            darkButton.classList.add('fill-yellow-400');
            htmlElement.classList.add('dark');
        } else {
            darkButton.classList.remove('fill-white');
            darkButton.classList.remove('fill-yellow-400');
            htmlElement.classList.remove('dark');
        }
    },

    start: function() {

        // Tạo thuộc tính (viết hoa chữ đầu tiên)
        this.defineProperties();

        // Xử lý các xử kiện
        this.handleEvents();

        // Render các task hiện có
        this.renderLists();

        // Load trạng thái người dùng
        this.loadConfig();

    }
};

app.start();