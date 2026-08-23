document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('spiralCanvas');
    const ctx = canvas.getContext('2d');
    const charImg = document.getElementById('mainCharImg');
    const charWrapper = document.getElementById('charWrapper');

    const fallbackSVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
            <g fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
                <ellipse cx="150" cy="330" rx="90" ry="15" fill="rgba(0,0,0,0.35)" stroke="none"/>
                <path d="M90 280 C90 310, 130 320, 150 320 C170 320, 210 310, 210 280" fill="#e2dabf" stroke="#1c1a17" stroke-width="5"/>
                <path d="M100 295 Q130 305 145 285" fill="#e2dabf" stroke="#1c1a17" stroke-width="4"/>
                <path d="M200 295 Q170 305 155 285" fill="#e2dabf" stroke="#1c1a17" stroke-width="4"/>
                <path d="M100 130 Q70 170 80 250 Q150 270 220 250 Q230 170 200 130 Z" fill="#29211c" stroke="#12100e" stroke-width="6"/>
                <path d="M80 150 Q130 220 150 220 Q170 220 220 150 Q180 240 120 240 Z" fill="#201a16" stroke="#12100e" stroke-width="5"/>
                <path d="M120 110 L120 150 Q150 160 180 150 L180 110 Z" fill="#1b1613" stroke="#12100e" stroke-width="5"/>
                <path d="M110 110 C80 90, 80 40, 120 25 C140 10, 160 10, 180 25 C220 40, 220 90, 190 110 Z" fill="#111111" stroke="#000" stroke-width="6"/>
                <path d="M90 80 L115 70 L105 100 L130 85 L140 115 L150 75 L160 115 L170 85 L195 100 L185 70 L210 80 L185 50" fill="#111111" stroke="#000" stroke-width="4"/>
                <ellipse cx="130" cy="75" rx="12" ry="14" fill="#3a3028" stroke="#000" stroke-width="3"/>
                <circle cx="130" cy="75" r="4" fill="#000"/>
                <ellipse cx="170" cy="75" rx="12" ry="14" fill="#3a3028" stroke="#000" stroke-width="3"/>
                <circle cx="170" cy="75" r="4" fill="#000"/>
                <path d="M115 90 Q130 98 145 90" stroke="#1a1410" stroke-width="3" fill="none"/>
                <path d="M155 90 Q170 98 185 90" stroke="#1a1410" stroke-width="3" fill="none"/>
            </g>
        </svg>
    `)}`;

    charImg.onerror = () => {
        charImg.src = fallbackSVG;
    };

    const c1 = [245, 245, 247];
    const c2 = [120, 120, 128];

    let rotationAngle = 0;
    const bandWidth = 45;

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawSpiral() {
        const scale = 2;
        const width = Math.ceil(canvas.width / scale);
        const height = Math.ceil(canvas.height / scale);

        if (offCanvas.width !== width || offCanvas.height !== height) {
            offCanvas.width = width;
            offCanvas.height = height;
        }

        const imgData = offCtx.createImageData(width, height);
        const data = imgData.data;
        const cx = width / 2;
        const cy = height / 2;

        const scaledBandWidth = bandWidth / scale;

        let idx = 0;
        const TWO_PI = Math.PI * 2;

        for (let y = 0; y < height; y++) {
            const dy = y - cy;
            const dy2 = dy * dy;

            for (let x = 0; x < width; x++) {
                const dx = x - cx;
                const r = Math.sqrt(dx * dx + dy2);
                
                let angle = Math.atan2(dy, dx) + rotationAngle;
                
                let val = ((r / scaledBandWidth) - (angle / TWO_PI)) % 1.0;
                if (val < 0) val += 1.0;

                const isColor1 = val < 0.5;
                const color = isColor1 ? c1 : c2;

                data[idx]     = color[0];
                data[idx + 1] = color[1];
                data[idx + 2] = color[2];
                data[idx + 3] = 255;

                idx += 4;
            }
        }

        offCtx.putImageData(imgData, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);

        rotationAngle += 0.012;

        requestAnimationFrame(drawSpiral);
    }

    requestAnimationFrame(drawSpiral);

    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) / centerX * 10;
        const moveY = (e.clientY - centerY) / centerY * 10;

        charWrapper.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.12}deg)`;
    });
});