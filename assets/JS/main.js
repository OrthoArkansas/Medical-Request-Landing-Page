// Add this to your main.js file
class SignaturePad {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.points = [];

        // Set canvas size with higher resolution for retina displays
        this.resizeCanvas();

        // Bind events
        this.bindEvents();

        // Drawing style
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    resizeCanvas() {
        const rect = this.canvas.parentNode.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
    }

    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleStart.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleEnd.bind(this));
        this.canvas.addEventListener('mouseout', this.handleEnd.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.handleStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleEnd.bind(this));

        // Window resize event
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    handleStart(event) {
        event.preventDefault();
        const pos = this.getPointerPosition(event);
        this.isDrawing = true;
        this.points = [pos];
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }

    handleMove(event) {
        event.preventDefault();
        if (!this.isDrawing) return;

        const pos = this.getPointerPosition(event);
        this.points.push(pos);

        if (this.points.length > 3) {
            const lastTwoPoints = this.points.slice(-2);
            const controlPoint = lastTwoPoints[0];
            const endPoint = {
                x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
            };

            this.ctx.quadraticCurveTo(
                controlPoint.x,
                controlPoint.y,
                endPoint.x,
                endPoint.y
            );
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(endPoint.x, endPoint.y);
        }
    }

    handleEnd(event) {
        event.preventDefault();
        this.isDrawing = false;
        this.points = [];
    }

    getPointerPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        return {
            x: (point.clientX - rect.left),
            y: (point.clientY - rect.top)
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    isEmpty() {
        const pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        return !pixels.some(pixel => pixel !== 0);
    }

    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}

// Initialize signature pad when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('signature-pad');
    const signaturePad = new SignaturePad(canvas);
    const clearButton = document.getElementById('clear');
    const form = document.getElementById('medicalReleaseForm');

    // Clear button handler
    clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        signaturePad.clear();
    });

    // Form submission handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Check if signature is empty
        if (signaturePad.isEmpty()) {
            alert('Please provide a signature');
            return;
        }

        // Get the signature data URL
        const signatureData = signaturePad.toDataURL();

        // Here you can add the signature data to your form submission
        // For example, you could add it to a hidden input:
        let signatureInput = document.getElementById('signature-data');
        if (!signatureInput) {
            signatureInput = document.createElement('input');
            signatureInput.type = 'hidden';
            signatureInput.id = 'signature-data';
            signatureInput.name = 'signature';
            form.appendChild(signatureInput);
        }
        signatureInput.value = signatureData;

        // Proceed with form submission
        alert('Form submitted successfully!');
        // You can add your form submission logic here
    });
});