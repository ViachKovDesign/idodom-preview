'use strict';
(() => {
  if (!document.body.classList.contains('architecture')) return;
  // Restored niche scene: native horizontal overflow on mobile, no pinned gallery.
  const nightRooms = [...document.querySelectorAll('.hero,[data-arch-night-room]')];
  let observer;
  function observeRooms() {
    observer?.disconnect();
    const header = parseFloat(getComputedStyle(document.body).getPropertyValue('--header')) || 68;
    const update = () => {
      const night = nightRooms.some(room => {
        const box = room.getBoundingClientRect();
        return box.top <= header + 1 && box.bottom > header + 1;
      });
      document.body.dataset.architectureRoom = night ? 'night' : 'day';
    };
    observer = new IntersectionObserver(update, {
      rootMargin: '-' + header + 'px 0px -' + Math.max(0, innerHeight - header - 2) + 'px 0px', threshold: 0
    });
    nightRooms.forEach(room => observer.observe(room));
    update();
  }
  addEventListener('resize', observeRooms);
  observeRooms();
})();
