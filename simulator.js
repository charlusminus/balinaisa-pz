/* =============================================
   BALINAISA SIMULATOR — Logic
   ============================================= */

const CATALOG = [
  { id: 'joko',    name: 'Joko',    cat: 'chaise',     price: 279,  color: '#C4975A', desc: 'Chaise en teck massif' },
  { id: 'aruna',   name: 'Aruna',   cat: 'chaise',     price: 359,  color: '#B8895A', desc: 'Chaise en teck massif' },
  { id: 'dune',    name: 'Dune',    cat: 'chaise',     price: 309,  color: '#D4A96A', desc: 'Chaise en teck massif' },
  { id: 'nara',    name: 'Nara',    cat: 'chaise',     price: 319,  color: '#C09050', desc: 'Chaise en teck massif' },
  { id: 'lisa',    name: 'Lisa',    cat: 'chaise',     price: 339,  color: '#B87848', desc: 'Chaise en teck massif' },
  { id: 'sari',    name: 'Sari',    cat: 'chaise',     price: 299,  color: '#D0A870', desc: 'Chaise en teck massif' },
  { id: 'luma',    name: 'Luma',    cat: 'fauteuil',   price: 499,  color: '#9A7050', desc: 'Fauteuil en teck massif' },
  { id: 'ananda',  name: 'Ananda',  cat: 'fauteuil',   price: 339,  color: '#A87850', desc: 'Fauteuil en teck massif' },
  { id: 'andini',  name: 'Andini',  cat: 'chaise',     price: 219,  color: '#C8A878', desc: 'Chaise en teck massif' },
  { id: 'padma',   name: 'Padma',   cat: 'chaise',     price: 299,  color: '#BC9060', desc: 'Chaise en teck massif' },
  { id: 'kinanti', name: 'Kinanti', cat: 'chaise',     price: 319,  color: '#D4A060', desc: 'Chaise en teck massif' },
  { id: 'indra',   name: 'Indra',   cat: 'table',      price: 389,  color: '#8B6030', desc: 'Table en teck massif' },
];

const LABEL = { chaise: 'Chaise', fauteuil: 'Fauteuil', table: 'Table', 'bain-soleil': 'Bain de soleil' };

const GEN_STEPS = [
  { title: 'Analyse de votre pièce…',       sub: "L'IA identifie la perspective et la luminosité",        pct: 20 },
  { title: 'Placement du meuble…',           sub: 'Calcul de l\'angle et de l\'échelle',                   pct: 50 },
  { title: 'Rendu des matières teck…',       sub: 'Application des textures bois et finitions',            pct: 80 },
  { title: 'Finalisation du rendu…',         sub: 'Harmonisation des couleurs et ombres',                  pct: 95 },
];

// State
let currentStep = 0;
let uploadedFile = null;
let uploadedDataURL = null;
let selectedProduct = null;
let qty = 1;

/* =============================================
   HERO → START
   ============================================= */
function startSimulator() {
  document.getElementById('hero').classList.add('hidden');
  document.getElementById('simulator').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderCatalog('all');
}

/* =============================================
   FILE UPLOAD
   ============================================= */
function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  uploadedFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    uploadedDataURL = e.target.result;
    const zone = document.getElementById('upload-zone');
    const inner = document.getElementById('upload-zone-inner');
    const preview = document.getElementById('preview-img');
    inner.classList.add('hidden');
    preview.src = uploadedDataURL;
    preview.classList.remove('hidden');
    zone.classList.add('has-file');
    document.getElementById('btn-step1-next').disabled = false;
  };
  reader.readAsDataURL(file);
}

// Drag & drop
document.addEventListener('DOMContentLoaded', () => {
  const zone = document.getElementById('upload-zone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--primary)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.getElementById('file-input');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handleFileUpload(input);
    }
  });
});

/* =============================================
   CATALOG
   ============================================= */
function renderCatalog(filter) {
  const grid = document.getElementById('catalog-grid');
  const items = filter === 'all' ? CATALOG : CATALOG.filter(p => p.cat === filter);
  grid.innerHTML = items.map(p => `
    <div class="catalog-card${selectedProduct?.id === p.id ? ' selected' : ''}"
         onclick="selectProduct('${p.id}')"
         data-cat="${p.cat}">
      <div class="catalog-card-img" style="background: linear-gradient(135deg, ${p.color}22, ${p.color}44);">
        <svg width="56" height="42" viewBox="0 0 56 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="18" width="48" height="14" rx="3" fill="${p.color}" opacity="0.8"/>
          <rect x="8" y="10" width="40" height="10" rx="2" fill="${p.color}"/>
          <rect x="8" y="32" width="6" height="8" rx="1" fill="${p.color}" opacity="0.7"/>
          <rect x="42" y="32" width="6" height="8" rx="1" fill="${p.color}" opacity="0.7"/>
        </svg>
      </div>
      <div class="catalog-card-body">
        <div class="catalog-card-name">${p.name}</div>
        <div class="catalog-card-mat">Teck massif</div>
        <div class="catalog-card-price">${p.price.toLocaleString('fr-FR')},00 €</div>
      </div>
    </div>
  `).join('');
}

function filterCatalog(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCatalog(cat);
}

function selectProduct(id) {
  selectedProduct = CATALOG.find(p => p.id === id);
  qty = 1;
  document.querySelectorAll('.catalog-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[onclick="selectProduct('${id}')"]`)?.classList.add('selected');
  document.getElementById('btn-step2-next').disabled = false;
}

/* =============================================
   STEP NAVIGATION
   ============================================= */
function goToStep(step) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`step-${step}`).classList.remove('hidden');
  updateStepNav(step);
  updateProgressBar(step);
  currentStep = step;

  if (step === 3) runGeneration();
  if (step === 4) renderResult();

  window.scrollTo({ top: 60, behavior: 'smooth' });
}

function updateStepNav(step) {
  document.querySelectorAll('.step-item').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === step) el.classList.add('active');
    else if (s < step) el.classList.add('done');
  });
}

function updateProgressBar(step) {
  const pct = { 1: 25, 2: 50, 3: 75, 4: 100 }[step] || 25;
  document.getElementById('progress-bar').style.width = pct + '%';
}

/* =============================================
   GENERATION ANIMATION
   ============================================= */
function runGeneration() {
  const bar = document.getElementById('gen-progress-bar');
  const title = document.getElementById('gen-title');
  const sub = document.getElementById('gen-sub');
  const stepEls = ['gs-1','gs-2','gs-3','gs-4'].map(id => document.getElementById(id));
  stepEls.forEach(el => { el.classList.remove('active','done'); });

  let phase = 0;
  let progress = 0;

  const TIMING = [2200, 2500, 2800, 1800]; // ms per phase

  function advancePhase() {
    if (phase >= GEN_STEPS.length) {
      goToStep(4);
      return;
    }
    const s = GEN_STEPS[phase];
    title.textContent = s.title;
    sub.textContent = s.sub;

    stepEls.forEach((el, i) => {
      el.classList.remove('active','done');
      if (i < phase) el.classList.add('done');
      else if (i === phase) el.classList.add('active');
    });

    animateBar(progress, s.pct, TIMING[phase] * 0.8);
    progress = s.pct;
    phase++;
    setTimeout(advancePhase, TIMING[phase - 1]);
  }

  advancePhase();
}

function animateBar(from, to, duration) {
  const bar = document.getElementById('gen-progress-bar');
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = from + (to - from) * easeOut(t);
    bar.style.width = val.toFixed(1) + '%';
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* =============================================
   RESULT
   ============================================= */
function renderResult() {
  const p = selectedProduct;
  if (!p) return;

  // Images
  const beforeImg = document.getElementById('result-before');
  const afterImg = document.getElementById('result-after');
  beforeImg.src = uploadedDataURL || '';

  // Simulate a "generated" result by compositing: just use original for now
  // (placeholder until real API is connected)
  afterImg.src = uploadedDataURL || '';
  afterImg.style.filter = 'sepia(0.15) saturate(1.1)';

  // Quote
  document.getElementById('result-product-name').textContent = p.name;
  document.getElementById('quote-product-name').textContent = p.name;
  document.getElementById('quote-tag').textContent = LABEL[p.cat] || p.cat;
  document.getElementById('quote-product-img').style.background =
    `linear-gradient(135deg, ${p.color}33, ${p.color}66)`;

  qty = 1;
  updateQuote();
}

function updateQuote() {
  const p = selectedProduct;
  if (!p) return;
  const unitPrice = p.price;
  const hasDiscount = qty >= 4;
  const discountRate = 0.1;
  const discountAmt = hasDiscount ? unitPrice * qty * discountRate : 0;
  const ht = unitPrice * qty - discountAmt;
  const tva = ht * 0.20;
  const ttc = ht + tva;

  document.getElementById('qty-val').textContent = qty;
  document.getElementById('quote-unit-price').textContent = fmt(unitPrice);
  document.getElementById('quote-ht').textContent = fmt(ht);
  document.getElementById('quote-tva').textContent = fmt(tva);
  document.getElementById('quote-ttc').textContent = fmt(ttc);

  const discountLine = document.getElementById('quote-discount-line');
  if (hasDiscount) {
    discountLine.style.display = 'flex';
    document.getElementById('quote-discount').textContent = '−' + fmt(discountAmt);
  } else {
    discountLine.style.display = 'none';
  }
}

function changeQty(delta) {
  qty = Math.max(1, Math.min(20, qty + delta));
  updateQuote();
}

function fmt(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function switchResultTab(tab, btn) {
  document.querySelectorAll('.result-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const after = document.getElementById('result-after');
  const before = document.getElementById('result-before');
  if (tab === 'after') {
    after.classList.replace('hidden','active');
    before.classList.replace('active','hidden');
  } else {
    before.classList.replace('hidden','active');
    after.classList.replace('active','hidden');
  }
}

function downloadResult() {
  const img = document.getElementById('result-after');
  const a = document.createElement('a');
  a.href = img.src;
  a.download = `balinaisa-simulation-${selectedProduct?.id || 'rendu'}.jpg`;
  a.click();
}

function retrySimulation() {
  goToStep(2);
}

/* =============================================
   CONTACT FORM
   ============================================= */
async function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  const payload = {
    name:    document.getElementById('f-name').value,
    email:   document.getElementById('f-email').value,
    phone:   document.getElementById('f-phone').value,
    message: document.getElementById('f-message').value,
    product: selectedProduct?.name,
    qty,
    price_ttc: selectedProduct ? (selectedProduct.price * qty * 1.2).toFixed(2) : null,
    source: 'simulateur-balinaisa',
  };

  // TODO: replace with Activepieces webhook URL
  const WEBHOOK_URL = 'https://cloud.activepieces.com/api/v1/webhooks/vBqWuW1eudqSQG4eFkacG';

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
  } catch (_) {
    // no-cors: always "succeeds" silently
  }

  document.getElementById('contact-form').classList.add('hidden');
  document.getElementById('form-success').classList.remove('hidden');
}

/* =============================================
   RESET
   ============================================= */
function resetSimulator() {
  selectedProduct = null;
  uploadedFile = null;
  uploadedDataURL = null;
  qty = 1;

  document.getElementById('preview-img').classList.add('hidden');
  document.getElementById('preview-img').src = '';
  document.getElementById('upload-zone-inner').classList.remove('hidden');
  document.getElementById('upload-zone').classList.remove('has-file');
  document.getElementById('btn-step1-next').disabled = true;
  document.getElementById('btn-step2-next').disabled = true;
  document.getElementById('contact-form').classList.remove('hidden');
  document.getElementById('form-success').classList.add('hidden');
  document.getElementById('contact-form').reset();
  document.getElementById('gen-progress-bar').style.width = '0%';

  renderCatalog('all');
  goToStep(1);
}
