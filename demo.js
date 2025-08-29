/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * FOR DEMO ONLY: resize handler =================================================== */
class ResizeHandler {
  constructor(container) {
    this.container = container;
    this.resizeHandle = container.querySelector('.resize-handle');
    this.isResizing = false;
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;
    this.minWidth = 200;
    this.minHeight = 200;

    this.demoContainerMouseListener();
  }

  /* Binds mouse and touch events for resize functionality */
  demoContainerMouseListener() {
    if (this.resizeHandle) {
      // Mouse events
      this.resizeHandle.addEventListener('mousedown', (e) => this.startResize(e));
      document.addEventListener('mousemove', (e) => this.doResize(e));
      document.addEventListener('mouseup', () => this.stopResize());
      
      // Touch events
      this.resizeHandle.addEventListener('touchstart', (e) => this.startResize(e));
      document.addEventListener('touchmove', (e) => this.doResize(e));
      document.addEventListener('touchend', () => this.stopResize());
    }
  }

  /* Init resize operation */
  startResize(e) {
    e.preventDefault(); // Prevent default browser behavior

    // Enable resize mode
    this.isResizing = true;

    // Store initial coordinates (works for both mouse and touch)
    if (e.touches) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    } else {
      this.startX = e.clientX;
      this.startY = e.clientY;
    }

    // Get current container dimensions
    const computedStyle = window.getComputedStyle(this.container);
    this.startWidth = parseInt(computedStyle.width, 10);
    this.startHeight = parseInt(computedStyle.height, 10);

    // Add classes to disable text selection and pointer events
    document.body.classList.add('resizing');
    this.container.classList.add('resizing');
  }

  /* Handles the live resize operation */
  doResize(e) {
    // Exit if not in resizing mode
    if (!this.isResizing) return;

    e.preventDefault();

    // Get current position (works for both mouse and touch)
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;

    // Cal how far the pointer has moved from the start position
    const deltaX = currentX - this.startX; // Horizontal movement
    const deltaY = currentY - this.startY; // Vertical movement

    // Cal new dimensions while respecting minimum sizes
    const newWidth = Math.max(this.minWidth, this.startWidth + deltaX);
    const newHeight = Math.max(this.minHeight, this.startHeight + deltaY);

    // Apply the new dimensions to the container
    this.container.style.width = `${newWidth}px`;
    this.container.style.height = `${newHeight}px`;
  }

  stopResize() {
    // Exit if not currently resizing
    if (!this.isResizing) return;

    // Disable resize mode
    this.isResizing = false;

    // Remove classes that were disabling text selection and pointer events
    document.body.classList.remove('resizing');
    this.container.classList.remove('resizing');
  }

  destroy() {}
}
