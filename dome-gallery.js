/**
 * DomeGallery — Interactive 3D Spherical Course Gallery
 * Direct high-performance JavaScript implementation based on React Bits <DomeGallery />
 * Built for ELITE TOOLISTIC Academy of Professional Mastery
 */

(function (global) {
  'use strict';

  const DEFAULTS = {
    fit: 0.58,
    fitBasis: 'auto',
    minRadius: 560,
    maxRadius: 1400,
    padFactor: 0.2,
    overlayBlurColor: '#ffffff',
    maxVerticalRotationDeg: 16,
    dragSensitivity: 20,
    enlargeTransitionMs: 350,
    segments: 35,
    dragDampening: 2,
    openedImageWidth: '440px',
    openedImageHeight: '440px',
    imageBorderRadius: '14px',
    openedImageBorderRadius: '20px',
    grayscale: false,
    autoRotate: true,
    autoRotateSpeed: 0.04
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const normalizeAngle = d => ((d % 360) + 360) % 360;
  const wrapAngleSigned = deg => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
  };
  const getDataNumber = (el, name, fallback) => {
    const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
  };

  /**
   * Smart course title formatter:
   * Keeps titles clean, elegant, and strictly under 2 lines on 3D tiles.
   * Eliminates text overflow, peeking lines, and cut-off text at the bottom edge.
   */
  function formatTileTitle(title) {
    if (!title) return '';
    const clean = title.trim();
    if (clean.length <= 30) return clean;
    const words = clean.split(/\s+/);
    let res = '';
    for (const w of words) {
      if ((res ? res + ' ' + w : w).length > 28) break;
      res = res ? res + ' ' + w : w;
    }
    const base = (res || clean.slice(0, 26)).replace(/[\s,\-&/:]+$/, '');
    return base + '...';
  }

  function buildItems(pool, seg) {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (!pool || pool.length === 0) {
      return coords.map(c => ({
        ...c,
        src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        alt: 'Professional Course',
        name: 'Professional Course',
        file: 'courses.html',
        category: 'Certification',
        price: '₹2,999'
      }));
    }

    const normalizedImages = pool.map(item => {
      if (typeof item === 'string') {
        return {
          src: item,
          alt: 'Elite Course',
          name: 'Professional Course',
          file: 'courses.html',
          category: 'Accredited Curriculum',
          price: '₹2,999'
        };
      }
      return {
        src: item.src || item.image || '',
        alt: item.alt || item.name || 'Elite Course',
        name: item.name || 'Executive Certification',
        file: item.file || (item.slug ? `${item.slug}.html` : 'courses.html'),
        category: item.category || 'Executive Track',
        price: item.price || '₹2,999',
        desc_short: item.desc_short || 'Comprehensive academic syllabus with verifiable credential verification.'
      };
    });

    const usedImages = Array.from(
      { length: totalSlots },
      (_, i) => normalizedImages[i % normalizedImages.length]
    );

    // Shuffle slight neighbors to prevent repeats
    for (let i = 1; i < usedImages.length; i++) {
      if (usedImages[i].src === usedImages[i - 1].src && usedImages.length > 2) {
        for (let j = i + 1; j < usedImages.length; j++) {
          if (usedImages[j].src !== usedImages[i].src) {
            const tmp = usedImages[i];
            usedImages[i] = usedImages[j];
            usedImages[j] = tmp;
            break;
          }
        }
      }
    }

    return coords.map((c, i) => ({
      ...c,
      ...usedImages[i]
    }));
  }

  function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
  }

  class DomeGalleryInstance {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) {
        console.error('[DomeGallery] Target container not found:', container);
        return;
      }

      this.opts = Object.assign({}, DEFAULTS, options);
      this.images = this.opts.images || [];
      this.items = [];

      this.rotation = { x: 0, y: 0 };
      this.startRot = { x: 0, y: 0 };
      this.startPos = null;
      this.lastPos = null;
      this.lastTime = 0;
      this.dragging = false;
      this.moved = false;
      this.inertiaRAF = null;
      this.ambientRAF = null;
      this.opening = false;
      this.openStartedAt = 0;
      this.lastDragEndAt = 0;
      this.idleTimeout = null;
      this.autoRotateActive = this.opts.autoRotate;

      this.focusedEl = null;
      this.originalTilePos = null;
      this.lockedRadius = 600;

      this.init();
    }

    init() {
      this.items = buildItems(this.images, this.opts.segments);
      this.renderDOM();
      this.setupResizeObserver();
      this.setupGestures();
      this.setupViewerClose();
      this.applyTransform(this.rotation.x, this.rotation.y);

      if (this.opts.autoRotate) {
        this.startAmbientDrift();
      }
    }

    updateImages(newImages) {
      if (!newImages || newImages.length === 0) return;
      this.images = newImages;
      this.items = buildItems(this.images, this.opts.segments);
      this.refreshTiles();
    }

    renderDOM() {
      this.container.innerHTML = `
        <div class="sphere-root" style="
          --segments-x: ${this.opts.segments};
          --segments-y: ${this.opts.segments};
          --overlay-blur-color: ${this.opts.overlayBlurColor};
          --tile-radius: ${this.opts.imageBorderRadius};
          --enlarge-radius: ${this.opts.openedImageBorderRadius};
          --image-filter: ${this.opts.grayscale ? 'grayscale(1)' : 'none'};
        ">
          <main class="sphere-main">
            <div class="stage">
              <div class="sphere"></div>
            </div>
            <div class="overlay"></div>
            <div class="overlay overlay--blur"></div>
            <div class="edge-fade edge-fade--top"></div>
            <div class="edge-fade edge-fade--bottom"></div>
            <div class="edge-fade edge-fade--left"></div>
            <div class="edge-fade edge-fade--right"></div>
            <div class="viewer">
              <div class="scrim"></div>
              <div class="frame"></div>
            </div>
          </main>
        </div>
      `;

      this.rootEl = this.container.querySelector('.sphere-root');
      this.mainEl = this.container.querySelector('.sphere-main');
      this.sphereEl = this.container.querySelector('.sphere');
      this.frameEl = this.container.querySelector('.viewer .frame');
      this.viewerEl = this.container.querySelector('.viewer');
      this.scrimEl = this.container.querySelector('.viewer .scrim');

      this.refreshTiles();
    }

    refreshTiles() {
      if (!this.sphereEl) return;
      const html = this.items
        .map(
          (it, i) => `
        <div class="item"
          data-src="${it.src}"
          data-title="${it.name ? it.name.replace(/"/g, '&quot;') : ''}"
          data-file="${it.file || ''}"
          data-category="${it.category ? it.category.replace(/"/g, '&quot;') : ''}"
          data-price="${it.price || ''}"
          data-desc="${it.desc_short ? it.desc_short.replace(/"/g, '&quot;') : ''}"
          data-offset-x="${it.x}"
          data-offset-y="${it.y}"
          data-size-x="${it.sizeX}"
          data-size-y="${it.sizeY}"
          style="--offset-x: ${it.x}; --offset-y: ${it.y}; --item-size-x: ${it.sizeX}; --item-size-y: ${it.sizeY};">
          <div class="item__image" role="button" tabindex="0" aria-label="${it.name || it.alt}">
            <img src="${it.src}" draggable="false" loading="lazy" alt="${it.alt || it.name}" />
            <div class="tile-corner-title" title="${(it.name || '').replace(/"/g, '&quot;')}">
              <span class="tile-title-text">${formatTileTitle(it.name)}</span>
            </div>
          </div>
        </div>
      `
        )
        .join('');

      this.sphereEl.innerHTML = html;

      // Attach tile click handlers
      const tiles = this.sphereEl.querySelectorAll('.item__image');
      tiles.forEach(tile => {
        tile.addEventListener('click', e => this.onTileClick(e, tile));
      });
    }

    applyTransform(xDeg, yDeg) {
      if (this.sphereEl) {
        this.sphereEl.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
      }
    }

    setupResizeObserver() {
      const ro = new ResizeObserver(entries => {
        const cr = entries[0].contentRect;
        const w = Math.max(1, cr.width);
        const h = Math.max(1, cr.height);
        const minDim = Math.min(w, h);
        const maxDim = Math.max(w, h);
        const aspect = w / h;

        let basis;
        switch (this.opts.fitBasis) {
          case 'min':
            basis = minDim;
            break;
          case 'max':
            basis = maxDim;
            break;
          case 'width':
            basis = w;
            break;
          case 'height':
            basis = h;
            break;
          default:
            basis = aspect >= 1.3 ? w : minDim;
        }

        let radius = basis * this.opts.fit;
        const heightGuard = h * 1.35;
        radius = Math.min(radius, heightGuard);
        radius = clamp(radius, this.opts.minRadius, this.opts.maxRadius);
        this.lockedRadius = Math.round(radius);

        const viewerPad = Math.max(8, Math.round(minDim * this.opts.padFactor));
        this.rootEl.style.setProperty('--radius', `${this.lockedRadius}px`);
        this.rootEl.style.setProperty('--viewer-pad', `${viewerPad}px`);

        this.applyTransform(this.rotation.x, this.rotation.y);
      });

      ro.observe(this.rootEl);
      this.resizeObserver = ro;
    }

    setupGestures() {
      let velocityX = 0;
      let velocityY = 0;

      const onPointerDown = e => {
        if (this.focusedEl || this.opening) return;
        this.stopInertia();
        this.pauseAmbientDrift();

        this.dragging = true;
        this.moved = false;
        this.startRot = { ...this.rotation };
        this.startPos = { x: e.clientX, y: e.clientY };
        this.lastPos = { x: e.clientX, y: e.clientY };
        this.lastTime = performance.now();
        velocityX = 0;
        velocityY = 0;

        try {
          this.mainEl.setPointerCapture(e.pointerId);
        } catch (_) {}
      };

      const onPointerMove = e => {
        if (!this.dragging || !this.startPos) return;

        const now = performance.now();
        const dt = Math.max(1, now - this.lastTime);
        const dxStep = e.clientX - this.lastPos.x;
        const dyStep = e.clientY - this.lastPos.y;

        // Instant velocity estimation
        velocityX = dxStep / dt;
        velocityY = dyStep / dt;

        this.lastPos = { x: e.clientX, y: e.clientY };
        this.lastTime = now;

        const dxTotal = e.clientX - this.startPos.x;
        const dyTotal = e.clientY - this.startPos.y;

        if (!this.moved) {
          if (dxTotal * dxTotal + dyTotal * dyTotal > 16) {
            this.moved = true;
          }
        }

        const nextX = clamp(
          this.startRot.x - dyTotal / this.opts.dragSensitivity,
          -this.opts.maxVerticalRotationDeg,
          this.opts.maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(this.startRot.y + dxTotal / this.opts.dragSensitivity);

        if (this.rotation.x !== nextX || this.rotation.y !== nextY) {
          this.rotation = { x: nextX, y: nextY };
          this.applyTransform(nextX, nextY);
        }
      };

      const onPointerUp = e => {
        if (!this.dragging) return;
        this.dragging = false;

        try {
          this.mainEl.releasePointerCapture(e.pointerId);
        } catch (_) {}

        if (this.moved) {
          this.lastDragEndAt = performance.now();
        }

        // Apply inertia if release velocity is significant
        const vx = clamp(velocityX * 22, -1.4, 1.4);
        const vy = clamp(velocityY * 22, -1.4, 1.4);

        if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
          this.startInertia(vx, vy);
        } else {
          this.scheduleAmbientDriftResume();
        }

        this.moved = false;
      };

      this.mainEl.addEventListener('pointerdown', onPointerDown);
      this.mainEl.addEventListener('pointermove', onPointerMove);
      this.mainEl.addEventListener('pointerup', onPointerUp);
      this.mainEl.addEventListener('pointercancel', onPointerUp);

      // Also forward drags from the free-hand background hero overlay
      this.bindHeroOverlayDrag();
    }

    bindHeroOverlayDrag() {
      const heroArea = document.querySelector('.hero');
      if (!heroArea) return;

      // Allow dragging on empty regions of hero section
      heroArea.addEventListener('pointerdown', e => {
        // If clicking on an anchor, button, input, or inside enlarged modal, do not intercept
        if (
          e.target.closest('a, button, input, select, textarea, .hero-actions, .hero-controls, .enlarge') ||
          this.focusedEl
        ) {
          return;
        }
        // Dispatch to mainEl
        this.mainEl.dispatchEvent(
          new PointerEvent('pointerdown', {
            clientX: e.clientX,
            clientY: e.clientY,
            pointerId: e.pointerId,
            bubbles: true
          })
        );
      });
    }

    stopInertia() {
      if (this.inertiaRAF) {
        cancelAnimationFrame(this.inertiaRAF);
        this.inertiaRAF = null;
      }
    }

    startInertia(vx, vy) {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(this.opts.dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);

      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;

        if ((Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) || ++frames > maxFrames) {
          this.inertiaRAF = null;
          this.scheduleAmbientDriftResume();
          return;
        }

        const nextX = clamp(
          this.rotation.x - vY / 200,
          -this.opts.maxVerticalRotationDeg,
          this.opts.maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(this.rotation.y + vX / 200);

        this.rotation = { x: nextX, y: nextY };
        this.applyTransform(nextX, nextY);
        this.inertiaRAF = requestAnimationFrame(step);
      };

      this.stopInertia();
      this.inertiaRAF = requestAnimationFrame(step);
    }

    startAmbientDrift() {
      if (this.ambientRAF) return;
      const drift = () => {
        if (!this.dragging && !this.focusedEl && this.autoRotateActive) {
          const nextY = wrapAngleSigned(this.rotation.y + this.opts.autoRotateSpeed);
          this.rotation.y = nextY;
          this.applyTransform(this.rotation.x, nextY);
        }
        this.ambientRAF = requestAnimationFrame(drift);
      };
      this.ambientRAF = requestAnimationFrame(drift);
    }

    pauseAmbientDrift() {
      if (this.idleTimeout) {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = null;
      }
    }

    scheduleAmbientDriftResume() {
      if (!this.autoRotateActive) return;
      this.pauseAmbientDrift();
      this.idleTimeout = setTimeout(() => {
        this.startAmbientDrift();
      }, 1600);
    }

    toggleAutoRotate() {
      this.autoRotateActive = !this.autoRotateActive;
      if (this.autoRotateActive) {
        this.startAmbientDrift();
      }
      return this.autoRotateActive;
    }

    resetRotation() {
      this.stopInertia();
      const startX = this.rotation.x;
      const startY = this.rotation.y;
      const startTime = performance.now();
      const duration = 500;

      const animateReset = now => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentX = startX * (1 - ease);
        const currentY = wrapAngleSigned(startY * (1 - ease));

        this.rotation = { x: currentX, y: currentY };
        this.applyTransform(currentX, currentY);

        if (progress < 1) {
          requestAnimationFrame(animateReset);
        }
      };

      requestAnimationFrame(animateReset);
    }

    onTileClick(e, el) {
      if (this.dragging || this.moved) return;
      if (performance.now() - this.lastDragEndAt < 120) return;

      const parent = el.closest('.item') || el.parentElement;
      const courseFile = parent?.dataset.file || '';

      // Instant tactile tap feedback
      el.classList.add('tile-clicked');

      // Smart redirect to All Courses page
      const targetUrl = courseFile
        ? `courses.html?highlight=${encodeURIComponent(courseFile)}#catalog`
        : 'courses.html#catalog';

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 90);
    }

    openItemFromElement(el) {
      if (this.opening) return;
      this.opening = true;
      this.openStartedAt = performance.now();
      this.pauseAmbientDrift();

      document.body.classList.add('dg-scroll-lock');

      const parent = el.parentElement;
      this.focusedEl = el;
      el.setAttribute('data-focused', 'true');

      const offsetX = getDataNumber(parent, 'offsetX', 0);
      const offsetY = getDataNumber(parent, 'offsetY', 0);
      const sizeX = getDataNumber(parent, 'sizeX', 2);
      const sizeY = getDataNumber(parent, 'sizeY', 2);

      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, this.opts.segments);
      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(this.rotation.y);

      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - this.rotation.x;

      parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

      const refDiv = document.createElement('div');
      refDiv.className = 'item__image item__image--reference';
      refDiv.style.opacity = '0';
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
      parent.appendChild(refDiv);

      void refDiv.offsetHeight;

      const tileR = refDiv.getBoundingClientRect();
      const mainR = this.mainEl.getBoundingClientRect();
      const frameR = this.frameEl.getBoundingClientRect();

      if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
        this.opening = false;
        this.focusedEl = null;
        parent.removeChild(refDiv);
        document.body.classList.remove('dg-scroll-lock');
        return;
      }

      this.originalTilePos = {
        left: tileR.left,
        top: tileR.top,
        width: tileR.width,
        height: tileR.height
      };

      el.style.visibility = 'hidden';
      el.style.zIndex = '0';

      const overlay = document.createElement('div');
      overlay.className = 'enlarge';
      overlay.style.position = 'absolute';
      overlay.style.left = `${frameR.left - mainR.left}px`;
      overlay.style.top = `${frameR.top - mainR.top}px`;
      overlay.style.width = `${frameR.width}px`;
      overlay.style.height = `${frameR.height}px`;
      overlay.style.opacity = '0';
      overlay.style.zIndex = '30';
      overlay.style.willChange = 'transform, opacity';
      overlay.style.transformOrigin = 'top left';
      overlay.style.transition = `transform ${this.opts.enlargeTransitionMs}ms ease, opacity ${this.opts.enlargeTransitionMs}ms ease`;

      const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
      const courseTitle = parent.dataset.title || 'Executive Certification';
      const courseFile = parent.dataset.file || 'courses.html';
      const courseCategory = parent.dataset.category || 'Accredited Curriculum';
      const coursePrice = parent.dataset.price || '₹2,999';
      const courseDesc = parent.dataset.desc || 'Comprehensive syllabus designed for working professionals and ambitious leaders.';

      overlay.innerHTML = `
        <img src="${rawSrc}" alt="${courseTitle}" />
        <button class="enlarge-close-btn" title="Close" aria-label="Close">✕</button>
        <div class="enlarge-card-content">
          <span class="enlarge-badge">§ ${courseCategory}</span>
          <h3 class="enlarge-title">${courseTitle}</h3>
          <p class="enlarge-desc">${courseDesc}</p>
          <div class="enlarge-footer">
            <span class="enlarge-price">${coursePrice}</span>
            <a href="${courseFile}" class="enlarge-cta">
              View Curriculum <span>→</span>
            </a>
          </div>
        </div>
      `;

      this.viewerEl.appendChild(overlay);

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;
      const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
      const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;

      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

      setTimeout(() => {
        if (!overlay.parentElement) return;
        overlay.style.opacity = '1';
        overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
        this.rootEl.setAttribute('data-enlarging', 'true');
      }, 16);

      // Close button handler
      const closeBtn = overlay.querySelector('.enlarge-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.stopPropagation();
          this.closeEnlarged();
        });
      }

      // Smooth custom resize to opened size
      const wantsResize = this.opts.openedImageWidth || this.opts.openedImageHeight;
      if (wantsResize) {
        const onFirstEnd = ev => {
          if (ev.propertyName !== 'transform') return;
          overlay.removeEventListener('transitionend', onFirstEnd);

          const prevTransition = overlay.style.transition;
          overlay.style.transition = 'none';

          const tempWidth = this.opts.openedImageWidth || `${frameR.width}px`;
          const tempHeight = this.opts.openedImageHeight || `${frameR.height}px`;

          overlay.style.width = tempWidth;
          overlay.style.height = tempHeight;
          const newRect = overlay.getBoundingClientRect();
          overlay.style.width = `${frameR.width}px`;
          overlay.style.height = `${frameR.height}px`;
          void overlay.offsetWidth;

          overlay.style.transition = `left ${this.opts.enlargeTransitionMs}ms ease, top ${this.opts.enlargeTransitionMs}ms ease, width ${this.opts.enlargeTransitionMs}ms ease, height ${this.opts.enlargeTransitionMs}ms ease`;

          const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;

          requestAnimationFrame(() => {
            overlay.style.left = `${centeredLeft}px`;
            overlay.style.top = `${centeredTop}px`;
            overlay.style.width = tempWidth;
            overlay.style.height = tempHeight;
          });

          const cleanupSecond = () => {
            overlay.removeEventListener('transitionend', cleanupSecond);
            overlay.style.transition = prevTransition;
          };
          overlay.addEventListener('transitionend', cleanupSecond, { once: true });
        };
        overlay.addEventListener('transitionend', onFirstEnd);
      }
    }

    closeEnlarged() {
      if (performance.now() - this.openStartedAt < 250) return;
      const el = this.focusedEl;
      if (!el) return;

      const parent = el.parentElement;
      const overlay = this.viewerEl.querySelector('.enlarge');
      if (!overlay) return;

      const refDiv = parent.querySelector('.item__image--reference');
      const originalPos = this.originalTilePos;

      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        el.style.visibility = '';
        el.style.zIndex = '0';
        this.focusedEl = null;
        this.rootEl.removeAttribute('data-enlarging');
        this.opening = false;
        document.body.classList.remove('dg-scroll-lock');
        this.scheduleAmbientDriftResume();
        return;
      }

      const currentRect = overlay.getBoundingClientRect();
      const rootRect = this.rootEl.getBoundingClientRect();

      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height
      };

      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height
      };

      const animatingOverlay = document.createElement('div');
      animatingOverlay.className = 'enlarge-closing';
      animatingOverlay.style.cssText = `
        position: absolute;
        left: ${overlayRelativeToRoot.left}px;
        top: ${overlayRelativeToRoot.top}px;
        width: ${overlayRelativeToRoot.width}px;
        height: ${overlayRelativeToRoot.height}px;
        z-index: 9999;
        border-radius: var(--enlarge-radius, 20px);
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        transition: all ${this.opts.enlargeTransitionMs}ms ease-out;
        pointer-events: none;
        margin: 0;
        transform: none;
      `;

      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const img = originalImg.cloneNode();
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        animatingOverlay.appendChild(img);
      }

      overlay.remove();
      this.rootEl.appendChild(animatingOverlay);
      void animatingOverlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        animatingOverlay.style.left = `${originalPosRelativeToRoot.left}px`;
        animatingOverlay.style.top = `${originalPosRelativeToRoot.top}px`;
        animatingOverlay.style.width = `${originalPosRelativeToRoot.width}px`;
        animatingOverlay.style.height = `${originalPosRelativeToRoot.height}px`;
        animatingOverlay.style.opacity = '0';
      });

      const cleanup = () => {
        animatingOverlay.remove();
        this.originalTilePos = null;
        if (refDiv) refDiv.remove();

        parent.style.transition = 'none';
        el.style.transition = 'none';
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');

        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          el.style.zIndex = '0';
          this.focusedEl = null;
          this.rootEl.removeAttribute('data-enlarging');

          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 300ms ease-out';

            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                this.opening = false;
                document.body.classList.remove('dg-scroll-lock');
                this.scheduleAmbientDriftResume();
              }, 300);
            });
          });
        });
      };

      animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
    }

    setupViewerClose() {
      if (this.scrimEl) {
        this.scrimEl.addEventListener('click', () => this.closeEnlarged());
      }
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.focusedEl) {
          this.closeEnlarged();
        }
      });
    }

    destroy() {
      this.stopInertia();
      this.pauseAmbientDrift();
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
  }

  // Export globally
  global.DomeGallery = DomeGalleryInstance;

  // Auto-init helper
  global.initHeroDomeGallery = async function (containerSelector = '#dome-gallery-container') {
    const el = document.querySelector(containerSelector);
    if (!el) return null;

    let coursesData = [];
    try {
      const resp = await fetch('all_167_courses.json');
      if (resp.ok) {
        coursesData = await resp.json();
      }
    } catch (e) {
      console.warn('[DomeGallery] Could not load all_167_courses.json, attempting fallback', e);
    }

    if (!coursesData || coursesData.length === 0) {
      try {
        const resp2 = await fetch('course_image_assignments.json');
        if (resp2.ok) {
          coursesData = await resp2.json();
        }
      } catch (_) {}
    }

    const gallery = new DomeGalleryInstance(el, {
      images: coursesData,
      grayscale: false,
      fit: 0.62,
      minRadius: 600,
      maxRadius: 1400,
      segments: 35,
      overlayBlurColor: '#ffffff',
      maxVerticalRotationDeg: 15,
      dragSensitivity: 18,
      openedImageWidth: '440px',
      openedImageHeight: '440px',
      imageBorderRadius: '14px',
      openedImageBorderRadius: '20px',
      autoRotate: true,
      autoRotateSpeed: 0.04
    });

    return gallery;
  };
})(typeof window !== 'undefined' ? window : this);
