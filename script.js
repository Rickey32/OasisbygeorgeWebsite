/* ══════════════════════════════════════════════════════
   OasisByGeorge  |  script.js
   ══════════════════════════════════════════════════════

   MALL 1 — George-notifiering (redan konfigurerad):
   ─────────────────────────────────────────────────────
   1. Go to https://www.emailjs.com  →  sign up FREE
   2. "Email Services" → Add Gmail → connect oasisbygeorge@gmail.com
   3. "Email Templates" → Create template → paste this:

      Subject:  Ny bokning – {{service}} | {{booking_date}} kl {{booking_time}}

      Body:
        Hej George! Du har fått en ny bokning 🎉

        Kund: {{from_name}}
        Telefon: {{from_phone}}
        E-post: {{customer_email}}
        Adress: {{address}}

        Tjänst: {{service}}
        Datum: {{booking_date}}
        Tid: {{booking_time}}
        Antal fönster: {{windows}}

        Meddelande: {{notes}}

        Ring kunden för bekräftelse: {{from_phone}}

   4. Go to "Account" → copy your Public Key
   5. Replace the values below.

   MALL 2 — Kundbekräftelse (skapa i EmailJS):
   ─────────────────────────────────────────────────────
   Subject:  Bokningsbekräftelse – OasisByGeorge | {{booking_date}} kl {{booking_time}}
   To Email: {{to_email}}

   Hej {{to_name}}! Tack för din bokning hos OasisByGeorge. 🎉

   Din bokning:
     Tjänst:  {{service}}
     Datum:   {{booking_date}}
     Tid:     {{booking_time}}
     Adress:  {{address}}
     Fönster: {{windows}}

   George hör av sig via SMS för att bekräfta.
   Frågor? Ring: 073-877 76 33

   – OasisByGeorge

   Kopiera mall-ID och sätt det som clientTemplateId nedan.
   ──────────────────────────────────────────────────── */

const EJS = {
  publicKey:        'apkikIgO4LZDCpIax',
  serviceId:        'service_gxd35la',
  templateId:       'template_e7yu9gl', // används för både George-notifiering och kundbekräftelse
};

/* ── Init EmailJS ────────────────────────────────────── */
if (EJS.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
  emailjs.init({ publicKey: EJS.publicKey });
}

/* ══════════════════════════════════════════════════════
   PROMO BAR
══════════════════════════════════════════════════════ */
document.getElementById('promo-close').addEventListener('click', function () {
  document.getElementById('promo-bar').style.display = 'none';
});

/* ══════════════════════════════════════════════════════
   NAVBAR — scroll effect + mobile menu
══════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const hamburger    = document.getElementById('hamburger');
const mobileNav    = document.getElementById('mobileNav');
const mobileClose  = document.getElementById('mobileNavClose');

hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

/* ══════════════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════════════
   COUNTER ANIMATION (hero stats)
══════════════════════════════════════════════════════ */
const counterEl = document.querySelector('[data-count]');
if (counterEl) {
  const target = parseInt(counterEl.dataset.count, 10);
  const counterObs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    counterObs.disconnect();
    let current = 0;
    const step = Math.ceil(target / 60);
    const tick = setInterval(() => {
      current = Math.min(current + step, target);
      counterEl.textContent = current + '+';
      if (current >= target) clearInterval(tick);
    }, 22);
  }, { threshold: 0.5 });
  counterObs.observe(counterEl);
}

/* ══════════════════════════════════════════════════════
   BEFORE / AFTER SLIDER
══════════════════════════════════════════════════════ */
(function () {
  const wrap    = document.getElementById('beforeAfter');
  const after   = document.getElementById('baAfter');
  const divider = document.getElementById('baDivider');
  if (!wrap) return;

  let dragging = false;

  function setPos(x) {
    const rect = wrap.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.min(Math.max(pct, 5), 95);
    after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left    = pct + '%';
  }

  wrap.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
  wrap.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup',   () => dragging = false);
  window.addEventListener('touchend',  () => dragging = false);
})();

/* ══════════════════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════════════════ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ══════════════════════════════════════════════════════
   COOKIE BANNER
══════════════════════════════════════════════════════ */
(function () {
  const banner  = document.getElementById('cookie-banner');
  const accept  = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (localStorage.getItem('gk_cookie')) return;
  setTimeout(() => banner.classList.add('visible'), 1500);
  function dismiss() { banner.classList.remove('visible'); localStorage.setItem('gk_cookie', '1'); }
  accept.addEventListener('click',  dismiss);
  decline.addEventListener('click', dismiss);
})();

/* ══════════════════════════════════════════════════════
   BOOKING WIZARD
══════════════════════════════════════════════════════ */

/* ── State ───────────────────────────────────────────── */
const booking = {
  service: null,
  date:    null,
  time:    null,
  name:    '',
  phone:   '',
  email:   '',
  windows: '',
  address: '',
  notes:   '',
};

let currentStep  = 1;
const totalSteps = 5;
let calYear, calMonth;

/* ── DOM refs ────────────────────────────────────────── */
const nextBtn    = document.getElementById('nextBtn');
const backBtn    = document.getElementById('backBtn');
const calGrid    = document.getElementById('calGrid');
const calLabel   = document.getElementById('calMonthLabel');

/* ── Calendar init ───────────────────────────────────── */
(function initCal() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  renderCal();
})();

document.getElementById('calPrev').addEventListener('click', () => {
  const now = new Date();
  if (calYear === now.getFullYear() && calMonth <= now.getMonth()) return;
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCal();
});
document.getElementById('calNext').addEventListener('click', () => {
  const now = new Date();
  const maxMonth = now.getMonth() + 2;
  const maxYear  = now.getFullYear() + (maxMonth > 11 ? 1 : 0);
  const adjMax   = maxMonth % 12;
  if (calYear === maxYear && calMonth >= adjMax) return;
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCal();
});

function renderCal() {
  const months = ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'];
  calLabel.textContent = `${months[calMonth]} ${calYear}`;

  const today     = new Date(); today.setHours(0,0,0,0);
  const maxDate   = new Date(today); maxDate.setDate(today.getDate() + 60);
  const firstDay  = new Date(calYear, calMonth, 1);
  const lastDay   = new Date(calYear, calMonth + 1, 0);
  const startDow  = firstDay.getDay();
  const offset    = startDow === 0 ? 6 : startDow - 1; // Mon-first

  const headers = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön'];
  let html = headers.map(d => `<div class="cal-hdr">${d}</div>`).join('');

  for (let i = 0; i < offset; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date    = new Date(calYear, calMonth, d);
    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const past    = date < today;
    const sunday  = date.getDay() === 0;
    const far     = date > maxDate;
    const disabled = past || sunday || far;
    const isToday = date.getTime() === today.getTime();
    const selected = booking.date === dateStr;

    const cls = [
      'cal-day',
      disabled ? 'disabled' : 'available',
      selected  ? 'selected' : '',
      isToday   ? 'today'    : '',
    ].join(' ').trim();

    html += `<div class="${cls}" ${!disabled ? `data-date="${dateStr}"` : ''}>${d}</div>`;
  }
  calGrid.innerHTML = html;

  calGrid.querySelectorAll('.cal-day.available').forEach(el => {
    el.addEventListener('click', () => {
      booking.date = el.dataset.date;
      renderCal();
      updateNextBtn();
    });
  });
}

/* ── Time slots ──────────────────────────────────────── */
document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
    booking.time = slot.dataset.time;
    updateNextBtn();
  });
});

/* ── Service cards ───────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    booking.service = card.dataset.service;
    updateNextBtn();
  });
});

/* ── Step navigation ─────────────────────────────────── */
nextBtn.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  if (currentStep === totalSteps) {
    submitBooking();
  } else {
    goToStep(currentStep + 1);
  }
});
backBtn.addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

function goToStep(step) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');

  for (let i = 1; i <= totalSteps; i++) {
    const prog = document.getElementById(`prog-${i}`);
    prog.classList.remove('active','done');
    if (i < step)  prog.classList.add('done');
    if (i === step) prog.classList.add('active');
    prog.querySelector('.prog-dot').textContent = i < step ? '✓' : i;
  }

  backBtn.style.visibility = step > 1 ? 'visible' : 'hidden';
  currentStep = step;

  if (step === totalSteps) buildSummary();
  updateNextBtn();
}

function updateNextBtn() {
  switch (currentStep) {
    case 1:
      nextBtn.textContent = booking.service ? 'Välj datum →' : 'Välj tjänst för att fortsätta';
      nextBtn.disabled = !booking.service;
      break;
    case 2:
      nextBtn.textContent = booking.date ? 'Välj tid →' : 'Välj datum för att fortsätta';
      nextBtn.disabled = !booking.date;
      break;
    case 3:
      nextBtn.textContent = booking.time ? 'Fyll i uppgifter →' : 'Välj tid för att fortsätta';
      nextBtn.disabled = !booking.time;
      break;
    case 4:
      nextBtn.textContent = 'Granska bokning →';
      nextBtn.disabled = false;
      break;
    case 5:
      nextBtn.textContent = '✓ Skicka bokningsförfrågan';
      nextBtn.disabled = false;
      break;
  }
}

/* ── Validation ──────────────────────────────────────── */
function validateStep(step) {
  if (step === 1 && !booking.service) { alert('Välj en tjänst för att fortsätta.'); return false; }
  if (step === 2 && !booking.date)    { alert('Välj ett datum för att fortsätta.'); return false; }
  if (step === 3 && !booking.time)    { alert('Välj en tid för att fortsätta.'); return false; }
  if (step === 4) {
    const name    = document.getElementById('b-name');
    const phone   = document.getElementById('b-phone');
    const email   = document.getElementById('b-email');
    const address = document.getElementById('b-address');
    let ok = true;
    [name, phone, email, address].forEach(f => {
      f.classList.remove('error');
      if (!f.value.trim()) { f.classList.add('error'); ok = false; }
    });
    if (!ok) { alert('Fyll i de obligatoriska fälten (märkta med *).'); return false; }
    booking.name    = name.value.trim();
    booking.phone   = phone.value.trim();
    booking.email   = email.value.trim();
    booking.windows = document.getElementById('b-windows').value.trim();
    booking.address = address.value.trim();
    booking.notes   = document.getElementById('b-notes').value.trim();
  }
  return true;
}

/* ── Summary ─────────────────────────────────────────── */
function buildSummary() {
  const rows = [
    ['Tjänst',  booking.service],
    ['Datum',   formatDate(booking.date)],
    ['Tid',     booking.time],
    ['Namn',    booking.name],
    ['Telefon', booking.phone],
    ['E-post',  booking.email || '—'],
    ['Adress',  booking.address],
    ['Fönster', booking.windows || '—'],
    ['Övrigt',  booking.notes  || '—'],
  ];
  document.getElementById('summaryBody').innerHTML = rows.map(([label, val]) =>
    `<div class="summary-row">
       <span class="s-label">${label}</span>
       <span class="s-val">${val}</span>
     </div>`
  ).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

/* ── Send emails ─────────────────────────────────────── */
function sendClientConfirmation() {
  if (!booking.email) return Promise.resolve();
  return emailjs.send(EJS.serviceId, EJS.templateId, {
    to_email:       booking.email,
    to_name:        booking.name,
    from_name:      booking.name,
    from_phone:     booking.phone,
    customer_email: booking.email,
    address:        booking.address,
    service:        booking.service,
    booking_date:   formatDate(booking.date),
    booking_time:   booking.time,
    windows:        booking.windows || '—',
    notes:          booking.notes   || '—',
  });
}

function submitBooking() {
  nextBtn.textContent = 'Skickar…';
  nextBtn.disabled    = true;

  const params = {
    to_email:       'oasisbygeorge@gmail.com',
    to_name:        'George',
    from_name:      booking.name,
    from_phone:     booking.phone,
    customer_email: booking.email || 'Ej angiven',
    address:        booking.address,
    service:        booking.service,
    booking_date:   formatDate(booking.date),
    booking_time:   booking.time,
    windows:        booking.windows || 'Ej angett',
    notes:          booking.notes   || 'Inga anteckningar',
  };

  function showSuccess() {
    document.getElementById('bookingProgress').style.display = 'none';
    document.querySelector('.booking-body').style.display    = 'none';
    document.getElementById('bookingFooter').style.display   = 'none';
    const successEl  = document.getElementById('bookingSuccess');
    successEl.classList.add('show');
    document.getElementById('successName').textContent = booking.name.split(' ')[0];
    document.getElementById('successSummary').innerHTML = `
      <strong>📋 Din bokning</strong><br>
      🪟 ${booking.service}<br>
      📅 ${formatDate(booking.date)} kl. ${booking.time}<br>
      📍 ${booking.address}
    `;
  }

  if (EJS.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
    /* ─ EmailJS not yet configured: open mailto as fallback ─ */
    const subject = encodeURIComponent(`Ny bokning – ${booking.service} | ${formatDate(booking.date)} kl ${booking.time}`);
    const body    = encodeURIComponent(
      `Ny bokningsförfrågan från hemsidan:\n\n` +
      `Namn: ${booking.name}\nTelefon: ${booking.phone}\nE-post: ${booking.email || '—'}\n` +
      `Adress: ${booking.address}\n\nTjänst: ${booking.service}\nDatum: ${formatDate(booking.date)}\n` +
      `Tid: ${booking.time}\nAntal fönster: ${booking.windows || '—'}\n\nMeddelande: ${booking.notes || '—'}`
    );
    window.location.href = `mailto:oasisbygeorge@gmail.com?subject=${subject}&body=${body}`;
    showSuccess();
    return;
  }

  emailjs.send(EJS.serviceId, EJS.templateId, params)
    .then(() => {
      sendClientConfirmation().catch(err => console.warn('Kundbekräftelse kunde inte skickas:', err));
      showSuccess();
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      alert('Något gick fel. Ring mig direkt på 073-877 76 33 så bokar vi manuellt!');
      nextBtn.textContent = '✓ Skicka bokningsförfrågan';
      nextBtn.disabled    = false;
    });
}

/* ── Kick off ────────────────────────────────────────── */
updateNextBtn();

/* ══════════════════════════════════════════════════════
   PRICING TOGGLE — Engångsputs / Abonnemang
══════════════════════════════════════════════════════ */
(function () {
  const btnOnce    = document.getElementById('toggle-once');
  const btnSub     = document.getElementById('toggle-sub');
  const slotSel    = document.getElementById('slotSelector');
  const toggleHint = document.getElementById('toggleHint');
  if (!btnOnce || !btnSub) return;

  function formatSEK(n) {
    return n >= 1000
      ? Math.floor(n / 1000) + ' ' + String(n).slice(-3)
      : String(n);
  }

  function getSlots() {
    const active = document.querySelector('.slot-btn.active');
    return active ? parseInt(active.dataset.slots, 10) : 4;
  }

  function applyMode(mode) {
    const slots = getSlots();
    document.querySelectorAll('.price-main[data-once]').forEach(el => {
      const perVisit = parseInt(el.dataset.sub, 10);
      const onceVal  = parseInt(el.dataset.once, 10);
      if (mode === 'sub') {
        const total = perVisit * slots;
        el.textContent = formatSEK(total);
        /* show per-visit note */
        let note = el.closest('.price-amount').nextElementSibling;
        if (!note || !note.classList.contains('price-per-visit')) {
          note = document.createElement('div');
          note.className = 'price-per-visit';
          el.closest('.price-amount').insertAdjacentElement('afterend', note);
        }
        note.textContent = `${slots} besök × ${formatSEK(perVisit)} kr`;
        note.style.display = 'block';
      } else {
        el.textContent = formatSEK(onceVal);
        const note = el.closest('.price-amount').nextElementSibling;
        if (note && note.classList.contains('price-per-visit')) {
          note.style.display = 'none';
        }
      }
    });
    /* update unit label */
    document.querySelectorAll('.price-unit').forEach(el => {
      el.textContent = mode === 'sub' ? ' kr totalt' : ' kr';
    });
    /* update RUT-avdrag prices (50% — follows the same once/sub toggle) */
    document.querySelectorAll('.rut-amount[data-once]').forEach(el => {
      if (el.classList.contains('rut-muted')) return;
      const val = mode === 'sub'
        ? parseInt(el.dataset.sub, 10) * slots
        : parseInt(el.dataset.once, 10);
      el.textContent = formatSEK(val) + ' kr';
    });
  }

  btnOnce.addEventListener('click', () => {
    btnOnce.classList.add('active');
    btnSub.classList.remove('active');
    applyMode('once');
    if (slotSel)    slotSel.style.display = 'none';
    if (toggleHint) toggleHint.textContent = 'Engångsbokning — boka när du vill, betala per tillfälle.';
  });

  btnSub.addEventListener('click', () => {
    btnSub.classList.add('active');
    btnOnce.classList.remove('active');
    applyMode('sub');
    if (slotSel)    slotSel.style.display = 'block';
    if (toggleHint) toggleHint.textContent = 'Välj ditt paket — boka varje besök när det passar dig. Spara 20% på varje tillfälle.';
  });

  /* Paketväljare — uppdatera totalpris vid byte av antal besök */
  document.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btnSub.classList.contains('active')) applyMode('sub');
    });
  });

  /* Init: Engångsputs är aktivt som standard */
  applyMode('once');
})();

/* ══════════════════════════════════════════════════════
   STAMKUND FORM
══════════════════════════════════════════════════════ */
(function () {
  const form    = document.getElementById('stamkund-form');
  const success = document.getElementById('stamkund-success');
  const submit  = document.getElementById('sk-submit');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('sk-name');
    const phone   = document.getElementById('sk-phone');
    const email   = document.getElementById('sk-email');
    const address = document.getElementById('sk-address');
    const windows = document.getElementById('sk-windows');
    const slots   = document.getElementById('sk-slots');

    let ok = true;
    [name, phone, email, address].forEach(f => {
      f.classList.remove('error');
      if (!f.value.trim()) { f.classList.add('error'); ok = false; }
    });
    if (!ok) { alert('Fyll i de obligatoriska fälten.'); return; }

    submit.textContent = 'Skickar…';
    submit.disabled = true;

    const slotsVal = slots ? slots.value : '4';
    const params = {
      to_name:        'George',
      from_name:      name.value.trim(),
      from_phone:     phone.value.trim(),
      customer_email: email.value.trim(),
      address:        address.value.trim(),
      service:        `STAMKUNDSREGISTRERING — Paket: ${slotsVal} besök (20% rabatt)`,
      booking_date:   '—',
      booking_time:   '—',
      windows:        windows.value.trim() || 'Ej angivet',
      notes:          `Kunden vill bli stamkund. Valt paket: ${slotsVal} besök.`,
    };

    function showSuccess() {
      form.style.display = 'none';
      success.style.display = 'block';
    }

    if (EJS.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
      showSuccess();
      return;
    }

    emailjs.send(EJS.serviceId, EJS.templateId, params)
      .then(() => showSuccess())
      .catch(() => {
        alert('Något gick fel. Ring George direkt på 073-877 76 33!');
        submit.textContent = 'Bli stamkund — spara 20% →';
        submit.disabled = false;
      });
  });
})();
