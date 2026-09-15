const CONTACT_EMAIL = 'szalai2003@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const root = document.documentElement;

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
const langToggle = document.getElementById('langToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeMeta = document.querySelector('meta[name="theme-color"]');

let currentLang = localStorage.getItem('szalai-language') || 'hu';
let currentTheme = localStorage.getItem('szalai-theme') || 'dark';

function setLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'hu';
  root.lang = currentLang;
  localStorage.setItem('szalai-language', currentLang);

  document.querySelectorAll('[data-hu][data-en]').forEach((el) => {
    if (el.closest('.consent') && el.querySelector('a')) return;
    el.textContent = el.dataset[currentLang];
  });

  document.querySelectorAll('[data-hu-placeholder][data-en-placeholder]').forEach((el) => {
    el.placeholder = currentLang === 'en' ? el.dataset.enPlaceholder : el.dataset.huPlaceholder;
  });

  const consent = document.querySelector('.consent span');
  if (consent) {
    consent.innerHTML = currentLang === 'en'
      ? 'I have read the <a href="privacy.html" target="_blank" rel="noopener">privacy notice</a>.'
      : 'Elolvastam az <a href="privacy.html" target="_blank" rel="noopener">adatkezelési tájékoztatót</a>.';
  }

  if (langToggle) {
    langToggle.innerHTML = currentLang === 'hu'
      ? '<span class="lang-active">HU</span><span class="lang-sep">/</span><span>EN</span>'
      : '<span>HU</span><span class="lang-sep">/</span><span class="lang-active">EN</span>';
    langToggle.setAttribute('aria-label', currentLang === 'hu' ? 'Switch to English' : 'Váltás magyarra');
  }

  document.title = currentLang === 'en'
    ? 'Szalai Automation | Websites + AI automation'
    : 'Szalai Automation | Weboldal + AI automatizálás';

  const description = currentLang === 'en'
    ? 'Modern websites and AI automation for small businesses. Less admin, more leads, faster operations.'
    : 'Modern weboldalak és AI automatizálás kisvállalkozásoknak. Kevesebb admin, több érdeklődő, gyorsabb működés.';
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', currentLang === 'en' ? 'en_US' : 'hu_HU');

  updateCalculator();
}

function setTheme(theme) {
  currentTheme = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = currentTheme;
  localStorage.setItem('szalai-theme', currentTheme);
  if (themeIcon) themeIcon.textContent = currentTheme === 'dark' ? '☾' : '☀';
  themeToggle?.setAttribute('aria-pressed', String(currentTheme === 'light'));
  themeMeta?.setAttribute('content', currentTheme === 'dark' ? '#080b0c' : '#f5f7f5');
}

langToggle?.addEventListener('click', () => setLanguage(currentLang === 'hu' ? 'en' : 'hu'));
themeToggle?.addEventListener('click', () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'));

menuBtn?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(Boolean(open)));
});
document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => {
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion || !('IntersectionObserver' in window)) {
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

const hours = document.getElementById('hours');
const rate = document.getElementById('rate');
const hoursOut = document.getElementById('hoursOut');
const rateOut = document.getElementById('rateOut');
const monthlyValue = document.getElementById('monthlyValue');
const money = (n) => new Intl.NumberFormat(currentLang === 'en' ? 'en-US' : 'hu-HU').format(n) + ' Ft';
function updateCalculator() {
  if (!hours || !rate || !hoursOut || !rateOut || !monthlyValue) return;
  hoursOut.textContent = currentLang === 'en' ? `${hours.value} hrs` : `${hours.value} óra`;
  rateOut.textContent = money(Number(rate.value));
  monthlyValue.textContent = money(Number(hours.value) * Number(rate.value) * 4);
}
hours?.addEventListener('input', updateCalculator);
rate?.addEventListener('input', updateCalculator);

const toast = document.getElementById('toast');
function showToast(hu, en) {
  if (!toast) return;
  toast.textContent = currentLang === 'en' ? en : hu;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

document.querySelectorAll('[data-plan]').forEach((link) => {
  link.addEventListener('click', () => {
    const service = document.getElementById('service');
    if (!service) return;
    const plan = link.dataset.plan;
    service.value = plan === 'Launch' ? 'Új weboldal' : plan === 'Growth' ? 'Weboldal + automatizálás' : 'AI / admin automatizálás';
  });
});

const form = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  if (data.get('_honey')) return;
  data.set('_subject', `Új Szalai Automation lead – ${data.get('name')}`);
  data.set('_template', 'table');
  data.set('_captcha', 'false');
  data.set('language', currentLang.toUpperCase());

  const original = submitBtn?.innerHTML;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'en' ? 'Sending…' : 'Küldés…';
  }
  if (formStatus) formStatus.textContent = currentLang === 'en' ? 'Sending your message…' : 'Az üzenet küldése folyamatban…';

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false || result.success === 'false') throw new Error(result.message || 'Submit failed');
    form.reset();
    if (formStatus) formStatus.textContent = currentLang === 'en' ? 'Thanks! Your message was sent successfully.' : 'Köszönöm! Az üzeneted sikeresen elküldve.';
    showToast('Sikeresen elküldve.', 'Sent successfully.');
  } catch (error) {
    if (formStatus) {
      formStatus.innerHTML = currentLang === 'en'
        ? `Automatic sending failed. <a href="mailto:${CONTACT_EMAIL}">Send an email instead</a>.`
        : `Az automatikus küldés nem sikerült. <a href="mailto:${CONTACT_EMAIL}">Küldd el emailben</a>.`;
    }
    showToast('A küldés nem sikerült, használd az email linket.', 'Sending failed. Please use the email link.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original || (currentLang === 'en' ? 'Request free assessment ↗' : 'Ingyenes felmérést kérek ↗');
    }
  }
});

setTheme(currentTheme);
setLanguage(currentLang);
