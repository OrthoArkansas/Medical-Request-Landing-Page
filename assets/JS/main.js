document.getElementById("medicalForm").addEventListener("submit", function(event) {
    event.preventDefault();
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    alert("Your request has been submitted successfully!");
    this.reset();
});