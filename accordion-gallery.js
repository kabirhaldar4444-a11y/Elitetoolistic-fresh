/**
 * AccordionGallery — Interactive Expanding Image Accordion
 * Open-source component from React Bits ported to high-performance Vanilla JS + CSS
 * Built for ELITE TOOLISTIC Academy of Certified Mastery
 *
 * Features:
 * - GSAP-powered smooth 3D tilt and flexGrow interpolation
 * - Dynamic parallax media drift and desaturation/grayscale recovery
 * - Staggered label & accent bar reveal
 * - Full keyboard navigation (Arrow keys) and responsive mobile fallback
 */

(function (global) {
  'use strict';

  const DEFAULTS = {
    items: [],
    defaultIndex: 2,
    accentColor: '#38bdf8',
    overlayColor: '#060010',
    textColor: '#ffffff',
    height: 260,
    gap: 12,
    radius: 16,
    expandRatio: 0.52,
    orientation: 'horizontal',
    duration: 0.6,
    ease: 'power3.out',
    parallax: 0.5,
    tilt: 8,
    stagger: 0.06,
    trigger: 'hover',
    showLabels: true,
    grayscale: true,
    className: ''
  };

  class AccordionGallery {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) {
        console.warn('[AccordionGallery] Container not found:', container);
        return;
      }

      this.opts = Object.assign({}, DEFAULTS, options);
      this.items = this.opts.items || [];
      this.count = this.items.length;
      if (this.count === 0) return;

      this.active = Math.min(Math.max(this.opts.defaultIndex, 0), this.count - 1);
      this.vertical = this.opts.orientation === 'vertical';
      this.mediaSize = 320;
      this.tl = null;
      this.firstRun = true;

      this.panelEls = [];
      this.mediaEls = [];
      this.barEls = [];
      this.textEls = [];
      this.metaSubEls = [];
      this.enrollBtnEls = [];

      this.prefersReduced = typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

      this.buildDOM();
      this.setupObserver();
    }

    buildDOM() {
      const { accentColor, overlayColor, textColor, gap, radius, height, className } = this.opts;

      const gallery = document.createElement('div');
      gallery.className = `accordion-gallery${this.vertical ? ' accordion-gallery--vertical' : ''}${className ? ' ' + className : ''}`;
      gallery.setAttribute('role', 'list');
      gallery.setAttribute('aria-label', 'Course category accordion gallery');

      gallery.style.setProperty('--ag-accent', accentColor);
      gallery.style.setProperty('--ag-overlay', overlayColor);
      gallery.style.setProperty('--ag-text', textColor);
      gallery.style.setProperty('--ag-gap', `${gap}px`);
      gallery.style.setProperty('--ag-radius', `${radius}px`);
      gallery.style.height = this.vertical ? `${Math.round(height * 1.6)}px` : `${height}px`;

      this.panelEls = [];
      this.mediaEls = [];
      this.barEls = [];
      this.textEls = [];
      this.metaSubEls = [];
      this.enrollBtnEls = [];

      this.items.forEach((item, i) => {
        const isActive = i === this.active;
        const panel = document.createElement('div');
        panel.className = `ag-panel${isActive ? ' ag-panel--active' : ''}`;
        panel.style.borderRadius = `${radius}px`;
        panel.setAttribute('role', 'button');
        panel.setAttribute('tabindex', '0');
        panel.setAttribute('aria-label', `${item.label || item.name || 'Course panel'} - Click to view and enroll`);
        if (isActive) panel.setAttribute('aria-current', 'true');

        // Distinct price badge on the card
        const priceVal = item.price || (item.rawCourse?.price ? (item.rawCourse.price.startsWith('₹') ? item.rawCourse.price : '₹' + item.rawCourse.price) : '₹24,999');
        const priceBadge = document.createElement('span');
        priceBadge.className = 'ag-panel__price-badge';
        priceBadge.textContent = priceVal;
        panel.appendChild(priceBadge);

        // Frame and Media
        const frame = document.createElement('span');
        frame.className = 'ag-panel__frame';

        const media = document.createElement('span');
        media.className = 'ag-panel__media';

        const img = document.createElement('img');
        img.src = item.image || item.src || '';
        img.alt = item.alt || item.label || item.name || '';
        img.draggable = false;
        img.loading = 'lazy';
        img.onerror = function() {
          this.onerror = null;
          this.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80';
        };
        media.appendChild(img);

        const overlay = document.createElement('span');
        overlay.className = 'ag-panel__overlay';
        overlay.setAttribute('aria-hidden', 'true');

        frame.appendChild(media);
        frame.appendChild(overlay);
        panel.appendChild(frame);

        // Labels, Price & Enroll Now Button
        let bar = null;
        let text = null;
        let enrollBtn = null;
        let metaSub = null;
        if (this.opts.showLabels) {
          const labelWrap = document.createElement('div');
          labelWrap.className = 'ag-panel__label';
          labelWrap.setAttribute('aria-hidden', 'true');

          const titleWrap = document.createElement('div');
          titleWrap.className = 'ag-panel__title-wrap';

          bar = document.createElement('span');
          bar.className = 'ag-panel__bar';

          const infoCol = document.createElement('div');
          infoCol.className = 'ag-panel__info-col';

          text = document.createElement('span');
          text.className = 'ag-panel__text';
          text.textContent = item.label || item.name || '';

          metaSub = document.createElement('div');
          metaSub.className = 'ag-panel__meta-sub';
          metaSub.innerHTML = `<span class="ag-panel__fee-text">Fee: <strong>${priceVal}</strong></span><span class="ag-panel__cert-tag">Certified</span>`;

          infoCol.appendChild(text);
          infoCol.appendChild(metaSub);

          titleWrap.appendChild(bar);
          titleWrap.appendChild(infoCol);
          labelWrap.appendChild(titleWrap);

          // Dedicated Enroll Now button for every course
          enrollBtn = document.createElement('a');
          enrollBtn.className = 'ag-panel__enroll-btn';
          enrollBtn.href = item.link || 'courses.html';
          enrollBtn.innerHTML = `<span>Enroll Now</span><span class="ag-panel__enroll-arrow">→</span>`;
          enrollBtn.setAttribute('title', `Enroll Now in ${item.label || item.name || 'Course'}`);
          enrollBtn.addEventListener('click', e => {
            e.stopPropagation();
          });
          labelWrap.appendChild(enrollBtn);

          panel.appendChild(labelWrap);
        }

        // Store references
        this.panelEls.push(panel);
        this.mediaEls.push(media);
        this.barEls.push(bar);
        this.textEls.push(text);
        this.metaSubEls.push(metaSub);
        this.enrollBtnEls.push(enrollBtn);

        // Events
        if (this.opts.trigger === 'hover') {
          panel.addEventListener('mouseenter', () => {
            this.setActive(i);
            if (typeof this.opts.onItemHover === 'function') {
              this.opts.onItemHover(i, this.count);
            }
          });
        }

        panel.addEventListener('click', e => {
          if (e.target.closest('.ag-panel__enroll-btn')) return;
          // Always navigate to the external course listing page on click
          window.location.href = 'https://www.elitetoolistic.org/courses';
        });

        panel.addEventListener('focus', () => {
          this.setActive(i);
          if (typeof this.opts.onItemHover === 'function') {
            this.opts.onItemHover(i, this.count);
          }
        });

        panel.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (i === this.active && item.link) {
              window.location.href = item.link;
            } else {
              this.setActive(i);
            }
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.setActive((i + 1) % this.count);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.setActive((i - 1 + this.count) % this.count);
          }
        });

        gallery.appendChild(panel);
      });

      gallery.addEventListener('mouseleave', () => {
        if (typeof this.opts.onGalleryLeave === 'function') {
          this.opts.onGalleryLeave();
        }
      });

      this.galleryEl = gallery;
      this.container.innerHTML = '';
      this.container.appendChild(gallery);
    }

    setupObserver() {
      const measure = () => {
        if (!this.galleryEl) return;
        const rect = this.galleryEl.getBoundingClientRect();
        const total = this.vertical ? rect.height : rect.width;
        const usable = Math.max(total - this.opts.gap * (this.count - 1), 120);
        const r = Math.min(Math.max(this.opts.expandRatio, 0.2), 0.9);
        const size = Math.max(140, usable * r * 1.22);
        this.mediaSize = size;
        this.galleryEl.style.setProperty('--ag-media-size', `${size}px`);
        this.applyLayout(!this.firstRun);
        this.firstRun = false;
      };

      measure();
      this.ro = new ResizeObserver(measure);
      this.ro.observe(this.galleryEl);
    }

    setActive(index) {
      if (index === this.active || index < 0 || index >= this.count) return;
      this.active = index;

      this.panelEls.forEach((p, i) => {
        const isActive = i === this.active;
        p.classList.toggle('ag-panel--active', isActive);
        if (isActive) {
          p.setAttribute('aria-current', 'true');
        } else {
          p.removeAttribute('aria-current');
        }
      });

      this.applyLayout(true);

      if (typeof this.opts.onActiveChange === 'function') {
        this.opts.onActiveChange(this.active, this.count);
      }
    }

    applyLayout(animate = true) {
      const gsap = global.gsap;
      const { expandRatio, duration, ease, tilt, parallax, grayscale, showLabels, stagger } = this.opts;
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = this.count > 1 ? (r * (count => count - 1)(this.count)) / (1 - r) : 1;
      const mediaSize = this.mediaSize;

      if (!gsap) {
        // Fallback pure CSS
        this.panelEls.forEach((panel, i) => {
          const isActive = i === this.active;
          panel.style.flexGrow = isActive ? grow : 1;
        });
        return;
      }

      if (this.tl) this.tl.kill();
      const dur = animate && !this.prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      this.panelEls.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === this.active;
        const media = this.mediaEls[i];
        const bar = this.barEls[i];
        const text = this.textEls[i];
        const enrollBtn = this.enrollBtnEls[i];

        const rot = isActive ? 0 : i < this.active ? tilt : -tilt;
        const rotProp = this.vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          tl.to(
            media,
            {
              xPercent: 0,
              yPercent: 0,
              x: 0,
              y: 0,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          const metaSub = this.metaSubEls[i];
          const labelTargets = [bar, text, metaSub, enrollBtn].filter(Boolean);
          if (isActive) {
            tl.to(labelTargets, { opacity: 1, x: 0, duration: dur, ease, stagger: this.prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to(labelTargets, { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      this.tl = tl;
    }

    destroy() {
      if (this.ro) this.ro.disconnect();
      if (this.tl) this.tl.kill();
      if (this.galleryEl) this.galleryEl.remove();
    }

    setItems(newItems, defaultIndex = 0) {
      if (!newItems || newItems.length === 0) return;
      if (this.tl) this.tl.kill();
      if (this.galleryEl) this.galleryEl.remove();
      this.items = newItems;
      this.count = newItems.length;
      this.active = Math.min(Math.max(defaultIndex, 0), this.count - 1);
      this.firstRun = true;
      this.buildDOM();
      this.update(0.4);
    }
  }

  // Auto-init helper for courses.html: All 14 Separate Category Accordions
  global.initCoursesPageAccordions = async function() {
    const accordionsContainer = document.getElementById('all14CategoryAccordionsContainer');
    if (!accordionsContainer) return;

    let coursesData = [];
    try {
      const resp = await fetch('all_167_courses.json');
      if (resp.ok) coursesData = await resp.json();
    } catch (e) {
      console.warn('[AccordionGallery] Failed to fetch courses JSON', e);
    }

    if (!coursesData || coursesData.length === 0) return;

    // Ordered categories with icons and slugs for smooth scrolling
    const CATEGORY_META = [
      { id: 'AI & Modern Workflows', icon: '🤖', short: 'AI Workflows', slug: 'cat-ai' },
      { id: 'Construction: Project Management & Billing', icon: '🏗️', short: 'PM & Billing', slug: 'cat-pm' },
      { id: 'Construction: Site Operations & Safety', icon: '🦺', short: 'Site & Safety', slug: 'cat-safety' },
      { id: 'Construction: Design Coordination & BIM', icon: '📐', short: 'BIM & Design', slug: 'cat-bim' },
      { id: 'Construction: Materials, Finishes & Tech', icon: '🧱', short: 'Materials & Tech', slug: 'cat-materials' },
      { id: 'Corporate Operations & Logistics', icon: '📦', short: 'Logistics & Ops', slug: 'cat-logistics' },
      { id: 'Business & Management', icon: '💼', short: 'Business & Mgmt', slug: 'cat-business' },
      { id: 'Technology & Digital Skills', icon: '💻', short: 'Tech & Digital', slug: 'cat-tech' },
      { id: 'Professional Development', icon: '🎯', short: 'Professional Dev', slug: 'cat-prof-dev' },
      { id: 'Marketing & Communication', icon: '📢', short: 'Marketing', slug: 'cat-marketing' },
      { id: 'Career Development', icon: '🚀', short: 'Career Growth', slug: 'cat-career' },
      { id: 'Productivity & Office Skills', icon: '📊', short: 'Productivity', slug: 'cat-productivity' },
      { id: 'Construction & Engineering', icon: '🏛️', short: 'Civil Engineering', slug: 'cat-civil' },
      { id: 'Additional Professional Skills', icon: '🌟', short: 'Executive Skills', slug: 'cat-skills' }
    ];

    // Curated high-resolution bright photography pool for each discipline
    const CATEGORY_FALLBACK_IMAGES = {
      "AI & Modern Workflows": [
            "images/cliparts/clipart_ai_robotics.svg",
            "images/cliparts/clipart_ai_workflow.svg",
            "images/cliparts/clipart_tech_coding.svg"
      ],
      "Construction: Project Management & Billing": [
            "images/cliparts/clipart_pm_building.svg",
            "images/cliparts/clipart_pm_finance.svg",
            "images/cliparts/clipart_business_project.svg"
      ],
      "Construction: Site Operations & Safety": [
            "images/cliparts/clipart_safety_site.svg",
            "images/cliparts/clipart_safety_env.svg",
            "images/cliparts/clipart_civil_construct.svg"
      ],
      "Construction: Design Coordination & BIM": [
            "images/cliparts/clipart_bim_architecture.svg",
            "images/cliparts/clipart_bim_engineering.svg",
            "images/cliparts/clipart_materials_build.svg"
      ],
      "Construction: Materials, Finishes & Tech": [
            "images/cliparts/clipart_materials_tech.svg",
            "images/cliparts/clipart_materials_build.svg",
            "images/cliparts/clipart_civil_construct.svg"
      ],
      "Corporate Operations & Logistics": [
            "images/cliparts/clipart_logistics_ops.svg",
            "images/cliparts/clipart_logistics_fleet.svg",
            "images/cliparts/clipart_business_project.svg"
      ],
      "Business & Management": [
            "images/cliparts/clipart_business_mgmt.svg",
            "images/cliparts/clipart_business_project.svg",
            "images/cliparts/clipart_pm_finance.svg"
      ],
      "Technology & Digital Skills": [
            "images/cliparts/clipart_tech_coding.svg",
            "images/cliparts/clipart_tech_circuit.svg",
            "images/cliparts/clipart_ai_robotics.svg"
      ],
      "Professional Development": [
            "images/cliparts/clipart_prof_doodle.svg",
            "images/cliparts/clipart_prof_launch.svg",
            "images/cliparts/clipart_career_growth.svg"
      ],
      "Marketing & Communication": [
            "images/cliparts/clipart_marketing_comm.svg",
            "images/cliparts/clipart_marketing_launch.svg",
            "images/cliparts/clipart_business_mgmt.svg"
      ],
      "Career Development": [
            "images/cliparts/clipart_career_growth.svg",
            "images/cliparts/clipart_career_study.svg",
            "images/cliparts/clipart_prof_doodle.svg"
      ],
      "Productivity & Office Skills": [
            "images/cliparts/clipart_productivity_office.svg",
            "images/cliparts/clipart_productivity_dash.svg",
            "images/cliparts/clipart_tech_coding.svg"
      ],
      "Construction & Engineering": [
            "images/cliparts/clipart_civil_eng.svg",
            "images/cliparts/clipart_civil_construct.svg",
            "images/cliparts/clipart_bim_engineering.svg"
      ],
      "Additional Professional Skills": [
            "images/cliparts/clipart_exec_skills.svg",
            "images/cliparts/clipart_exec_medicine.svg",
            "images/cliparts/clipart_career_growth.svg"
      ]
};

    // Group courses by category
    const categoryMap = {};
    CATEGORY_META.forEach(meta => { categoryMap[meta.id] = []; });

    coursesData.forEach(c => {
      const cat = c.category;
      if (categoryMap[cat]) {
        const list = categoryMap[cat];
        const catImages = CATEGORY_FALLBACK_IMAGES[cat] || [];
        let chosenImg = c.image;
        if (!chosenImg || chosenImg.includes('pmiservices.org')) {
          chosenImg = catImages[list.length % catImages.length] || 'images/cliparts/clipart_civil_eng.svg';
        }

        const priceRaw = c.price || '24,999';
        const formattedPrice = priceRaw.startsWith('₹') ? priceRaw : '₹' + priceRaw;

        list.push({
          image: chosenImg,
          label: c.name,
          price: formattedPrice,
          link: c.file || (c.slug ? `${c.slug}.html` : 'courses.html'),
          alt: c.name,
          rawCourse: c
        });
      }
    });

    // ── Smart Category Dropdown ──
    const dropdownMenu = document.getElementById('coursesCatDropdownMenu');
    const dropdownBtn = document.getElementById('coursesCatDropdownBtn');
    const dropdownBtnText = document.getElementById('coursesCatBtnText');
    const dropdownBtnIcon = document.getElementById('coursesCatBtnIcon');
    const dropdownWrap = document.getElementById('coursesCatDropdownWrap');

    if (dropdownMenu && dropdownBtn) {
      // Build dropdown items
      const allOpt = document.createElement('li');
      allOpt.className = 'courses-cat-dropdown-item courses-cat-dropdown-item--active';
      allOpt.setAttribute('role', 'option');
      allOpt.setAttribute('aria-selected', 'true');
      allOpt.innerHTML = `<span class="dd-icon">🗂️</span><span class="dd-label">All Disciplines</span><span class="dd-count">(${coursesData.length})</span>`;
      allOpt.addEventListener('click', () => filterByCategory(null, '🗂️', 'All Disciplines'));
      dropdownMenu.appendChild(allOpt);

      CATEGORY_META.forEach(meta => {
        const count = categoryMap[meta.id]?.length || 0;
        const li = document.createElement('li');
        li.className = 'courses-cat-dropdown-item';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.setAttribute('data-slug', meta.slug);
        li.innerHTML = `<span class="dd-icon">${meta.icon}</span><span class="dd-label">${meta.id}</span><span class="dd-count">(${count})</span>`;
        li.addEventListener('click', () => filterByCategory(meta.slug, meta.icon, meta.id));
        dropdownMenu.appendChild(li);
      });

      // Toggle open/close
      dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownWrap.classList.toggle('is-open');
        dropdownBtn.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', () => {
        dropdownWrap.classList.remove('is-open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      });
      dropdownWrap.addEventListener('click', e => e.stopPropagation());
    }

    function filterByCategory(slug, icon, label) {
      // Update button text
      if (dropdownBtnText) dropdownBtnText.textContent = label;
      if (dropdownBtnIcon) dropdownBtnIcon.textContent = icon;
      dropdownWrap?.classList.remove('is-open');
      if (dropdownBtn) dropdownBtn.setAttribute('aria-expanded', 'false');

      // Update active state
      dropdownMenu?.querySelectorAll('.courses-cat-dropdown-item').forEach(li => {
        const isActive = slug ? li.getAttribute('data-slug') === slug : !li.getAttribute('data-slug');
        li.classList.toggle('courses-cat-dropdown-item--active', isActive);
        li.setAttribute('aria-selected', String(isActive));
      });

      // Show/hide accordion cards
      accordionsContainer.querySelectorAll('.category-floating-card').forEach(card => {
        if (!slug || card.id === slug) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // ── Smart Live Search ──
    const searchInput = document.getElementById('courseSearchInput');
    const searchClear = document.getElementById('courseSearchClear');
    const searchResults = document.getElementById('coursesSearchResults');

    // Flatten all courses for search
    const allSearchableCourses = coursesData.map(c => ({
      name: c.name || '',
      category: c.category || '',
      link: 'https://www.elitetoolistic.org/courses',
      price: c.price ? (c.price.startsWith('₹') ? c.price : '₹' + c.price) : '₹24,999',
      icon: CATEGORY_META.find(m => m.id === c.category)?.icon || '📚'
    }));

    function doSearch(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        searchResults.hidden = true;
        searchResults.innerHTML = '';
        accordionsContainer.style.display = '';
        if (searchClear) searchClear.style.opacity = '0';
        return;
      }
      if (searchClear) searchClear.style.opacity = '1';
      accordionsContainer.style.display = 'none';
      searchResults.hidden = false;

      const matches = allSearchableCourses.filter(c =>
        c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `<div class="sr-empty"><span>🔍</span><p>No courses found for <strong>"${query}"</strong></p></div>`;
        return;
      }

      searchResults.innerHTML = `
        <div class="sr-header"><span class="sr-count">${matches.length} courses found</span><span class="sr-query">for "${query}"</span></div>
        <div class="sr-grid">
          ${matches.map(c => `
            <a class="sr-card" href="${c.link}" target="_blank" rel="noopener">
              <span class="sr-card-icon">${c.icon}</span>
              <div class="sr-card-body">
                <span class="sr-card-name">${c.name.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi'), m => `<mark>${m}</mark>`)}</span>
                <span class="sr-card-cat">${c.category}</span>
              </div>
              <span class="sr-card-price">${c.price}</span>
            </a>
          `).join('')}
        </div>
      `;
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => doSearch(searchInput.value));
      searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { searchInput.value = ''; doSearch(''); } });
    }
    if (searchClear) {
      searchClear.style.opacity = '0';
      searchClear.addEventListener('click', () => { if (searchInput) searchInput.value = ''; doSearch(''); searchInput?.focus(); });
    }

    // Render All 14 Separate Accordion Galleries with Smart Controls
    accordionsContainer.innerHTML = '';
    const allGalleryInstances = [];

    CATEGORY_META.forEach((meta, idx) => {
      const allItems = categoryMap[meta.id] || [];
      if (allItems.length === 0) return;

      const pageSize = 6;
      let currentPage = 0;
      const totalPages = Math.ceil(allItems.length / pageSize);

      const card = document.createElement('div');
      card.className = 'category-floating-card';
      card.id = meta.slug;

      const numStr = String(idx + 1).padStart(2, '0');

      card.innerHTML = `
        <div class="category-floating-header">
          <div class="category-floating-title-group">
            <span class="category-floating-kicker">${meta.icon} DISCIPLINE ${numStr} • ${allItems.length} PROGRAMS</span>
            <h3 class="category-floating-title">${meta.id}</h3>
          </div>
        </div>
        <div class="category-accordion-stage">
          ${totalPages > 1 ? `
          <button class="cat-flank-slider-btn cat-flank-prev" title="Slide Left (Previous Courses)" aria-label="Slide Left">
            <span class="flank-arrow">‹</span>
          </button>
          ` : ''}
          <div class="category-accordion-viewport">
            <div id="cat-mount-${idx}" class="accordion-gallery-mount"></div>
          </div>
          ${totalPages > 1 ? `
          <button class="cat-flank-slider-btn cat-flank-next" title="Slide Right (Next Courses)" aria-label="Slide Right">
            <span class="flank-arrow">›</span>
          </button>
          ` : ''}
        </div>
      `;

      accordionsContainer.appendChild(card);

      // Mount initial page items
      const mountEl = card.querySelector(`#cat-mount-${idx}`);
      const gridDrawer = card.querySelector(`#cat-grid-${idx}`);
      const accordionStage = card.querySelector('.category-accordion-stage');
      const accordionViewport = card.querySelector('.category-accordion-viewport');
      const toggleBtn = card.querySelector('.cat-view-toggle-btn');
      const prevBtn = card.querySelector('.cat-prev-btn');
      const nextBtn = card.querySelector('.cat-next-btn');
      const flankPrevBtn = card.querySelector('.cat-flank-prev');
      const flankNextBtn = card.querySelector('.cat-flank-next');
      const pageIndicator = card.querySelector('.cat-page-indicator');
      const dots = card.querySelectorAll('.cat-page-dot');

      const initialSlice = allItems.slice(0, pageSize);
      let inst = null;
      let autoAdvanceTimer = null;
      let lastTransitionDirection = null; // 'forward' | 'backward' | null
      let allowAutoAdvance = true;

      function cancelAutoAdvance() {
        if (autoAdvanceTimer) {
          clearTimeout(autoAdvanceTimer);
          autoAdvanceTimer = null;
        }
      }

      function handleItemHover(hoverIndex, totalInGroup) {
        cancelAutoAdvance();
        if (totalPages <= 1) return;

        // If user just transitioned forward and is landing on index 0, guard against immediate backward transition
        if (lastTransitionDirection === 'forward' && hoverIndex === 0) {
          return;
        }
        // If user just transitioned backward and is landing on the last card, guard against immediate forward transition
        if (lastTransitionDirection === 'backward' && hoverIndex === totalInGroup - 1) {
          return;
        }

        // If hovering any intermediate card, user has actively engaged with this page
        if (hoverIndex > 0 && hoverIndex < totalInGroup - 1) {
          lastTransitionDirection = null;
          allowAutoAdvance = true;
        }

        if (!allowAutoAdvance) return;

        // 1) Forward auto-advance: Hovering the last card in the group
        if (hoverIndex === totalInGroup - 1) {
          autoAdvanceTimer = setTimeout(() => {
            const nextPage = (currentPage + 1) % totalPages;
            lastTransitionDirection = 'forward';
            allowAutoAdvance = false;
            updatePage(nextPage, 0);
          }, 450);
        }
        // 2) Backward auto-advance: Hovering the first card (card 0) in the group
        else if (hoverIndex === 0) {
          autoAdvanceTimer = setTimeout(() => {
            const prevPage = (currentPage - 1 + totalPages) % totalPages;
            lastTransitionDirection = 'backward';
            allowAutoAdvance = false;
            const prevStart = prevPage * pageSize;
            const prevCount = Math.min(pageSize, allItems.length - prevStart);
            const targetLandingIndex = Math.max(0, prevCount - 1);
            updatePage(prevPage, targetLandingIndex);
          }, 450);
        } else {
          lastTransitionDirection = null;
        }
      }

      function handleGalleryLeave() {
        cancelAutoAdvance();
        lastTransitionDirection = null;
        allowAutoAdvance = true;
      }

      function slidePrevious() {
        lastTransitionDirection = null;
        allowAutoAdvance = true;
        const prevPage = (currentPage - 1 + totalPages) % totalPages;
        const prevStart = prevPage * pageSize;
        const prevCount = Math.min(pageSize, allItems.length - prevStart);
        updatePage(prevPage, Math.max(0, prevCount - 1));
      }

      function slideNext() {
        lastTransitionDirection = null;
        allowAutoAdvance = true;
        updatePage((currentPage + 1) % totalPages, 0);
      }

      function updatePage(newPage, targetIndex = 0) {
        cancelAutoAdvance();
        currentPage = (newPage + totalPages) % totalPages;
        const start = currentPage * pageSize;
        const end = Math.min(start + pageSize, allItems.length);
        const newSlice = allItems.slice(start, end);
        if (inst) {
          inst.setItems(newSlice, targetIndex);
        }
        if (pageIndicator) {
          pageIndicator.textContent = `${start + 1}–${end} of ${allItems.length}`;
        }
        dots.forEach((d, i) => {
          d.classList.toggle('cat-page-dot--active', i === currentPage);
        });

        // Re-enable auto-advance on subsequent mouse interaction after landing
        setTimeout(() => {
          allowAutoAdvance = true;
        }, 550);
      }

      if (mountEl) {
        inst = new AccordionGallery(mountEl, {
          items: initialSlice,
          defaultIndex: Math.min(2, Math.max(0, initialSlice.length - 1)),
          accentColor: '#006cfe',
          overlayColor: '#ffffff',
          height: 260,
          gap: 12,
          radius: 16,
          expandRatio: 0.52,
          trigger: 'hover',
          showLabels: true,
          grayscale: false,
          tilt: 8,
          parallax: 0.5,
          onItemHover: handleItemHover,
          onActiveChange: handleItemHover,
          onGalleryLeave: handleGalleryLeave
        });
        allGalleryInstances.push(inst);
      }

      if (prevBtn) prevBtn.addEventListener('click', slidePrevious);
      if (nextBtn) nextBtn.addEventListener('click', slideNext);
      if (flankPrevBtn) flankPrevBtn.addEventListener('click', slidePrevious);
      if (flankNextBtn) flankNextBtn.addEventListener('click', slideNext);

      // Free-hand mouse drag and touch swipe directly on cards
      if (accordionViewport && totalPages > 1) {
        let isDragging = false;
        let dragStartX = 0;

        accordionViewport.addEventListener('mousedown', (e) => {
          if (e.target.closest('.ag-panel__enroll-btn') || e.target.closest('.cat-flank-slider-btn')) return;
          isDragging = true;
          dragStartX = e.clientX;
          accordionViewport.classList.add('is-dragging');
        });

        window.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            accordionViewport.classList.remove('is-dragging');
          }
        });

        accordionViewport.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const dx = e.clientX - dragStartX;
          if (Math.abs(dx) > 65) {
            isDragging = false;
            accordionViewport.classList.remove('is-dragging');
            if (dx < 0) {
              slideNext();
            } else {
              slidePrevious();
            }
          }
        });

        let touchStartX = 0;
        accordionViewport.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
          }
        }, { passive: true });

        accordionViewport.addEventListener('touchend', (e) => {
          if (e.changedTouches && e.changedTouches.length === 1) {
            const touchEndX = e.changedTouches[0].clientX;
            const tdx = touchEndX - touchStartX;
            if (Math.abs(tdx) > 50) {
              if (tdx < 0) {
                slideNext();
              } else {
                slidePrevious();
              }
            }
          }
        }, { passive: true });
      }
      dots.forEach(d => {
        d.addEventListener('click', () => {
          const p = parseInt(d.getAttribute('data-page'), 10);
          updatePage(p, 0);
        });
      });

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const isOpen = gridDrawer.classList.toggle('is-open');
          if (isOpen) {
            if (accordionStage) accordionStage.style.display = 'none';
            toggleBtn.querySelector('.toggle-icon').textContent = '↔';
            toggleBtn.querySelector('.toggle-text').textContent = 'Accordion Slider';
          } else {
            if (accordionStage) accordionStage.style.display = 'flex';
            toggleBtn.querySelector('.toggle-icon').textContent = '⊞';
            toggleBtn.querySelector('.toggle-text').textContent = `View All (${allItems.length})`;
          }
        });
      }
    });
  };

  // Export globally
  global.AccordionGallery = AccordionGallery;
  global.createAccordionGallery = function (container, options) {
    return new AccordionGallery(container, options);
  };
})(typeof window !== 'undefined' ? window : this);
