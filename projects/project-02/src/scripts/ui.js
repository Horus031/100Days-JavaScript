import { events } from "./event.js";

export const ui = {
    handleSizeCanvas: function(canvas) {
        const screenSize = Math.min(window.innerWidth, window.innerHeight) * 0.9; // 90% màn hình
        const newSize = Math.min(512, screenSize); // Giữ tối đa 512x512
        canvas.width = newSize;
        canvas.height = newSize;
    },

    renderCanvas: function(canvas, gridSelect, configHandler) {
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
    }
}