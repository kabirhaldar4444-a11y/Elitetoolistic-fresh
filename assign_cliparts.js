const fs = require('fs');
const path = require('path');

// 1. Run setup_cliparts first to ensure all SVGs exist in images/cliparts/
require('./setup_cliparts.js');

// 2. Define Category to Clip Art mappings
const categoryCliparts = {
  'AI & Modern Workflows': [
    'images/cliparts/clipart_ai_robotics.svg',
    'images/cliparts/clipart_ai_workflow.svg',
    'images/cliparts/clipart_tech_coding.svg'
  ],
  'Construction: Project Management & Billing': [
    'images/cliparts/clipart_pm_building.svg',
    'images/cliparts/clipart_pm_finance.svg',
    'images/cliparts/clipart_business_project.svg'
  ],
  'Construction: Site Operations & Safety': [
    'images/cliparts/clipart_safety_site.svg',
    'images/cliparts/clipart_safety_env.svg',
    'images/cliparts/clipart_civil_construct.svg'
  ],
  'Construction: Design Coordination & BIM': [
    'images/cliparts/clipart_bim_architecture.svg',
    'images/cliparts/clipart_bim_engineering.svg',
    'images/cliparts/clipart_materials_build.svg'
  ],
  'Construction: Materials, Finishes & Tech': [
    'images/cliparts/clipart_materials_tech.svg',
    'images/cliparts/clipart_materials_build.svg',
    'images/cliparts/clipart_civil_construct.svg'
  ],
  'Corporate Operations & Logistics': [
    'images/cliparts/clipart_logistics_ops.svg',
    'images/cliparts/clipart_logistics_fleet.svg',
    'images/cliparts/clipart_business_project.svg'
  ],
  'Business & Management': [
    'images/cliparts/clipart_business_mgmt.svg',
    'images/cliparts/clipart_business_project.svg',
    'images/cliparts/clipart_pm_finance.svg'
  ],
  'Technology & Digital Skills': [
    'images/cliparts/clipart_tech_coding.svg',
    'images/cliparts/clipart_tech_circuit.svg',
    'images/cliparts/clipart_ai_robotics.svg'
  ],
  'Professional Development': [
    'images/cliparts/clipart_prof_doodle.svg',
    'images/cliparts/clipart_prof_launch.svg',
    'images/cliparts/clipart_career_growth.svg'
  ],
  'Marketing & Communication': [
    'images/cliparts/clipart_marketing_comm.svg',
    'images/cliparts/clipart_marketing_launch.svg',
    'images/cliparts/clipart_business_mgmt.svg'
  ],
  'Career Development': [
    'images/cliparts/clipart_career_growth.svg',
    'images/cliparts/clipart_career_study.svg',
    'images/cliparts/clipart_prof_doodle.svg'
  ],
  'Productivity & Office Skills': [
    'images/cliparts/clipart_productivity_office.svg',
    'images/cliparts/clipart_productivity_dash.svg',
    'images/cliparts/clipart_tech_coding.svg'
  ],
  'Construction & Engineering': [
    'images/cliparts/clipart_civil_eng.svg',
    'images/cliparts/clipart_civil_construct.svg',
    'images/cliparts/clipart_bim_engineering.svg'
  ],
  'Additional Professional Skills': [
    'images/cliparts/clipart_exec_skills.svg',
    'images/cliparts/clipart_exec_medicine.svg',
    'images/cliparts/clipart_career_growth.svg'
  ]
};

// Fallback pool for any unmapped category
const generalPool = [
  'images/cliparts/clipart_civil_eng.svg',
  'images/cliparts/clipart_pm_building.svg',
  'images/cliparts/clipart_ai_robotics.svg',
  'images/cliparts/clipart_tech_coding.svg',
  'images/cliparts/clipart_prof_doodle.svg',
  'images/cliparts/clipart_logistics_fleet.svg',
  'images/cliparts/clipart_business_mgmt.svg'
];

// 3. Update all_167_courses.json
const coursesPath = path.join(__dirname, 'all_167_courses.json');
if (fs.existsSync(coursesPath)) {
  const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
  courses.forEach((c, index) => {
    const pool = categoryCliparts[c.category] || generalPool;
    c.image = pool[index % pool.length];
  });
  fs.writeFileSync(coursesPath, JSON.stringify(courses, null, 2), 'utf8');
  console.log(`Updated all ${courses.length} courses in all_167_courses.json with domain clip arts!`);
}

// 4. Update accordion-gallery.js fallback images
const accordionJsPath = path.join(__dirname, 'accordion-gallery.js');
if (fs.existsSync(accordionJsPath)) {
  let content = fs.readFileSync(accordionJsPath, 'utf8');
  
  // Replace CATEGORY_FALLBACK_IMAGES object in accordion-gallery.js
  const fallbackImagesBlock = `const CATEGORY_FALLBACK_IMAGES = ${JSON.stringify(categoryCliparts, null, 6)};`;
  content = content.replace(/const CATEGORY_FALLBACK_IMAGES = \{[\s\S]*?\n    \};/, fallbackImagesBlock);
  
  fs.writeFileSync(accordionJsPath, content, 'utf8');
  console.log('Updated CATEGORY_FALLBACK_IMAGES in accordion-gallery.js!');
}

// 5. Update components/DomeGallery.jsx default images
const domeGalleryJsxPath = path.join(__dirname, 'components', 'DomeGallery.jsx');
if (fs.existsSync(domeGalleryJsxPath)) {
  let content = fs.readFileSync(domeGalleryJsxPath, 'utf8');
  const domeDefaultImages = `const DEFAULT_IMAGES = [
  { src: 'images/cliparts/clipart_civil_eng.svg', alt: 'Civil & Structural Engineering' },
  { src: 'images/cliparts/clipart_pm_building.svg', alt: 'Construction Project Management' },
  { src: 'images/cliparts/clipart_ai_robotics.svg', alt: 'AI, Machine Learning & Robotics' },
  { src: 'images/cliparts/clipart_tech_coding.svg', alt: 'IT, Cloud & Cybersecurity' },
  { src: 'images/cliparts/clipart_logistics_fleet.svg', alt: 'Drone, Aviation & Aerospace' },
  { src: 'images/cliparts/clipart_prof_doodle.svg', alt: 'Executive Leadership & Study' },
  { src: 'images/cliparts/clipart_business_mgmt.svg', alt: 'Business, Finance & Analytics' }
];`;
  content = content.replace(/const DEFAULT_IMAGES = \[[\s\S]*?\];/, domeDefaultImages);
  fs.writeFileSync(domeGalleryJsxPath, content, 'utf8');
  console.log('Updated DEFAULT_IMAGES in components/DomeGallery.jsx!');
}

console.log('All clip art assignments completed successfully!');
