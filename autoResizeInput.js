function autoResize(input) {
    const tempInputMeasure = document.createElement('span');
    tempInputMeasure.style.visibility = 'hidden';
    tempInputMeasure.style.position = 'absolute';
    tempInputMeasure.style.fontSize = window.getComputedStyle(input).fontSize;
    tempInputMeasure.style.fontFamily = window.getComputedStyle(input).fontFamily;

    // Set padding to match input for accurate measurement
    tempInputMeasure.style.padding = `4px 8px`;
    tempInputMeasure.textContent = input.value || input.placeholder || '';

    document.body.appendChild(tempInputMeasure);
    const textWidth = tempInputMeasure.offsetWidth;
    document.body.removeChild(tempInputMeasure);

    // Determine final padding based on correctAns state
    const isCorrect = input.classList.contains('correctAns');
    const finalPadding = isCorrect ? 32 : 16;
    input.style.width = Math.max(80, textWidth + finalPadding) + 'px';
}

// Font loading detection (for mobile device)
async function waitForFontsAndLayout() {
    // Wait for fonts
    if ('fonts' in document) {
        try {
            await document.fonts.ready;
        } catch (e) {
            console.warn('Font ready detection failed');
        }
    }

    // Additional wait for layout stability
    await new Promise(resolve => setTimeout(resolve, 100));

    // Double-check with requestAnimationFrame
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
}

// Initialize with multiple safety checks
async function initAutoResize() {
    await waitForFontsAndLayout();

    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach(input => {
        input.addEventListener('input', () => autoResize(input));
        input.addEventListener('focus', () => autoResize(input));
        input.addEventListener('blur', () => autoResize(input));
    });

    // Initial resize with multiple attempts
    inputs.forEach(input => {
        autoResize(input);

        // Retry after short delays to handle any remaining font loading
        setTimeout(() => autoResize(input), 50);
        setTimeout(() => autoResize(input), 200);
        setTimeout(() => autoResize(input), 500);
    });

    // Final safety check after page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            inputs.forEach(input => autoResize(input));
        }, 100);
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoResize);
} else {
    initAutoResize();
}