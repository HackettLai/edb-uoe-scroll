/**
 * Init run after page loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Find the main content container that needs scrolling
    const scrollContainer = document.querySelector('.scroll-container');

    // Find the outer container that needs resizing
    const demoContainer = document.querySelector('.demo-container');

    // Init custom scrollbar if container exists
    if (scrollContainer) {
        new CustomScrollbar(scrollContainer);
    }

    // Init resize functionality if container exists
    if (demoContainer) {
        new ResizeHandler(demoContainer);
    }

});
