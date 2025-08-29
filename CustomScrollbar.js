/**
 * Features:
 * - Custom scrollbar with top cap, middle section, and bottom cap
 * - Draggable thumb for scrolling
 * - Auto-hiding when content fits container
 * - Smooth scroll on track click
 * - FOR DEMO: Draggable container to resizing
 */

class CustomScrollbar {
  /* Creates a new CustomScrollbar instance */
  constructor(container) {
    this.container = container;
    this.wrapper = container.parentElement;
    this.isDragging = false; // Track if thumb is being dragged
    this.dragStartY = 0;
    this.dragStartScrollTop = 0;
    this.createThumb();
    this.bindEvents();
    this.updateThumb();
  }

  /* Creates the three-part scrollbar */
  createThumb() {
    // Create main thumb container (Thumb container)
    this.thumb = document.createElement('div');
    this.thumb.className = 'custom-scrollbar-thumb';

    // Create top cap element (fixed height)
    this.thumbTop = document.createElement('div');
    this.thumbTop.className = 'thumb-top';

    // Create middle section that will expand/contract
    this.thumbMiddle = document.createElement('div');
    this.thumbMiddle.className = 'thumb-middle';

    // Create bottom cap element (fixed height)
    this.thumbBottom = document.createElement('div');
    this.thumbBottom.className = 'thumb-bottom';

    // Append above structure
    this.thumb.appendChild(this.thumbTop);
    this.thumb.appendChild(this.thumbMiddle);
    this.thumb.appendChild(this.thumbBottom);
    this.wrapper.appendChild(this.thumb);
  }

  /* Bind all event listeners forscrollbar in 1 */
  bindEvents() {
    // Update thumb position when content is scrolled
    this.container.addEventListener('scroll', () => this.updateThumb());

    // Watch size changing of container and wrapper
    this.resizeObserver = new ResizeObserver(() => this.updateThumb());
    this.resizeObserver.observe(this.container);
    this.resizeObserver.observe(this.wrapper);

    // Create thumb dragging function for mouse events
    this.thumb.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());

    // Create thumb dragging function for touch events
    this.thumb.addEventListener('touchstart', (e) => this.startDrag(e));
    document.addEventListener('touchmove', (e) => this.drag(e));
    document.addEventListener('touchend', () => this.endDrag());

    // When user clicks on the track
    this.wrapper.addEventListener('click', (e) => this.handleTrackClick(e));
  }

  /* Update thumb size and position */
  updateThumb() {
    // Get size of container and content
    const containerHeight = this.container.clientHeight; // Container height
    const contentHeight = this.container.scrollHeight; // Content full height
    const scrollTop = this.container.scrollTop; // Current scroll position
    console.log('containerHeight: ' + containerHeight);
    console.log('contentHeight: ' + contentHeight);
    console.log('scrollTop: ' + scrollTop);

    // Cal thumb height proportional to content
    const thumbHeight = Math.max(49, (containerHeight / contentHeight) * containerHeight); /* Min height of 49px to ensure the middle part will not be shrink (https://www.figma.com/design/cGsCDRfv9BOj6jsh4NppSs/EDB-Creative-Use-of-English?node-id=282-1782&t=gBH2IJoffigBrzW4-4) */

    // Cal max scroll and thumb position
    const maxScrollTop = contentHeight - containerHeight; // How far content can scroll
    const maxThumbTop = containerHeight - thumbHeight; // How far thumb can move
    console.log('maxScrollTop: ' + maxScrollTop);
    console.log('maxThumbTop: ' + maxThumbTop);

    // Cal thumb position based on scroll position
    const thumbTop = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0;
    console.log('thumbTop: ' + thumbTop);

    // Update thumb position and size
    this.thumb.style.top = `${thumbTop}px`;
    this.thumb.style.height = `${thumbHeight}px`;

    // Cal and update middle section height
    // 13px height for both top and cap
    const middleHeight = Math.max(0, thumbHeight - 26); /* 13px * 2 */
    this.thumbMiddle.style.height = `${middleHeight}px`;

    // Show/hide thumb based on content size
    const noScroll = contentHeight <= containerHeight;
    this.thumb.style.display = noScroll ? 'none' : 'block';
    if (noScroll) {
      this.wrapper.classList.add('no-scroll');
    } else {
      this.wrapper.classList.remove('no-scroll');
    }
  }

  /* Init thumb dragging */
  startDrag(e) {
    console.log('Start Drag');

    e.preventDefault(); // Prevent text selection when dragging

    // Enable flag
    this.isDragging = true;

    // Store current position (works for both mouse and touch)
    this.dragStartY = e.touches ? e.touches[0].clientY : e.clientY;

    // Store current scroll position
    this.dragStartScrollTop = this.container.scrollTop;
  }

  /* Handles the thumb dragging */
  drag(e) {
    // Bye Bye if not in dragging mode
    if (!this.isDragging) return;

    console.log('Dragging');

    e.preventDefault(); // Prevent text selection while dragging

    // Get current position (works for both mouse and touch)
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;

    // Cal how far the pointer has moved
    const thumbY = currentY - this.dragStartY;

    // Get size of container and content
    const containerHeight = this.container.clientHeight; // Container height
    const contentHeight = this.container.scrollHeight; // Content full height
    const thumbHeight = parseFloat(this.thumb.style.height); // Current thumb height

    // Cal maximum distances
    const maxThumbTop = containerHeight - thumbHeight; // How far thumb can move
    const maxScrollTop = contentHeight - containerHeight; // How far content can scroll

    // check if there has room to scroll
    if (maxThumbTop > 0 && maxScrollTop > 0) {
      // Cal the ratio between content scroll and thumb movement
      const scrollRatio = maxScrollTop / maxThumbTop;

      // Cal new scroll position based on drag distance
      const newScrollTop = this.dragStartScrollTop + thumbY * scrollRatio;

      // Apply scroll position, keep it within container (0 to maxScrollTop)
      this.container.scrollTop = Math.max(0, Math.min(maxScrollTop, newScrollTop));
    }
  }

  endDrag() {
    console.log('End Drag');

    // Reset flag
    this.isDragging = false;
    document.body.style.userSelect = '';
  }

  /* Handle click on the scrollbar track */
  handleTrackClick(e) {
    // Only handle clicks on the track but not on thumb. Click on thumb should trigger startDrag
    if (e.target !== this.wrapper) return;

    console.log('Track Click');

    // Get click coordinates relative to track
    const rect = this.wrapper.getBoundingClientRect();
    const clickY = e.clientY - rect.top; // Distance from top of track

    // Get current dimensions
    const containerHeight = this.container.clientHeight; // Container height
    const contentHeight = this.container.scrollHeight; // Content full height
    const maxScrollTop = contentHeight - containerHeight; // How far content can scroll

    // Convert click position to scroll position
    const targetScrollTop = (clickY / containerHeight) * maxScrollTop;

    // Scroll to target position
    this.container.scrollTo({
      top: Math.max(0, Math.min(maxScrollTop, targetScrollTop)),
      behavior: 'smooth', // Smooth scroll
    });
  }

  /* Cleans up resources used by the scrollbar ( Suggested by AI, I dun know what is doing here) */
  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.thumb && this.thumb.parentNode) {
      this.thumb.parentNode.removeChild(this.thumb);
    }
  }
}
