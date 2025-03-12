// Signature pad functionality
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('signature-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    // Set canvas dimensions based on its display size
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Drawing functionality
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        // Get correct coordinates for both mouse and touch
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Clear signature button
    document.getElementById('clear-signature').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // Form submission
    document.getElementById('medical-release-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if signature exists
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const isEmpty = !imageData.some(channel => channel !== 0);
        
        if (isEmpty) {
            alert('Please sign the form before submitting.');
            return;
        }
        
        // Here you would normally send the form data to your server
        // For this demo, just show a success message
        alert('Form submitted successfully!');
    });
});