/* Paste a Formspree or Web3Forms endpoint here to have requests emailed to
   broussardscooling@gmail.com. Left empty, the form just shows the thank-you message. */
const FORM_ENDPOINT = "";

document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

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
    Object.entries(bad).forEach(([id, isBad]) => document.getElementById(id).classList.toggle('bad', isBad));
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
      thanks.focus();
    } catch (err) {
      alert("Sorry, that didn't go through. Please call or text us at (225) 428-7776.");
    } finally {
      btn.disabled = false; btn.textContent = 'Send request';
    }
  });
})();
