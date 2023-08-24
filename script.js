const container = document.querySelector('.scroll-container');
const scrollAmount = 215; // Scroll by 210px
const scrollSpeed = 1500; // 1000ms (1 second) per scroll

let isDragging = false;
let scrollInterval;

function scrollGallery() {
  if (!isDragging) {
    const currentScrollLeft = container.scrollLeft;
    const newScrollLeft = currentScrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Reset scroll to the beginning when it reaches the end
    if (newScrollLeft >= container.scrollWidth - container.clientWidth) {
      setTimeout(() => {
        container.scrollTo({ left: 0, behavior: 'auto' });
      }, 1500); // Wait 1 second before resetting to create a pause
    }
  }
}

scrollInterval = setInterval(scrollGallery, scrollSpeed);

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  const startX = e.pageX - container.offsetLeft;
  const scrollLeft = container.scrollLeft;

  clearInterval(scrollInterval);
  container.style.cursor = 'grabbing';

  container.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX);
      container.scrollLeft = scrollLeft - walk;
    }
  });

  container.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';

    // Delay resuming auto-scrolling after dragging
    setTimeout(() => {
      if (!isHoveringOverImage()) {
        scrollInterval = setInterval(scrollGallery, scrollSpeed);
      }
    }, 1000); // Wait 1 second before resuming auto-scrolling
  });
});

container.addEventListener('mouseleave', () => {
  isDragging = false;
  container.style.cursor = 'grab';

  // Delay resuming auto-scrolling after dragging
  setTimeout(() => {
    if (!isHoveringOverImage()) {
      scrollInterval = setInterval(scrollGallery, scrollSpeed);
    }
  }, 1000); // Wait 1 second before resuming auto-scrolling
});

const images = document.querySelectorAll('.t200x400div > a > img');

function isHoveringOverImage() {
  return Array.from(images).some((img) => {
    const rect = img.getBoundingClientRect();
    return (
      rect.left <= event.clientX &&
      event.clientX <= rect.right &&
      rect.top <= event.clientY &&
      event.clientY <= rect.bottom
    );
  });
}

images.forEach((img) => {
  img.addEventListener('mouseenter', () => {
    clearInterval(scrollInterval);
  });

  img.addEventListener('mouseleave', () => {
    if (!isDragging && !isHoveringOverImage()) {
      scrollInterval = setInterval(scrollGallery, scrollSpeed);
    }
  });
});
