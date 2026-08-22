const track = document.querySelector('.slides');
const slides = [...track.querySelectorAll('figure')];
const previous = document.querySelector('[data-gallery-previous]');
const next = document.querySelector('[data-gallery-next]');
const count = document.querySelector('.gallery-count');
const dots = document.querySelector('.gallery-dots');
let current = 0;

const dotButtons = slides.map((slide, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Show screenshot ${index + 1}`);
  button.addEventListener('click', () => show(index));
  dots.append(button);
  return button;
});

function updateControls() {
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
  count.textContent = `${current + 1} / ${slides.length}`;
  dotButtons.forEach((dot, index) => dot.setAttribute('aria-current', index === current));
}

function show(index) {
  slides[current].classList.remove('is-active');
  slides[current].hidden = true;
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides[current].classList.add('is-active');
  slides[current].hidden = false;
  updateControls();
}

previous.addEventListener('click', () => show(current - 1));
next.addEventListener('click', () => show(current + 1));
track.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
});
let touchStart = null;
track.addEventListener('touchstart', event => {
  touchStart = event.changedTouches[0].clientX;
}, { passive: true });
track.addEventListener('touchend', event => {
  if (touchStart === null) return;
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 50) show(current + (distance < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });

slides.forEach((slide, index) => {
  slide.hidden = index !== current;
  slide.classList.toggle('is-active', index === current);
});
updateControls();
