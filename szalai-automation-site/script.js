const CONTACT_EMAIL = 'szalai2003@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

const counter = document.querySelector('.counter');
if (counter) {
  if (reduceMotion) {
    counter.textContent = counter.dataset.target || '8';
  } else {
    const counterObs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const target = Number(counter.dataset.target || 0);
      let current = 0;
      const id = setInterval(() => {
        current += 1;
        counter.textContent = current;
        if (current >= target) clearInterval(id);
      }, 90);
      counterObs.disconnect();
    }, {threshold: .5});
    counterObs.observe(counter);
  }
}

const hours = document.getElementById('hours');
const rate = document.getElementById('rate');
const hoursOut = document.getElementById('hoursOut');
const rateOut = document.getElementById('rateOut');
const monthlyValue = document.getElementById('monthlyValue');
const money = n => new Intl.NumberFormat('hu-HU').format(n) + ' Ft';
function updateCalc(){
  hoursOut.textContent = `${hours.value} óra`;
  rateOut.textContent = money(Number(rate.value));
  monthlyValue.textContent = money(Number(hours.value) * Number(rate.value) * 4);
}
hours?.addEventListener('input', updateCalc);
rate?.addEventListener('input', updateCalc);
if (hours && rate) updateCalc();

const toast = document.getElementById('toast');
function showToast(msg){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

document.querySelectorAll('[data-plan]').forEach(link => {
  link.addEventListener('click', () => {
    const service = document.getElementById('service');
    if (service) {
      const plan = link.dataset.plan;
      service.value = plan === 'Launch' ? 'Új weboldal' : plan === 'Growth' ? 'Weboldal + automatizálás' : 'AI / admin automatizálás';
    }
  });
});

const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  if (data.get('_honey')) return;

  data.append('_subject', `Új Szalai Automation lead – ${data.get('name')}`);
  data.append('_template', 'table');
  data.append('_captcha', 'false');

  submitBtn.disabled = true;
  submitBtn.dataset.original = submitBtn.textContent;
  submitBtn.textContent = 'Küldés…';
  formStatus.textContent = 'Az üzenet küldése folyamatban…';

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === 'false' || result.success === false) {
      throw new Error(result.message || 'A küldés sikertelen.');
    }
    form.reset();
    formStatus.textContent = 'Köszönöm! Az üzeneted megérkezett. Hamarosan válaszolok.';
    showToast('Sikeresen elküldve.');
  } catch (error) {
    formStatus.innerHTML = `Most nem sikerült automatikusan elküldeni. <a href="mailto:${CONTACT_EMAIL}">Küldd el emailben</a>.`;
    showToast('A küldés nem sikerült, használd az email linket.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.original || 'Ingyenes felmérést kérek ↗';
  }
});
