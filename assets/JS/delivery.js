function showInputField() {
    var select = document.getElementById("options");
    var inputContainer = document.getElementById("inputContainer");
    var userInput = document.getElementById("userInput");
    var dynamicLabel = document.getElementById("dynamicLabel");

    if (select.value) {
        dynamicLabel.textContent = select.options[select.selectedIndex].text; // Set label to selected option
        inputContainer.style.display = "block";
        userInput.setAttribute("required", "true");
    } else {
        inputContainer.style.display = "none";
        userInput.removeAttribute("required");
    }
}