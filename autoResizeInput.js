function autoResize(input) {
    // Draw a temp box for measurement
    const tempInputMeasure = document.createElement('span');
    tempInputMeasure.style.visibility = 'hidden';
    tempInputMeasure.style.position = 'absolute';
    tempInputMeasure.style.fontSize = window.getComputedStyle(input).fontSize;
    tempInputMeasure.style.fontFamily = window.getComputedStyle(input).fontFamily;
    tempInputMeasure.style.padding = `4px 8px`;
    tempInputMeasure.textContent = input.value || input.placeholder || '';

    document.body.appendChild(tempInputMeasure);
    const textWidth = tempInputMeasure.offsetWidth;
    document.body.removeChild(tempInputMeasure);

    const isCorrect = input.classList.contains('correctAns');
    const finalPadding = isCorrect ? 32 : 16;
    input.style.width = Math.max(80, textWidth + finalPadding) + 'px';
}

// Initialize by wait for fonts to load
async function initAutoResize() {
    if ('fonts' in document) {
        await document.fonts.ready;
    }

    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', () => autoResize(input));
        input.addEventListener('focus', () => autoResize(input));
        input.addEventListener('blur', () => autoResize(input));

        // Init run after all font are loaded
        autoResize(input);
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoResize);
} else {
    initAutoResize();
}