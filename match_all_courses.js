const fs = require('fs');
const path = require('path');

const courses = JSON.parse(fs.readFileSync('all_167_courses.json', 'utf8'));
const availableSvgs = JSON.parse(fs.readFileSync('all_available_svgs.json', 'utf8'));

console.log(`Total courses: ${courses.length}`);
console.log(`Total available SVGs: ${availableSvgs.length}`);

// Keyword scoring algorithm
function scoreMatch(courseName, category, svgName) {
  const cleanSvg = svgName.replace('.svg', '').toLowerCase();
  const svgTokens = cleanSvg.split(/[-_]/);
  
  const text = (courseName + ' ' + category).toLowerCase();
  const courseTokens = text.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  let score = 0;

  // Exact phrase or token matches
  for (const st of svgTokens) {
    if (st.length < 3) continue;
    if (text.includes(st)) {
      score += 15;
    }
    for (const ct of courseTokens) {
      if (ct.length < 3) continue;
      if (ct === st) score += 30;
      else if (ct.includes(st) || st.includes(ct)) score += 10;
    }
  }

  // Domain associations
  const associations = [
    { terms: ['construct', 'builder', 'civil', 'site', 'building', 'concrete', 'structure', 'repair', 'demolition'], svgs: ['under-construction', 'building', 'engineering-team', 'city-driver', 'work-in-progress', 'house-searching', 'architecture', 'maintenance', 'inspection', 'scrum-board'] },
    { terms: ['bim', 'autocad', 'blueprint', 'drawing', 'revit', 'architecture'], svgs: ['3d-modeling', 'architecture', 'designer', 'prototyping', 'design-process', 'wireframing', 'art-lover', 'creative-team'] },
    { terms: ['safety', 'hazard', 'risk', 'inspection', 'compliance', 'security'], svgs: ['safety', 'security-on', 'gdpr', 'security-analyst', 'safe', 'secure-server', 'police'] },
    { terms: ['ai', 'copilot', 'machine learning', 'robot', 'automation', 'agent', 'chatbot', 'prompt'], svgs: ['robotics', 'artificial-intelligence', 'machine-learning', 'drone-surveillance', 'future-rhymes', 'virtual-reality', 'voice-interface'] },
    { terms: ['coding', 'software', 'programming', 'developer', 'python', 'github', 'dev'], svgs: ['programming', 'software-engineer', 'developer-activity', 'code-review', 'source-code', 'coding', 'pair-programming'] },
    { terms: ['logistics', 'fleet', 'warehouse', 'supply', 'cargo', 'shipping', 'transport'], svgs: ['logistics', 'delivery-truck', 'drone-delivery', 'in-no-time', 'order-delivered', 'package-arrived', 'takeout-boxes'] },
    { terms: ['finance', 'cash', 'budget', 'billing', 'cost', 'estimation', 'rate', 'price', 'account'], svgs: ['financial-data', 'finance', 'calculator', 'savings', 'credit-card', 'payments', 'make-it-rain', 'investing', 'wallet'] },
    { terms: ['excel', 'data', 'analytics', 'dashboard', 'report', 'powerbi', 'tableau'], svgs: ['spreadsheets', 'analytics', 'data-reports', 'all-the-data', 'metrics', 'pie-chart', 'visual-data', 'dashboard'] },
    { terms: ['marketing', 'brand', 'content', 'social', 'media', 'copywriting', 'public relations'], svgs: ['content-creator', 'social-media', 'influencer', 'post', 'public-discussion', 'podcast', 'online-media', 'digital-nomad'] },
    { terms: ['leadership', 'career', 'supervisory', 'executive', 'team', 'management'], svgs: ['team-collaboration', 'conference', 'presentation', 'pitching', 'scrum-board', 'stepping-up', 'goals', 'business-deal', 'interview'] },
    { terms: ['speech', 'confidence', 'charisma', 'communication', 'coaching', 'mindset', 'body language'], svgs: ['public-speaking', 'speech-to-text', 'listening', 'active-support', 'meditation', 'mindfulness', 'creative-thinking'] },
    { terms: ['green', 'energy', 'solar', 'environment', 'sustainable', 'carbon'], svgs: ['environmental-study', 'nature-benefits', 'clean-up', 'into-the-night', 'walking-outside', 'blooming'] }
  ];

  for (const assoc of associations) {
    const hasTerm = assoc.terms.some(t => text.includes(t));
    if (hasTerm) {
      if (assoc.svgs.some(s => cleanSvg.includes(s) || cleanSvg === s)) {
        score += 25;
      }
    }
  }

  return score;
}

// Map each course uniquely
const assignedSvgs = new Set();
const courseMapping = [];

// Sort courses or process in order
courses.forEach(c => {
  // Candidate list sorted by score
  const candidates = availableSvgs
    .filter(svg => !assignedSvgs.has(svg))
    .map(svg => ({ svg, score: scoreMatch(c.name, c.category, svg) }))
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];
  assignedSvgs.add(best.svg);
  courseMapping.push({
    id: c.id,
    name: c.name,
    category: c.category,
    svg: best.svg,
    score: best.score
  });
});

console.log(`Successfully mapped ${courseMapping.length} courses!`);
console.log(`Unique SVGs used: ${assignedSvgs.size} (Must be exactly ${courses.length})`);

fs.writeFileSync('unique_course_svg_mapping.json', JSON.stringify(courseMapping, null, 2));

// Show sample mappings
console.log('\nSample Mappings:');
courseMapping.slice(0, 15).forEach(m => {
  console.log(`- "${m.name}" (${m.category}) -> ${m.svg} [score: ${m.score}]`);
});
