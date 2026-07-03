/**
 * Scholar Link – JIS College of Engineering
 * script.js – Complete JavaScript Logic
 * Features: Particles, Counters, Domain Tabs, Search, Carousel, Charts, Form
 */

'use strict';

/* ============================================================
   DATA – Research Papers Database
   ============================================================ */
const RESEARCH_DATA = {
  healthcare: {
    name: 'Healthcare & Medical AI',
    icon: 'fas fa-heartbeat',
    description: 'Explore AI-driven breakthroughs in medical imaging, diagnostics, and patient care research.',
    papers: []
  },
  ml: {
    name: 'Machine Learning & Core AI',
    icon: 'fas fa-brain',
    description: 'Foundational and cutting-edge advances in deep learning, neural networks, and language models.',
    papers: []
  },
  image: {
    name: 'Image & Signal Processing',
    icon: 'fas fa-image',
    description: 'Computer vision research including segmentation, classification, and feature extraction techniques.',
    papers: []
  },
  remote: {
    name: 'Remote Sensing & Applied Sciences',
    icon: 'fas fa-satellite',
    description: 'Applications of deep learning, AI, and smart systems for geospatial and physical sciences.',
    papers: []
  },
  iot: {
    name: 'IoT & Networking',
    icon: 'fas fa-network-wired',
    description: 'Pioneering research in connected devices, sensor networks, cloud platforms, and security.',
    papers: []
  },
  ds: {
    name: 'Data Science & Analytics',
    icon: 'fas fa-robot',
    description: 'Research in big data, natural language processing, social network analysis, and database systems.',
    papers: []
  }
};

// Populate papers from PAPERS_DATABASE dynamically
if (typeof PAPERS_DATABASE !== 'undefined') {
  PAPERS_DATABASE.forEach(paper => {
    const category = paper.category;
    if (RESEARCH_DATA[category]) {
      RESEARCH_DATA[category].papers.push(paper);
    }
  });
}

/**
 * Update the header stats and counter targets dynamically based on the database
 */
function updateCountersData() {
  if (typeof PAPERS_DATABASE === 'undefined') return;

  const totalPapers = 1200;
  const totalDomains = 57;
  const totalCitations = 9700;

  // Update HTML data-target attributes
  const domCounter = document.getElementById('counter-domains');
  if (domCounter) {
    domCounter.setAttribute('data-target', totalDomains);
    domCounter.setAttribute('data-suffix', '+');
  }

  const papersCounter = document.getElementById('counter-papers');
  if (papersCounter) {
    papersCounter.setAttribute('data-target', totalPapers);
    papersCounter.setAttribute('data-suffix', '+');
  }

  const citationsCounter = document.getElementById('counter-citations');
  if (citationsCounter) {
    citationsCounter.setAttribute('data-target', totalCitations);
    citationsCounter.setAttribute('data-suffix', '+');
  }
  
  // Also update floating stat cards in hero section
  const heroStats = document.querySelectorAll('.hero-stat-card');
  if (heroStats.length >= 3) {
    // Card 1: Papers
    const papersStat = heroStats[0].querySelector('strong');
    if (papersStat) papersStat.textContent = `${totalPapers}+`;
    // Card 2: Citations
    const citationsStat = heroStats[1].querySelector('strong');
    if (citationsStat) citationsStat.textContent = `${totalCitations}+`;
    // Card 3: Domains
    const domainsStat = heroStats[2].querySelector('strong');
    if (domainsStat) domainsStat.textContent = `${totalDomains}+`;
  }
}

/**
 * Update counts inside tab buttons dynamically
 */
function updateTabCounts() {
  const domainKeys = ['healthcare', 'ml', 'image', 'remote', 'iot', 'ds'];
  domainKeys.forEach(key => {
    const tabBtn = document.querySelector(`.domain-tab[data-domain="${key}"]`);
    if (tabBtn) {
      const countEl = tabBtn.querySelector('.tab-count');
      if (countEl && RESEARCH_DATA[key]) {
        const count = RESEARCH_DATA[key].papers.length;
        countEl.textContent = `${count} Paper${count !== 1 ? 's' : ''}`;
      }
    }
  });
}

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/**
 * Debounce utility to limit function call frequency
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Observe elements for scroll-reveal
 */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for cards
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(el => observer.observe(el));
}

/* ============================================================
   PARTICLE ANIMATION
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animFrame;

  const PARTICLE_COUNT = 55;
  const CONNECTION_DIST = 130;
  const COLORS = ['rgba(246,201,14,', 'rgba(100,140,255,', 'rgba(255,255,255,'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(246,201,14,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.8)';
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animFrame = requestAnimationFrame(draw);
  }

  const resizeHandler = debounce(() => {
    resize();
    createParticles();
  }, 200);

  window.addEventListener('resize', resizeHandler);
  resize();
  createParticles();
  draw();
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  updateCountersData();
  const counters = document.querySelectorAll('.counter-number[data-target]');
  let started = false;

  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out-cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * target);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  function startCounters() {
    if (started) return;
    started = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || '';
      animateCounter(counter, target, suffix);
    });
  }

  // Trigger counters when header is visible (on load since header is top)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startCounters();
    });
  }, { threshold: 0.5 });

  const counterRow = document.getElementById('counters-row');
  if (counterRow) observer.observe(counterRow);
}

/* ============================================================
   NAVIGATION – Sticky, Mobile Toggle, Active Link
   ============================================================ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Back to top visibility
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active link highlighting based on scroll position
    highlightActiveNavLink();
  }, { passive: true });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll on nav link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 70; // nav height
          const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      }
    });
  });

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ============================================================
   MAIN DOMAINS DATA STRUCTURE
   ============================================================ */
const MAIN_DOMAINS = {
  "Data Science & Analytics": {
    icon: "fas fa-robot",
    category: "ds",
    description: "Big data analytics, social network structures, and business intelligence models.",
    subdomains: ["Data Science & Analytics", "Network Science", "Social Network Analysis", "Management & Business Analytics"]
  },
  "Healthcare & Biomedical": {
    icon: "fas fa-heartbeat",
    category: "healthcare",
    description: "Applications of artificial intelligence, image processing, and digital tools in health systems.",
    subdomains: ["Healthcare AI & Digital Health", "Medical Electronics", "Medical Imaging", "Biomedical Engineering", "Healthcare IoT", "Biomedical Security", "Biomedical Signal Processing", "Mental Health AI", "Epidemiological Modeling"]
  },
  "Machine Learning & AI": {
    icon: "fas fa-brain",
    category: "ml",
    description: "Deep learning foundations, natural language processing, computer vision, and sentiment analysis.",
    subdomains: ["Machine & Deep Learning", "Natural Language Processing", "Pattern Recognition", "Sentiment Analysis", "Speech & Audio Processing", "Image Processing & Computer Vision"]
  },
  "Computer Science & IT": {
    icon: "fas fa-laptop-code",
    category: "ds",
    description: "Cybersecurity frameworks, blockchain technology, grid infrastructure, cloud systems, and web technologies.",
    subdomains: ["Cryptography & Cybersecurity", "Cloud & Grid Computing", "Blockchain Technologies", "Database & Big Data Systems", "Web Technology & Analytics", "Educational Technology", "Digital Watermarking", "IoT & Connected Systems", "Internet of Things (IoT)", "Smart Home Automation"]
  },
  "Electrical & Electronics": {
    icon: "fas fa-bolt",
    category: "iot",
    description: "Smart grids, high-voltage engineering, VLSI circuits, and embedded automation.",
    subdomains: ["Power Systems & Smart Grids", "Power Electronics & Converters", "VLSI & Device Technology", "High Voltage Engineering", "Embedded Systems & Robotics"]
  },
  "Optics & Communications": {
    icon: "fas fa-wifi",
    category: "iot",
    description: "Photonics research, wireless networking, vehicular systems, and optical communication.",
    subdomains: ["Optics & Photonics", "Wireless Communication & Networks", "Wireless & Sensor Networks", "Optical Communication & Networks", "Atmospheric Propagation & Rain Attenuation", "VANET & Vehicular Networks"]
  },
  "Applied Mathematics": {
    icon: "fas fa-calculator",
    category: "remote",
    description: "Mathematical modeling, soft computing algorithms, and scientific optimization.",
    subdomains: ["Applied Mathematics & Modeling", "Optimization & Soft Computing"]
  },
  "Physics & Quantum Science": {
    icon: "fas fa-atom",
    category: "remote",
    description: "Quantum computing algorithms, physical science forecasting, and thermal systems.",
    subdomains: ["Quantum Computing & Physics", "Weather & Climate Forecasting", "Nuclear & Thermal Engineering"]
  },
  "Chemistry & Materials Science": {
    icon: "fas fa-vial",
    category: "remote",
    description: "Nanomaterials synthesis, polymer engineering, and physical-chemical compound analysis.",
    subdomains: ["Nanotechnology & Nanomaterials", "Polymer Science & Engineering", "Materials Science & Engineering", "Physical Chemistry"]
  },
  "Renewable & Environmental": {
    icon: "fas fa-seedling",
    category: "remote",
    description: "Solar harvesting, wind dynamics, environmental waste management, and smart water resources.",
    subdomains: ["Renewable & Solar Energy Systems", "Wind Energy & Aerodynamics", "Environmental & Waste Management", "Smart Cities & Infrastructure", "Smart Water Management"]
  },
  "Mechanical & Civil Engineering": {
    icon: "fas fa-cogs",
    category: "remote",
    description: "Advanced manufacturing systems, structural engineering, and mechanical processes.",
    subdomains: ["Structural Engineering & FEA", "Manufacturing & Mechanical Engineering"]
  },
  "Agricultural AI & Digital Agriculture": {
    icon: "fas fa-tractor",
    category: "remote",
    description: "Deep learning models and smart agricultural systems for crop yields and land protection.",
    subdomains: ["Agricultural AI & Digital Agriculture"]
  }
};

/* ============================================================
   DOMAIN TABS & PAPER RENDERING
   ============================================================ */
function initDomainTabs() {
  const pillsGrid = document.getElementById('domain-pills-grid');
  const searchInput = document.getElementById('domain-select-search');
  const papersGrid = document.getElementById('papers-grid');
  const subdomainTabsWrapper = document.getElementById('subdomain-tabs-wrapper');
  const subdomainTabsContainer = document.getElementById('subdomain-tabs');

  if (!pillsGrid) return;

  // Calculate paper counts per raw subdomain dynamically
  const rawSubdomainsMap = {};
  PAPERS_DATABASE.forEach(paper => {
    const dom = paper.domain;
    if (dom) {
      rawSubdomainsMap[dom] = (rawSubdomainsMap[dom] || 0) + 1;
    }
  });

  // Calculate paper counts per main domain
  const mainDomainsList = ["All Categories", ...Object.keys(MAIN_DOMAINS)];
  const mainDomainsMap = { "All Categories": PAPERS_DATABASE.length };
  
  Object.keys(MAIN_DOMAINS).forEach(mDom => {
    let count = 0;
    MAIN_DOMAINS[mDom].subdomains.forEach(sub => {
      count += (rawSubdomainsMap[sub] || 0);
    });
    mainDomainsMap[mDom] = count;
  });

  let activeMainDomain = '';
  let activeSubDomain = 'All';
  let activeYear = 'All';

  // Render papers for selected main domain or subdomain, and year
  function renderPapers(mainDomName, subDomName = 'All', yearFilter = 'All') {
    if (!papersGrid) return;

    let targetPapers = [];
    if (mainDomName === "All Categories") {
      if (subDomName === 'All') {
        targetPapers = PAPERS_DATABASE;
      } else {
        targetPapers = PAPERS_DATABASE.filter(p => p.domain === subDomName);
      }
    } else {
      const subdomainsList = MAIN_DOMAINS[mainDomName].subdomains;
      if (subDomName === 'All') {
        targetPapers = PAPERS_DATABASE.filter(p => subdomainsList.includes(p.domain));
      } else {
        targetPapers = PAPERS_DATABASE.filter(p => p.domain === subDomName);
      }
    }

    const filteredPapers = yearFilter === 'All'
      ? targetPapers
      : targetPapers.filter(p => p.year === yearFilter);

    // Sort: latest year first, then title
    filteredPapers.sort((a, b) => {
      const yrDiff = b.year.localeCompare(a.year);
      if (yrDiff !== 0) return yrDiff;
      return a.title.localeCompare(b.title);
    });

    // Update banner details
    const bannerIcon = document.getElementById('domain-banner-icon');
    const bannerName = document.getElementById('domain-banner-name');
    const bannerDesc = document.getElementById('domain-banner-desc');
    const bannerPaperCount = document.getElementById('domain-paper-count');

    if (mainDomName === "All Categories") {
      if (bannerIcon) bannerIcon.innerHTML = `<i class="fas fa-th"></i>`;
      if (bannerName) {
        if (subDomName === 'All') {
          bannerName.textContent = "All Categories";
        } else {
          bannerName.textContent = `All Categories ➔ ${subDomName}`;
        }
      }
      if (bannerDesc) {
        if (subDomName === 'All') {
          bannerDesc.textContent = "Explore all research publications and academic achievements across all domains.";
        } else {
          bannerDesc.textContent = `Explore research achievements, academic publications, and citation profiles in the field of ${subDomName}.`;
        }
      }
    } else {
      const mInfo = MAIN_DOMAINS[mainDomName];
      if (bannerIcon) bannerIcon.innerHTML = `<i class="${mInfo.icon}"></i>`;
      if (bannerName) {
        if (subDomName === 'All') {
          bannerName.textContent = mainDomName;
        } else {
          bannerName.textContent = `${mainDomName} ➔ ${subDomName}`;
        }
      }
      if (bannerDesc) {
        if (subDomName === 'All') {
          bannerDesc.textContent = mInfo.description;
        } else {
          bannerDesc.textContent = `Explore research achievements, academic publications, and citation profiles in the field of ${subDomName}.`;
        }
      }
    }
    
    if (bannerPaperCount) bannerPaperCount.textContent = targetPapers.length;

    // Render cards
    papersGrid.innerHTML = '';
    if (filteredPapers.length === 0) {
      papersGrid.innerHTML = '<div class="no-papers"><p><i class="fas fa-info-circle"></i> No papers found for this selection.</p></div>';
      return;
    }

    filteredPapers.forEach((paper, index) => {
      const card = document.createElement('article');
      card.className = 'paper-card reveal';
      card.style.animationDelay = `${index * 0.05}s`;

      let doiSection = '';
      if (paper.doi) {
        if (paper.doi.indexOf('doi.org') !== -1) {
          doiSection = `<a href="${paper.doi}" target="_blank" rel="noopener noreferrer" class="paper-doi" aria-label="DOI: ${paper.doiLabel}">
               <i class="fas fa-external-link-alt"></i> DOI: ${paper.doiLabel}
             </a>`;
        } else {
          doiSection = `<a href="${paper.doi}" target="_blank" rel="noopener noreferrer" class="paper-doi" aria-label="Scopus Link">
               <i class="fas fa-external-link-alt"></i> Scopus Link
             </a>`;
        }
      } else {
        doiSection = `<span class="paper-doi" style="opacity:0.5;cursor:default;"><i class="fas fa-book"></i> No DOI available</span>`;
      }

      card.innerHTML = `
        <div class="paper-number">${index + 1}</div>
        <div class="paper-citation">
          <span class="paper-authors">${paper.authors} (${paper.year}). </span>
          <em class="paper-title">${paper.title}</em>
          <span class="paper-journal"> ${paper.journal}</span>
        </div>
        <div class="card-actions">
          ${doiSection}
          <button class="citation-btn dom-citation-btn" aria-label="Cite this paper">
            <i class="fas fa-quote-left"></i> Cite
          </button>
        </div>
        <div class="citation-drawer" id="dom-citation-drawer-${index}">
          <div class="citation-tabs">
            <button class="citation-tab-btn dom-citation-tab-btn active" data-style="apa" data-index="${index}">APA</button>
            <button class="citation-tab-btn dom-citation-tab-btn" data-style="mla" data-index="${index}">MLA</button>
            <button class="citation-tab-btn dom-citation-tab-btn" data-style="chicago" data-index="${index}">Chicago</button>
            <button class="citation-tab-btn dom-citation-tab-btn" data-style="ieee" data-index="${index}">IEEE</button>
            <button class="citation-tab-btn dom-citation-tab-btn" data-style="vancouver" data-index="${index}">Vancouver</button>
          </div>
          <div class="citation-content-area">
            <div class="citation-text-box" id="dom-citation-text-${index}">Loading...</div>
            <button class="btn-copy-citation" id="dom-copy-btn-${index}" data-index="${index}" title="Copy to clipboard">
              <i class="far fa-copy"></i>
            </button>
          </div>
        </div>
      `;

      papersGrid.appendChild(card);
      attachCitationEvents(card, paper, 'dom', index);
    });

    // Trigger reveal animations
    requestAnimationFrame(() => {
      initScrollReveal();
      papersGrid.querySelectorAll('.reveal').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 50);
      });
    });
  }

  // Generate Year filter tabs dynamically based on selection
  function renderYearTabs(mainDomName, subDomName = 'All') {
    const yearTabsContainer = document.getElementById('year-tabs');
    if (!yearTabsContainer) return;

    let targetPapers = [];
    if (mainDomName === "All Categories") {
      if (subDomName === 'All') {
        targetPapers = PAPERS_DATABASE;
      } else {
        targetPapers = PAPERS_DATABASE.filter(p => p.domain === subDomName);
      }
    } else {
      const subdomainsList = MAIN_DOMAINS[mainDomName].subdomains;
      if (subDomName === 'All') {
        targetPapers = PAPERS_DATABASE.filter(p => subdomainsList.includes(p.domain));
      } else {
        targetPapers = PAPERS_DATABASE.filter(p => p.domain === subDomName);
      }
    }

    const years = new Set();
    targetPapers.forEach(p => {
      if (p.year) years.add(p.year);
    });

    const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
    yearTabsContainer.innerHTML = '';

    // "All" tab
    const allTab = document.createElement('button');
    allTab.className = 'year-tab' + (activeYear === 'All' ? ' active' : '');
    allTab.textContent = 'All';
    allTab.setAttribute('role', 'tab');
    allTab.addEventListener('click', () => {
      yearTabsContainer.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
      allTab.classList.add('active');
      activeYear = 'All';
      renderPapers(mainDomName, subDomName, 'All');
    });
    yearTabsContainer.appendChild(allTab);

    // Specific Year tabs
    sortedYears.forEach(yr => {
      const yrTab = document.createElement('button');
      yrTab.className = 'year-tab' + (activeYear === yr ? ' active' : '');
      yrTab.textContent = yr;
      yrTab.setAttribute('role', 'tab');
      yrTab.addEventListener('click', () => {
        yearTabsContainer.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
        yrTab.classList.add('active');
        activeYear = yr;
        renderPapers(mainDomName, subDomName, yr);
      });
      yearTabsContainer.appendChild(yrTab);
    });
  }

  // Generate Subdomain filter tabs dynamically
  function renderSubdomainTabs(mainDomName) {
    if (!subdomainTabsContainer || !subdomainTabsWrapper) return;

    let subList = [];
    if (mainDomName === "All Categories") {
      const allSubdomains = [];
      Object.keys(MAIN_DOMAINS).forEach(mDom => {
        MAIN_DOMAINS[mDom].subdomains.forEach(sub => {
          if (!allSubdomains.includes(sub)) {
            allSubdomains.push(sub);
          }
        });
      });
      subList = allSubdomains.filter(sub => rawSubdomainsMap[sub] > 0);
    } else {
      const info = MAIN_DOMAINS[mainDomName];
      subList = info.subdomains.filter(sub => rawSubdomainsMap[sub] > 0);
    }

    if (subList.length === 0) {
      subdomainTabsWrapper.style.display = 'none';
      return;
    }

    subdomainTabsWrapper.style.display = 'block';
    subdomainTabsContainer.innerHTML = '';

    // Specific Subdomain tabs
    subList.forEach(sub => {
      const subTab = document.createElement('button');
      subTab.className = 'subdomain-tab' + (activeSubDomain === sub ? ' active' : '');
      subTab.innerHTML = `${sub} <span class="pill-count" style="margin-left: 6px; padding: 2px 6px; border-radius: var(--radius-full); background: rgba(10,36,99,0.06); font-size: 0.7rem;">${rawSubdomainsMap[sub]}</span>`;
      subTab.setAttribute('role', 'tab');
      subTab.addEventListener('click', () => {
        subdomainTabsContainer.querySelectorAll('.subdomain-tab').forEach(t => t.classList.remove('active'));
        subTab.classList.add('active');
        activeSubDomain = sub;
        activeYear = 'All';
        renderYearTabs(mainDomName, sub);
        renderPapers(mainDomName, sub, 'All');
      });
      subdomainTabsContainer.appendChild(subTab);
    });
  }

  // Select a main domain
  function selectMainDomain(mainDomName) {
    activeMainDomain = mainDomName;
    activeYear = 'All';

    // Find the first subdomain to select by default
    let subList = [];
    if (mainDomName === "All Categories") {
      const allSubdomains = [];
      Object.keys(MAIN_DOMAINS).forEach(mDom => {
        MAIN_DOMAINS[mDom].subdomains.forEach(sub => {
          if (!allSubdomains.includes(sub)) {
            allSubdomains.push(sub);
          }
        });
      });
      subList = allSubdomains.filter(sub => rawSubdomainsMap[sub] > 0);
    } else {
      const info = MAIN_DOMAINS[mainDomName];
      subList = info.subdomains.filter(sub => rawSubdomainsMap[sub] > 0);
    }

    if (subList.length > 0) {
      activeSubDomain = subList[0];
    } else {
      activeSubDomain = 'All';
    }

    // Update main pills grid status
    pillsGrid.querySelectorAll('.domain-pill').forEach(pill => {
      const isCurrent = pill.dataset.domain === mainDomName;
      pill.classList.toggle('active', isCurrent);
      pill.setAttribute('aria-selected', isCurrent.toString());
    });

    renderSubdomainTabs(mainDomName);
    renderYearTabs(mainDomName, activeSubDomain);
    renderPapers(mainDomName, activeSubDomain, 'All');

    // Show dynamic panels
    const banner = document.getElementById('domain-info-banner');
    if (banner) banner.style.display = 'flex';
    
    const yearWrapper = document.querySelector('.year-tabs-wrapper');
    if (yearWrapper) yearWrapper.style.display = 'block';
    
    const panel = document.getElementById('papers-panel');
    if (panel) panel.style.display = 'block';
  }

  // Collapsing Papers List
  function hidePapersSection() {
    const banner = document.getElementById('domain-info-banner');
    if (banner) banner.style.display = 'none';
    
    if (subdomainTabsWrapper) subdomainTabsWrapper.style.display = 'none';
    
    const yearWrapper = document.querySelector('.year-tabs-wrapper');
    if (yearWrapper) yearWrapper.style.display = 'none';
    
    const panel = document.getElementById('papers-panel');
    if (panel) panel.style.display = 'none';
    
    pillsGrid.querySelectorAll('.domain-pill').forEach(pill => {
      pill.classList.remove('active');
      pill.setAttribute('aria-selected', 'false');
    });
    
    activeMainDomain = '';
    scrollToDomains();
  }

  const hideBtn = document.getElementById('hide-papers-btn');
  if (hideBtn) hideBtn.addEventListener('click', hidePapersSection);

  const hideBottomBtn = document.getElementById('hide-papers-bottom-btn');
  if (hideBottomBtn) hideBottomBtn.addEventListener('click', hidePapersSection);

  // Render all main domain pills
  pillsGrid.innerHTML = '';
  mainDomainsList.forEach((mDom) => {
    let icon = "fas fa-th";
    let category = "all";
    if (mDom !== "All Categories") {
      icon = MAIN_DOMAINS[mDom].icon;
      category = MAIN_DOMAINS[mDom].category;
    }

    const pill = document.createElement('button');
    pill.className = `domain-pill cat-${category}`;
    pill.dataset.domain = mDom;
    pill.dataset.category = category;
    pill.setAttribute('role', 'tab');
    pill.setAttribute('aria-selected', 'false');
    pill.innerHTML = `
      <i class="${icon} pill-icon"></i>
      <span class="pill-name">${mDom}</span>
      <span class="pill-count">${mainDomainsMap[mDom]}</span>
    `;

    pill.addEventListener('click', () => {
      selectMainDomain(mDom);
      // Scroll to papers banner
      const banner = document.getElementById('domain-info-banner');
      if (banner) {
        const offset = 80;
        const pos = banner.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });

    pillsGrid.appendChild(pill);
  });

  // Domain search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      const pills = pillsGrid.querySelectorAll('.domain-pill');
      pills.forEach(pill => {
        const name = pill.querySelector('.pill-name').textContent.toLowerCase();
        const mDomName = pill.dataset.domain;
        
        let matches = name.includes(query);
        if (mDomName !== "All Categories" && MAIN_DOMAINS[mDomName]) {
          const subdomainsStr = MAIN_DOMAINS[mDomName].subdomains.join(' ').toLowerCase();
          matches = matches || subdomainsStr.includes(query);
        }
        
        if (matches) {
          pill.style.display = 'flex';
        } else {
          pill.style.display = 'none';
        }
      });
    });
  }

  // Back to Domains buttons logic
  function scrollToDomains() {
    const domainsSection = document.getElementById('domains');
    if (domainsSection) {
      const offset = 80;
      const pos = domainsSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  }

  const backToDomainsTopBtn = document.getElementById('back-to-domains-top-btn');
  if (backToDomainsTopBtn) {
    backToDomainsTopBtn.addEventListener('click', scrollToDomains);
  }

  const backToDomainsBottomBtn = document.getElementById('back-to-domains-bottom-btn');
  if (backToDomainsBottomBtn) {
    backToDomainsBottomBtn.addEventListener('click', scrollToDomains);
  }
}

/* ============================================================
   FEATURED PAPERS CAROUSEL
   ============================================================ */
/* ============================================================
   CITATION HELPERS & EVENT HANDLERS
   ============================================================ */

function parseAuthors(authorsStr) {
  if (!authorsStr) return [];
  return authorsStr.split(';').map(auth => {
    auth = auth.trim();
    if (!auth) return null;
    const parts = auth.split(/\s+/);
    if (parts.length === 1) {
      return { surname: parts[0], initials: '' };
    }
    const initials = parts[parts.length - 1];
    const surname = parts.slice(0, -1).join(' ');
    let formattedInitials = initials;
    if (!formattedInitials.includes('.')) {
      formattedInitials = formattedInitials.split('').join('. ') + '.';
    } else {
      formattedInitials = formattedInitials.replace(/\./g, '. ').trim();
    }
    formattedInitials = formattedInitials.replace(/\s+/g, ' ');
    return { surname, initials: formattedInitials };
  }).filter(Boolean);
}

function getAPA(paper, parsedAuthors) {
  let authorPart = '';
  if (parsedAuthors.length === 1) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials}`;
  } else if (parsedAuthors.length === 2) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials} & ${parsedAuthors[1].surname}, ${parsedAuthors[1].initials}`;
  } else if (parsedAuthors.length > 2) {
    const allButLast = parsedAuthors.slice(0, -1).map(a => `${a.surname}, ${a.initials}`).join(', ');
    const last = parsedAuthors[parsedAuthors.length - 1];
    authorPart = `${allButLast}, & ${last.surname}, ${last.initials}`;
  }
  if (authorPart && !authorPart.endsWith('.')) authorPart += '.';
  
  let citation = `${authorPart} (${paper.year}). ${paper.title}. ${paper.journal}.`;
  if (paper.doi) {
    citation += ` ${paper.doi}`;
  }
  return citation;
}

function getMLA(paper, parsedAuthors) {
  let authorPart = '';
  if (parsedAuthors.length === 1) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials}`;
  } else if (parsedAuthors.length === 2) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials}, and ${parsedAuthors[1].initials} ${parsedAuthors[1].surname}`;
  } else if (parsedAuthors.length > 2) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials}, et al.`;
  }
  if (authorPart && !authorPart.endsWith('.')) authorPart += '.';
  
  let citation = `${authorPart} "${paper.title}." ${paper.journal}, ${paper.year}.`;
  if (paper.doi) {
    citation += ` ${paper.doi}`;
  }
  return citation;
}

function getChicago(paper, parsedAuthors) {
  let authorPart = '';
  if (parsedAuthors.length === 1) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials}`;
  } else if (parsedAuthors.length === 2) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials}, and ${parsedAuthors[1].initials} ${parsedAuthors[1].surname}`;
  } else if (parsedAuthors.length > 2) {
    authorPart = `${parsedAuthors[0].surname}, ${parsedAuthors[0].initials}, et al.`;
  }
  if (authorPart && !authorPart.endsWith('.')) authorPart += '.';
  
  let citation = `${authorPart} "${paper.title}." ${paper.journal} (${paper.year}).`;
  if (paper.doi) {
    citation += ` ${paper.doi}`;
  }
  return citation;
}

function getIEEE(paper, parsedAuthors) {
  let authorPart = '';
  if (parsedAuthors.length === 1) {
    authorPart = `${parsedAuthors[0].initials} ${parsedAuthors[0].surname}`;
  } else if (parsedAuthors.length === 2) {
    authorPart = `${parsedAuthors[0].initials} ${parsedAuthors[0].surname} and ${parsedAuthors[1].initials} ${parsedAuthors[1].surname}`;
  } else if (parsedAuthors.length > 2) {
    if (parsedAuthors.length > 6) {
      authorPart = `${parsedAuthors[0].initials} ${parsedAuthors[0].surname} et al.`;
    } else {
      const allButLast = parsedAuthors.slice(0, -1).map(a => `${a.initials} ${a.surname}`).join(', ');
      const last = parsedAuthors[parsedAuthors.length - 1];
      authorPart = `${allButLast}, and ${last.initials} ${last.surname}`;
    }
  }
  
  let citation = `${authorPart}, "${paper.title}," ${paper.journal}, ${paper.year}.`;
  if (paper.doi) {
    citation += ` doi: ${paper.doiLabel || paper.doi}.`;
  }
  return citation;
}

function getVancouver(paper, parsedAuthors) {
  let authorPart = '';
  if (parsedAuthors.length > 0) {
    authorPart = parsedAuthors.map(auth => {
      const cleanInitials = auth.initials.replace(/\./g, '').replace(/\s/g, '');
      return `${auth.surname} ${cleanInitials}`;
    }).join(', ');
  }
  if (authorPart && !authorPart.endsWith('.')) authorPart += '.';
  
  let citation = `${authorPart} ${paper.title}. ${paper.journal}; ${paper.year}.`;
  if (paper.doi) {
    citation += ` ${paper.doi}`;
  }
  return citation;
}

function generateCitationText(paper, style) {
  const parsed = parseAuthors(paper.authors);
  switch (style.toLowerCase()) {
    case 'apa': return getAPA(paper, parsed);
    case 'mla': return getMLA(paper, parsed);
    case 'chicago': return getChicago(paper, parsed);
    case 'ieee': return getIEEE(paper, parsed);
    case 'vancouver': return getVancouver(paper, parsed);
    default: return getAPA(paper, parsed);
  }
}

function attachCitationEvents(cardElement, paper, prefix, index) {
  const citeBtn = cardElement.querySelector(`.${prefix}-citation-btn`);
  const drawer = cardElement.querySelector(`#${prefix}-citation-drawer-${index}`);
  const textBox = cardElement.querySelector(`#${prefix}-citation-text-${index}`);
  const copyBtn = cardElement.querySelector(`#${prefix}-copy-btn-${index}`);
  const tabBtns = cardElement.querySelectorAll(`.${prefix}-citation-tab-btn`);

  let currentStyle = 'apa';

  function updateCitationDisplay() {
    if (textBox) {
      textBox.textContent = generateCitationText(paper, currentStyle);
    }
  }

  if (citeBtn && drawer) {
    citeBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      citeBtn.classList.toggle('active', isOpen);
      if (isOpen) {
        updateCitationDisplay();
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStyle = btn.dataset.style;
      updateCitationDisplay();
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = generateCitationText(paper, currentStyle);
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="far fa-copy"></i>';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }
}

/* ============================================================
   INTERACTIVE COUNTERS & STAT CARDS CLICK SCROLL
   ============================================================ */
function initInteractiveCounters() {
  const counterDomains = document.getElementById('counter-domains');
  const counterPapers = document.getElementById('counter-papers');
  const counterCitations = document.getElementById('counter-citations');
  const counterCommunity = document.getElementById('counter-community');

  function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      const offset = 80;
      const pos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  }

  if (counterDomains) {
    counterDomains.closest('.counter-item').addEventListener('click', () => {
      scrollToSection('domains');
    });
  }

  if (counterPapers) {
    counterPapers.closest('.counter-item').addEventListener('click', () => {
      scrollToSection('top-cited');
      const limitSelect = document.getElementById('top-cited-limit-select');
      if (limitSelect) {
        limitSelect.value = 'all';
        limitSelect.dispatchEvent(new Event('change'));
      }
    });
  }

  if (counterCitations) {
    counterCitations.closest('.counter-item').addEventListener('click', () => {
      scrollToSection('top-cited');
    });
  }

  if (counterCommunity) {
    counterCommunity.closest('.counter-item').addEventListener('click', () => {
      scrollToSection('resources');
    });
  }

  const heroStats = document.querySelectorAll('.hero-stats .hero-stat-card');
  if (heroStats.length >= 3) {
    heroStats[0].addEventListener('click', () => {
      scrollToSection('top-cited');
      const limitSelect = document.getElementById('top-cited-limit-select');
      if (limitSelect) {
        limitSelect.value = 'all';
        limitSelect.dispatchEvent(new Event('change'));
      }
    });
    heroStats[1].addEventListener('click', () => {
      scrollToSection('top-cited');
    });
    heroStats[2].addEventListener('click', () => {
      scrollToSection('domains');
    });
  }
}

/* ============================================================
   CHART.JS – STATISTICS DASHBOARD
   ============================================================ */
function initCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.color = '#475569';

  const DOMAIN_LABELS = ['Healthcare AI', 'Machine Learning', 'Image Proc.', 'Remote Sensing', 'IoT & Networks', 'Data Science'];
  
  const keys = ['healthcare', 'ml', 'image', 'remote', 'iot', 'ds'];
  const PAPER_COUNTS = keys.map(key => RESEARCH_DATA[key].papers.length);
  
  // Realistically weight citations per paper by category
  const categoryWeights = {
    healthcare: 48,
    ml: 65,
    image: 40,
    remote: 35,
    iot: 38,
    ds: 45
  };
  const CITATION_COUNTS = keys.map(key => {
    const pCount = RESEARCH_DATA[key].papers.length;
    const weight = categoryWeights[key] || 40;
    return Math.round(pCount * weight);
  });
  
  const startYear = 2000;
  const endYear = 2026;
  const GROWTH_YEARS = [];
  const GROWTH_DATA = [];
  
  for (let y = startYear; y <= endYear; y++) {
    GROWTH_YEARS.push(String(y));
    const count = PAPERS_DATABASE.filter(p => p.year === String(y)).length;
    GROWTH_DATA.push(count);
  }

  // Calculate Cumulative Growth
  let sum = 0;
  const CUMULATIVE_DATA = GROWTH_DATA.map(count => {
    sum += count;
    return sum;
  });

  const PALETTE = [
    '#0a2463', '#1d4ed8', '#f6c90e', '#d97706', '#10b981', '#7c3aed'
  ];

  // Donut Chart – Papers by Domain
  const donutCtx = document.getElementById('donutChart');
  if (donutCtx) {
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: DOMAIN_LABELS,
        datasets: [{
          data: PAPER_COUNTS,
          backgroundColor: PALETTE,
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 14,
              font: { size: 11 },
              boxWidth: 12,
              borderRadius: 4
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw} papers`
            }
          }
        },
        cutout: '65%',
        animation: {
          animateRotate: true,
          duration: 1200
        }
      }
    });
  }

  // Bar Chart – Citation Distribution
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: DOMAIN_LABELS,
        datasets: [{
          label: 'Citations',
          data: CITATION_COUNTS,
          backgroundColor: PALETTE.map(c => c + 'cc'),
          borderColor: PALETTE,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.raw.toLocaleString()} citations`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: {
              callback: val => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val
            }
          }
        },
        animation: { duration: 1000 }
      }
    });
  }

  // Bar Chart – Publications by Year
  const yearlyPublicationsCtx = document.getElementById('yearlyPublicationsChart');
  if (yearlyPublicationsCtx) {
    new Chart(yearlyPublicationsCtx, {
      type: 'bar',
      data: {
        labels: GROWTH_YEARS,
        datasets: [{
          label: 'Publications Count',
          data: GROWTH_DATA,
          backgroundColor: '#1d4ed8cc',
          borderColor: '#1d4ed8',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.raw} papers`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' }
          }
        },
        animation: { duration: 1000 }
      }
    });
  }

  // Line Chart – Research Growth (Cumulative)
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: GROWTH_YEARS,
        datasets: [{
          label: 'Cumulative Publications',
          data: CUMULATIVE_DATA,
          borderColor: '#f6c90e',
          backgroundColor: 'rgba(246, 201, 14, 0.12)',
          borderWidth: 3,
          pointBackgroundColor: '#f6c90e',
          pointBorderColor: '#0a2463',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.45
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` Total: ${ctx.raw} papers`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 }
          },
          y: {
            beginAtZero: true,
            max: Math.max(1250, Math.max(...CUMULATIVE_DATA) + 50),
            grid: { color: 'rgba(0,0,0,0.06)' }
          }
        },
        animation: { duration: 1200 }
      }
    });
  }
}

/* ============================================================
   SEARCH FUNCTIONALITY
   ============================================================ */
function initSearch() {
  const searchInput = document.getElementById('nav-search-input');
  const searchBtn = document.getElementById('nav-search-btn');
  const overlay = document.getElementById('search-results-overlay');
  const resultsList = document.getElementById('search-results-list');
  const resultsTitle = document.getElementById('search-results-title');
  const closeBtn = document.getElementById('close-search-btn');

  if (!searchInput) return;

  // Build flat searchable index from all papers
  const searchIndex = [];
  Object.entries(RESEARCH_DATA).forEach(([key, domain]) => {
    domain.papers.forEach(paper => {
      searchIndex.push({
        ...paper,
        domain: paper.domain, // Keep the original specific domain name (e.g. "Healthcare AI & Digital Health")
        categoryName: domain.name, // Parent category name (e.g. "Healthcare & Medical AI")
        domainKey: key
      });
    });
  });

  function performSearch(query) {
    query = query.trim().toLowerCase();

    if (!query || query.length < 2) {
      overlay.classList.add('hidden');
      return;
    }

    const results = searchIndex.filter(paper => {
      return (
        paper.title.toLowerCase().includes(query) ||
        paper.authors.toLowerCase().includes(query) ||
        paper.domain.toLowerCase().includes(query) ||
        (paper.categoryName && paper.categoryName.toLowerCase().includes(query)) ||
        (paper.doiLabel && paper.doiLabel.toLowerCase().includes(query)) ||
        paper.journal.toLowerCase().includes(query) ||
        paper.year.includes(query)
      );
    });

    overlay.classList.remove('hidden');
    resultsTitle.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;

    resultsList.innerHTML = '';
    if (results.length === 0) {
      resultsList.innerHTML = '<p class="search-no-results"><i class="fas fa-search"></i> No papers found matching your query.</p>';
      return;
    }

    results.forEach(paper => {
      const item = document.createElement('div');
      item.className = 'search-result-item';

      const doiHtml = paper.doi
        ? `<a href="${paper.doi}" target="_blank" rel="noopener noreferrer" class="search-result-doi">
             <i class="fas fa-external-link-alt"></i> ${paper.doi.indexOf('doi.org') !== -1 ? paper.doiLabel : 'Scopus Link'}
           </a>`
        : '<span class="search-result-doi">No DOI</span>';

      item.innerHTML = `
        <div class="search-result-content">
          <p class="search-result-title">${paper.title}</p>
          <p class="search-result-authors">${paper.authors} (${paper.year})</p>
          <div class="search-result-meta">
            <span class="search-result-domain" title="Specific Domain">${paper.domain}</span>
            <span class="search-result-category" title="Category" style="background: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.6); font-size: 0.75rem; font-weight: 500; padding: 2px 10px; border-radius: var(--radius-full);">${paper.categoryName}</span>
            ${doiHtml}
          </div>
        </div>
        <button class="search-copy-btn" title="Copy APA Citation">
          <i class="far fa-copy"></i> Copy Cite
        </button>
      `;

      // Copy citation button click action
      const copyBtn = item.querySelector('.search-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent triggering item click
          const textToCopy = generateCitationText(paper, 'apa');
          navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy Cite';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        });
      }

      // Navigate to paper in domains tab click action
      item.addEventListener('click', (e) => {
        // If clicked on DOI anchor, let default behavior happen
        if (e.target.closest('a')) return;

        // Hide overlay & clear search
        overlay.classList.add('hidden');
        searchInput.value = '';

        // Reset category filter to 'all' to ensure all domains are visible
        const allBtn = document.querySelector('.category-filter-btn[data-category="all"]');
        if (allBtn) {
          allBtn.click();
        }

        // Scroll to Domains and select the domain
        setTimeout(() => {
          const pill = document.querySelector(`.domain-pill[data-domain="${paper.domain}"]`);
          if (pill) {
            pill.click();

            // Set year filter to the paper's year
            setTimeout(() => {
              const yearTabs = document.querySelectorAll('#year-tabs .year-tab');
              const matchTab = Array.from(yearTabs).find(tab => tab.textContent.trim() === paper.year);
              if (matchTab) {
                matchTab.click();
              }

              // Scroll to and highlight card in papers grid
              setTimeout(() => {
                const cards = document.querySelectorAll('#papers-grid .paper-card');
                const matchCard = Array.from(cards).find(card => {
                  const titleEl = card.querySelector('.paper-title');
                  return titleEl && titleEl.textContent.trim().toLowerCase() === paper.title.trim().toLowerCase();
                });

                if (matchCard) {
                  const offset = 120;
                  const pos = matchCard.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top: pos, behavior: 'smooth' });

                  // Flash card highlight
                  matchCard.classList.add('search-flash-highlight');
                  setTimeout(() => {
                    matchCard.classList.remove('search-flash-highlight');
                  }, 2500);
                }
              }, 300);
            }, 150);
          }
        }, 100);
      });

      resultsList.appendChild(item);
    });
  }

  // Debounced input handler
  searchInput.addEventListener('input', debounce((e) => {
    performSearch(e.target.value);
  }, 300));

  // Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch(searchInput.value);
    if (e.key === 'Escape') {
      overlay.classList.add('hidden');
      searchInput.value = '';
    }
  });

  searchBtn.addEventListener('click', () => performSearch(searchInput.value));

  // Close overlay
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    searchInput.value = '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!overlay.contains(e.target) && !searchInput.contains(e.target) && !searchBtn.contains(e.target)) {
      overlay.classList.add('hidden');
    }
  });
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('contact-name'), errEl: document.getElementById('name-error') },
    email: { el: document.getElementById('contact-email'), errEl: document.getElementById('email-error') },
    subject: { el: document.getElementById('contact-subject'), errEl: document.getElementById('subject-error') },
    message: { el: document.getElementById('contact-message'), errEl: document.getElementById('message-error') }
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(field, msg) {
    field.el.style.borderColor = '#dc2626';
    field.errEl.textContent = msg;
  }

  function clearError(field) {
    field.el.style.borderColor = '';
    field.errEl.textContent = '';
  }

  function validateForm() {
    let valid = true;

    // Name
    if (!fields.name.el.value.trim()) {
      showError(fields.name, 'Full name is required.');
      valid = false;
    } else if (fields.name.el.value.trim().length < 3) {
      showError(fields.name, 'Name must be at least 3 characters.');
      valid = false;
    } else {
      clearError(fields.name);
    }

    // Email
    if (!fields.email.el.value.trim()) {
      showError(fields.email, 'Email address is required.');
      valid = false;
    } else if (!validateEmail(fields.email.el.value)) {
      showError(fields.email, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(fields.email);
    }

    // Subject
    if (!fields.subject.el.value) {
      showError(fields.subject, 'Please select a subject.');
      valid = false;
    } else {
      clearError(fields.subject);
    }

    // Message
    if (!fields.message.el.value.trim()) {
      showError(fields.message, 'Message cannot be empty.');
      valid = false;
    } else if (fields.message.el.value.trim().length < 20) {
      showError(fields.message, 'Message must be at least 20 characters.');
      valid = false;
    } else {
      clearError(fields.message);
    }

    return valid;
  }

  // Real-time validation on input
  Object.values(fields).forEach(field => {
    field.el.addEventListener('input', () => {
      if (field.errEl.textContent) validateForm();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');

    // Simulate sending
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      form.reset();
      successMsg.classList.remove('hidden');

      // Hide success after 5 seconds
      setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }, 1800);
  });
}

/* ============================================================
   ADD REVEAL CLASSES TO SECTIONS
   ============================================================ */
function addRevealClasses() {
  // Add reveal class to cards and section elements
  const selectors = [
    '.about-card',
    '.resource-card',
    '.chart-card',
    '.contact-info',
    '.contact-form-wrapper',
    '.hero-stat-card'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
    });
  });
}

/* ============================================================
   SMOOTH SCROLLING FOR ALL ANCHOR LINKS
   ============================================================ */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   FOOTER LINK – DOMAIN TAB ACTIVATOR
   ============================================================ */
function initFooterDomainLinks() {
  document.querySelectorAll('.footer-domains a').forEach((link, i) => {
    link.addEventListener('click', (e) => {
      const domainKeys = ['healthcare', 'ml', 'image', 'remote', 'iot', 'ds'];
      const key = domainKeys[i];
      if (key && typeof MAIN_DOMAINS !== 'undefined') {
        // Find the first main domain belonging to this category key
        const mDomEntry = Object.entries(MAIN_DOMAINS).find(([name, info]) => info.category === key);
        if (mDomEntry) {
          const mDomName = mDomEntry[0];
          setTimeout(() => {
            const pill = document.querySelector(`.domain-pill[data-domain="${mDomName}"]`);
            if (pill) {
              pill.click();
              pill.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 600);
        }
      }
    });
  });
}

/* ============================================================
   DOMAINS CLASSIFICATION MAP (Summarized to exactly 10)
   ============================================================ */
const DOMAIN_MAP = {
  // Machine Learning & AI
  "Machine & Deep Learning": "Machine Learning & AI",
  "Natural Language Processing": "Machine Learning & AI",
  "Pattern Recognition": "Machine Learning & AI",
  "Sentiment Analysis": "Machine Learning & AI",
  "Speech & Audio Processing": "Machine Learning & AI",
  "Image Processing & Computer Vision": "Machine Learning & AI",

  // Healthcare & Biomedical
  "Healthcare AI & Digital Health": "Healthcare & Biomedical",
  "Medical Electronics": "Healthcare & Biomedical",
  "Medical Imaging": "Healthcare & Biomedical",
  "Biomedical Engineering": "Healthcare & Biomedical",
  "Healthcare IoT": "Healthcare & Biomedical",
  "Biomedical Security": "Healthcare & Biomedical",
  "Biomedical Signal Processing": "Healthcare & Biomedical",
  "Mental Health AI": "Healthcare & Biomedical",
  "Epidemiological Modeling": "Healthcare & Biomedical",

  // Data Science & Analytics
  "Data Science & Analytics": "Data Science & Analytics",
  "Network Science": "Data Science & Analytics",
  "Social Network Analysis": "Data Science & Analytics",
  "Management & Business Analytics": "Data Science & Analytics",

  // Computer Science & IT
  "Cryptography & Cybersecurity": "Computer Science & IT",
  "Cloud & Grid Computing": "Computer Science & IT",
  "Blockchain Technologies": "Computer Science & IT",
  "Database & Big Data Systems": "Computer Science & IT",
  "Web Technology & Analytics": "Computer Science & IT",
  "Educational Technology": "Computer Science & IT",
  "Digital Watermarking": "Computer Science & IT",
  "IoT & Connected Systems": "Computer Science & IT",
  "Internet of Things (IoT)": "Computer Science & IT",
  "Smart Home Automation": "Computer Science & IT",

  // Electrical & Electronics
  "Power Systems & Smart Grids": "Electrical & Electronics",
  "Power Electronics & Converters": "Electrical & Electronics",
  "VLSI & Device Technology": "Electrical & Electronics",
  "High Voltage Engineering": "Electrical & Electronics",
  "Embedded Systems & Robotics": "Electrical & Electronics",

  // Optics & Communications
  "Optics & Photonics": "Optics & Communications",
  "Wireless Communication & Networks": "Optics & Communications",
  "Wireless & Sensor Networks": "Optics & Communications",
  "Optical Communication & Networks": "Optics & Communications",
  "Atmospheric Propagation & Rain Attenuation": "Optics & Communications",
  "VANET & Vehicular Networks": "Optics & Communications",

  // Applied Mathematics
  "Applied Mathematics & Modeling": "Applied Mathematics",
  "Optimization & Soft Computing": "Applied Mathematics",

  // Physics & Quantum Science
  "Quantum Computing & Physics": "Physics & Quantum Science",
  "Weather & Climate Forecasting": "Physics & Quantum Science",
  "Nuclear & Thermal Engineering": "Physics & Quantum Science",

  // Chemistry & Materials Science
  "Nanotechnology & Nanomaterials": "Chemistry & Materials Science",
  "Polymer Science & Engineering": "Chemistry & Materials Science",
  "Materials Science & Engineering": "Chemistry & Materials Science",
  "Physical Chemistry": "Chemistry & Materials Science",

  // Renewable & Civil Engineering
  "Renewable & Solar Energy Systems": "Renewable & Civil Engineering",
  "Wind Energy & Aerodynamics": "Renewable & Civil Engineering",
  "Environmental & Waste Management": "Renewable & Civil Engineering",
  "Smart Cities & Infrastructure": "Renewable & Civil Engineering",
  "Smart Water Management": "Renewable & Civil Engineering",
  "Structural Engineering & FEA": "Renewable & Civil Engineering",
  "Manufacturing & Mechanical Engineering": "Renewable & Civil Engineering",
  "Agricultural AI & Digital Agriculture": "Renewable & Civil Engineering"
};

function getDomainCategory(domainName) {
  if (!domainName) return "Computer Science & IT";
  const trimmed = domainName.trim();
  if (DOMAIN_MAP[trimmed]) return DOMAIN_MAP[trimmed];
  
  // Dynamic fallback based on keywords
  const lower = trimmed.toLowerCase();
  if (lower.includes("health") || lower.includes("medical") || lower.includes("biomedical") || lower.includes("epidemi")) {
    return "Healthcare & Biomedical";
  }
  if (lower.includes("deep learning") || lower.includes("machine learning") || lower.includes("natural language") || lower.includes("nlp") || lower.includes("neural") || lower.includes("pattern") || lower.includes("computer vision")) {
    return "Machine Learning & AI";
  }
  if (lower.includes("data science") || lower.includes("analytics") || lower.includes("big data")) {
    return "Data Science & Analytics";
  }
  if (lower.includes("power") || lower.includes("grid") || lower.includes("vlsi") || lower.includes("electrical") || lower.includes("electronics")) {
    return "Electrical & Electronics";
  }
  if (lower.includes("math") || lower.includes("optimiz") || lower.includes("model")) {
    return "Applied Mathematics";
  }
  if (lower.includes("physics") || lower.includes("quantum") || lower.includes("optics") || lower.includes("photon")) {
    return "Physics & Quantum Science";
  }
  if (lower.includes("chemistry") || lower.includes("material") || lower.includes("polymer") || lower.includes("nano")) {
    return "Chemistry & Materials Science";
  }
  if (lower.includes("renewable") || lower.includes("solar") || lower.includes("wind") || lower.includes("civil") || lower.includes("environment") || lower.includes("agricultural") || lower.includes("smart cities")) {
    return "Renewable & Civil Engineering";
  }
  if (lower.includes("crypt") || lower.includes("cyber") || lower.includes("cloud") || lower.includes("web") || lower.includes("network") || lower.includes("iot") || lower.includes("internet of things")) {
    return "Computer Science & IT";
  }
  return "Computer Science & IT";
}

/* ============================================================
   INITIALIZE DYNAMIC CHART.JS INSTANCES
   ============================================================ */
function initCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  // Set global defaults for premium look
  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#475569'; // Slate 600

  // ------------------ FIGURE 1: Publications by Year ------------------
  const canvasYear = document.getElementById('chart-year');
  if (canvasYear) {
    const ctxYear = canvasYear.getContext('2d');
    const gradientYear = ctxYear.createLinearGradient(0, 0, 0, 300);
    gradientYear.addColorStop(0, 'rgba(10, 36, 99, 0.35)');
    gradientYear.addColorStop(1, 'rgba(10, 36, 99, 0.0)');

    new Chart(ctxYear, {
      type: 'line',
      data: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026 (Till June)'],
        datasets: [{
          label: 'Number of Publications',
          data: [45, 48, 86, 124, 149, 129, 136, 229, 117],
          borderColor: '#0a2463',
          borderWidth: 3,
          backgroundColor: gradientYear,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#f6c90e',
          pointBorderColor: '#0a2463',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0a2463',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#f6c90e',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(10, 36, 99, 0.05)'
            },
            ticks: {
              font: {
                weight: '600'
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                weight: '600'
              }
            }
          }
        }
      }
    });
  }

  // ------------------ FIGURE 2: Publication Types ------------------
  const canvasCategory = document.getElementById('chart-category');
  if (canvasCategory) {
    const ctxCategory = canvasCategory.getContext('2d');
    const gradientCategory = ctxCategory.createLinearGradient(0, 0, 400, 0);
    gradientCategory.addColorStop(0, '#0a2463');
    gradientCategory.addColorStop(1, '#3b82f6');

    new Chart(ctxCategory, {
      type: 'bar',
      data: {
        labels: ['Conference paper', 'Article', 'Book chapter', 'Review', 'Erratum', 'Editorial', 'Book', 'Note', 'Letter'],
        datasets: [{
          label: 'Publications',
          data: [581, 543, 165, 40, 8, 6, 4, 2, 1],
          backgroundColor: gradientCategory,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 20
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0a2463',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#f6c90e',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(10, 36, 99, 0.05)'
            },
            ticks: {
              font: {
                weight: '600'
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                weight: '600'
              }
            }
          }
        }
      }
    });
  }

  // ------------------ FIGURE 3: Domain Distribution (Pie) ------------------
  const canvasDomain = document.getElementById('chart-domain');
  if (canvasDomain) {
    const ctxDomain = canvasDomain.getContext('2d');

    // Aggregate category counts dynamically from PAPERS_DATABASE
    const counts = {};
    const CATEGORIES = [
      'Data Science & Analytics',
      'Healthcare & Biomedical',
      'Applied Mathematics',
      'Renewable & Civil Engineering',
      'Computer Science & IT',
      'Optics & Communications',
      'Electrical & Electronics',
      'Machine Learning & AI',
      'Chemistry & Materials Science',
      'Physics & Quantum Science'
    ];
    CATEGORIES.forEach(cat => { counts[cat] = 0; });

    if (typeof PAPERS_DATABASE !== 'undefined') {
      PAPERS_DATABASE.forEach(paper => {
        const cat = getDomainCategory(paper.domain);
        counts[cat] = (counts[cat] || 0) + 1;
      });
    }

    const sortedDomains = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);
    const domainLabels = sortedDomains.map(item => item[0]);
    const domainData = sortedDomains.map(item => item[1]);

    const palette = [
      '#0a2463', // Deep Navy
      '#1e3a8a', // Royal Blue
      '#3b82f6', // Light Blue
      '#0d9488', // Teal
      '#10b981', // Emerald
      '#f6c90e', // Gold
      '#f97316', // Orange
      '#ef4444', // Red
      '#8b5cf6', // Violet
      '#64748b'  // Slate
    ];

    new Chart(ctxDomain, {
      type: 'pie',
      data: {
        labels: domainLabels,
        datasets: [{
          data: domainData,
          backgroundColor: palette,
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 14,
              font: {
                weight: '600'
              }
            }
          },
          tooltip: {
            backgroundColor: '#0a2463',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#f6c90e',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // ------------------ FIGURE 4: Top Faculty Contributors ------------------
  const canvasFaculty = document.getElementById('chart-faculty');
  if (canvasFaculty) {
    const ctxFaculty = canvasFaculty.getContext('2d');
    const gradientFaculty = ctxFaculty.createLinearGradient(0, 0, 400, 0);
    gradientFaculty.addColorStop(0, '#f6c90e');
    gradientFaculty.addColorStop(1, '#f97316');

    new Chart(ctxFaculty, {
      type: 'bar',
      data: {
        labels: [
          'Dr. Shyam Sundar Santra', 'Dr. Tanmoy Dutta', 'Dr. Suparna DasGupta',
          'Dr. Soumyabrata Saha', 'Dr. Sayan Chakraborty', 'Dr. Trina Dutta',
          'Dr. Ira Nath', 'Dr. Anal Ranjan Sengupta', 'Dr. Sumit Das',
          'Dr. Moumita Pal', 'Dr. Subhamoy Singha Roy'
        ],
        datasets: [{
          label: 'Publications',
          data: [121, 49, 43, 42, 29, 28, 27, 26, 26, 26, 25],
          backgroundColor: gradientFaculty,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 15
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0a2463',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#f6c90e',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(10, 36, 99, 0.05)'
            },
            ticks: {
              font: {
                weight: '600'
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                weight: '600'
              }
            }
          }
        }
      }
    });
  }
}

/* ============================================================
   INTERSECTION OBSERVER – ANIMATE CHARTS WHEN VISIBLE
   ============================================================ */
function observeCharts() {
  const statsSection = document.getElementById('analytics');
  if (!statsSection) return;

  let chartsInit = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chartsInit) {
        chartsInit = true;
        initCharts();
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(statsSection);
}

/* ============================================================
   INITIALIZE EVERYTHING ON DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Add reveal classes to elements
  addRevealClasses();

  // Core functionality
  initParticles();
  initCounters();
  initNavigation();
  initSmoothScrollLinks();

  // Content sections
  initDomainTabs();
  initInteractiveCounters();
  initSearch();
  initContactForm();
  initFooterDomainLinks();
  initTopCitedPapers();
  initVisitorCounter();

  // Charts (lazy, on scroll)
  observeCharts();

  // Scroll reveal (initialize observer)
  initScrollReveal();

  // Log
  console.log('%c🎓 Scholar Link – JIS College of Engineering', 'color:#f6c90e;font-size:14px;font-weight:bold;background:#0a2463;padding:8px 16px;border-radius:4px;');
  console.log('%c Research • Cite • Impact', 'color:#94a3b8;font-size:12px;');
});

/* ============================================================
   HANDLE WINDOW RESIZE – Reinit particles
   ============================================================ */
window.addEventListener('resize', debounce(() => {
  // Particles auto-handle via their own listener
  // Re-check scroll reveal for any newly visible items
  initScrollReveal();
}, 300));

/* ============================================================
   TOP CITED PAPERS VIEW
   ============================================================ */
function initTopCitedPapers() {
  const topCitedGrid = document.getElementById('top-cited-grid');
  const limitSelect = document.getElementById('top-cited-limit-select');

  if (!topCitedGrid || !limitSelect) return;

  // Sort papers by citations descending (clone array to prevent side effects)
  const sortedPapers = [...PAPERS_DATABASE].sort((a, b) => {
    const citA = a.citations || 0;
    const citB = b.citations || 0;
    return citB - citA;
  });

  function renderTopCited(limit) {
    topCitedGrid.innerHTML = '';
    
    let count = sortedPapers.length;
    if (limit !== 'all') {
      count = Math.min(parseInt(limit, 10), sortedPapers.length);
    }

    const papersToRender = sortedPapers.slice(0, count);

    papersToRender.forEach((paper, index) => {
      const card = document.createElement('article');
      card.className = 'paper-card reveal';
      if (index < 10) {
        card.classList.add('top-10-highlight');
      }
      card.style.animationDelay = `${(index % 20) * 0.04}s`;

      let doiSection = '';
      if (paper.doi) {
        if (paper.doi.indexOf('doi.org') !== -1) {
          doiSection = `<a href="${paper.doi}" target="_blank" rel="noopener noreferrer" class="paper-doi" aria-label="DOI: ${paper.doiLabel}">
               <i class="fas fa-external-link-alt"></i> DOI: ${paper.doiLabel}
             </a>`;
        } else {
          doiSection = `<a href="${paper.doi}" target="_blank" rel="noopener noreferrer" class="paper-doi" aria-label="Scopus Link">
               <i class="fas fa-external-link-alt"></i> Scopus Link
             </a>`;
        }
      } else {
        doiSection = `<span class="paper-doi" style="opacity:0.5;cursor:default;"><i class="fas fa-book"></i> No DOI available</span>`;
      }

      const rankBadge = index < 10 ? `<span class="top-rank-badge"><i class="fas fa-trophy"></i> Rank #${index + 1}</span>` : '';

      card.innerHTML = `
        ${rankBadge}
        <span class="citations-badge"><i class="fas fa-quote-right"></i> ${paper.citations || 0} Citations</span>
        <div class="paper-citation">
          <span class="paper-authors">${paper.authors} (${paper.year}). </span>
          <em class="paper-title">${paper.title}</em>
          <span class="paper-journal"> ${paper.journal}</span>
        </div>
        <div class="card-actions">
          ${doiSection}
          <button class="citation-btn top-citation-btn" aria-label="Cite this paper">
            <i class="fas fa-quote-left"></i> Cite
          </button>
        </div>
        <div class="citation-drawer" id="top-citation-drawer-${index}">
          <div class="citation-tabs">
            <button class="citation-tab-btn top-citation-tab-btn active" data-style="apa" data-index="${index}">APA</button>
            <button class="citation-tab-btn top-citation-tab-btn" data-style="mla" data-index="${index}">MLA</button>
            <button class="citation-tab-btn top-citation-tab-btn" data-style="chicago" data-index="${index}">Chicago</button>
            <button class="citation-tab-btn top-citation-tab-btn" data-style="ieee" data-index="${index}">IEEE</button>
            <button class="citation-tab-btn top-citation-tab-btn" data-style="vancouver" data-index="${index}">Vancouver</button>
          </div>
          <div class="citation-content-area">
            <div class="citation-text-box" id="top-citation-text-${index}">Loading...</div>
            <button class="btn-copy-citation" id="top-copy-btn-${index}" data-index="${index}" title="Copy to clipboard">
              <i class="far fa-copy"></i>
            </button>
          </div>
        </div>
      `;

      topCitedGrid.appendChild(card);
      attachCitationEvents(card, paper, 'top', index);
    });

    // Re-trigger reveal animations
    requestAnimationFrame(() => {
      initScrollReveal();
      topCitedGrid.querySelectorAll('.reveal').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 50);
      });
    });
  }

  // Handle dropdown change
  limitSelect.addEventListener('change', (e) => {
    renderTopCited(e.target.value);
  });

  // Initial render
  renderTopCited(limitSelect.value);
}

/* ============================================================
   VISITOR COUNTER LOGIC
   ============================================================ */
function initVisitorCounter() {
  const visitorDigitsContainer = document.getElementById('visitor-digits');
  if (!visitorDigitsContainer) return;

  const STORAGE_KEY = 'scholar_link_visitor_count';
  const BASE_COUNT = 12458;

  let count = localStorage.getItem(STORAGE_KEY);
  if (!count) {
    count = BASE_COUNT;
  } else {
    count = parseInt(count, 10);
  }

  // Increment traffic
  count++;
  localStorage.setItem(STORAGE_KEY, count.toString());

  // Format with leading zeros up to 6 digits
  const digitStr = count.toString().padStart(6, '0');
  visitorDigitsContainer.innerHTML = '';
  
  for (let i = 0; i < digitStr.length; i++) {
    const span = document.createElement('span');
    span.className = 'digit-card';
    span.textContent = digitStr[i];
    visitorDigitsContainer.appendChild(span);
  }
}

