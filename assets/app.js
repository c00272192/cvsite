// Year stamps
const yr = new Date().getFullYear();
document.getElementById('year')?.replaceChildren(yr);
document.getElementById('year-foot')?.replaceChildren(yr);

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');
if (toggle && navList) {
  toggle.addEventListener('click', () => {
    const show = !navList.classList.contains('show');
    navList.classList.toggle('show', show);
    toggle.setAttribute('aria-expanded', String(show));
  });
}

// IntersectionObserver reveals
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Carousel controls (buttons + wheel + swipe)
const carousels = document.querySelectorAll('[data-carousel]');
carousels.forEach(car => {
  const track = car.querySelector('[data-track]');
  const prev = car.querySelector('[data-prev]');
  const next = car.querySelector('[data-next]');
  if (!track) return;

  const scrollByOne = (dir = 1) => {
    const w = track.getBoundingClientRect().width;
    track.scrollBy({ left: dir * (w * 0.5 + 8), behavior: 'smooth' });
  };

  prev?.addEventListener('click', () => scrollByOne(-1));
  next?.addEventListener('click', () => scrollByOne(1));

  // Wheel
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    e.preventDefault();
    track.scrollBy({ left: e.deltaX, behavior: 'smooth' });
  }, { passive: false });

  // Drag / swipe
  let isDown = false, startX = 0, startScroll = 0;
  track.addEventListener('pointerdown', (e) => { isDown = true; startX = e.clientX; startScroll = track.scrollLeft; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointermove', (e) => { if (!isDown) return; const dx = e.clientX - startX; track.scrollLeft = startScroll - dx; });
  track.addEventListener('pointerup', () => { isDown = false; });
  track.addEventListener('pointerleave', () => { isDown = false; });
});

// Command palette (⌘K / Ctrl+K)
const palette = document.getElementById('palette');
const palInput = document.getElementById('q');
const cmdBtn = document.querySelector('[data-cmd]');
function openPal(){ palette?.showModal(); palInput?.focus(); }
function closePal(){ palette?.close(); }
window.addEventListener('keydown', (e) => {
  const isMac = navigator.platform.toUpperCase().includes('MAC');
  if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')){
    e.preventDefault(); openPal();
  }
  if (e.key === 'Escape' && palette?.open) closePal();
});
cmdBtn?.addEventListener('click', openPal);

palInput?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const v = e.target.value.trim().toLowerCase();
  const map = {
    projects:'#projects',
    experience:'#experience',
    education:'#education',
    awards:'#awards',
    github:'https://github.com/YOUR_GITHUB',
    linkedin:'https://www.linkedin.com/in/dylan-o-donnell-983117230/'
  };
  if (map[v]) { window.location.href = map[v]; closePal(); }
});
