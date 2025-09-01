function autoResize(input) {
    const tempInputMeasure = document.createElement('span'); /* Draw a temp box for measurement */
    tempInputMeasure.style.visibility = 'hidden';
    tempInputMeasure.style.position = 'absolute';
    tempInputMeasure.style.fontSize = window.getComputedStyle(input).fontSize;
    tempInputMeasure.style.fontFamily = window.getComputedStyle(input).fontFamily;
    tempInputMeasure.style.padding = '4px 8px'; // Match input padding
    tempInputMeasure.textContent = input.value || input.placeholder || '';

    document.body.appendChild(tempInputMeasure);

    const textWidth = tempInputMeasure.offsetWidth;
    document.body.removeChild(tempInputMeasure);
    input.style.width = Math.max(80, textWidth + 16) + 'px'; // min-width: 80px; 8 padding on both sides
}

// Apply to all text input
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => autoResize(input));
    input.addEventListener('focus', () => autoResize(input));
    input.addEventListener('blur', () => autoResize(input));

    // Init
    autoResize(input);
});