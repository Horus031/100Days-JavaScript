const headerBlock = document.querySelector('#header');
const menuBlock = document.querySelector('#menu');
const darkButton = document.querySelector('#darkButton');
const darkIcon = document.querySelector('#darkIcon');
const htmlElement = document.documentElement;
const navBlock = document.querySelector('#navbar');
const listBlock = document.querySelector('#list');
const inputButton = document.querySelector('#inputButton');
const searchInput = document.querySelector('#searchInput');
const notification = document.querySelector('#dialog');
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
    response: undefined,
    isDark: false,
    config: JSON.parse(localStorage.getItem(userKey)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(userKey, JSON.stringify(this.config));
    },
    // Hàm dùng để render giao diện và check các điều kiện hiển thị
    renderLists: function(todoList = todos) {
        if (todoList.length === 0) {
            this.displayEmptyState(); // Hàm riêng để hiển thị trạng thái trống
        } else {
            const fragment = document.createDocumentFragment();
            todoList.forEach((todo, index) => {
                const taskElement = this.createTaskElement(todo, index);
                fragment.appendChild(taskElement);
            });
            listBlock.innerHTML = ''; // Xóa nội dung cũ
            listBlock.appendChild(fragment); // Thêm danh sách mới

            // Xử lý các loại thời gian, priority và type
            this.checkPriority();
            
            this.checkType();
            
            if (todoList == todos) { 
                this.checkDateAndRender();
            }
        }
    },

    // Hàm để hiển thị trạng thái trống
    displayEmptyState: function(todoList = todos) {
        const emptyState = document.createElement('div');
        if (todoList.length == 0) {
            emptyState.innerHTML = `
            <div class="flex flex-col justify-center items-center">
                <div class="m-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-56 h-56" viewBox="0 0 118 111" fill="none">
                        <path d="M79.4562 42.09C71.0762 42.14 62.5662 41.75 54.5962 39.53C46.6262 37.31 39.5962 33.15 33.1962 28.28C28.9962 25.11 25.1962 22.59 19.7462 22.97C14.4259 23.2517 9.33794 25.2399 5.23621 28.64C-1.69379 34.7 -0.643786 45.86 2.11621 53.79C6.28621 65.66 18.9562 73.86 29.7062 79.28C42.1362 85.49 55.7862 89.09 69.4862 91.17C81.4862 92.99 96.8962 94.32 107.296 86.48C116.856 79.28 119.476 62.84 117.136 51.74C116.566 48.4568 114.816 45.4947 112.216 43.41C105.506 38.51 95.4962 41.78 87.9562 41.95C85.1562 42.01 82.3162 42.07 79.4562 42.09Z" class="stroke-[#272933] dark:fill-[#272933]"/>
                        <path d="M58.9662 110.62C79.2406 110.62 95.6762 109.595 95.6762 108.33C95.6762 107.065 79.2406 106.04 58.9662 106.04C38.6919 106.04 22.2562 107.065 22.2562 108.33C22.2562 109.595 38.6919 110.62 58.9662 110.62Z" fill="#272933"/>
                        <path d="M96.4862 29.87V34.18" class="stroke-black dark:stroke-[#4A5059]" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M94.3262 32.03H98.6362" class="stroke-black dark:stroke-[#4A5059]" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M24.2562 66.09V70.39" class="stroke-black dark:stroke-[#4A5059]" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22.1062 68.24H26.4162" class="stroke-black dark:stroke-[#4A5059]" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.2262 11.95V16.25" class="stroke-black dark:stroke-[#4A5059]" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.0762 14.1H20.3762" class="stroke-black dark:stroke-[#4A5059]" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M83.7929 6.64512L26.7598 12.5691C25.4579 12.7043 24.5121 13.8694 24.6473 15.1713L32.4475 90.2673C32.5827 91.5692 33.7477 92.515 35.0496 92.3797L92.0828 86.4557C93.3847 86.3205 94.3305 85.1555 94.1953 83.8536L86.3951 8.75759C86.2599 7.45568 85.0949 6.5099 83.7929 6.64512Z" class="fill-white stroke-black dark:fill-[#2D333E] dark:stroke-[#4A5059]" stroke-miterlimit="10"/>
                        <path d="M81.3387 10.1214L29.8656 15.4679C28.5637 15.6031 27.6179 16.7681 27.7532 18.07L34.8074 85.9846C34.9426 87.2866 36.1076 88.2323 37.4096 88.0971L88.8826 82.7507C90.1846 82.6154 91.1303 81.4504 90.9951 80.1485L83.9409 12.2339C83.8056 10.9319 82.6406 9.98616 81.3387 10.1214Z" class="fill-white stroke-black dark:fill-[#2D333E] dark:stroke-[#4A5059]" stroke-miterlimit="10"/>
                        <path d="M72.4662 13.44L71.6662 5.73998C71.65 5.57904 71.6022 5.42289 71.5255 5.28046C71.4488 5.13803 71.3448 5.01212 71.2194 4.90995C71.094 4.80777 70.9497 4.73133 70.7947 4.68501C70.6397 4.63868 70.4771 4.62338 70.3162 4.63998L60.7662 5.63998C60.5579 4.13104 59.7712 2.76216 58.5722 1.82256C57.3733 0.882954 55.856 0.446206 54.341 0.604587C52.826 0.762967 51.4319 1.50407 50.4533 2.67133C49.4746 3.83858 48.988 5.34057 49.0962 6.85998L39.5362 7.85998C39.3757 7.87617 39.2199 7.92405 39.078 8.00085C38.936 8.07766 38.8108 8.18186 38.7094 8.30742C38.608 8.43298 38.5325 8.5774 38.4874 8.73233C38.4422 8.88726 38.4282 9.04961 38.4462 9.20998L39.2462 16.91C39.2625 17.0709 39.3103 17.2271 39.387 17.3695C39.4636 17.5119 39.5676 17.6378 39.693 17.74C39.8184 17.8422 39.9628 17.9186 40.1177 17.965C40.2727 18.0113 40.4353 18.0266 40.5962 18.01L71.3762 14.81C71.5382 14.7926 71.695 14.7433 71.8377 14.6648C71.9805 14.5863 72.1062 14.4802 72.2076 14.3528C72.309 14.2253 72.384 14.079 72.4284 13.9223C72.4728 13.7656 72.4857 13.6017 72.4662 13.44Z" fill="#4A5059"/>
                        <path d="M72.7624 52.36C72.6857 55.3404 71.5922 58.2051 69.6634 60.4786C67.7347 62.7521 65.0866 64.2979 62.1585 64.8595C59.2305 65.421 56.1984 64.9646 53.5654 63.566C50.9324 62.1673 48.8567 59.9105 47.6827 57.1699" stroke="#4A5059" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M47.8762 44.2C48.6604 44.2 49.2962 43.5642 49.2962 42.78C49.2962 41.9957 48.6604 41.36 47.8762 41.36C47.0919 41.36 46.4562 41.9957 46.4562 42.78C46.4562 43.5642 47.0919 44.2 47.8762 44.2Z" fill="#4A5059"/>
                        <path d="M67.8762 41.2C68.6604 41.2 69.2962 40.5642 69.2962 39.78C69.2962 38.9957 68.6604 38.36 67.8762 38.36C67.0919 38.36 66.4562 38.9957 66.4562 39.78C66.4562 40.5642 67.0919 41.2 67.8762 41.2Z" fill="#4A5059"/>
                    </svg>
                </div>
                <div class="flex flex-col items-center">
                    <h1 class="text-2xl text-black dark:text-gray-600 font-semibold">No Task</h1>
                    <p class="text-black dark:text-gray-600">It seems there are no task added yet</p>
                </div>
            </div>
        `
        while(listBlock.firstChild) {
            listBlock.removeChild(listBlock.firstChild);
        }
        listBlock.appendChild(emptyState);
        }
    },
    
    // Tạo phần tủ chứa các task
    createTaskElement: function(todo, index) {
        const taskDiv = document.createElement('div');
        taskDiv.id = `task-${index + 1}`;
        taskDiv.className = 'bg-white dark:bg-slate-800 dark:border-gray-500 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md animate-taskTransition transition-all';
        taskDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex space-x-4 items-center">
                    <input type="checkbox" name="checkbox" id="" class="size-5">
                    <div id="item-info">
                        <h3 id="todoName-${index + 1}" class="dark:text-white text-sm font-medium text-gray-900">${todo.name}</h3>
                        <div id="info-${index + 1}" class="flex items-center space-x-2 mt-1">
                            <span class="deadline dark:text-gray-400 text-xs text-gray-500">${todo.deadline}</span>
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
        `;
        return taskDiv;
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
            messageBlock.className = 'active bg-gray-200 flex items-center justify-between z-10 border-blue-700 border-l-4 rounded px-2 py-2 max-w-80 w-80 text-black dark:text-gray-600 animate-toastTransition';
            messageBlock.innerHTML = `
                <svg class="w-8 h-8 mr-2 text-blue-700" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" version="1.1" id="Capa_1" viewBox="0 0 45.311 45.311" xml:space="preserve">
                <g>
                    <path d="M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656   c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635   C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001   c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0   c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578   c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0   c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29   c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z"/>
                </g>
                </svg>

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
    
    createNotification: function(){ 
        return new Promise((resolve) => {
            const notification = document.createElement('div');
            notification.classList.add('relative', 'z-10');
            notification.ariaLabel = 'modal-title';
            notification.ariaModal = 'true';
            notification.role = 'dialog';
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-gray-500/75 transition-opacity';
            overlay.ariaHidden = 'true';
            const infoBlock = document.createElement('div');
            infoBlock.className = 'fixed inset-0 z-10 w-screen overflow-y-auto';
            infoBlock.innerHTML = `
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                    <svg class="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                </div>
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-base font-semibold text-gray-900" id="modal-title">Delete your task</h3>
                                    <div class="mt-2">
                                    <p class="text-sm text-gray-500">Are you sure you want to delete your task? All of your data will be permanently removed. This action cannot be undone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button id="acceptDelete" value="Yes" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                            <button id="cancelDelete" value="No" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                        </div>
                    </div>
                </div>
            `

            notification.appendChild(overlay);
            notification.appendChild(infoBlock);
            document.body.appendChild(notification);

            notification.addEventListener('click', function(e) {
                if (e.target.closest('button[id="acceptDelete"]')) {
                    resolve(true);
                    document.body.removeChild(notification);
                } else if (e.target.closest('button[id="cancelDelete"]')){
                    resolve(false);
                    document.body.removeChild(notification);
                }
            });
        })
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
                    const formattedDate = _this.convertDateFormat(dateInput.value);
                    todos.push({
                        id: todos.length + 1,
                        name: inputValue.value,
                        originalDeadline: formattedDate,
                        deadline: `${formattedDate}`,
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
            listBlock.addEventListener('click', async function(e) {
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
                    const userConfirmed = await _this.createNotification();
                    if (userConfirmed) {
                        todos.splice(taskId, 1);
                        localStorage.setItem('todos', JSON.stringify(todos));
                        _this.renderLists();
                        _this.attachEvents();
                    }
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

    convertDateFormat: function(dateStr) {
        return dateStr.split('-').reverse().join('-');
    },

    handleDatePicker: function() {
        const datepicker = document.getElementById('dateInput');
        const datepickerContainer = document.getElementById('datepicker-container');
        const daysContainer = document.getElementById('days-container');
        const currentMonthElement = document.getElementById('currentMonth');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');
        const cancelButton = document.getElementById('cancelButton');
        const applyButton = document.getElementById('applyButton');
        const toggleDatepicker = document.getElementById('toggleDatepicker');

        let currentDate = new Date();
        let selectedDate = null;

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            currentMonthElement.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            daysContainer.innerHTML = '';
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDayOfMonth; i++) {
            daysContainer.innerHTML += `<div></div>`;
            }

            for (let i = 1; i <= daysInMonth; i++) {
            daysContainer.innerHTML += `<div class="flex items-center justify-center cursor-pointer w-[46px] h-[46px] text-dark-3 dark:text-dark-6 rounded-full hover:bg-blue-700 hover:text-white">${i}</div>`;
            }

            document.querySelectorAll('#days-container div').forEach(day => {
            day.addEventListener('click', function () {
                selectedDate = `${this.textContent}-${month + 1}-${year}`;
                document.querySelectorAll('#days-container div').forEach(d => d.classList.remove('bg-blue-700', 'text-white', 'dark:text-white'));
                this.classList.add('bg-blue-700', 'text-white', 'dark:text-white');
            });
            });
        }

        datepicker.addEventListener('click', function () {
            datepickerContainer.classList.toggle('hidden');
            renderCalendar();
        });

        toggleDatepicker.addEventListener('click', function () {
            datepickerContainer.classList.toggle('hidden');
            renderCalendar();
        });

        prevMonthButton.addEventListener('click', function () {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthButton.addEventListener('click', function () {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        cancelButton.addEventListener('click', function () {
            selectedDate = null;
            datepickerContainer.classList.add('hidden');
        });

        applyButton.addEventListener('click', function () {
            if (selectedDate) {
            datepicker.value = selectedDate;
            console.log(selectedDate.split('-').reverse().join('-'));
            }
            datepickerContainer.classList.add('hidden');
        });

        // Close datepicker when clicking outside
        document.addEventListener('click', function (event) {
            if (!datepicker.contains(event.target) && !datepickerContainer.contains(event.target)) {
            datepickerContainer.classList.add('hidden');
            }
        });
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

        this.handleDatePicker();

        // Render các task hiện có
        this.renderLists();

        this.attachEvents();

        // Load trạng thái người dùng
        this.loadConfig();

    }
};

app.start();