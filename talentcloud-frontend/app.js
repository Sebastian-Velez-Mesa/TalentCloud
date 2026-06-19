/**
 * TalentCloud v1.1 - Interactive Frontend Logic
 * Author: Sebastián Vélez Mesa | 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initFaqAccordion();
  initMatchSimulator();
  initLeadForm();
});

/**
 * 1. Navbar Scroll Effect
 * Adds backdrop shadow and compact layout on page scroll.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * 2. FAQ Accordion Control
 * Controls smooth open/close expansion transitions for FAQs.
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    const answerContainer = item.querySelector('.faq-answer');

    if (!questionButton || !answerContainer) return;

    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other active items first
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answerContainer.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        // Calculate container height dynamically for smooth rendering
        answerContainer.style.maxHeight = answerContainer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 3. Interactive Match Simulator
 * Simulates analyzing a resume against a selected vacancy.
 */
function initMatchSimulator() {
  const vacancyOptions = document.querySelectorAll('.vacancy-option');
  const dragArea = document.getElementById('sim-drag-area');
  const loaderOverlay = document.getElementById('sim-loader');
  const loaderText = document.getElementById('sim-loader-text');
  const resultOverlay = document.getElementById('sim-result');
  const resetBtn = document.getElementById('btn-reset-simulator');

  // SVG Dial Elements
  const dialProgress = document.getElementById('dial-progress');
  const dialScoreText = document.getElementById('dial-score-value');
  const matchCandidateText = document.getElementById('result-candidate-name');
  const matchTitleText = document.getElementById('result-match-title');
  const skillsContainer = document.getElementById('result-skills-container');

  if (!dragArea || !loaderOverlay || !resultOverlay) return;

  // Vacancy Data
  const vacanciesData = {
    backend: {
      candidateName: "Carlos Mendoza",
      score: 87,
      label: "Excelente Afinidad",
      skills: ["Java 17", "Spring Boot", "MySQL", "Docker", "REST APIs"]
    },
    frontend: {
      candidateName: "Sofía Moreno",
      score: 94,
      label: "Match Excepcional",
      skills: ["React.js", "TypeScript", "CSS Vanilla", "Vite", "Web Performance"]
    },
    data: {
      candidateName: "Felipe Gaviria",
      score: 79,
      label: "Buen Match Relacional",
      skills: ["Python", "Pandas", "MySQL", "Docker", "Scikit-Learn"]
    }
  };

  let selectedVacancy = 'backend';

  // 1. Selector vacancy handler
  vacancyOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active from all options
      vacancyOptions.forEach(opt => opt.classList.remove('active'));
      // Add active to current
      option.classList.add('active');
      selectedVacancy = option.getAttribute('data-vacancy');
    });
  });

  // 2. Click or Drag trigger simulation
  dragArea.addEventListener('click', startSimulation);

  // Fictitious drag and drop visual response
  dragArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragArea.style.borderColor = 'var(--accent-cyan)';
    dragArea.style.background = 'rgba(var(--accent-cyan-rgb), 0.05)';
  });

  dragArea.addEventListener('dragleave', () => {
    dragArea.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    dragArea.style.background = 'rgba(255, 255, 255, 0.02)';
  });

  dragArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragArea.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    dragArea.style.background = 'rgba(255, 255, 255, 0.02)';
    startSimulation();
  });

  // Reset simulator
  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering dragArea click
    resultOverlay.classList.remove('active');
    // Reset SVG offset
    if (dialProgress) dialProgress.style.strokeDashoffset = '314';
  });

  function startSimulation() {
    // Prevent starting if already displaying results
    if (resultOverlay.classList.contains('active') || loaderOverlay.classList.contains('active')) return;

    loaderOverlay.classList.add('active');
    
    // Animate loader text stages
    const stages = [
      "Leyendo PDF de Currículum...",
      "Extrayendo competencias y experiencia...",
      "Calculando score de coincidencia relacional...",
      "Normalizando datos en base de datos..."
    ];

    let currentStage = 0;
    loaderText.innerText = stages[0];

    const stageInterval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        loaderText.innerText = stages[currentStage];
      }
    }, 450);

    setTimeout(() => {
      clearInterval(stageInterval);
      loaderOverlay.classList.remove('active');
      showResults();
    }, 2000);
  }

  function showResults() {
    const data = vacanciesData[selectedVacancy];
    if (!data) return;

    // Fill content
    matchCandidateText.innerText = `${data.candidateName} (CV_Importado.pdf)`;
    matchTitleText.innerText = data.label;
    
    // Custom color classes for text
    if (data.score >= 90) {
      matchTitleText.style.color = 'var(--accent-cyan)';
    } else if (data.score >= 80) {
      matchTitleText.style.color = 'var(--accent-blue)';
    } else {
      matchTitleText.style.color = 'var(--accent-gold)';
    }

    // Populate skills tags
    skillsContainer.innerHTML = '';
    data.skills.forEach(skill => {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.innerText = skill;
      skillsContainer.appendChild(span);
    });

    resultOverlay.classList.add('active');

    // Trigger SVG dial animation
    // Circle circumference = 2 * PI * r = 2 * 3.14159 * 50 = 314
    setTimeout(() => {
      const percentage = data.score / 100;
      const offset = 314 - (percentage * 314);
      if (dialProgress) dialProgress.style.strokeDashoffset = offset;

      // Count up score number animation
      let count = 0;
      const duration = 1200; // ms
      const stepTime = Math.abs(Math.floor(duration / data.score));
      const timer = setInterval(() => {
        count++;
        if (dialScoreText) dialScoreText.innerText = count + '%';
        if (count >= data.score) {
          clearInterval(timer);
        }
      }, stepTime);
    }, 100);
  }
}

/**
 * 4. Lead Form Validation
 * Prevents default submits, validates entries, and triggers a clean CSS success state.
 */
function initLeadForm() {
  const form = document.getElementById('lead-capture-form');
  const formContent = document.getElementById('form-inputs-container');
  const successMessage = document.getElementById('form-success-container');
  const submitBtn = document.getElementById('btn-submit-lead');

  if (!form || !formContent || !successMessage || !submitBtn) return;

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('lead-name');
    const emailInput = document.getElementById('lead-email');

    let isValid = true;

    // Reset error states
    document.querySelectorAll('.form-error').forEach(err => err.style.display = 'none');
    if (nameInput) nameInput.style.borderColor = 'var(--border-color)';
    if (emailInput) emailInput.style.borderColor = 'var(--border-color)';

    // Validate Name
    if (nameInput && nameInput.value.trim() === '') {
      const error = nameInput.parentElement.querySelector('.form-error');
      if (error) error.style.display = 'block';
      nameInput.style.borderColor = '#ef4444';
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && (!emailRegex.test(emailInput.value.trim()))) {
      const error = emailInput.parentElement.querySelector('.form-error');
      if (error) error.style.display = 'block';
      emailInput.style.borderColor = '#ef4444';
      isValid = false;
    }

    if (isValid) {
      // Simulate API submit delay
      submitBtn.innerText = "Procesando...";
      submitBtn.disabled = true;

      setTimeout(() => {
        formContent.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Custom greeting
        const successUser = document.getElementById('success-user-name');
        if (successUser && nameInput) {
          successUser.innerText = nameInput.value.trim();
        }
      }, 1000);
    }
  });
}
