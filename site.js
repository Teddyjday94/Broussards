/* Paste a Formspree or Web3Forms endpoint here to have requests emailed to
   broussardscooling@gmail.com. Left empty, the form just shows the thank-you message. */
const FORM_ENDPOINT = "";

document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Gold bar under the current page's menu link. It has a view-transition-name,
// so moving between pages slides it from the old link to the new one.
const current = document.querySelector('.site-nav a[aria-current="page"]');
if (current) current.appendChild(Object.assign(document.createElement('span'), { className: 'nav-bar' }));

// Fade the map in once it has loaded instead of popping in
document.querySelectorAll('.map iframe').forEach(fr => {
  const show = () => fr.classList.add('loaded');
  fr.addEventListener('load', show);
  setTimeout(show, 4000);
});

// Scroll reveal: content eases up into place as it comes on screen.
// Items that arrive together are staggered so they read in order.
(function () {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const selector = [
    'main h1', 'main h2', '.page-head p', '.lede', '.intro .actions', '.rating',
    '.photo', '.svc-list li', '.cols', '.brands', 'blockquote', '.facts',
    '.help ol > li', '.maint ul', '.faq details', '.details > div', 'form.request',
    '.map', 'main section p', '.more', 'main h3', '.cta-band .wrap > *'
  ].join(',');
  const els = [...document.querySelectorAll(selector)].filter(el => !el.parentElement.closest('.reveal, .thanks') && (el.classList.add('reveal'), true));
  let fired = false;
  const io = new IntersectionObserver(entries => {
    fired = true;
    const arriving = entries.filter(e => e.isIntersecting).map(e => e.target);
    arriving.forEach((el, i) => {
      el.style.setProperty('--d', Math.min(i * 0.07, 0.42) + 's');
      io.unobserve(el);
    });
    setTimeout(() => arriving.forEach(el => el.classList.add('in')), 20);
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
  // Safety net: never leave content hidden if the observer doesn't report in
  setTimeout(() => { if (!fired) { io.disconnect(); els.forEach(el => el.classList.add('in')); } }, 1500);
})();

(function () {
  const form = document.getElementById('request');
  if (!form) return;
  const thanks = document.getElementById('thanks');
  const f = form.elements;

  // contact.html?service=Commercial preselects the service type
  const wanted = new URLSearchParams(location.search).get('service');
  if (wanted && [...f.service.options].some(o => o.value === wanted)) f.service.value = wanted;

  f.phone.addEventListener('input', e => {
    const d = e.target.value.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
    e.target.value = d.length > 6 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0,3)}) ${d.slice(3)}` : d;
  });
  form.addEventListener('input', e => { const fld = e.target.closest('.field'); if (fld) fld.classList.remove('bad'); });

  function check() {
    const bad = {
      'f-service': !f.service.value,
      'f-desc': f.description.value.trim().length < 3,
      'f-name': f.name.value.trim().length < 2,
      'f-phone': f.phone.value.replace(/\D/g, '').replace(/^1/, '').length !== 10,
      'f-email': f.email.value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()),
      'f-addr': f.address.value.trim().length < 5
    };
    Object.entries(bad).forEach(([id, isBad]) => {
      const fld = document.getElementById(id);
      fld.classList.toggle('bad', isBad);
      if (isBad) { // small shake so the problem field is easy to spot
        fld.classList.remove('nudge'); void fld.offsetWidth; fld.classList.add('nudge');
        fld.addEventListener('animationend', () => fld.classList.remove('nudge'), { once: true });
      }
    });
    const first = form.querySelector('.field.bad input, .field.bad select, .field.bad textarea');
    if (first) first.focus();
    return !first;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!check() || f._company_website.value) return;
    const data = Object.fromEntries(new FormData(form)); delete data._company_website;
    const btn = document.getElementById('send');
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      if (FORM_ENDPOINT) {
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _subject: 'Service request: ' + data.service, ...data }) });
        if (!r.ok) throw new Error('send failed');
      }
      form.style.display = 'none';
      thanks.style.display = 'block';
      thanks.classList.add('show');
      thanks.focus();
    } catch (err) {
      alert("Sorry, that didn't go through. Please call or text us at (225) 428-7776.");
    } finally {
      btn.disabled = false; btn.textContent = 'Send request';
    }
  });
})();
