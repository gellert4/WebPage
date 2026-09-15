const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach((a) => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
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
    }, { threshold: 0.5 });
    counterObs.observe(counter);
  }
}

const hours = document.getElementById('hours');
const rate = document.getElementById('rate');
const hoursOut = document.getElementById('hoursOut');
const rateOut = document.getElementById('rateOut');
const monthlyValue = document.getElementById('monthlyValue');
const money = (n) => `${new Intl.NumberFormat('hu-HU').format(n)} Ft`;

function updateCalc() {
  if (!hours || !rate || !hoursOut || !rateOut || !monthlyValue) return;
  hoursOut.textContent = `${hours.value} óra`;
  rateOut.textContent = money(Number(rate.value));
  monthlyValue.textContent = money(Number(hours.value) * Number(rate.value) * 4);
}

hours?.addEventListener('input', updateCalc);
rate?.addEventListener('input', updateCalc);
updateCalc();

document.querySelectorAll('[data-plan]').forEach((link) => {
  link.addEventListener('click', () => {
    const service = document.getElementById('service');
    if (!service) return;
    const plan = link.dataset.plan;
    service.value = plan === 'Launch'
      ? 'Új weboldal'
      : plan === 'Growth'
        ? 'Weboldal + automatizálás'
        : 'AI / admin automatizálás';
  });
});

const form = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const formOpenedAt = Date.now();

form?.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
    return;
  }

  const honey = form.querySelector('[name="_honey"]');
  if (honey?.value) {
    event.preventDefault();
    return;
  }

  if (Date.now() - formOpenedAt < 1800) {
    event.preventDefault();
    if (formStatus) formStatus.textContent = 'Kérlek, ellenőrizd az adatokat, majd küldd el újra az űrlapot.';
    return;
  }

  const lastSubmit = Number(sessionStorage.getItem('szalaiAutomationLastSubmit') || 0);
  if (Date.now() - lastSubmit < 15000) {
    event.preventDefault();
    if (formStatus) formStatus.textContent = 'Az előző beküldés után várj néhány másodpercet az újabb üzenettel.';
    return;
  }

  sessionStorage.setItem('szalaiAutomationLastSubmit', String(Date.now()));
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Küldés…';
  }
  if (formStatus) formStatus.textContent = 'Az üzenet továbbítása folyamatban…';
});
