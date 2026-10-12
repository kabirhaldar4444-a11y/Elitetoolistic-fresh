const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'images', 'cliparts');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Map of source SVGs to copy & colorize
const sourceSvgs = {
  'construction': 'art_construction.svg',
  'engineering': 'art_engineering.svg',
  'architecture': 'art_architecture.svg',
  'robotics': 'art_robotics.svg',
  'drone': 'art_drone.svg',
  'coding': 'art_coding.svg',
  'analytics': 'art_analytics.svg',
  'doodle_study': 'sample_freehand_doodle.svg',
  'circuit': 'circuit.svg',
  'environment': 'environmental-study.svg',
  'finance': 'finance.svg',
  'logistics': 'logistics.svg',
  'launch': 'maker-launch.svg',
  'medicine': 'medicine.svg',
  'project': 'project-completed.svg',
  'science': 'science.svg'
};

// Color palettes for brand alignment
const palettes = {
  blue: '#006cfe',
  sky: '#0284c7',
  emerald: '#10b981',
  teal: '#0d9488',
  purple: '#8b5cf6',
  indigo: '#6366f1',
  amber: '#f59e0b',
  orange: '#ea580c',
  rose: '#e11d48',
  pink: '#ec4899',
  slate: '#334155'
};

function colorize(srcPath, primaryColor, accentColor = '#38bdf8') {
  if (!fs.existsSync(srcPath)) return null;
  let content = fs.readFileSync(srcPath, 'utf8');
  content = content.replace(/var\(--primary-svg-color\)/g, primaryColor);
  content = content.replace(/#6c63ff/gi, primaryColor);
  content = content.replace(/fill="#2f2e41"/g, 'fill="#1e293b"');
  return content;
}

// Generate rich collection in images/cliparts/
const generatedList = [
  { name: 'clipart_ai_robotics.svg', src: 'art_robotics.svg', color: palettes.indigo },
  { name: 'clipart_ai_workflow.svg', src: 'science.svg', color: palettes.purple },
  { name: 'clipart_pm_building.svg', src: 'art_construction.svg', color: palettes.blue },
  { name: 'clipart_pm_finance.svg', src: 'finance.svg', color: palettes.amber },
  { name: 'clipart_safety_site.svg', src: 'sample_construction.svg', color: palettes.orange },
  { name: 'clipart_safety_env.svg', src: 'environmental-study.svg', color: palettes.emerald },
  { name: 'clipart_bim_architecture.svg', src: 'art_architecture.svg', color: palettes.teal },
  { name: 'clipart_bim_engineering.svg', src: 'art_engineering.svg', color: palettes.blue },
  { name: 'clipart_materials_tech.svg', src: 'circuit.svg', color: palettes.sky },
  { name: 'clipart_materials_build.svg', src: 'sample_building.svg', color: palettes.teal },
  { name: 'clipart_logistics_ops.svg', src: 'logistics.svg', color: palettes.blue },
  { name: 'clipart_logistics_fleet.svg', src: 'art_drone.svg', color: palettes.amber },
  { name: 'clipart_business_mgmt.svg', src: 'art_analytics.svg', color: palettes.indigo },
  { name: 'clipart_business_project.svg', src: 'project-completed.svg', color: palettes.blue },
  { name: 'clipart_tech_coding.svg', src: 'art_coding.svg', color: palettes.purple },
  { name: 'clipart_tech_circuit.svg', src: 'circuit.svg', color: palettes.sky },
  { name: 'clipart_prof_doodle.svg', src: 'sample_freehand_doodle.svg', color: palettes.blue },
  { name: 'clipart_prof_launch.svg', src: 'maker-launch.svg', color: palettes.emerald },
  { name: 'clipart_marketing_comm.svg', src: 'art_analytics.svg', color: palettes.rose },
  { name: 'clipart_marketing_launch.svg', src: 'maker-launch.svg', color: palettes.pink },
  { name: 'clipart_career_growth.svg', src: 'maker-launch.svg', color: palettes.amber },
  { name: 'clipart_career_study.svg', src: 'sample_freehand_doodle.svg', color: palettes.teal },
  { name: 'clipart_productivity_office.svg', src: 'art_coding.svg', color: palettes.emerald },
  { name: 'clipart_productivity_dash.svg', src: 'art_analytics.svg', color: palettes.blue },
  { name: 'clipart_civil_eng.svg', src: 'art_engineering.svg', color: palettes.blue },
  { name: 'clipart_civil_construct.svg', src: 'art_construction.svg', color: palettes.sky },
  { name: 'clipart_exec_skills.svg', src: 'project-completed.svg', color: palettes.purple },
  { name: 'clipart_exec_medicine.svg', src: 'medicine.svg', color: palettes.rose }
];

for (const item of generatedList) {
  const content = colorize(item.src, item.color);
  if (content) {
    fs.writeFileSync(path.join(targetDir, item.name), content);
    console.log(`Saved images/cliparts/${item.name}`);
  }
}

console.log('Finished generating clip arts in images/cliparts/');
