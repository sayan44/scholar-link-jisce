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
   DOMAIN TABS & PAPER RENDERING
   ============================================================ */
function initDomainTabs() {
  const pillsGrid = document.getElementById('domain-pills-grid');
  const searchInput = document.getElementById('domain-select-search');
  const papersGrid = document.getElementById('papers-grid');

  if (!pillsGrid) return;

  // Extract unique domains dynamically and map them to their category
  const domainsMap = {};
  const domainCategoryMap = {};
  PAPERS_DATABASE.forEach(paper => {
    const dom = paper.domain;
    if (dom) {
      domainsMap[dom] = (domainsMap[dom] || 0) + 1;
      if (paper.category) {
        domainCategoryMap[dom] = paper.category;
      }
    }
  });
  const sortedDomains = Object.keys(domainsMap).sort();

  let activeDomain = sortedDomains[0] || '';
  let activeYear = 'All';

  // Render papers for selected domain and year
  function renderPapers(domainName, yearFilter = 'All') {
    if (!papersGrid) return;

    const domainPapers = PAPERS_DATABASE.filter(p => p.domain === domainName);
    const samplePaper = domainPapers[0];
    const categoryKey = samplePaper ? samplePaper.category : 'ds';
    const categoryInfo = RESEARCH_DATA[categoryKey] || { icon: 'fas fa-book', description: 'Curated research publications.' };

    const filteredPapers = yearFilter === 'All'
      ? domainPapers
      : domainPapers.filter(p => p.year === yearFilter);

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

    if (bannerIcon) bannerIcon.innerHTML = `<i class="${categoryInfo.icon}"></i>`;
    if (bannerName) bannerName.textContent = domainName;
    if (bannerDesc) bannerDesc.textContent = `Explore research achievements, academic publications, and citation profiles in the field of ${domainName}.`;
    if (bannerPaperCount) bannerPaperCount.textContent = domainPapers.length;

    // Render cards
    papersGrid.innerHTML = '';
    if (filteredPapers.length === 0) {
      papersGrid.innerHTML = '<div class="no-papers"><p><i class="fas fa-info-circle"></i> No papers found for this year.</p></div>';
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

  // Generate Year filter tabs dynamically
  function renderYearTabs(domainName) {
    const yearTabsContainer = document.getElementById('year-tabs');
    if (!yearTabsContainer) return;

    const domainPapers = PAPERS_DATABASE.filter(p => p.domain === domainName);
    const years = new Set();
    domainPapers.forEach(p => {
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
      renderPapers(domainName, 'All');
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
        renderPapers(domainName, yr);
      });
      yearTabsContainer.appendChild(yrTab);
    });
  }

  // Select a domain
  function selectDomain(domainName) {
    activeDomain = domainName;
    activeYear = 'All';

    // Update pills status
    pillsGrid.querySelectorAll('.domain-pill').forEach(pill => {
      const isCurrent = pill.dataset.domain === domainName;
      pill.classList.toggle('active', isCurrent);
      pill.setAttribute('aria-selected', isCurrent.toString());
    });

    renderYearTabs(domainName);
    renderPapers(domainName, 'All');
  }

  // Render all domain pills initially
  pillsGrid.innerHTML = '';
  sortedDomains.forEach((dom, index) => {
    const categoryKey = domainCategoryMap[dom] || 'ds';
    const categoryInfo = RESEARCH_DATA[categoryKey] || { icon: 'fas fa-book' };

    const pill = document.createElement('button');
    pill.className = `domain-pill cat-${categoryKey}` + (index === 0 ? ' active' : '');
    pill.dataset.domain = dom;
    pill.dataset.category = categoryKey;
    pill.setAttribute('role', 'tab');
    pill.setAttribute('aria-selected', (index === 0).toString());
    pill.innerHTML = `
      <i class="${categoryInfo.icon} pill-icon"></i>
      <span class="pill-name">${dom}</span>
      <span class="pill-count">${domainsMap[dom]}</span>
    `;

    pill.addEventListener('click', () => {
      selectDomain(dom);
      // Scroll to papers banner with offset to clear sticky header
      const banner = document.getElementById('domain-info-banner');
      if (banner) {
        const offset = 80;
        const pos = banner.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });

    pillsGrid.appendChild(pill);
  });

  // Category Filter bar click logic
  const catFilterBar = document.getElementById('category-filter-bar');
  if (catFilterBar) {
    catFilterBar.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        catFilterBar.querySelectorAll('.category-filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const selectedCat = btn.dataset.category;
        const pills = pillsGrid.querySelectorAll('.domain-pill');
        let firstVisiblePill = null;
        let activePillStillVisible = false;

        pills.forEach(pill => {
          const pillCat = pill.dataset.category;
          const matches = (selectedCat === 'all' || pillCat === selectedCat);
          if (matches) {
            pill.style.display = 'flex';
            if (!firstVisiblePill) firstVisiblePill = pill;
            if (pill.dataset.domain === activeDomain) activePillStillVisible = true;
          } else {
            pill.style.display = 'none';
          }
        });

        // If the active domain is hidden, auto-select the first visible one in this category
        if (!activePillStillVisible && firstVisiblePill) {
          selectDomain(firstVisiblePill.dataset.domain);
        }
      });
    });
  }

  // Domain search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Reset category filter to 'all' if user starts typing
      if (query !== '' && catFilterBar) {
        const allBtn = catFilterBar.querySelector('.category-filter-btn[data-category="all"]');
        if (allBtn && !allBtn.classList.contains('active')) {
          catFilterBar.querySelectorAll('.category-filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          allBtn.classList.add('active');
          allBtn.setAttribute('aria-selected', 'true');
        }
      }

      const pills = pillsGrid.querySelectorAll('.domain-pill');
      pills.forEach(pill => {
        const name = pill.querySelector('.pill-name').textContent.toLowerCase();
        if (name.includes(query)) {
          pill.style.display = 'flex';
        } else {
          pill.style.display = 'none';
        }
      });
    });
  }

  // Initialize first domain
  if (sortedDomains.length > 0) {
    selectDomain(sortedDomains[0]);
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

function generateCitationText(paper, style) {
  const parsed = parseAuthors(paper.authors);
  switch (style.toLowerCase()) {
    case 'apa': return getAPA(paper, parsed);
    case 'mla': return getMLA(paper, parsed);
    case 'chicago': return getChicago(paper, parsed);
    case 'ieee': return getIEEE(paper, parsed);
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
      if (key && typeof PAPERS_DATABASE !== 'undefined') {
        // Find the first domain in database belonging to this category
        const matchPaper = PAPERS_DATABASE.find(p => p.category === key);
        if (matchPaper) {
          const domName = matchPaper.domain;
          setTimeout(() => {
            const pill = document.querySelector(`.domain-pill[data-domain="${domName}"]`);
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
   INTERSECTION OBSERVER – ANIMATE CHARTS WHEN VISIBLE
   ============================================================ */
function observeCharts() {
  const statsSection = document.getElementById('stats');
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
  }, { threshold: 0.2 });

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

