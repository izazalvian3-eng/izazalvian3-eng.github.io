/* =====================================================
   DESA SUKAMAJU — script.js
   Semua interaktivitas website desa
   ===================================================== */

// ===================================================
// 1. PRELOADER
// ===================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 700);
  }, 2200);
});

// ===================================================
// 2. NAVBAR — Scroll Effect & Toggle
// ===================================================
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
  handleBackTop();
});

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===================================================
// 3. ACTIVE NAV — Highlight based on scroll position
// ===================================================
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinkItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ===================================================
// 4. SMOOTH SCROLL for anchor links
// ===================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ===================================================
// 5. COUNTER ANIMATION
// ===================================================
function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString('id-ID');
  }, 16);
}

// ===================================================
// 6. INTERSECTION OBSERVER — Reveal + Counters + Bars
// ===================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-target]').forEach(el => animateCounter(el));
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
const statOverview = document.querySelector('.stat-overview');
if (heroStats) counterObserver.observe(heroStats);
if (statOverview) counterObserver.observe(statOverview);

// Bar chart observer
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
      setTimeout(() => bar.classList.add('animated'), i * 120);
    });
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.bar-chart').forEach(el => barObserver.observe(el));

// Add reveal class to major section elements
document.querySelectorAll('.section-header, .profil-grid, .chart-card, .umkm-card, .galeri-item, .stat-card-big, .org-card, .kontak-info, .kontak-form-wrap').forEach((el, i) => {
  if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObserver.observe(el);
  }
});

// ===================================================
// 7. PROFIL TABS
// ===================================================
const profilTabs    = document.querySelectorAll('.profil-tab');
const profilContents = document.querySelectorAll('.profil-tab-content');

profilTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    profilTabs.forEach(t => t.classList.remove('active'));
    profilContents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${target}`)?.classList.add('active');
  });
});

// ===================================================
// 8. UMKM FILTER
// ===================================================
const filterBtns = document.querySelectorAll('[data-filter]');
const umkmCards  = document.querySelectorAll('.umkm-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    umkmCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeIn .4s ease';
      }
    });
  });
});

// ===================================================
// 9. GALERI FILTER
// ===================================================
const gFilterBtns = document.querySelectorAll('[data-gfilter]');
const galeriItems = document.querySelectorAll('.galeri-item');

gFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.gfilter;
    gFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    galeriItems.forEach(item => {
      const show = filter === 'all' || item.dataset.gcat === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ===================================================
// 10. GALERI LIGHTBOX
// ===================================================
const lightbox       = document.getElementById('lightbox');
const lightboxClose  = document.getElementById('lightboxClose');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

galeriItems.forEach(item => {
  item.addEventListener('click', () => {
    const icon    = item.querySelector('.galeri-icon')?.textContent || '🖼️';
    const caption = item.querySelector('.galeri-caption')?.textContent || '';
    const bg      = item.querySelector('.galeri-placeholder')?.style.background || '';

    lightboxImg.style.background = bg;
    lightboxImg.textContent = icon;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===================================================
// 11. VIDEO PLAY BUTTON (placeholder)
// ===================================================
document.getElementById('playBtn')?.addEventListener('click', () => {
  showToast('Video sedang dipersiapkan. Mohon kunjungi channel YouTube desa kami.', '▶️');
});

// ===================================================
// 12. KONTAK FORM TABS
// ===================================================
const formTabs   = document.querySelectorAll('.form-tab');
const formPanels = document.querySelectorAll('.kontak-form');

formTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.form;
    formTabs.forEach(t => t.classList.remove('active'));
    formPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target)?.classList.add('active');
    document.getElementById('formSuccess').style.display = 'none';
  });
});

// ===================================================
// 13. FORM VALIDATION & SUBMIT
// ===================================================
function validateField(value, name) {
  if (!value.trim()) {
    showToast(`Field "${name}" wajib diisi.`, '⚠️');
    return false;
  }
  return true;
}

// Kirim Pesan
document.getElementById('btnKirimPesan')?.addEventListener('click', () => {
  const nama   = document.getElementById('nama').value;
  const telp   = document.getElementById('telp').value;
  const pesan  = document.getElementById('pesan').value;
  const perihal = document.getElementById('perihal').value;

  if (!validateField(nama, 'Nama Lengkap')) return;
  if (!validateField(telp, 'No. Telepon')) return;
  if (!validateField(perihal, 'Perihal')) return;
  if (!validateField(pesan, 'Pesan')) return;

  // Simulate sending
  submitForm('Pesan Anda telah kami terima. Tim kami akan menghubungi Anda dalam 1×24 jam kerja.');
});

// Kirim Pengaduan
document.getElementById('btnKirimPengaduan')?.addEventListener('click', () => {
  const namaPelapor = document.getElementById('namaPelapor').value;
  const kategori    = document.getElementById('kategoriPengaduan').value;
  const uraian      = document.getElementById('uraian').value;
  const anonim      = document.getElementById('anonim').checked;

  if (!validateField(namaPelapor, 'Nama Pelapor')) return;
  if (!validateField(kategori, 'Kategori Pengaduan')) return;
  if (!validateField(uraian, 'Uraian Pengaduan')) return;

  const msg = anonim
    ? 'Pengaduan anonim Anda telah kami terima dan akan ditindaklanjuti segera.'
    : 'Pengaduan Anda telah kami terima. Kami akan menghubungi Anda untuk tindak lanjut.';
  submitForm(msg);
});

function submitForm(message) {
  // Simulated loading
  const btn = document.querySelector('.kontak-form.active .btn-submit');
  if (btn) {
    btn.textContent = 'Mengirim...';
    btn.disabled = true;
  }
  setTimeout(() => {
    document.querySelectorAll('.kontak-form').forEach(f => f.classList.remove('active'));
    const successEl = document.getElementById('formSuccess');
    document.getElementById('successMsg').textContent = message;
    successEl.style.display = 'block';
    if (btn) { btn.textContent = btn.dataset.orig || 'Kirim'; btn.disabled = false; }
  }, 1200);
}

document.getElementById('btnBack')?.addEventListener('click', () => {
  document.getElementById('formSuccess').style.display = 'none';
  const activeTab = document.querySelector('.form-tab.active');
  if (activeTab) {
    const target = activeTab.dataset.form;
    document.getElementById(target)?.classList.add('active');
  } else {
    document.getElementById('kontak-form')?.classList.add('active');
  }
  // Reset forms
  document.querySelectorAll('.kontak-form input, .kontak-form textarea, .kontak-form select').forEach(el => el.value = '');
  document.getElementById('anonim').checked = false;
});

// ===================================================
// 14. NIK INPUT — only numbers, max 16
// ===================================================
document.getElementById('nik')?.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 16);
});

document.getElementById('telp')?.addEventListener('input', function () {
  this.value = this.value.replace(/[^\d\-\+\s]/g, '');
});

// ===================================================
// 15. BACK TO TOP BUTTON
// ===================================================
const backTopBtn = document.getElementById('backTop');

function handleBackTop() {
  backTopBtn?.classList.toggle('show', window.scrollY > 400);
}

backTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================================================
// 16. TOAST NOTIFICATION
// ===================================================
function showToast(message, icon = 'ℹ️') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  toast.style.cssText = `
    position: fixed; bottom: 88px; left: 50%; transform: translateX(-50%);
    background: #1B4332; color: #fff; padding: 14px 24px;
    border-radius: 50px; font-size: .88rem; z-index: 3000;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.2);
    animation: toastIn .3s ease;
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes toastOut { from{opacity:1;transform:translateX(-50%) translateY(0)} to{opacity:0;transform:translateX(-50%) translateY(16px)} }
  `;
  document.head.appendChild(styleEl);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 320);
  }, 3500);
}

// ===================================================
// 17. TICKER — duplicate content for seamless loop
// ===================================================
const tickerContent = document.querySelector('.ticker-content');
if (tickerContent) {
  tickerContent.innerHTML += tickerContent.innerHTML;
}

// ===================================================
// 18. KEYBOARD NAVIGATION for tabs
// ===================================================
document.querySelectorAll('.profil-tab').forEach((tab, i, tabs) => {
  tab.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') tabs[(i + 1) % tabs.length].click();
    if (e.key === 'ArrowLeft') tabs[(i - 1 + tabs.length) % tabs.length].click();
  });
  tab.setAttribute('tabindex', '0');
});

// ===================================================
// 19. CURRENT YEAR in footer
// ===================================================
document.querySelectorAll('.footer-bottom p').forEach(p => {
  p.innerHTML = p.innerHTML.replace('2025', new Date().getFullYear());
});

// ===================================================
// 20. STAT CARD HOVER TOOLTIP
// ===================================================
const statCards = document.querySelectorAll('.stat-card-big');
const tooltips = [
  'Total seluruh jiwa terdaftar di Desa Sukamaju',
  'Jumlah penduduk berjenis kelamin laki-laki',
  'Jumlah penduduk berjenis kelamin perempuan',
  'Total kepala keluarga terdaftar'
];
statCards.forEach((card, i) => {
  card.title = tooltips[i] || '';
});

// ===================================================
// 21. ACTIVE SECTION INDICATOR (tiny progress bar)
// ===================================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px;
  background: linear-gradient(to right, #52B788, #2D6A4F);
  z-index: 1001; width: 0%; transition: width .1s linear;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
});

// ===================================================
// 22. LAZY INIT — stagger card animations
// ===================================================
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }, (entry.target.dataset.delay || 0) * 1);
    cardObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.umkm-card').forEach((card, i) => {
  card.style.cssText += 'opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease;';
  card.dataset.delay = i * 80;
  cardObserver.observe(card);
});

document.querySelectorAll('.stat-card-big').forEach((card, i) => {
  card.style.cssText += 'opacity:0; transform:translateY(24px); transition: opacity .5s ease, transform .5s ease;';
  card.dataset.delay = i * 100;
  cardObserver.observe(card);
});

// ===================================================
// 23. PRINT-FRIENDLY (data summary page)
// ===================================================
document.addEventListener('keydown', e => {
  // Ctrl+P override info
  if (e.ctrlKey && e.key === 'p') {
    showToast('Untuk mencetak, gunakan Ctrl+P pada browser Anda.', '🖨️');
  }
});

console.log('%c🌾 Desa Sukamaju', 'color:#2D6A4F;font-size:20px;font-weight:bold;');
console.log('%cWebsite resmi Desa Sukamaju, Kec. Ciawi, Kab. Bogor', 'color:#52B788;font-size:12px;');