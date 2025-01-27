const headerBlock = document.querySelector('#header');
const menuBlock = document.querySelector('#menu');
const darkButton = document.querySelector('#darkButton');
const darkIcon = document.querySelector('#darkIcon');
const htmlElement = document.documentElement;
const navBlock = document.querySelector('#navbar');
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

// Object app dùng để chứa tất cả các thuộc tính và function 
const app = {
    isDark: false,
    config: JSON.parse(localStorage.getItem(userKey)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(userKey, JSON.stringify(this.config));
    },
    // Hàm dùng để render giao diện và check các điều kiện hiển thị
    renderLists: function(todoList = todos) {
        const htmls = todoList.map((todo, index) => {
            return `
                <div id="task-${index + 1}" class="bg-white dark:bg-slate-800 dark:border-gray-500 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md animate-taskTransition transition-all">
                    <div class="flex items-center justify-between ">
                        <div class="flex space-x-4 items-center">
                            <input type="checkbox" name="checkbox" id="" class="size-5">
                            <div id="item-info">
                                <h3 id="todoName-${index + 1}" class="dark:text-white text-sm font-medium text-gray-900">${todo.name}</h3>
                                <div id="info-${index + 1}" class="flex items-center space-x-2 mt-1">
                                    <span class="deadline max-w-[31px] dark:text-gray-400 text-xs text-gray-500 md:w-full md:max-w-max">${todo.deadline}</span>
                                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span class="priority text-nowrap px-2 py-0.5 text-xs font-medium rounded-full">${todo.priority}</span>
                                    <span class="type px-2 py-0.5 text-xs font-medium rounded-full">${todo.type}</span>
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

        // Xử lý các loại thời gian, priority và type
        this.checkPriority();
        
        this.checkType();
        
        if (todoList == todos) {
            this.checkDateAndRender();
        }

},

    // Hàm để xử lý màu hiển thị của Priority trên giao diện
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

    // Hàm để xử lý màu hiển thị của Type trên giao diện
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
                    elem.classList.add('bg-purple-100', 'text-purple-700');
            }
        })
    },

    // Hàm để xử lý thời gian
    checkDateAndRender: function() {
        const oneDayTime = 24 * 60 * 60 * 1000;  // 24 giờ tính bằng mili giây
        const currentTime = new Date();
        const currentMs = currentTime.getTime();
        // Lấy các giá trị thời gian từ Local Storage
        const deadlineList = todos.map(todo => todo.originalDeadline);


        // Chuyển đổi các giá trị thời gian về 0
        function setMidnight(time) {
            const date = new Date(time);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        }
        
        const currentMidnight = setMidnight(currentMs);
        const formattedDeadline = deadlineList.map(time => setMidnight(new Date(time).getTime()));

        formattedDeadline.forEach((time, index) => {
            const dayDiff = Math.floor((time - currentMidnight) / oneDayTime);
            let newDeadline;
            if (dayDiff === 0) {
                newDeadline = 'Today';
            } else if (dayDiff === 1) {
                newDeadline = 'Tomorrow';
            }

            if (newDeadline) {
                todos[index].deadline = `Due ${newDeadline}`;
                localStorage.setItem('todos', JSON.stringify(todos));
                
            } else {
                const deadlineTime = new Date(time);
                const deadlineDay = deadlineTime.getDate();
                const deadlineMonth = deadlineTime.getMonth() + 1;
                const deadlineYear = deadlineTime.getFullYear();
                const fullTime = `${deadlineDay}-${deadlineMonth}-${deadlineYear}`;
                todos[index].deadline = `Due ${fullTime}`;
                localStorage.setItem('todos', JSON.stringify(todos));
            }
        })

        // Khởi tạo biến chứa chuỗi chuyển về định dạng Date
        const storedDeadlineTime = deadlineList.map(time => {
            const deadlineTime = new Date(time);
            return deadlineTime.getTime();
        });
        // Khởi tạo biến lặp qua các
        const sortedDeadlineTodos = todos.toSorted((a, b) => {
            const deadlineA = storedDeadlineTime[todos.indexOf(a)];
            const deadlineB = storedDeadlineTime[todos.indexOf(b)];
            return deadlineA - deadlineB;
        });
        // Cập nhật lại id theo tuần tự bắt đầu từ 1
        const updatedDeadlineTodos = sortedDeadlineTodos.map((todo, i) => {
            const newTodo = { ...todo };
            newTodo.id = i + 1;
            return newTodo;
        });

        // Gán lại vào local storage và đảm bảo nếu như đúng tuần tự thì không gán nữa
        if (JSON.stringify(updatedDeadlineTodos) !== JSON.stringify(todos)) {
            localStorage.setItem('todos', JSON.stringify(updatedDeadlineTodos));
            this.renderLists(updatedDeadlineTodos);
        }
    },

    // Tạo thuộc tính viết hoa chữ cái đầu cho đối tượng String
    defineProperties: function() {
        Object.defineProperty(String.prototype, 'capitalize', {
            value: function() {
                return this.charAt(0).toUpperCase() + this.slice(1);
            },
            enumerable: false
        });
    },

    // Tạo Toast Message
    createToastMessage: function() {
        const toast = document.querySelector('#toast');
        const existingMessageBlock = document.querySelector('#message-block');
        // Add các phần tử DOM vào
        if (!existingMessageBlock) {
            const messageBlock = document.createElement('div');
            messageBlock.id = 'message-block';
            messageBlock.className = 'active bg-gray-200 flex items-center justify-between z-10 border-blue-700 border-l-4 rounded px-4 py-2 max-w-80 w-80 text-black dark:text-gray-600 animate-toastTransition';
            messageBlock.innerHTML = `
                Wait! You need to fill in all the information to add a task.
                <button id="closeToastBtn" class="ml-2">
                    <svg class="w-5 h-5 dark:fill-gray-600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" version="1.1">
                        <rect width="16" height="16" id="icon-bound" fill="none" />
                        <polygon points="14.707,2.707 13.293,1.293 8,6.586 2.707,1.293 1.293,2.707 6.586,8 1.293,13.293 2.707,14.707 8,9.414   13.293,14.707 14.707,13.293 9.414,8 "/>
                    </svg>
                </button>
            `

            toast.appendChild(messageBlock);

            const closeToastButton = document.querySelector('#closeToastBtn');
            let autoRemoveTimeout;

            closeToastButton.addEventListener('click', function() {
                clearTimeout(autoRemoveTimeout);
                messageBlock.classList.remove('active');
                messageBlock.classList.remove('animate-toastTransition');
                messageBlock.classList.add('animate-toastSlideOut');
                setTimeout(() => {
                    toast.removeChild(messageBlock);
                }, 400);
            })

            autoRemoveTimeout = setTimeout(() => {
                // Kiểm tra xem messageBlock có bị xóa trước thời gian này không
                // Nếu không thì nhảy vào điều kiện và tự động xóa
                if (toast.contains(messageBlock)) {
                    // Xóa animation xuất hiện, thêm animation biến mất
                    messageBlock.classList.remove('animate-toastTransition');
                    messageBlock.classList.add('animate-toastSlideOut');
                    // Sau khi thực thi xong animation thì xóa phần tử con
                    setTimeout(() => {
                        toast.removeChild(messageBlock);
                    }, 1000);
                }
            }, 3000);
        }
        
        
        

        

        
    },
    

    // Hàm để xử lý tất cả sự kiện trên trình duyệt
    handleEvents: function() {
        const _this = this;
        const inputValue = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        const priorValue = document.getElementById('taskPriority');
        const typeValue = document.getElementById('taskType');
        document.addEventListener('DOMContentLoaded', function() {
            const listItems = Array.from(listBlock.children);

            // Bật/Tắt Dark Mode
            darkButton.addEventListener('click', function() {
                _this.isDark = !_this.isDark;
                _this.setConfig('isDark', _this.isDark);
                darkButton.classList.toggle('fill-white');
                darkButton.classList.toggle('fill-yellow-400');
                htmlElement.classList.toggle('dark', _this.isDark);
            })

            // Thêm task
            inputButton.addEventListener('click', function() {
                const addCondition = inputValue.value.trim() !== '' && dateInput.value && priorValue.value && typeValue.value
                if (addCondition) {
                    todos.push({
                        id: todos.length + 1,
                        name: inputValue.value,
                        originalDeadline: dateInput.value,
                        deadline: `${dateInput.value}`,
                        priority: `${priorValue.value.capitalize()} Priority`,
                        type: `${typeValue.value.capitalize()}`
                    })
                    localStorage.setItem('todos', JSON.stringify(todos));
                    inputValue.value = '';
                    _this.checkDateAndRender();
                    _this.renderLists();
                    _this.attachEvents();
                } else {
                    _this.createToastMessage();
                }
            })

            
            // Sửa/xóa task
            listBlock.addEventListener('click', function(e) {
                const taskElement = e.target.closest('div[id^="task-"]');
                const taskId = parseInt(taskElement.id.replace('task-', ''), 10) - 1;
                const saveTaskButton = taskElement.querySelector('#saveTaskBtn');
                const adjustTaskButton = taskElement.querySelector('#adjustTaskBtn');
                let taskText = taskElement.querySelector('h3[id^="todoName-"]');
                let infoBlock = taskElement.querySelector('div[id^="info-"]')
                let taskPrior = taskElement.querySelector('.priority');
                let taskType = taskElement.querySelector('.type');

                // Nếu ấn nút xóa task
                if (e.target.closest('#deleteTaskBtn')) {
                    todos.splice(taskId, 1);
                    localStorage.setItem('todos', JSON.stringify(todos));
                    _this.renderLists();
                    _this.attachEvents();
                }

                // Nếu ấn nút chỉnh sửa task
                if (e.target.closest('#adjustTaskBtn')) {
                    // Tìm đến task cần chỉnh sửa
                    let taskItem = taskText.parentElement;
                    let currentText = taskText.textContent;


                    // Tạo ra ô input
                    let inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.name = 'inputValue';
                    inputField.className = 'border border-gray-300 rounded-lg p-1 pl-2 text-gray-300 bg-transparent'
                    inputField.value = currentText;

                    // Tạo ra ô select priority
                    const originalPriorSelect = document.getElementById('taskPriority');
                    const originalTypeSelect = document.getElementById('taskType');

                    let selectPriorField = document.createElement('select');
                    selectPriorField.id = 'priority';
                    selectPriorField.className = originalPriorSelect.className;
                    selectPriorField.innerHTML = originalPriorSelect.innerHTML;

                    // Tạo ra ô select type
                    let selectTypeField = document.createElement('select');
                    selectTypeField.id = 'type';
                    selectTypeField.className = originalTypeSelect.className;
                    selectTypeField.innerHTML = originalTypeSelect.innerHTML;

                    // Thoát focus của phần tử hiện tại
                    if (document.activeElement) {
                        document.activeElement.blur();
                    }

                    // Thay thế nội dung bằng input
                    taskItem.replaceChild(inputField, taskText);
                    infoBlock.replaceChild(selectPriorField, taskPrior);
                    infoBlock.replaceChild(selectTypeField, taskType);
                    inputField.focus(); // Thêm focus vào input sửa task
                    saveTaskButton.classList.remove('hidden');
                    adjustTaskButton.classList.add('hidden');

                } else if (e.target.closest('#saveTaskBtn')) {
                    // Tạo ra các biến chứa giá trị mới
                    let newInputField = taskElement.querySelector('input[type="text"]');
                    let taskItem = newInputField.parentElement;
                    let newValue = newInputField.value;

                    // Tạo ra hai biến chứa các giá trị select mới
                    let newPriorField = taskElement.querySelector('select[id="priority"]');
                    let newPriorValue = newPriorField.value.capitalize();
                    let newTypeField = taskElement.querySelector('select[id="type"]');
                    let newTypeValue = newTypeField.value.capitalize();

                    // Tạo ra heading chứa thông tin sau khi sửa
                    let newTextTask = document.createElement('h3');
                    let newPriorBlock = document.createElement('span');
                    let newTypeBlock = document.createElement('span');

                    // Cấu hình cho thẻ title mới
                    newTextTask.id = `todoName-${taskId + 1}`;
                    newTextTask.className = 'dark:text-white text-sm font-medium text-gray-900';
                    

                    // Cấu hình cho các thẻ select mới
                    const adjustAdditions = newValue.trim() && newPriorValue && newTypeValue
                    if (adjustAdditions) {
                        newTextTask.textContent = newValue;
                        newPriorBlock.className = 'priority px-2 py-0.5 text-xs font-medium rounded-full'
                        newPriorBlock.textContent = newPriorValue;
                        newTypeBlock.className = 'type px-2 py-0.5 text-xs font-medium rounded-full';
                        newTypeBlock.textContent = newTypeValue;

                        _this.updateNewInfo(taskId, newValue, newPriorValue, newTypeValue);
                        _this.renderLists();
                        _this.attachEvents();
                        // Thay thế input bằng heading

                        taskItem.replaceChild(newTextTask, newInputField);
                        infoBlock.replaceChild(newPriorBlock, newPriorField);
                        infoBlock.replaceChild(newTypeBlock, newTypeField);
                        saveTaskButton.classList.add('hidden');
                        adjustTaskButton.classList.remove('hidden');
                    } else {
                        _this.createToastMessage();
                    }
                }
            });
        })
    },

    attachEvents: function() {
        const listItems = Array.from(listBlock.children);
        navBlock.addEventListener('click', function(e) {
            listItems.forEach(item => {
                item.classList.remove('animate-taskTransition');
            });
            setTimeout(() => {
                switch (e.target.id) {
                    case 'alltask':
                        listItems.forEach(item => {
                            item.style.display = 'block';
                            setTimeout(() => item.classList.add('animate-taskTransition'), 0);
                        });
                        break;
                    case 'personal':
                    case 'work':
                    case 'shopping':
                        listItems.forEach(item => {
                            const itemType = item.querySelector('.type').textContent.toLowerCase();
                            item.style.display = itemType.includes(e.target.id) ? '' : 'none';
                            setTimeout(() => item.classList.add('animate-taskTransition'), 0);
                        });
                        break;
                }
            }, 0);
        });

        // Tìm task
        headerBlock.addEventListener('input', function(e) {
            if(e.target.id === 'searchInput') {
                let searchValue = searchInput.value.toLowerCase().trim();
                listItems.forEach(item => {
                    const todoName = item.querySelector('h3').textContent.toLowerCase();
                    item.style.display = todoName.includes(searchValue) ? 'block' : 'none';
                });
            }
        })
    },

    updateNewInfo: function(taskId, newName, newPrior, newType) {
        let updatedTodos = todos.map(todo => {
            if (todo.id == taskId + 1) {
                todo.name = newName;
                todo.priority = `${newPrior} Priority`;
                todo.type = newType;
            }
            return todo;
        });

        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    },

    loadConfig: function() {
        let darkMode = JSON.parse(this.config.isDark);
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

        this.handleEvents();

        // Render các task hiện có
        this.renderLists();

        this.attachEvents();

        // Load trạng thái người dùng
        this.loadConfig();

    }
};

app.start();