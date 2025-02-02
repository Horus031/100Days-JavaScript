export const ui = {
    handleSizeCanvas: function(canvas) {
        const screenSize = Math.min(window.innerWidth, window.innerHeight) * 0.9; // 90% màn hình
        const newSize = Math.min(512, screenSize); // Giữ tối đa 512x512
        canvas.width = newSize;
        canvas.height = newSize;
    },

    renderCanvas: function(canvas, gridSelect) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        const imageData = ctx.createImageData(canvas.width, canvas.height)
        const gridSize = parseInt(gridSelect.value);
        const pixelSize = canvas.width / gridSize;

        // Màu viền (đen)
        const borderColor = [0, 0, 0, 255]; // RGBA cho màu đen
        // Màu bên trong (đỏ)
        const fillColor = [255, 0, 0, 255]; // RGBA cho màu đỏ

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;

                // Kiểm tra xem pixel có nằm trên viền hay không
                if (x === 0 || x === canvas.width - 1 || y === 0 || y === canvas.height - 1) {
                    // Đặt màu viền (màu đen)
                    imageData.data[index] = borderColor[0];     // Red
                    imageData.data[index + 1] = borderColor[1]; // Green
                    imageData.data[index + 2] = borderColor[2]; // Blue
                    imageData.data[index + 3] = borderColor[3]; // Alpha
                    } else {
                    // Đặt màu bên trong (màu đỏ)
                    imageData.data[index] = fillColor[0];      // Red
                    imageData.data[index + 1] = fillColor[1];  // Green
                    imageData.data[index + 2] = fillColor[2];  // Blue
                    imageData.data[index + 3] = fillColor[3];  // Alpha
                }
            }
        }

        // Vẽ ImageData lên canvas tại vị trí (50, 50)
        ctx.putImageData(imageData, 0, 0);    
        
        
    }
}