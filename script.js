const CONTACT_EMAIL = ""; // Add Reshma's email address between the quotes before publishing.

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const progress = document.querySelector('.page-progress');
const cursor = document.querySelector('.cursor-dot');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 80);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}, { passive: true });

menuButton.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
}));

document.addEventListener('pointermove', e => {
  cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const dialog = document.querySelector('.lightbox');
const galleryImage = dialog.querySelector('img');
const count = dialog.querySelector('.lightbox-count');
const title = dialog.querySelector('.lightbox-title');
let pages = [], pageIndex = 0;

function showPage() {
  galleryImage.src = `assets/pages/page-${String(pages[pageIndex]).padStart(2, '0')}.webp`;
  count.textContent = `${pageIndex + 1} / ${pages.length}`;
}
function openProject(card) {
  pages = card.dataset.pages.split(',').map(Number); pageIndex = 0;
  title.textContent = card.querySelector('h3').textContent;
  showPage(); dialog.showModal(); document.body.classList.add('lightbox-open');
}
document.querySelectorAll('.project').forEach(card => {
  card.addEventListener('click', () => openProject(card));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card); } });
});
dialog.querySelector('.next').addEventListener('click', () => { pageIndex = (pageIndex + 1) % pages.length; showPage(); });
dialog.querySelector('.prev').addEventListener('click', () => { pageIndex = (pageIndex - 1 + pages.length) % pages.length; showPage(); });
dialog.querySelector('.lightbox-close').addEventListener('click', () => { dialog.close(); document.body.classList.remove('lightbox-open'); });
dialog.addEventListener('click', e => { if (e.target === dialog) { dialog.close(); document.body.classList.remove('lightbox-open'); } });
document.addEventListener('keydown', e => {
  if (!dialog.open) return;
  if (e.key === 'ArrowRight') { pageIndex = (pageIndex + 1) % pages.length; showPage(); }
  if (e.key === 'ArrowLeft') { pageIndex = (pageIndex - 1 + pages.length) % pages.length; showPage(); }
});

const form = document.querySelector('#contact-form');
const status = form.querySelector('.form-status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(form);
  const subject = data.get('subject');
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  if (CONTACT_EMAIL) {
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email application…';
  } else {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      status.textContent = 'Message copied. Add the contact email in script.js to activate direct email sending.';
    } catch {
      status.textContent = 'Add the contact email in script.js to activate this form.';
    }
  }
});
