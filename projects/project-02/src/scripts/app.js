import { storage } from "./storage.js";
import { ui } from "./ui.js";
import { events } from "./event.js";

const darkModeBtn = document.querySelector('#dark-mode');
const htmlElement = document.documentElement;
const canvas = document.querySelector('#pixel-grid');
const gridSelect = document.querySelector('#grid-size');
const colorPicker = document.querySelector('#color-picker');


const app = {
    handleUI: function() {
        // Đảm bảo canvas ở các màn hình
        ui.handleSizeCanvas(canvas);

        // render bản vẽ dựa trên grid size
        ui.renderCanvas(canvas, gridSelect, storage);
    },

    handleEvents: function() {
        // Handle trạng thái dark mode
        events.handleDarkMode(darkModeBtn, htmlElement, storage);

        events.handleGridSelect(canvas, gridSelect, storage);

        events.handleDrawing(canvas, gridSelect, colorPicker);
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
