const fs = require('fs');
const path = require('path');

// 1. Load all 167 courses and image assignments
const allCourses = JSON.parse(fs.readFileSync('all_167_courses.json', 'utf8'));
const assignments = JSON.parse(fs.readFileSync('course_image_assignments.json', 'utf8'));

console.log('Courses count:', allCourses.length);
console.log('Assignments count:', assignments.length);

const imageMapBySlug = {};
const imageMapByName = {};
assignments.forEach(item => {
    imageMapBySlug[item.slug] = item.image;
    imageMapByName[item.name.toLowerCase()] = item.image;
});

// Update image on every course
const uniqueImages = new Set();
let missingCount = 0;

allCourses.forEach(c => {
    const slug = c.file ? c.file.replace(/\.html$/, '') : c.id;
    const img = imageMapBySlug[slug] || imageMapByName[c.name.toLowerCase()];
    if (!img) {
        console.error('Missing image for:', c.name, slug);
        missingCount++;
    } else {
        c.image = img;
        uniqueImages.add(img);
    }
});

console.log('Missing images count:', missingCount);
console.log('Unique images assigned:', uniqueImages.size);

// Save updated all_167_courses.json
fs.writeFileSync('all_167_courses.json', JSON.stringify(allCourses, null, 2));

// 2. Function to generate individual course detail page
function generateDetailPage(course, prevFile, nextFile) {
    const desc_main_paragraphs = (course.desc_main || '')
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);
    const desc_main_html = desc_main_paragraphs.map(p => `<p>${p}</p>`).join('\n    ');

    const key_learning_html = (course.key_learning || [])
        .map(item => `<li>${item}</li>`)
        .join('\n      ');

    const investment_bullets_html = (course.investment_bullets || [])
        .map(item => `<li>${item}</li>`)
        .join('\n      ');

    const reviews_html = (course.reviews || [])
        .map(r => `
      <div class="review-card">
        <div class="review-stars">★★★★★</div>
        <p class="review-text">"${r.text}"</p>
        <div class="reviewer-meta">
          <span class="reviewer-name">${r.name}</span>
          <span class="reviewer-loc">${r.location}</span>
        </div>
      </div>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${course.name} | ELITE TOOLISTIC</title>
  <meta name="description" content="${course.desc_short}"/>
  <meta name="keywords" content="${course.name}, professional certification, ELITE TOOLISTIC, online course, career growth" />
  
  <meta property="og:title" content="${course.name} | ELITE TOOLISTIC" />
  <meta property="og:description" content="${course.desc_short}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://www.elitetoolistic.com/${course.file}" />
  
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="cart.css"/>
  <style>
    .course-detail-hero {
      background: linear-gradient(135deg, rgba(12,27,51,0.92) 0%, rgba(12,27,51,0.98) 100%),
                  url('${course.image}') center/cover no-repeat;
      color: var(--white);
      padding: 5rem 5% 4rem;
      border-bottom: 2px solid var(--border);
      position: relative;
    }
    .hero-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.3);
      color: var(--white);
      padding: 10px 18px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      text-decoration: none;
      transition: var(--transition);
      z-index: 10;
    }
    .hero-nav-arrow:hover {
      background: var(--blue-accent);
      color: var(--navy-brand);
      border-color: var(--blue-accent);
    }
    .arrow-left { left: 5%; }
    .arrow-right { right: 5%; }

    .course-detail-hero h1 {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      line-height: 1.25;
      margin-bottom: 1.25rem;
      max-width: 900px;
    }
    .course-detail-hero .subtitle {
      font-size: 1.15rem;
      color: rgba(255,255,255,0.85);
      line-height: 1.7;
      max-width: 800px;
      margin-bottom: 2rem;
    }
    .course-detail-hero-badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: rgba(201,151,56,0.25);
      border: 1px solid rgba(201,151,56,0.6);
      color: #ffd885;
      padding: 5px 12px;
      margin-bottom: 1.5rem;
    }

    .course-content-section {
      padding: 4rem 5%;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3.5rem;
      background: var(--surface);
      border-bottom: 2px solid var(--border);
    }
    .about-course h2 {
      font-family: var(--font-serif);
      font-size: 1.55rem;
      font-weight: 700;
      margin: 2.25rem 0 1rem;
      color: var(--navy-brand);
    }
    .about-course h2:first-of-type {
      margin-top: 0;
    }
    .about-course p {
      font-size: 1rem;
      color: var(--ink-muted);
      line-height: 1.8;
      margin-bottom: 1.25rem;
    }
    .about-course ul {
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .about-course ul li {
      font-size: 0.98rem;
      color: var(--ink-muted);
      line-height: 1.75;
      margin-bottom: 0.5rem;
    }

    .info-boxes {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      position: sticky;
      top: 96px;
    }
    .info-box {
      background: var(--bg);
      padding: 2rem;
      border: 1.5px solid var(--border);
    }
    .info-box h3 {
      font-family: var(--font-serif);
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 0.6rem;
      color: var(--black);
    }
    .info-box p {
      font-size: 0.92rem;
      color: var(--ink-muted);
      line-height: 1.65;
    }

    .enroll-action {
      text-align: center;
      padding: 5rem 5%;
      background: var(--bg-subtle);
      border-bottom: 2px solid var(--border);
    }
    .enroll-btn-large {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 16px 36px;
      background: var(--navy-brand);
      color: var(--white);
      font-family: var(--font-mono);
      font-size: 0.95rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-decoration: none;
      transition: var(--transition);
      cursor: pointer;
      border: none;
    }
    .enroll-btn-large:hover {
      background: var(--blue-accent);
      color: var(--navy-brand);
    }

    .reviews-section {
      margin-top: 3.5rem;
      border-top: 2px solid var(--border);
      padding-top: 2.5rem;
    }
    .review-card {
      background: var(--bg);
      border: 1.5px solid var(--border);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .review-stars {
      color: #f59e0b;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    .review-text {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 0.98rem;
      color: var(--dark);
      line-height: 1.65;
      margin-bottom: 0;
    }

    @media (max-width: 900px) {
      .course-content-section { grid-template-columns: 1fr; }
      .info-boxes { position: relative; top: 0; }
      .hero-nav-arrow { position: static; transform: none; display: inline-block; margin: 10px 5px; }
      .course-detail-hero h1 { max-width: 100%; }
      .course-detail-hero .subtitle { max-width: 100%; }
    }
  </style>
  <link rel="icon" type="image/png" href="images/LOGO.png" />
</head>
<body>

<!-- NAVBAR -->
<nav id="navbar">
  <a href="index.html" class="nav-logo">
    <img src="images/new_elite_logo_transparent.png" alt="Elite Toolistic" />
    <div class="nav-brand-title">
      <span class="brand-name">ELITE TOOLISTIC</span>
      <span class="brand-sub">Academy of Certified Mastery</span>
    </div>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="courses.html" class="active">Courses</a></li>
    <li><a href="about.html">About Us</a></li>
    <li><a href="persona.html">Persona</a></li>
    <li><a href="team.html">Our Team</a></li>
  </ul>
  <a href="courses.html" class="nav-enroll">All Courses <span class="arrow">→</span></a>
  <div class="hamburger" id="hamburger"><span></span><span></span><span></span></div>
</nav>

<header class="course-detail-hero">
  <a href="${prevFile}" class="hero-nav-arrow arrow-left" aria-label="Previous Course">← Previous Course</a>
  
  <span class="course-detail-hero-badge">Certification Syllabus • ${course.category}</span>
  <h1>${course.name}</h1>
  <p class="subtitle">${course.desc_short}</p>

  <a href="${nextFile}" class="hero-nav-arrow arrow-right" aria-label="Next Course">Next Course →</a>
</header>

<section class="course-content-section">
  <div class="about-course">
    <h2>Curriculum Overview &amp; Foundations</h2>
    ${desc_main_html}

    <h2>Core Competency Modules</h2>
    <ul>
      ${key_learning_html}
    </ul>

    <h2>Candidate Profile &amp; Prerequisites</h2>
    <p>${course.ideal_for}</p>

    <h2>Anticipated Practical Outcomes</h2>
    <p>${course.outcomes}</p>

    <h2>Tuition &amp; Examination Investment</h2>
    <p><strong>Standard Program Fee:</strong> ₹${course.price}/-</p>
    <p>This comprehensive tuition covers:</p>
    <ul>
      ${investment_bullets_html}
    </ul>
    <p><strong>Curricular Duration:</strong> Structured ${course.duration} curriculum designed for rigorous practical capability acquisition, organizational leadership, and industry-oriented standards.</p>

    <div class="reviews-section">
      <h2>Candidate Commendations &amp; Evaluations</h2>
      <p style="margin-bottom: 2rem; color: var(--ink-muted);">Reflections from verified professionals who have completed this curriculum track:</p>
      ${reviews_html}
    </div>
  </div>
  
  <div class="info-boxes">
    <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
      <div class="info-box">
        <h3>Tuition Assessment</h3>
        <p>Complete professional certification program assessed at <strong>₹${course.price}/-</strong>. ${course.pricing_desc}</p>
      </div>
      <div class="info-box">
        <h3>Program Cadence</h3>
        <p>${course.duration_desc}</p>
      </div>
      <div class="info-box">
        <h3>Candidate Flexibility</h3>
        <p>${course.terms_desc}</p>
      </div>

      <div class="cart-actions" style="display: flex; gap: 10px; flex-direction: column;">
        <button class="add-to-cart-btn" data-course-id="${course.file}" data-course-name="${course.name}" data-course-price="${course.price}">Add to Cart</button>
        <button class="checkout-payalma-btn">Buy Now</button>
      </div>
    </div>
  </div>
</section>

<section class="enroll-action">
  <h2 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; margin-bottom: 1rem;">Commence Your Certification</h2>
  <p style="font-size: 1.05rem; color: var(--ink-muted); margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">Enroll today in ${course.name} and accelerate your technical execution competencies under certified professional mentorship.</p>
  <button class="enroll-btn-large checkout-payalma-btn" style="border:none; cursor:pointer;">Enroll &amp; Complete Registration →</button>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="footer-logo">
        <img src="images/LOGO.png" alt="ELITE TOOLISTIC Logo" style="height: 38px; width: auto;" />
      </div>
      <p>ELITE TOOLISTIC (OPC) PRIVATE LIMITED is a registered professional e-learning academy dedicated to career growth, skill certification, and executive training.</p>
      <div class="footer-contact">
        <p><strong>Registered Office:</strong> 1444, Gaur City 1, Sector 4, Greater Noida, Ghaziabad, UP 201318</p>
        <p><strong>Corporate Office:</strong> DLF Prime Towers, Okhla Industrial Estate Phase I, New Delhi 110020</p>
        <p style="margin-top:0.5rem">Email: <a href="mailto:support@elitetoolistic.com">support@elitetoolistic.com</a></p>
        <p>Phone: +91 7969654626 | +91 8062386662 | +91 2241507377</p>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="courses.html">All Courses</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="team.html">Our Team</a></li>
        <li><a href="persona.html">Persona Method</a></li>
        <li><a href="contact.html">Contact Us</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Student Resources</h4>
      <ul>
        <li><a href="exam-portal.html">Exam Portal</a></li>
        <li><a href="demo-exam-portal.html">Demo Exam</a></li>
        <li><a href="sample-certificate.html">Sample Certificate</a></li>
        <li><a href="sample-invoice.html">Sample Invoice</a></li>
        <li><a href="viewmou.html">MoU - Ministry of Education</a></li>
        <li><a href="viewmou-1.html">MoU - PMI University</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Policies &amp; Legal</h4>
      <ul>
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
        <li><a href="terms-conditions.html">Terms &amp; Conditions</a></li>
        <li><a href="refund-policy.html">Refund Policy</a></li>
        <li><a href="service-delivery.html">Service Delivery</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 ELITE TOOLISTIC (OPC) PRIVATE LIMITED. All rights reserved.</span>
    <span>Certified Professional E-Learning Provider</span>
  </div>
</footer>

<script src="cart.js"></script>
<script>
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
</script>
</body>
</html>`;
}

// 3. Generate all 167 detail pages
console.log('Writing detail pages...');
const totalLen = allCourses.length;
allCourses.forEach((course, index) => {
    const prev = allCourses[(index - 1 + totalLen) % totalLen];
    const next = allCourses[(index + 1) % totalLen];
    const html = generateDetailPage(course, prev.file, next.file);
    fs.writeFileSync(course.file, html, 'utf-8');
    if (fs.existsSync('courses') && fs.statSync('courses').isDirectory()) {
        fs.writeFileSync(path.join('courses', course.file), html, 'utf-8');
    }
});
console.log(`Generated ${totalLen} individual course detail pages successfully!`);

// 4. Build the catalog cards HTML
let catalog_cards_html = "";
allCourses.forEach(course => {
    let tag_class = "tag-beginner";
    if (course.difficulty === "Intermediate") {
        tag_class = "tag-intermediate";
    } else if (course.difficulty === "Advanced") {
        tag_class = "tag-advanced";
    }

    catalog_cards_html += `
    <div class="catalog-card" 
         data-name="${course.name.toLowerCase()}" 
         data-category="${course.category}" 
         data-price="${course.price_num}" 
         data-duration="${course.duration_days}" 
         data-difficulty="${course.difficulty}">
      <div class="course-image">
        <a href="${course.file}"><img src="${course.image}" alt="${course.name} Certification" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80'" /></a>
      </div>
      <div class="card-content" style="padding: 1.5rem; display:flex; flex-direction:column; flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
          <span class="catalog-tag ${tag_class}">${course.difficulty.toUpperCase()}</span>
          <span class="catalog-duration-pill" style="font-family:var(--font-mono); font-size:0.75rem; color:var(--ink-faint); font-weight:700;">${course.duration}</span>
        </div>
        <h3 style="font-family:var(--font-serif); font-size:1.18rem; font-weight:700; margin-bottom:0.75rem; line-height:1.35;"><a href="${course.file}" style="color:inherit; text-decoration:none;">${course.name}</a></h3>
        <p class="catalog-card-desc" style="font-size:0.88rem; color:var(--ink-muted); line-height:1.6; margin-bottom:1.25rem; flex-grow:1;">${course.desc_short}</p>
        <div class="catalog-price" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:1rem; margin-top:auto;">
          <span class="price" style="font-family:var(--font-mono); font-size:1.15rem; font-weight:700; color:var(--navy-brand);">₹${course.price}</span>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <a href="${course.file}" class="view-course-link" style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; text-transform:uppercase; text-decoration:underline;">View Details →</a>
            <button class="quick-add-btn" 
                    onclick="addToCart({id:'${course.file}', name:'${course.name.replace(/'/g, "\\'")}', price:'${course.price_num}'})" 
                    title="Add to cart"
                    style="background:var(--navy-brand); color:var(--white); border:none; padding:4px 8px; font-size:0.72rem; font-family:var(--font-mono); font-weight:700; cursor:pointer;">+ CART</button>
          </div>
        </div>
      </div>
    </div>`;
});

// Extract unique categories for filter dropdown
const categories = [...new Set(allCourses.map(c => c.category))].sort();

let categoryOptionsHtml = `<option value="all">All Domains (${allCourses.length})</option>`;
categories.forEach(cat => {
    const count = allCourses.filter(c => c.category === cat).length;
    categoryOptionsHtml += `<option value="${cat}">${cat} (${count})</option>`;
});

// 5. Generate courses.html with search & filters
const courses_page_html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>All Courses &amp; Certifications | ELITE TOOLISTIC</title>
  <meta name="description" content="Explore ELITE TOOLISTIC's complete register of ${allCourses.length} accredited professional certifications, executive diplomas, and specialized programs."/>
  <meta name="keywords" content="professional courses, corporate training, excel certification, leadership certificate, AI courses, construction project management, ELITE TOOLISTIC catalog" />
  
  <meta property="og:title" content="All Courses &amp; Certifications | ELITE TOOLISTIC" />
  <meta property="og:description" content="Explore our register of ${allCourses.length} professional certification diplomas." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.elitetoolistic.com/courses.html" />
  
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="cart.css"/>
  <link rel="icon" type="image/png" href="images/LOGO.png" />
  <style>
    .courses-page-hero {
      background: linear-gradient(135deg, var(--bg) 0%, var(--surface) 100%);
      border-bottom: 2px solid var(--border);
      padding: 4.5rem 5% 3.5rem;
    }
    .course-catalog { padding: 4rem 5% 5rem; background: var(--surface); border-bottom: 2px solid var(--border); }
    
    /* Search & Filter Controls */
    .filter-wrapper {
      background: var(--bg);
      border: 1.5px solid var(--border);
      padding: 1.5rem 2rem;
      margin-top: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }
    .filter-row-top {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .search-input-box {
      flex: 2;
      min-width: 260px;
      position: relative;
    }
    .search-input-box input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 2.75rem;
      border: 1.5px solid var(--border);
      background: var(--surface);
      font-family: inherit;
      font-size: 0.95rem;
      color: var(--black);
      outline: none;
      transition: var(--transition);
      box-sizing: border-box;
    }
    .search-input-box input:focus {
      border-color: var(--navy-brand);
      box-shadow: 0 0 0 3px rgba(12,27,51,0.08);
    }
    .search-input-box .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      color: var(--ink-faint);
      pointer-events: none;
    }
    .search-clear-btn {
      position: absolute;
      right: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--ink-faint);
      cursor: pointer;
      font-size: 1.1rem;
      display: none;
    }
    
    .filter-select-box {
      flex: 1;
      min-width: 190px;
      position: relative;
    }
    .filter-select-box select {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 1.5px solid var(--border);
      background: var(--surface);
      font-family: inherit;
      font-size: 0.92rem;
      color: var(--black);
      outline: none;
      cursor: pointer;
      transition: var(--transition);
      box-sizing: border-box;
    }
    .filter-select-box select:focus {
      border-color: var(--navy-brand);
    }

    .filter-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .results-count {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--ink-muted);
    }
    .results-count strong {
      color: var(--navy-brand);
    }
    .reset-btn {
      background: transparent;
      border: 1px solid var(--border);
      padding: 6px 14px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--ink-muted);
      cursor: pointer;
      transition: var(--transition);
    }
    .reset-btn:hover {
      background: var(--navy-brand);
      color: var(--white);
      border-color: var(--navy-brand);
    }

    .catalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 2rem; }
    
    .catalog-card {
      background: var(--surface); border: 1.5px solid var(--border);
      display: flex; flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .catalog-card:hover {
      background: var(--surface);
      border-color: var(--blue-accent);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    }
    
    .course-image {
      width: 100%;
      height: 190px;
      overflow: hidden;
      border-bottom: 1.5px solid var(--border);
      background: var(--bg);
    }
    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .catalog-card:hover .course-image img {
      transform: scale(1.03);
    }
    
    .catalog-tag {
      font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; padding: 2px 6px;
    }
    .tag-beginner { background: var(--blue-light); color: var(--navy-brand); border: 1px solid var(--blue-border); }
    .tag-intermediate { background: var(--blue-subtle); color: var(--navy-brand); border: 1px solid var(--blue-accent); }
    .tag-advanced { background: var(--navy-brand); color: var(--white); border: 1px solid var(--navy-brand); }
    
    .quick-add-btn:hover {
      background: var(--blue-accent) !important;
      color: var(--navy-brand) !important;
    }

    .no-results-state {
      display: none;
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg);
      border: 1.5px dashed var(--border);
      margin-top: 2rem;
    }
    .no-results-state h3 {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
      color: var(--black);
    }
    .no-results-state p {
      color: var(--ink-muted);
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1100px) {
      .catalog-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 750px) {
      .catalog-grid { grid-template-columns: 1fr; }
      .filter-row-top { flex-direction: column; align-items: stretch; }
      .search-input-box, .filter-select-box { width: 100%; }
    }
  </style>
</head>
<body>

<!-- NAVBAR -->
<nav id="navbar">
  <a href="index.html" class="nav-logo">
    <img src="images/new_elite_logo_transparent.png" alt="Elite Toolistic" />
    <div class="nav-brand-title">
      <span class="brand-name">ELITE TOOLISTIC</span>
      <span class="brand-sub">Academy of Certified Mastery</span>
    </div>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="courses.html" class="active">Courses</a></li>
    <li><a href="about.html">About Us</a></li>
    <li><a href="persona.html">Persona</a></li>
    <li><a href="team.html">Our Team</a></li>
  </ul>
  <a href="contact.html" class="nav-enroll">Contact Us <span class="arrow">→</span></a>
  <div class="hamburger" id="hamburger"><span></span><span></span><span></span></div>
</nav>

<section class="courses-page-hero">
  <p class="section-label-sm">Professional Learning Programs</p>
  <h1 class="page-hero-h1">All Courses &amp; Certifications</h1>
  <p class="page-hero-sub">${allCourses.length} accredited diplomas, executive masterclasses, and certified disciplines formulated for engineering practitioners, corporate managers, tech specialists, and organizational leaders.</p>
</section>

<section class="course-catalog">
  <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1rem;">
    <div>
      <p class="section-label-sm">Curriculum Directory</p>
      <h2 class="section-h2" style="margin-bottom:0;">Accredited Course Catalog</h2>
    </div>
  </div>

  <!-- SEARCH & FILTER TOOLBAR -->
  <div class="filter-wrapper">
    <div class="filter-row-top">
      <!-- Search Input -->
      <div class="search-input-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="courseSearchInput" placeholder="Search by course title, keywords, or skills..." autocomplete="off" />
        <button id="searchClearBtn" class="search-clear-btn" title="Clear search">✕</button>
      </div>

      <!-- Category Filter -->
      <div class="filter-select-box">
        <select id="categoryFilter" aria-label="Filter by Domain">
          ${categoryOptionsHtml}
        </select>
      </div>

      <!-- Price Sorting Dropdown -->
      <div class="filter-select-box">
        <select id="priceSortSelect" aria-label="Sort Courses">
          <option value="default">Sort by: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration-asc">Duration: Shortest First</option>
          <option value="duration-desc">Duration: Longest First</option>
          <option value="name-asc">Alphabetical (A - Z)</option>
        </select>
      </div>

      <!-- Price Range Filter -->
      <div class="filter-select-box" style="flex:0.8; min-width:160px;">
        <select id="priceRangeFilter" aria-label="Filter by Price Tier">
          <option value="all">All Fee Tiers</option>
          <option value="under-25">Under ₹25,000</option>
          <option value="25-50">₹25,000 – ₹50,000</option>
          <option value="above-50">Above ₹50,000</option>
        </select>
      </div>
    </div>

    <div class="filter-meta-row">
      <div class="results-count" id="resultsCount">
        Showing <strong id="shownCount">${allCourses.length}</strong> of <strong>${allCourses.length}</strong> Accredited Courses
      </div>
      <button class="reset-btn" id="resetFiltersBtn">Reset Filters</button>
    </div>
  </div>

  <!-- NO RESULTS NOTIFICATION -->
  <div class="no-results-state" id="noResultsState">
    <h3>No matching courses found</h3>
    <p>Try adjusting your search keywords, clearing your filters, or browsing all disciplines.</p>
    <button class="reset-btn" onclick="resetAllFilters()" style="padding:10px 22px;">Show All Courses</button>
  </div>

  <!-- CATALOG GRID -->
  <div class="catalog-grid" id="catalogGrid">
    ${catalog_cards_html}
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="footer-logo">
        <img src="images/LOGO.png" alt="ELITE TOOLISTIC Logo" style="height: 38px; width: auto;" />
      </div>
      <p>ELITE TOOLISTIC (OPC) PRIVATE LIMITED is a registered professional e-learning academy dedicated to career growth, skill certification, and executive training.</p>
      <div class="footer-contact">
        <p><strong>Registered Office:</strong> 1444, Gaur City 1, Sector 4, Greater Noida, Ghaziabad, UP 201318</p>
        <p><strong>Corporate Office:</strong> DLF Prime Towers, Okhla Industrial Estate Phase I, New Delhi 110020</p>
        <p style="margin-top:0.5rem">Email: <a href="mailto:support@elitetoolistic.com">support@elitetoolistic.com</a></p>
        <p>Phone: +91 7969654626 | +91 8062386662 | +91 2241507377</p>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="courses.html">All Courses</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="team.html">Our Team</a></li>
        <li><a href="persona.html">Persona Method</a></li>
        <li><a href="contact.html">Contact Us</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Student Resources</h4>
      <ul>
        <li><a href="exam-portal.html">Exam Portal</a></li>
        <li><a href="demo-exam-portal.html">Demo Exam</a></li>
        <li><a href="sample-certificate.html">Sample Certificate</a></li>
        <li><a href="sample-invoice.html">Sample Invoice</a></li>
        <li><a href="viewmou.html">MoU - Ministry of Education</a></li>
        <li><a href="viewmou-1.html">MoU - PMI University</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Policies &amp; Legal</h4>
      <ul>
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
        <li><a href="terms-conditions.html">Terms &amp; Conditions</a></li>
        <li><a href="refund-policy.html">Refund Policy</a></li>
        <li><a href="service-delivery.html">Service Delivery</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 ELITE TOOLISTIC (OPC) PRIVATE LIMITED. All rights reserved.</span>
    <span>Certified Professional E-Learning Provider</span>
  </div>
</footer>

<script src="cart.js"></script>
<script>
  // Mobile Nav Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // Interactive Search & Filters Logic
  (function() {
    const searchInput = document.getElementById('courseSearchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceSortSelect = document.getElementById('priceSortSelect');
    const priceRangeFilter = document.getElementById('priceRangeFilter');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const catalogGrid = document.getElementById('catalogGrid');
    const shownCountEl = document.getElementById('shownCount');
    const noResultsState = document.getElementById('noResultsState');

    if (!catalogGrid) return;

    // Grab all course cards
    const initialCards = Array.from(catalogGrid.querySelectorAll('.catalog-card'));
    initialCards.forEach((card, idx) => {
      card.dataset.defaultIndex = idx;
    });

    function applyFilters() {
      const query = (searchInput.value || '').trim().toLowerCase();
      const selectedCategory = categoryFilter.value;
      const selectedPriceRange = priceRangeFilter.value;
      const selectedSort = priceSortSelect.value;

      if (searchClearBtn) {
        searchClearBtn.style.display = query.length > 0 ? 'block' : 'none';
      }

      let visibleCards = initialCards.filter(card => {
        const name = card.dataset.name || '';
        const descEl = card.querySelector('.catalog-card-desc');
        const desc = descEl ? descEl.innerText.toLowerCase() : '';
        const category = card.dataset.category || '';
        const price = parseInt(card.dataset.price || '0', 10);

        if (query) {
          const matchesSearch = name.includes(query) || desc.includes(query) || category.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }

        if (selectedCategory !== 'all') {
          if (category !== selectedCategory) return false;
        }

        if (selectedPriceRange === 'under-25') {
          if (price >= 25000) return false;
        } else if (selectedPriceRange === '25-50') {
          if (price < 25000 || price > 50000) return false;
        } else if (selectedPriceRange === 'above-50') {
          if (price <= 50000) return false;
        }

        return true;
      });

      visibleCards.sort((a, b) => {
        const priceA = parseInt(a.dataset.price || '0', 10);
        const priceB = parseInt(b.dataset.price || '0', 10);
        const durA = parseInt(a.dataset.duration || '0', 10);
        const durB = parseInt(b.dataset.duration || '0', 10);
        const nameA = a.dataset.name || '';
        const nameB = b.dataset.name || '';
        const defaultA = parseInt(a.dataset.defaultIndex || '0', 10);
        const defaultB = parseInt(b.dataset.defaultIndex || '0', 10);

        switch (selectedSort) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'duration-asc':
            return durA - durB;
          case 'duration-desc':
            return durB - durA;
          case 'name-asc':
            return nameA.localeCompare(nameB);
          default:
            return defaultA - defaultB;
        }
      });

      catalogGrid.innerHTML = '';
      if (visibleCards.length === 0) {
        if (noResultsState) noResultsState.style.display = 'block';
      } else {
        if (noResultsState) noResultsState.style.display = 'none';
        visibleCards.forEach(card => catalogGrid.appendChild(card));
      }

      if (shownCountEl) {
        shownCountEl.innerText = visibleCards.length;
      }
    }

    window.resetAllFilters = function() {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      if (priceSortSelect) priceSortSelect.value = 'default';
      if (priceRangeFilter) priceRangeFilter.value = 'all';
      applyFilters();
    };

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        applyFilters();
        searchInput.focus();
      });
    }
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (priceSortSelect) priceSortSelect.addEventListener('change', applyFilters);
    if (priceRangeFilter) priceRangeFilter.addEventListener('change', applyFilters);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', window.resetAllFilters);
  })();
</script>
</body>
</html>`;

fs.writeFileSync('courses.html', courses_page_html, 'utf-8');
console.log('Successfully updated courses.html and all course detail pages with verified unique images!');
