const headerBlock = document.querySelector('#header');
const menuBlock = document.querySelector('#menu');
const darkButton = document.querySelector('#darkButton');
const darkIcon = document.querySelector('#darkIcon');
const htmlElement = document.documentElement;
const inputButton = document.querySelector('#inputButton');
// Lấy danh sách từ Local Storage hoặc tạo mảng mới nếu chưa có
const todos = JSON.parse(localStorage.getItem('todos')) || [];

console.log(todos);

// Bật/tắt menu
function toggleMenu() {
    menuBlock.classList.toggle('hidden');
    menuBlock.classList.toggle('w-64');
    menuBlock.classList.toggle('w-full');
    menuBlock.classList.toggle('animate-menuTransition');
}

const app = {
    isDark: false,
    renderLists: function() {
        const listBlock = document.querySelector('#list');
        const htmls = todos.map(todo => {
            return `
                <div class="bg-white dark:bg-slate-800 dark:border-gray-500 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div class="flex items-center justify-between ">
                        <div class="flex space-x-4 items-center">
                            <input type="checkbox" name="" id="" class="size-5">
                            <div>
                                <h3 class="dark:text-white text-sm font-medium text-gray-900">${todo.name}</h3>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="dark:text-gray-400 text-xs text-gray-500">${todo.deadline}</span>
                                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span class="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">${todo.priority}</span>
                                    <span class="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">${todo.type}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <button class=" hover:bg-gray-100 rounded-md p-1">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                            </button>

                            <button class="hover:bg-gray-100 rounded-md ml-3 p-1">
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

        // Bật/Tắt Dark Mode
        darkButton.onclick = function() {
            darkButton.classList.toggle('fill-white');
            darkButton.classList.toggle('fill-yellow-400')
            htmlElement.classList.toggle('dark');
        }

        // Thêm task
        inputButton.onclick = function() {
            let inputValue = document.getElementById('taskInput');
            let dateInput = document.getElementById('dateInput')
            let priorValue = document.getElementById('taskPriority');
            let typeValue = document.getElementById('taskType');
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

    },

    start: function() {

        // Tạo thuộc tính (viết hoa chữ đầu tiên)
        this.defineProperties();

        // Xử lý các xử kiện
        this.handleEvents();

        // Render các task hiện có
        this.renderLists();

    }
};


app.start();