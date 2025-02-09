import { ui } from "./ui.js";

export const events = {
    isMouseDown: false,
    handleDarkMode: function(button, htmlElement, configHandler) {
        button.addEventListener('click', () => {
            const isDark = htmlElement.classList.toggle('dark');
            console.log(isDark);
            configHandler.saveConfig('isDark', isDark);
        });
        let darkMode = configHandler.getConfig('isDark');
        if (darkMode) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
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

        return { x, y, pixelSize, currentColor, rect};
    },

    // Hàm khởi tạo các giá trị công cụ
    handleToolValues: function() {
        const pencil = document.querySelector('button#pencil');
        const eraser = document.querySelector('button#eraser');
        const eyedropper = document.querySelector('button#eyedropper');
        const croppedCanvas = document.querySelector("#croppedCanvas");
        const croppedCtx = croppedCanvas.getContext('2d', { willReadFrequently: true });
        const cropSize = 100;
        

        return { pencil, eraser, eyedropper, croppedCanvas, cropSize, croppedCtx };
    },

    // handleHoverPixels: function(canvas, gridSelect, ctx, colorPicker, offScreenCanvas, offScreenCtx) {
    //     offScreenCanvas.width = canvas.width;
    //     offScreenCanvas.height = canvas.height;

    //     // Copy the initial canvas content to the off-screen canvas
    //     offScreenCtx.drawImage(canvas, 0, 0);

    //     canvas.addEventListener('mousemove', function(e) {
    //         const { x, y, pixelSize } = events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);

    //         // Xóa canvas & vẽ lại ảnh gốc
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.drawImage(offScreenCanvas, 0, 0);

    //         // Hover hiệu ứng mờ
    //         ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    //         ctx.fillRect(x, y, pixelSize, pixelSize);
    //     })

    //     canvas.addEventListener("mouseleave", () => {
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.drawImage(offScreenCanvas, 0, 0); // Xóa hiệu ứng khi rời chuột khỏi canvas
    //         ui.renderCanvas(canvas, gridSelect);
    //     });
    // },

    // Sự kiện chọn màu từ color picker và vẽ
    handleColorAndDraw: function(canvas, gridSelect, colorPicker, configHandler, ctx, recentColors) {
        let storageColors = configHandler.getConfig('storageColors');
        const { pencil }  = events.handleToolValues();

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
                const { x, y, pixelSize, currentColor} = events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
                ctx.strokeStyle = 'black';
                ctx.fillStyle = `${currentColor}`;
                ctx.fillRect(x, y, pixelSize, pixelSize);
                ctx.strokeRect(x, y, pixelSize, pixelSize);
            }
        })
        
    },

    // Sự kiện xóa
    handleEraser: function(canvas, gridSelect, ctx, colorPicker) {
        canvas.addEventListener('click', function(e) {
            const { eraser } = events.handleToolValues();
            if (eraser.hasAttribute('active')) {
                const { x, y, pixelSize } = events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
                ctx.strokeStyle = 'black';
                ctx.clearRect(x, y, pixelSize, pixelSize);
                ctx.strokeRect(x, y, pixelSize, pixelSize);
            }
        })
    },

    // Sự kiện pick màu từ canvas
    handleEyedropper: function(canvas, gridSelect, ctx, colorPicker) {
        const { eyedropper, croppedCanvas, cropSize, croppedCtx } = events.handleToolValues();
        canvas.addEventListener('mousemove', function(e) {
            if (eyedropper.hasAttribute('active')) {
                croppedCanvas.classList.remove('hidden');
                const { rect } = events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
    
                const cursorX = e.clientX - rect.left;
                const cursorY = e.clientY - rect.top;
    
                // Lấy ảnh xung quanh con trỏ
                const startX = Math.max(0, cursorX - cropSize / 2);
                const startY = Math.max(0, cursorY - cropSize / 2);
    
                const croppedImage = ctx.getImageData(startX, startY, cropSize, cropSize);
    
                // Hiển thị ảnh đã cắt
                croppedCanvas.width = cropSize;
                croppedCanvas.height = cropSize;
                croppedCtx.putImageData(croppedImage, 0, 0);
            }
        });
    
        canvas.addEventListener('click', function(e) {
            if (eyedropper.hasAttribute('active')) {
                const { x, y } = events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
                const pixelData = ctx.getImageData(x, y, 1, 1).data; // Get data for a single pixel
                console.log(pixelData);
                const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
                console.log(`Color at (${x}, ${y}): ${color}`);
                colorPicker.value = events.rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
            }
        });
    
        canvas.addEventListener('mouseout', function() {
            croppedCanvas.classList.add('hidden');
        });
    },

    rgbToHex: function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
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
        const { pencil, eraser } = events.handleToolValues();
        canvas.addEventListener('mousedown', function(e) {
            events.isMouseDown = true;
        })

        canvas.addEventListener('mousemove', function(e) {
            if (events.isMouseDown) {
                if (pencil.hasAttribute('active')) {
                    const { x, y, pixelSize, currentColor} = events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 0.5;
                    ctx.fillStyle = `${currentColor}`;
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                    ctx.strokeRect(x, y, pixelSize, pixelSize);

                } else if (eraser.hasAttribute('active')) {
                    const { x, y, pixelSize } = events.handleDrawValues(e, gridSelect, canvas, ctx, colorPicker);
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 0.5;
                    ctx.clearRect(x, y, pixelSize, pixelSize);
                    ctx.strokeRect(x, y, pixelSize, pixelSize);
                }
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
                    case 'eyedropper':
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
    },
} 