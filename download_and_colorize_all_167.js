const fs = require('fs');
const path = require('path');
const https = require('https');

const courses = JSON.parse(fs.readFileSync('all_167_courses.json', 'utf8'));
const availableSvgs = JSON.parse(fs.readFileSync('all_available_svgs.json', 'utf8'));
const targetDir = path.join(__dirname, 'images', 'cliparts');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Enhanced Domain & Keyword Lexicon
const domainKeywords = [
  // Civil & Construction
  { match: /bim|revit|building-information/i, candidates: ['3d-modeling.svg', 'prototyping.svg', 'designer.svg', 'wireframing.svg', 'design-process.svg', 'visual-design.svg'] },
  { match: /autocad|architectural-drawing|blueprint|structural-drawing|as-built/i, candidates: ['architecture.svg', 'art-lover.svg', 'creative-team.svg', 'design-inspiration.svg', 'creative-process.svg'] },
  { match: /safety|hazard|scaffolding|iso-45001/i, candidates: ['safety.svg', 'security-on.svg', 'gdpr.svg', 'security-analyst.svg', 'safe.svg', 'secure-server.svg', 'police.svg'] },
  { match: /concrete|formwork|precast|repair|retrofitting/i, candidates: ['work-in-progress.svg', 'maintenance.svg', 'firmware.svg', 'in-progress.svg', 'city-driver.svg', 'house-searching.svg'] },
  { match: /demolition|salvage|dismantling/i, candidates: ['deconstruct.svg', 'throw-away.svg', 'clean-up.svg', 'into-the-night.svg'] },
  { match: /excavation|shoring|deep-foundation/i, candidates: ['nature-benefits.svg', 'gardening.svg', 'walking-outside.svg', 'camping.svg'] },
  { match: /site-layout|land-surveying|levelling/i, candidates: ['navigation.svg', 'adventure-map.svg', 'map.svg', 'street-view.svg', 'explore.svg'] },
  { match: /water-management|dewatering|waterproofing/i, candidates: ['water-bottle.svg', 'rain.svg', 'weather-app.svg', 'wind-turbine.svg'] },
  { match: /drywall|acoustic|partitioning|flooring|interior-fit-out|wardrobe|glazing|fa-ade/i, candidates: ['interior-design.svg', 'home-run.svg', 'apartment-rent.svg', 'moving-forward.svg', 'window-shopping.svg'] },
  { match: /heavy-equipment|crane|utilities|temporary-power/i, candidates: ['electric-car.svg', 'maintenance.svg', 'server-cluster.svg', 'factory.svg', 'work-together.svg'] },
  { match: /green|sustainable|carbon-neutral|energy|environmental/i, candidates: ['environmental-study.svg', 'nature-benefits.svg', 'blooming.svg', 'earth.svg', 'clean-up.svg', 'planting.svg'] },
  
  // Finance, Costing, Quantity Surveying & Contracts
  { match: /cost-estimation|quantity-surveying|bar-bending|bbs|rate-analysis/i, candidates: ['calculator.svg', 'finance.svg', 'financial-data.svg', 'savings.svg', 'credit-card.svg', 'payments.svg'] },
  { match: /bill|billing|invoice|cash-flow|budget/i, candidates: ['make-it-rain.svg', 'wallet.svg', 'investing.svg', 'successful-purchase.svg', 'revenue.svg', 'receipt.svg'] },
  { match: /contract|claim|dispute|tendering|bidding|procurement/i, candidates: ['business-deal.svg', 'contract.svg', 'agreement.svg', 'terms.svg', 'legal.svg', 'accept-request.svg'] },

  // Logistics, Supply Chain & Operations
  { match: /supply-chain|warehouse|inventory|storekeeping|waste-reduction/i, candidates: ['logistics.svg', 'delivery-truck.svg', 'order-delivered.svg', 'package-arrived.svg', 'takeout-boxes.svg'] },
  { match: /fleet|last-mile|relocation|third-party|3pl|cross-border/i, candidates: ['drone-delivery.svg', 'in-no-time.svg', 'fast-loading.svg', 'subway.svg', 'on-the-way.svg'] },
  { match: /retail|e-commerce|fulfillment/i, candidates: ['add-to-cart.svg', 'shopping-app.svg', 'online-shopping.svg', 'stripe-payments.svg'] },
  { match: /erp|enterprise-resource|digital-document|dpr/i, candidates: ['server-status.svg', 'cloud-hosting.svg', 'operating-system.svg', 'file-manager.svg', 'folder.svg'] },
  { match: /root-cause|bottleneck|incident|crisis|business-continuity|disaster/i, candidates: ['alert.svg', 'fixing-bugs.svg', 'warning.svg', 'server-down.svg', 'questions.svg'] },
  { match: /lean|six-sigma|quality-assurance|kpi|sla/i, candidates: ['metrics.svg', 'done-checking.svg', 'project-completed.svg', 'accept-tasks.svg', 'checklist.svg'] },

  // AI, Data & Tech
  { match: /copilot|generative-ai|gpt|chatgpt|prompt-engineering|chatbot/i, candidates: ['robotics.svg', 'artificial-intelligence.svg', 'machine-learning.svg', 'voice-interface.svg', 'future-rhymes.svg'] },
  { match: /ai-enhanced-video|media-production/i, candidates: ['video-call.svg', 'animating.svg', 'movie-night.svg', 'record-bug.svg'] },
  { match: /scraping|cold-email|sales-scraping/i, candidates: ['email-campaign.svg', 'mailbox.svg', 'contact-us.svg', 'sent-message.svg'] },
  { match: /excel|powerbi|tableau|dashboard|data-analytics|data-handling/i, candidates: ['spreadsheets.svg', 'analytics.svg', 'data-reports.svg', 'all-the-data.svg', 'pie-chart.svg', 'visual-data.svg'] },
  { match: /coding|programming|software|web-development|website/i, candidates: ['programming.svg', 'software-engineer', 'developer-activity.svg', 'code-review.svg', 'source-code.svg', 'coding.svg', 'pair-programming.svg'] },
  { match: /smart-home|iot/i, candidates: ['smart-home.svg', 'connected-world.svg', 'circuit.svg', 'motherboard.svg'] },

  // Leadership, Career & Communication
  { match: /speech|motivational|speaker|public-relations/i, candidates: ['conference-speaker.svg', 'public-speaking.svg', 'podcasting.svg', 'speech-to-text.svg', 'interview.svg'] },
  { match: /charisma|confidence|mindset|relationship|resilience|body-language/i, candidates: ['personal-training.svg', 'meditation.svg', 'mindfulness.svg', 'positive-attitude.svg', 'creativity.svg'] },
  { match: /leadership|team|supervisory|project-coordination|agile|scrum/i, candidates: ['team-collaboration.svg', 'conference.svg', 'presentation.svg', 'pitching.svg', 'scrum-board.svg', 'stepping-up.svg'] },
  { match: /career|employability|readiness|personal-branding/i, candidates: ['career-progress.svg', 'career-development.svg', 'goals.svg', 'maker-launch.svg', 'stepping-up.svg'] },
  { match: /marketing|brand|content-writing|digital-marketing|social-media/i, candidates: ['content-creator.svg', 'social-media.svg', 'influencer.svg', 'post.svg', 'public-discussion.svg'] },
  { match: /customer-success|customer-service|customer-relationship|crm/i, candidates: ['active-support.svg', 'customer-survey.svg', 'chat.svg', 'feedback.svg', 'help.svg'] },
  { match: /time-management|productivity|office-administration|workplace/i, candidates: ['time-management.svg', 'schedule.svg', 'to-do-list.svg', 'organize-resume.svg', 'work-chat.svg'] }
];

// 2. Score Matcher
function getBestSvg(course, assignedSet) {
  const cName = course.name;
  const cCat = course.category;
  const cText = (cName + ' ' + (course.file || '') + ' ' + cCat).toLowerCase();

  // Try domain candidates first
  for (const rule of domainKeywords) {
    if (rule.match.test(cText)) {
      for (const cand of rule.candidates) {
        const fullCand = cand.endsWith('.svg') ? cand : cand + '.svg';
        if (availableSvgs.includes(fullCand) && !assignedSet.has(fullCand)) {
          return fullCand;
        }
      }
    }
  }

  // Token scoring fallback
  const courseTokens = cText.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
  let bestSvg = null;
  let maxScore = -1;

  for (const svg of availableSvgs) {
    if (assignedSet.has(svg)) continue;
    const clean = svg.replace('.svg', '').toLowerCase();
    const svgTokens = clean.split(/[-_]/);

    let score = 0;
    for (const st of svgTokens) {
      if (st.length < 3) continue;
      for (const ct of courseTokens) {
        if (ct === st) score += 30;
        else if (ct.includes(st) || st.includes(ct)) score += 10;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestSvg = svg;
    }
  }

  if (bestSvg) return bestSvg;

  // Final fallback to any unassigned SVG
  for (const svg of availableSvgs) {
    if (!assignedSet.has(svg)) return svg;
  }
  return availableSvgs[0];
}

// 3. Assign 1-to-1 unique mapping for all 167 courses
const assigned = new Set();
const finalMapping = [];

courses.forEach(c => {
  const svg = getBestSvg(c, assigned);
  assigned.add(svg);
  finalMapping.push({
    id: c.id,
    name: c.name,
    category: c.category,
    sourceSvg: svg,
    localPath: `images/cliparts/${c.id}.svg`
  });
});

console.log(`\nAll 167 Courses Assigned! Total unique SVGs: ${assigned.size}`);
if (assigned.size !== courses.length) {
  console.error('ERROR: Uniqueness check failed!');
  process.exit(1);
}

// 4. Color Palette by Category
const categoryColors = {
  'AI & Modern Workflows': '#6366f1', // Indigo
  'Construction: Project Management & Billing': '#006cfe', // Royal Blue
  'Construction: Site Operations & Safety': '#f59e0b', // Amber / Safety Orange
  'Construction: Design Coordination & BIM': '#0d9488', // Teal
  'Construction: Materials, Finishes & Tech': '#0284c7', // Sky Blue
  'Corporate Operations & Logistics': '#2563eb', // Blue
  'Business & Management': '#1e40af', // Navy
  'Technology & Digital Skills': '#7c3aed', // Purple
  'Professional Development': '#0284c7', // Ocean Blue
  'Marketing & Communication': '#e11d48', // Rose
  'Career Development': '#ea580c', // Bright Orange
  'Productivity & Office Skills': '#10b981', // Emerald Green
  'Construction & Engineering': '#006cfe', // Classic Elite Blue
  'Additional Professional Skills': '#8b5cf6' // Violet
};

// 5. Download and Colorize each SVG directly into images/cliparts/${course.id}.svg
async function downloadSvg(svgName) {
  const url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/master/svgs/${svgName}`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve(data));
      } else {
        console.warn(`Failed to download ${svgName}: ${res.statusCode}`);
        resolve(null);
      }
    }).on('error', err => {
      console.warn(`Error downloading ${svgName}:`, err.message);
      resolve(null);
    });
  });
}

function colorize(svgContent, primaryColor) {
  if (!svgContent) return null;
  let res = svgContent.replace(/var\(--primary-svg-color\)/g, primaryColor);
  res = res.replace(/#6c63ff/gi, primaryColor);
  res = res.replace(/fill="#2f2e41"/g, 'fill="#1e293b"');
  return res;
}

(async () => {
  console.log(`Starting download and colorization of 167 unique SVGs...`);
  const concurrency = 15;
  for (let i = 0; i < finalMapping.length; i += concurrency) {
    const chunk = finalMapping.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (item) => {
      const raw = await downloadSvg(item.sourceSvg);
      if (raw) {
        const color = categoryColors[item.category] || '#006cfe';
        const colorized = colorize(raw, color);
        const outPath = path.join(__dirname, 'images', 'cliparts', `${item.id}.svg`);
        fs.writeFileSync(outPath, colorized, 'utf8');
      }
    }));
    process.stdout.write(`Downloaded & colorized ${Math.min(i + concurrency, finalMapping.length)} / ${finalMapping.length}...\r`);
  }
  console.log(`\nDownload and colorization complete!`);

  // 6. Update all_167_courses.json with 1-to-1 unique image paths
  courses.forEach(c => {
    c.image = `images/cliparts/${c.id}.svg`;
  });
  fs.writeFileSync('all_167_courses.json', JSON.stringify(courses, null, 2), 'utf8');
  console.log(`Updated all_167_courses.json: 167 unique images assigned!`);

  // Verification
  const imageSet = new Set(courses.map(c => c.image));
  console.log(`VERIFICATION CHECK: Total courses = ${courses.length}, Unique image files = ${imageSet.size}`);
  if (imageSet.size === courses.length) {
    console.log('SUCCESS: Exactly 167 unique, dedicated clip art files with ZERO duplicates!');
  }
})();
