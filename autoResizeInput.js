function autoResize(input) {
    // Draw a temp box for measurement
    const tempInputMeasure = document.createElement('span');
    tempInputMeasure.style.visibility = 'hidden';
    tempInputMeasure.style.position = 'absolute';
    tempInputMeasure.style.fontSize = window.getComputedStyle(input).fontSize;
    tempInputMeasure.style.fontFamily = window.getComputedStyle(input).fontFamily;

    // Padding for measurement
    tempInputMeasure.style.padding = `4px 8px`;
    tempInputMeasure.textContent = input.value || input.placeholder || '';

    document.body.appendChild(tempInputMeasure);

    const textWidth = tempInputMeasure.offsetWidth;
    document.body.removeChild(tempInputMeasure);

    // Add extra padding for icon if input is marked as correct
    const isCorrect = input.classList.contains('correctAns');
    const finalPadding = isCorrect ? 32 : 16; // 32px when correct (for icon), 16px normal
    input.style.width = Math.max(80, textWidth + finalPadding) + 'px';
}

// Apply to all text input
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => autoResize(input));
    input.addEventListener('focus', () => autoResize(input));
    input.addEventListener('blur', () => autoResize(input));

    // Init
    autoResize(input);
});