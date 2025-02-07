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

        events.handleEraser(canvas);

        events.handleHoldDrawing(canvas, gridSelect, ctx, colorPicker);

        events.handleRecentColors(recentColors, colorPicker);

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
