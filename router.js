/**
 * SINDARITY ENGINE — DYNAMIC ROUTER
 * Reads the URL path, fetches niches.json, populates
 * the master template with the correct niche data.
 *
 * Routes:
 *   domain.com/             → Master / default page
 *   domain.com/chiropractor → Chiropractic niche page
 *   domain.com/legal        → Legal niche page
 *   etc.
 */

// ── UTILITIES ─────────────────────────────────────────

/**
 * Extract the niche key from the current URL path.
 * /chiropractor  → "chiropractor"
 * /legal/        → "legal"
 * /              → null (default page)
 */
function getNicheFromPath() {
  const path = window.location.pathname
    .replace(/^\//, '')   // strip leading /
    .replace(/\/$/, '')   // strip trailing /
    .toLowerCase()
    .trim();
  return path || null;
}

/**
 * Safely set text content on an element if it exists.
 */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

/**
 * Fade-in a DOM element.
 */
function reveal(el, delay = 0) {
  if (!el) return;
  el.style.opacity = '0';
  el.style.transition = `opacity 0.5s ease ${delay}ms`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { el.style.opacity = '1'; });
  });
}

// ── NICHE RENDERER ────────────────────────────────────

/**
 * Populate the template DOM with niche data.
 */
function renderNiche(data) {
  document.title = `Sindarity — ${data.nicheName}`;

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = `${data.headline} — Sindarity Data Solutions`;

  // Header badge
  setText('nicheBadge', data.nicheName);

  // Hero left
  setText('metricValue', data.metric || '—');

  // Hero right
  setText('nicheLabel', data.nicheName.toUpperCase());
  setText('headline',   data.headline);
  setText('subheadline', data.subheadline);
  setText('painPoint',  data.painPoint);
  setText('solution',   data.solution);
  setText('ctaText',    data.ctaText);
  setText('trustBadge', data.badge || 'HIPAA Compliant · BAA Available');

  // CTA href — smooth scroll to contact
  const ctaBtn = document.getElementById('ctaBtn');
  if (ctaBtn) ctaBtn.href = '#contact';

  // Pre-fill hidden contact email target
  const form = document.getElementById('contactForm');
  if (form && data.contactEmail) {
    form.dataset.email = data.contactEmail;
  }

  // Reveal page
  document.body.style.visibility = 'visible';
}

/**
 * Render a graceful fallback "master" page when the
 * niche doesn't exist in the JSON.
 */
function renderDefault(nicheKey) {
  document.title = 'Sindarity — Sovereign Data Infrastructure';

  setText('nicheBadge',  'Sindarity');
  setText('metricValue', 'Revenue Recovery');
  setText('nicheLabel',  'SINDARITY DATA SOLUTIONS');
  setText('headline',    'Sovereign Data Infrastructure.\nBuilt for What\'s at Stake.');
  setText('subheadline', 'Infrastructure for Advocacy. Systems for Revenue Recovery.');
  setText('painPoint',   'Documentation gaps are quietly draining your revenue — and no one is tracking them systematically.');
  setText('solution',    'We build sovereign data systems that organize your records, surface the gaps, and protect your revenue — without new software, without workflow disruption.');
  setText('ctaText',     'Deploy Your Recovery Protocol');
  setText('trustBadge',  'HIPAA Compliant · BAA Available · NDA Standard');

  if (nicheKey) {
    console.info(`[Sindarity Router] Niche "${nicheKey}" not found — rendering default.`);
  }

  document.body.style.visibility = 'visible';
}

// ── FORM HANDLER ─────────────────────────────────────

function initForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const successState = document.getElementById('successState');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const firstName  = form.firstName.value.trim();
    const lastName   = form.lastName.value.trim();
    const email      = form.email.value.trim();
    const org        = form.org.value.trim();

    if (!firstName || !lastName || !email || !org) {
      highlightEmpty(form);
      return;
    }

    if (!isValidEmail(email)) {
      form.email.style.borderColor = 'rgba(180,60,60,0.5)';
      form.email.focus();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Submitting…';

    // ── INTEGRATION POINT ──────────────────────────────
    // Replace the setTimeout below with your actual form
    // submission. Examples:
    //
    // Formspree:
    //   const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       firstName, lastName, email, org,
    //       challenge: form.challenge.value,
    //       niche: form.dataset.email,
    //       _subject: `New *CMD Intake — ${org}`
    //     })
    //   });
    //
    // Netlify Forms: add data-netlify="true" to <form> tag.
    // n8n Webhook: POST to your self-hosted n8n endpoint.
    // ──────────────────────────────────────────────────

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Show success
    form.querySelectorAll('.form-row, .form-group, .form-submit-row').forEach(el => {
      el.style.display = 'none';
    });
    if (successState) successState.style.display = 'block';
  });
}

function highlightEmpty(form) {
  ['firstName','lastName','email','org'].forEach(name => {
    const el = form[name];
    if (el && !el.value.trim()) {
      el.style.borderColor = 'rgba(180,60,60,0.4)';
      el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── SCROLL HEADER ─────────────────────────────────────

function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── MAIN BOOT ─────────────────────────────────────────

async function boot() {
  // Hide until populated (prevents flash of unpopulated content)
  document.body.style.visibility = 'hidden';

  initScrollHeader();
  initForm();

  const nicheKey = getNicheFromPath();

  // If no niche in URL, render the master default page
  if (!nicheKey) {
    renderDefault(null);
    return;
  }

  try {
    // Fetch the central data file
    // Works in both dev (Vite) and production (Vercel/GitHub Pages)
    const res = await fetch('/niches.json');

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const nicheData = json.niches?.[nicheKey];

    if (nicheData) {
      renderNiche(nicheData);
    } else {
      renderDefault(nicheKey);
    }

  } catch (err) {
    console.error('[Sindarity Router] Failed to load niches.json:', err);
    renderDefault(nicheKey);
  }
}

// Boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
