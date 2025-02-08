import { storage } from "./storage.js";
import { ui } from "./ui.js";
import { events } from "./event.js";

const darkModeBtn = document.querySelector('#dark-mode');
const htmlElement = document.documentElement;
const canvas = document.querySelector('#pixel-grid');
const ctx = canvas.getContext('2d');
const gridSelect = document.querySelector('#grid-size');
const colorPicker = document.querySelector('#color-picker');
const recentColors = document.querySelector('#recent-colors');
const clearButton = document.querySelector('#clear-btn');




const app = {
    handleUI: function() {
        // Đảm bảo canvas ở các màn hình
        ui.handleSizeCanvas(canvas);

        // Render bản vẽ dựa trên grid size
        ui.renderCanvas(canvas, gridSelect);

        ui.renderRecentColor(recentColors, storage);
    },

    handleEvents: function() {
        // Handle trạng thái dark mode
        events.handleDarkMode(darkModeBtn, htmlElement, storage);

        // Sự kiện chọn khung pixel
        events.handleGridSelect(canvas, gridSelect, storage);

        // Sự kiện chọn màu và vẽ
        events.handleColorAndDraw(canvas, gridSelect, colorPicker, storage, ctx, recentColors);

        // Sự kiện bôi/xóa canvas
        events.handleEraser(canvas, gridSelect, ctx, colorPicker);

        // Sự kiện lấy màu từ canvas
        events.handleEyedropper(canvas, gridSelect, ctx, colorPicker);

        // Sự kiện đè chuột tô nhiều pixel
        events.handleHoldDrawing(canvas, gridSelect, ctx, colorPicker);

        // Sự kiện lưu các màu đã chọn gần đây
        events.handleRecentColors(recentColors, colorPicker);

        // Sự kiện thuộc tính cho tool đang sử dụng
        events.handleActiveTools();
        
        events.clearCanvas(clearButton, canvas, gridSelect)
    },

    handleResize: function() {
        ui.handleSizeCanvas(canvas);
        ui.renderCanvas(canvas, gridSelect);
    },


    init: function() {
        this.handleUI();
        
        this.handleEvents();

        // Add resize event listener
        window.addEventListener('resize', this.handleResize.bind(this));
    },

}

app.init();
