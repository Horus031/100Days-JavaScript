import { ui } from "./ui.js";

export const events = {
    handleDarkMode: function(button, htmlElement, configHandler) {
        button.addEventListener('click', () => {
            const isDark = htmlElement.classList.toggle('dark');
            configHandler.saveConfig('isDark', isDark);
        });
        let darkMode = configHandler.getConfig('isDark');
        if (darkMode.isDark) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    },

    handleGridSelect: function(canvas, gridSelect, configHandler) {
        gridSelect.addEventListener('change', () => {
            ui.renderCanvas(canvas, gridSelect, configHandler)
        })
    },

    handleDrawing: function(canvas, gridSelect, colorPicker) {
        const ctx = canvas.getContext('2d');
        let currentColor;

        colorPicker.addEventListener('input', function() {
            return currentColor = colorPicker.value
        })
        
        canvas.addEventListener('click', function(e) {
            const gridSize = parseInt(gridSelect.value);
            const pixelSize = canvas.width / gridSize;

            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
            const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;

            

            ctx.fillStyle = `${currentColor}`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
        })
    }
} 