/**
 * TalentCloud v1.1 - Interactive Frontend Logic
 * Handles: Navbar scroll, FAQ accordion, Match simulator, Lead form, Scroll animations
 * Author: Sebastián Vélez Mesa | 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollAnimations();
  initFaqAccordion();
  initMatchSimulator();
  initLeadForm();
});

/* ========================================
   1. NAVBAR SCROLL EFFECT
   ======================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('bg-black/80', 'shadow-2xl', 'shadow-black/40');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.remove('bg-black/80', 'shadow-2xl', 'shadow-black/40');
      navbar.classList.add('bg-transparent');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check
}

/* ========================================
   2. SCROLL-TRIGGERED ANIMATIONS
   ======================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ========================================
   3. FAQ ACCORDION
   ======================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-answer-panel');
    const chevron = item.querySelector('.faq-chevron');

    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherPanel = other.querySelector('.faq-answer-panel');
          const otherChevron = other.querySelector('.faq-chevron');
          if (otherPanel) otherPanel.style.maxHeight = '0px';
          if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = '0px';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ========================================
   4. INTERACTIVE MATCH SIMULATOR
   ======================================== */
function initMatchSimulator() {
  const vacancyOptions = document.querySelectorAll('.vacancy-option');
  const dragArea = document.getElementById('sim-drag-area');
  const loaderOverlay = document.getElementById('sim-loader');
  const loaderText = document.getElementById('sim-loader-text');
  const resultOverlay = document.getElementById('sim-result');
  const resetBtn = document.getElementById('btn-reset-simulator');
  const dialArc = document.getElementById('dial-arc');
  const dialScoreText = document.getElementById('dial-score-value');
  const matchTitleText = document.getElementById('result-match-title');
  const matchCandidateText = document.getElementById('result-candidate-name');
  const skillsContainer = document.getElementById('result-skills-container');

  if (!dragArea || !loaderOverlay || !resultOverlay) return;

  // Data per vacancy
  const vacanciesData = {
    backend: {
      candidateName: 'Carlos Mendoza',
      score: 87,
      label: 'Excelente Afinidad',
      skills: ['Java 17', 'Spring Boot', 'MySQL', 'Docker', 'REST APIs']
    },
    frontend: {
      candidateName: 'Sofía Moreno',
      score: 94,
      label: 'Match Excepcional',
      skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Performance']
    },
    data: {
      candidateName: 'Felipe Gaviria',
      score: 79,
      label: 'Buen Match Relacional',
      skills: ['Python', 'Pandas', 'MySQL', 'Docker', 'Scikit-Learn']
    }
  };

  let selectedVacancy = 'backend';

  // Vacancy selector
  vacancyOptions.forEach(option => {
    option.addEventListener('click', () => {
      vacancyOptions.forEach(o => o.classList.remove('active', 'border-blue-500/60', 'bg-blue-500/10'));
      vacancyOptions.forEach(o => o.classList.add('border-white/[0.06]', 'bg-white/[0.02]'));
      option.classList.add('active', 'border-blue-500/60', 'bg-blue-500/10');
      option.classList.remove('border-white/[0.06]', 'bg-white/[0.02]');
      selectedVacancy = option.getAttribute('data-vacancy');
    });
  });

  // Click to simulate
  dragArea.addEventListener('click', startSimulation);

  // Visual drag response (fictitious)
  dragArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragArea.classList.add('border-cyan-400/60');
  });
  dragArea.addEventListener('dragleave', () => {
    dragArea.classList.remove('border-cyan-400/60');
  });
  dragArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragArea.classList.remove('border-cyan-400/60');
    startSimulation();
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resultOverlay.classList.remove('active');
      if (dialArc) dialArc.style.strokeDashoffset = '314';
      if (dialScoreText) dialScoreText.textContent = '0%';
    });
  }

  function startSimulation() {
    if (resultOverlay.classList.contains('active') || loaderOverlay.classList.contains('active')) return;

    loaderOverlay.classList.add('active');

    const stages = [
      'Leyendo PDF del Currículum...',
      'Extrayendo competencias técnicas...',
      'Calculando score de coincidencia...',
      'Normalizando en base de datos...'
    ];

    let idx = 0;
    if (loaderText) loaderText.textContent = stages[0];

    const interval = setInterval(() => {
      idx++;
      if (idx < stages.length && loaderText) loaderText.textContent = stages[idx];
    }, 420);

    setTimeout(() => {
      clearInterval(interval);
      loaderOverlay.classList.remove('active');
      showResults();
    }, 2000);
  }

  function showResults() {
    const data = vacanciesData[selectedVacancy];
    if (!data) return;

    if (matchCandidateText) matchCandidateText.textContent = `${data.candidateName} (CV_Importado.pdf)`;
    if (matchTitleText) matchTitleText.textContent = data.label;

    // Color based on score
    if (matchTitleText) {
      matchTitleText.className = 'text-lg font-bold mb-1';
      if (data.score >= 90) matchTitleText.classList.add('text-cyan-400');
      else if (data.score >= 80) matchTitleText.classList.add('text-blue-400');
      else matchTitleText.classList.add('text-amber-400');
    }

    // Skills
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      data.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'text-xs font-semibold px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300';
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
      });
    }

    resultOverlay.classList.add('active');

    // Animate dial
    setTimeout(() => {
      const pct = data.score / 100;
      const offset = 314 - (pct * 314);
      if (dialArc) dialArc.style.strokeDashoffset = offset;

      // Count up
      let count = 0;
      const step = Math.max(Math.floor(1100 / data.score), 8);
      const counter = setInterval(() => {
        count++;
        if (dialScoreText) dialScoreText.textContent = count + '%';
        if (count >= data.score) clearInterval(counter);
      }, step);
    }, 80);
  }
}

/* ========================================
   5. LEAD FORM VALIDATION
   ======================================== */
function initLeadForm() {
  const submitBtn = document.getElementById('btn-submit-lead');
  const formContent = document.getElementById('form-inputs-container');
  const successMsg = document.getElementById('form-success-container');

  if (!submitBtn || !formContent || !successMsg) return;

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('lead-name');
    const emailInput = document.getElementById('lead-email');
    let valid = true;

    // Reset errors
    document.querySelectorAll('.field-error').forEach(el => el.classList.add('hidden'));
    if (nameInput) nameInput.classList.remove('border-red-500');
    if (emailInput) emailInput.classList.remove('border-red-500');

    // Name check
    if (nameInput && nameInput.value.trim() === '') {
      const err = nameInput.closest('.form-group')?.querySelector('.field-error');
      if (err) err.classList.remove('hidden');
      nameInput.classList.add('border-red-500');
      valid = false;
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value.trim())) {
      const err = emailInput.closest('.form-group')?.querySelector('.field-error');
      if (err) err.classList.remove('hidden');
      emailInput.classList.add('border-red-500');
      valid = false;
    }

    if (valid) {
      submitBtn.textContent = 'Procesando...';
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-60', 'cursor-not-allowed');

      // Real API call
      fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nameInput.value.trim(),
          email: emailInput.value.trim(),
          password_hash: 'lead_password_123', // Dummy password for lead
          rol: 'Candidato'
        })
      })
      .then(res => res.json())
      .then(data => {
        formContent.style.display = 'none';
        successMsg.style.display = 'block';
        const userName = document.getElementById('success-user-name');
        if (userName && nameInput) userName.textContent = nameInput.value.trim();
      })
      .catch(err => {
        console.error('Error al registrar lead:', err);
        submitBtn.textContent = 'Error. Intenta de nuevo.';
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
      });
    }
  });
}
