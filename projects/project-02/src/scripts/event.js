import { ui } from "./ui.js";

export const events = {
    isMouseDown: false,
    currentColor: undefined,
    handleDarkMode: function(button, htmlElement, configHandler) {
        button.addEventListener('click', () => {
            const isDark = htmlElement.classList.toggle('dark');
            console.log(isDark);
            configHandler.saveConfig('isDark', isDark);
        });
        let darkMode = configHandler.getConfig('isDark');
        if (darkMode) {
            htmlElement.classList.add('dark');
            console.log('dark');
        } else {
            htmlElement.classList.remove('dark');
            console.log('light');
        }
    },

    // 
    handleGridSelect: function(canvas, gridSelect, configHandler) {
        gridSelect.addEventListener('change', () => {
            ui.renderCanvas(canvas, gridSelect, configHandler)
        })
    },
    
    // Hàm khởi tạo các giá trị dùng cho việc vẽ và tìm tọa độ pixel
    handleDrawValues: function(e, gridSelect, canvas, ctx, colorPicker) {
        const gridSize = parseInt(gridSelect.value);
        const pixelSize = canvas.width / gridSize;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
        const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;
        let currentColor = colorPicker.value

        ctx.strokeStyle = 'black';
        ctx.fillStyle = `${currentColor}`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
        ctx.strokeRect(x, y, pixelSize, pixelSize);
    },

    // Sự kiện chọn màu từ color picker và vẽ
    handleColorAndDraw: function(canvas, gridSelect, colorPicker, configHandler, ctx, recentColors) {
        let storageColors = configHandler.getConfig('storageColors');
        const pencil = document.querySelector('button#pencil');

        // Nếu local storage không phải array, thì chuyển về để xử lý duyệt mảngs
        if (!Array.isArray(storageColors)) {
            storageColors = [];
        }

        // Nhận value màu từ color picker
        colorPicker.addEventListener('change', function() {
            events.currentColor = colorPicker.value;
            const colorElement = document.createElement('button');
            colorElement.className = 'w-8 h-8 rounded border border-white';
            colorElement.style.backgroundColor = events.currentColor;
            colorElement.setAttribute('data-color', events.currentColor); // Lưu trữ mã màu hex bằng một attribtue

            if (storageColors.length >= 8) {
                storageColors.pop();
            }
            storageColors.unshift(events.currentColor);
            configHandler.saveConfig('storageColors', storageColors);
            ui.renderRecentColor(recentColors, configHandler);
        });

        // Lắng nghe sự kiện click vào mỗi ô pixel
        canvas.addEventListener('click', function(e) {
            if (pencil.hasAttribute('active')) {
                events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
            }
        })
        
    },

    handleEraser: function(canvas) {
        const eraser = document.querySelector('button#eraser')
        canvas.addEventListener('click', function(e) {
            if (eraser.hasAttribute('active')) {
                console.log('true');
            }
        })
    },

    // Xử lý sự kiện chọn màu trong bảng màu gần đây
    handleRecentColors: function(currentColors, colorPicker) {
        // Lắng nghe sự kiện chọn màu từ ô màu gần đây
        currentColors.addEventListener('click', function(e) {
            if (e.target.closest('button')) {
                const color = e.target.getAttribute('data-color'); // Lấy mã màu hex từ attribute đã set
                colorPicker.value = color;
                this.currentColor = colorPicker.value;
                
            }
        })
    },

    // Xử lý sự kiện đè chuột để tô nhiều pixel
    handleHoldDrawing: function(canvas, gridSelect, ctx, colorPicker) {        
        canvas.addEventListener('mousedown', function(e) {
            events.isMouseDown = true;
        })

        canvas.addEventListener('mousemove', function(e) {
            if (events.isMouseDown) {
                events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
            }
        })

        canvas.addEventListener('mouseup', function(e) {
            events.isMouseDown = false;
        })

        canvas.addEventListener('mouseout', function(e) {
            events.isMouseDown = false;
        })
            
        
    },

    // Sự kiện chọn công cụ
    handleActiveTools: function() {
        const toolBlock = document.querySelector('#tool-container');
        const toolElement = [...toolBlock.children];
        toolElement.forEach(tool => {
            tool.addEventListener('click', function(e) {
                // Xóa thuộc tính của công cụ trước đó
                toolElement.forEach(tool => {
                    tool.classList.remove('bg-gray-300', 'dark:bg-gray-500');
                    tool.removeAttribute('active');
                });

                // Lấy ra data-tool của công cụ và thêm thuộc tính vào button
                const toolType = tool.dataset.tool;
                switch (toolType) {
                    case 'pencil':
                    case 'eraser':
                    case 'color-picker':
                        tool.classList.add('bg-gray-300', 'dark:bg-gray-500')
                        tool.setAttribute('active', 'true');
                }
            })
        })
    },

    // Xóa canvas
    clearCanvas: function(clearButton, canvas, gridSelect) {
        clearButton.addEventListener('click', function() {
            ui.renderCanvas(canvas, gridSelect)
        })
    }
} 