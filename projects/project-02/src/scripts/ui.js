import { events } from "./event.js";

export const ui = {
    handleSizeCanvas: function(canvas) {
        const screenSize = Math.min(window.innerWidth, window.innerHeight) * 0.9; // 90% màn hình
        const newSize = Math.min(1024, screenSize); // Giữ tối đa 512x512
        canvas.width = newSize;
        canvas.height = newSize;
    },

    renderCanvas: function(canvas, gridSelect) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        const gridSize = parseInt(gridSelect.value);
        const pixelSize = canvas.width / gridSize;

        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        for (let y = 0; y < gridSize; y++) {
            for(let x = 0; x < gridSize; x++) {
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    },

    renderRecentColor: function(recentColors, configHandler) {
        let storageColors = configHandler.getConfig(`storageColors`);


        if (!Array.isArray(storageColors)) {
            storageColors = [];
        }


        recentColors.innerHTML = '';
        storageColors.forEach(color => {
            const colorElement = document.createElement('button');
            colorElement.className = 'w-8 h-8 rounded border border-black dark:border-white';
            colorElement.style.backgroundColor = color;
            colorElement.setAttribute('data-color', color); // Set thuộc tính mã màu ở format hex cho browser
            recentColors.appendChild(colorElement);
        });
    },
}