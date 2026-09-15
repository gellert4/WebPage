// EDIT THIS BEFORE GOING LIVE
const CONTACT_EMAIL = 'contact@yourdomain.hu';

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const counter = document.querySelector('.counter');
const counterObs = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  const target = Number(counter.dataset.target || 0);
  let current = 0;
  const id = setInterval(() => {
    current++;
    counter.textContent = current;
    if (current >= target) clearInterval(id);
  }, 90);
  counterObs.disconnect();
}, {threshold: .5});
if (counter) counterObs.observe(counter);

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
hours.addEventListener('input', updateCalc); rate.addEventListener('input', updateCalc); updateCalc();

const toast = document.getElementById('toast');
function showToast(msg){
  toast.textContent = msg; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

document.getElementById('leadForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const subject = `Új érdeklődés – ${data.get('name')} – ${data.get('service')}`;
  const body = [
    `Név / cég: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Érdeklődés: ${data.get('service')}`,
    `Keret: ${data.get('budget')}`,
    '',
    'Jelenlegi probléma / cél:',
    data.get('problem'),
    '',
    'Szeretnék egy rövid ingyenes felmérést.'
  ].join('\n');
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast('Brief elkészült, nyitom az emailed...');
  setTimeout(() => { window.location.href = url; }, 350);
});
