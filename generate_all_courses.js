const fs = require('fs');
const path = require('path');

// Pool of 51 completely unique Unsplash image URLs (no repeats)
const UNIQUE_BG_IMAGES = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80", // 1
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80", // 2
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80", // 3
  "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1920&q=80", // 4
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80", // 5
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80", // 6
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80", // 7
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80", // 8
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80", // 9
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1920&q=80", // 10
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80", // 11
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80", // 12
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80", // 13
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80", // 14
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80", // 15
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1920&q=80", // 16
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1920&q=80", // 17
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80", // 18
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80", // 19
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80", // 20
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80", // 21
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1920&q=80", // 22
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1920&q=80", // 23
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80", // 24
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1920&q=80", // 25
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80", // 26
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1920&q=80", // 27
  "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=1920&q=80", // 28
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80", // 29
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80", // 30
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80", // 31
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80", // 32
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1920&q=80", // 33
  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1920&q=80", // 34
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80", // 35
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80", // 36
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1920&q=80", // 37
  "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1920&q=80", // 38
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1920&q=80", // 39
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1920&q=80", // 40
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1920&q=80", // 41
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80", // 42
  "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=1920&q=80", // 43
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80", // 44
  "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1920&q=80", // 45
  "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1920&q=80", // 46
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1920&q=80", // 47
  "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1920&q=80", // 48
  "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1920&q=80",  // 49
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1920&q=80",  // 50
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80"   // 51
];

// Complete 51 Course Custom Database to ensure 100% unique, domain-specific metadata
const masterCoursesList = [
  {
    name: "Construction Project Management",
    file: "construction-project-management.html",
    difficulty: "Advanced",
    price: "32,000",
    duration: "45 hours",
    desc_short: "Master heavy infrastructure execution pipelines, resource scheduling, critical path metrics, and strict safety compliances.",
    desc_main: "This advanced program is custom-tailored for civil engineering executives, site administrators, and developers looking to lead physical build cycles under rigorous controls. We focus on modern resource modeling, scheduling, and subcontractor management.",
    key_learning: [
      "Advanced construction cost modeling and variance control",
      "Sequencing workflows with granular Gantt schedules",
      "Analyzing environmental drainage and geological reports",
      "Evaluating contract delays and material risk metrics",
      "Managing site logistics, tower cranes, and safety zoning",
      "Navigating ISO 45001 civil security regulations",
      "Directing structural concrete execution and quality audits",
      "Leading technical project closures and structural handovers"
    ],
    ideal_for: "Civil engineers, project coordinators, site supervisors, and infrastructure developers.",
    outcomes: "Confidently orchestrate multi-phase civil builds, mitigate material supply chain delays, and protect operational budgets.",
    pricing_desc: "Includes on-site simulation modules, templates, and industrial blueprint packs.",
    duration_desc: "45 hours of deep technical execution strategies and case study reviews.",
    terms_desc: "Corporate discounts available for bulk supervisor training groups.",
    investment_bullets: [
      "Access to standard structural execution template suites",
      "Practical Gantt mapping worksheets and checklist modules",
      "Interactive construction delay simulation games",
      "One-on-one reviews with veteran civil project directors",
      "Certified Civil Coordinator Credentials"
    ],
    reviews: [
      { name: "Rahul Verma", location: "Mumbai, MH", text: "Brilliant Gantt scheduling drills. Streamlined my high-rise concrete supply chain by 18%." },
      { name: "Sneha Rao", location: "Pune, MH", text: "The ISO 45001 site safety models saved our team multiple compliance audit headaches." },
      { name: "Vikram Nair", location: "Chennai, TN", text: "Uniquely granular blueprints and contract risk frameworks. Essential for senior engineers." }
    ]
  },
  {
    name: "Energy Management Certification",
    file: "energy-management-certification.html",
    difficulty: "Advanced",
    price: "55,000",
    duration: "50 hours",
    desc_short: "Develop advanced corporate auditing competencies in commercial thermodynamic systems, electrical grids, and carbon regulations.",
    desc_main: "Bridges chemical engineering physics, commercial HVAC structures, and clean power grid configurations. Learn to lead comprehensive industrial diagnostic audits, carbon footprint allocations, and solar microgrid installations.",
    key_learning: [
      "Conducting comprehensive thermal audits on boiler systems",
      "Optimizing commercial HVAC and fan pressure distribution",
      "Calculating carbon equivalents and scope greenhouse indexes",
      "Integrating photovoltaic arrays and clean microgrid structures",
      "Aligning plant operations with ISO 50001 certification rules",
      "Performing power grid peak-load scheduling and diagnostics",
      "Shoring up insulation limits and commercial thermodynamic loss",
      "Structuring financial models for energy conservation initiatives"
    ],
    ideal_for: "Plant utility managers, sustainability engineers, operations heads, and green builders.",
    outcomes: "Decrease industrial energy demand overheads, implement clean grids, and lead official ISO compliance audits.",
    pricing_desc: "Covers thermal diagnostic software access, calculations tools, and audit log grids.",
    duration_desc: "50 hours of extensive industrial utility analysis and regulatory study.",
    terms_desc: "Can be customized for industrial operations or building facility frameworks.",
    investment_bullets: [
      "Diagnostic boiler and cooling tower checklist libraries",
      "Carbon equivalent estimation spreadsheets and modeling sheets",
      "Case studies of certified ISO 50001 heavy manufacturing plants",
      "Direct guidance from registered energy sustainability auditors",
      "Energy Efficiency Leader Certification"
    ],
    reviews: [
      { name: "Vikram Singh", location: "Kolkata, WB", text: "Helped our textile plant implement an HVAC recovery program, reducing power usage by 14%." },
      { name: "Deepika Iyer", location: "Bengaluru, KA", text: "The carbon footprintScope calculations were exceptionally detailed. High practical value." },
      { name: "Karthik Pillai", location: "Kochi, KL", text: "Excellent thermodynamic loss guides. A must for industrial plant operators." }
    ]
  },
  {
    name: "Certified Commercial Contracts Manager",
    file: "certified-commercial-contracts-manager.html",
    difficulty: "Intermediate",
    price: "28,000",
    duration: "35 hours",
    desc_short: "Master commercial transactional law, Statement of Work boundaries, liability allocations, and vendor negotiation cycles.",
    desc_main: "Walk through the legal mechanics of contract administration. Draft Master Service Agreements, establish intellectual property boundaries, identify warranty loopholes, and resolve contract breach claims.",
    key_learning: [
      "Drafting airtight Statements of Work and terms sheets",
      "Allocating commercial liability, indemnity, and warranty rules",
      "Analyzing commercial transactional legal frameworks",
      "Setting post-award key performance indicators and metrics",
      "Structuring pricing adjustment models and indexing methods",
      "Securing corporate intellectual property and data ownership",
      "Auditing contract completion, exit fees, and asset closeout",
      "Mitigating damage claims and conducting mediation dialogues"
    ],
    ideal_for: "Corporate procurement teams, contract executives, business attorneys, and purchase leads.",
    outcomes: "Design, review, and negotiate strong commercial partnerships while reducing organizational litigation liabilities.",
    pricing_desc: "Includes standard agreement drafting kits, legal vocabulary guides, and contract audit sheets.",
    duration_desc: "35 hours of intensive drafting labs and negotiation simulations.",
    terms_desc: "Corporate billing is structured through standard invoice systems.",
    investment_bullets: [
      "Master contract clause libraries with editable liability formats",
      "Indemnification review checklists and case files",
      "Interactive negotiation mock setups with legal consultants",
      "Direct contract drafting review from corporate legal experts",
      "Commercial Contract Authority Certification"
    ],
    reviews: [
      { name: "Ananya Sharma", location: "New Delhi, DL", text: "The MSA indemnity frameworks are worth 5x the fee. Immediately updated our supplier deals." },
      { name: "Siddharth Rao", location: "Hyderabad, TS", text: "Brilliant commercial transaction codes review. Exceptional drafting templates." },
      { name: "Komal Shah", location: "Mumbai, MH", text: "Excellent exit fee templates. Saved our logistics division from a messy termination dispute." }
    ]
  },
  {
    name: "Advanced Civil Execution",
    file: "advanced-civil-execution.html",
    difficulty: "Advanced",
    price: "36,000",
    duration: "40 hours",
    desc_short: "Orchestrate heavy concrete execution technology, pile shoring design, load sensor networks, and complex site logistics.",
    desc_main: "Provides practical, field-tested methodologies to execute high-scale civil engineering works. Master heavy structural concrete tests, deep foundation installations, mechanical site logistics, and blueprint translations.",
    key_learning: [
      "Advanced structural concrete mix analysis and quality audits",
      "Deploying retaining shoring and foundation deep piles",
      "Configuring sensor arrays to audit structural stress loads",
      "Decoding structural details and load-bearing blueprint paths",
      "Directing on-site crawler crane and physical utility logistics",
      "Inspecting geotech soil mechanics and mitigating moisture shifts",
      "Orchestrating wastewater containment and site environmental safety",
      "Subcontractor scheduling grids, workforce safety, and site logs"
    ],
    ideal_for: "Senior civil engineers, site execution supervisors, structural inspectors, and building leads.",
    outcomes: "Manage large civil structural teams, audit cement mix strengths, and execute heavy foundations without error.",
    pricing_desc: "Covers geotech software access, mix calculators, and concrete strength index cards.",
    duration_desc: "40 hours of field-tested engineering and high-scale execution drills.",
    terms_desc: "Custom pricing frameworks available for large engineering enterprise groups.",
    investment_bullets: [
      "Concrete compression rating calculation templates",
      "Retaining wall and deep shoring diagnostic checklists",
      "Field engineering blueprints from high-scale highway builds",
      "Expert feedback sessions with structural engineering specialists",
      "Certified Civil Infrastructure Specialist Credentials"
    ],
    reviews: [
      { name: "Suresh Kumar", location: "Chennai, TN", text: "The piling and shoring simulations were outstanding. Enhanced our bridge foundation project." },
      { name: "Aditya Joshi", location: "Noida, UP", text: "Excellent blueprint analysis drills. Really helped align my site supervisors." },
      { name: "Harsh Vardhan", location: "Mumbai, MH", text: "Highly practical geotech soil guidance. Resolved a major drainage challenge on our high-rise site." }
    ]
  },
  {
    name: "Projects IN Controlled Environments",
    file: "projects-in-controlled-environments.html",
    difficulty: "Advanced",
    price: "45,000",
    duration: "35 hours",
    desc_short: "Learn structured business governance frameworks, investment justifications, stages control, and predictive exception rules.",
    desc_main: "Focuses on predictive governance, process parameters, and delivery metrics. Master start-up checks, business validation frameworks, stage limits, risk allocations, and exception protocols.",
    key_learning: [
      "Defining business investment business justifications and baselines",
      "Structuring project oversight roles and accountability matrices",
      "Managing stage-by-stage progression limits and approvals",
      "Handling risk indexes, safety tolerance, and exception triggers",
      "Developing product-based layouts and execution flowcharts",
      "Tracking change configuration registers and modifications",
      "Orchestrating technical closures, audits, and benefit maps",
      "Coordinating project boards, managers, and delivery team layers"
    ],
    ideal_for: "Operations directors, governance managers, delivery leads, and project auditors.",
    outcomes: "Establish highly controlled, risk-mitigated corporate governance structures, aligning delivery teams with commercial goals.",
    pricing_desc: "Includes comprehensive governance manuals, process cards, and exam simulators.",
    duration_desc: "35 hours of rigorous structured governance modeling and review.",
    terms_desc: "Complies with standard international project management certification structures.",
    investment_bullets: [
      "Oversight board briefing templates and reporting decks",
      "Tolerance limits configuration registers and sheets",
      "Case studies of structured governance in transformation projects",
      "Live mentorship feedback from certified senior project board members",
      "Controlled Project Governance Certification"
    ],
    reviews: [
      { name: "Nisha Rao", location: "Bengaluru, KA", text: "The exception modeling frameworks changed how our operations division handles unexpected budget variances." },
      { name: "Aman Patel", location: "Ahmedabad, GJ", text: "Clean, rigorous process structures. Perfectly resolved our software team's tracking issues." },
      { name: "Vikram Singh", location: "Kolkata, WB", text: "Exceptional benefit-mapping modules. Our corporate board loved the structured reporting decks." }
    ]
  },
  {
    name: "Contract and Claims Management",
    file: "contract-and-claims-management.html",
    difficulty: "Advanced",
    price: "30,000",
    duration: "30 hours",
    desc_short: "Master extension of time calculations, critical path delays, variation costings, and alternative dispute resolution.",
    desc_main: "Provides builders, quantity surveyors, and operators with strategies to resolve delays, cost overruns, variations, and claims. Learn to write claims packages, compute overhead damages, and handle mediation.",
    key_learning: [
      "Detecting variation causes and site delay claim events",
      "Calculating Extensions of Time with critical path analyses",
      "Computing disruption overheads, idle labor, and standby costs",
      "Drafting detailed, legally defensible claim justification files",
      "Negotiating claim settlements with architects, owners, and firms",
      "Navigating alternative dispute resolutions, mediation, and rules",
      "Using site reports, logs, and emails as legal claim evidence",
      "Mitigating subcontractor cost exposures during site standstills"
    ],
    ideal_for: "Quantity surveyors, construction lawyers, contract leads, and project leads.",
    outcomes: "Compile legally defensible claim packages, accurately calculate extension valuations, and avoid litigation costs.",
    pricing_desc: "Covers delay claim spreadsheets, calculator files, and case study packs.",
    duration_desc: "30 hours of rigorous disruption analysis and legal claims modeling.",
    terms_desc: "Special licensing terms apply for multi-user legal/engineering systems.",
    investment_bullets: [
      "Labor standby cost calculator sheets and spreadsheets",
      "Delay schedule templates with critical path calculation systems",
      "Real-world legal claims filing examples from heavy infrastructure cases",
      "Mock mediation and dispute settlement sessions with industry arbitrators",
      "Certified Claims Administrator Credentials"
    ],
    reviews: [
      { name: "Karan Verma", location: "Gurugram, HR", text: "Excellent mathematical breakdown of overhead damages. Saved our organization from major cost exposure." },
      { name: "Deepa Nair", location: "Kochi, KL", text: "Proactive logkeeping strategies have already helped us win two variation adjustments on site." },
      { name: "Rajesh Deshmukh", location: "Pune, MH", text: "Brilliant mediation setups. Outstanding frameworks for resolving contractor disputes." }
    ]
  },
  {
    name: "Self-Confidence Building Training",
    file: "self-confidence-building-training.html",
    difficulty: "Beginner",
    price: "25,000",
    duration: "10 hours",
    desc_short: "Conquer imposter syndrome, overcome negative internal monologues, and project personal presence in high-stakes environments.",
    desc_main: "A practical, psychological, and behavioral development program. Through cognitive reframing, assertive speaking practices, physical posture modifications, and systematic desensitization drills, you will build executive presence.",
    key_learning: [
      "Identifying and reframing self-limiting cognitive loops",
      "Mastering centered vocal delivery and assertive pacing",
      "Using body alignment to project personal authority",
      "Overcoming performance anxiety and high-stakes stress",
      "Establishing healthy operational boundaries and boundaries",
      "Managing critical feedback and rejection loops with poise",
      "Mitigating imposter syndrome patterns and tracking achievements",
      "Structuring daily self-assurance and goal-setting routines"
    ],
    ideal_for: "Emerging leaders, public presenters, team managers, and career transitions.",
    outcomes: "Speak with authority in key meetings, command group attention, and manage career changes with total self-assurance.",
    pricing_desc: "Includes cognitive reflection logs, assertiveness guides, and video speech reviews.",
    duration_desc: "10 hours of immersive confidence coaching and vocal performance labs.",
    terms_desc: "Available as private individual coaching or custom team dynamics groups.",
    investment_bullets: [
      "Assertive speaking video analysis and feedback logs",
      "Cognitive restructuring journals and daily tracking sheets",
      "Imposter syndrome mitigation and value recognition sheets",
      "Direct speech feedback from certified behavioral communication coaches",
      "Certified Professional Presence Credentials"
    ],
    reviews: [
      { name: "Rahul Sharma", location: "Nagpur, MH", text: "Completely transformed my executive pitch. I no longer freeze during corporate presentations." },
      { name: "Priya Trivedi", location: "Ahmedabad, GJ", text: "Highly practical cognitive tools. Replaced my self-doubt with highly structured confidence." },
      { name: "Sneha Rao", location: "Bengaluru, KA", text: "Fabulous group sessions. The boundary-setting exercises are exceptionally useful." }
    ]
  },
  {
    name: "Body Language Expert Training",
    file: "body-language-expert-training.html",
    difficulty: "Intermediate",
    price: "48,000",
    duration: "25 hours",
    desc_short: "Decode facial micro-expressions, analyze hand-gesture signals, detect deception, and leverage non-verbal alignment in sales meetings.",
    desc_main: "Provides tools to master non-verbal communication. Learn to read micro-expressions, analyze postures, mirrors dynamics, spatial proximity boundaries, and vocal tones to direct high-stakes meetings.",
    key_learning: [
      "Scientific tracking of facial micro-expressions and micro-shifts",
      "Analyzing palm, hand, and dynamic finger gesturing signals",
      "Using open postures and alignments to project corporate authority",
      "Mirroring clients to establish rapid professional trust",
      "Detecting hidden stress, anxiety, or deception indicators",
      "Leveraging vocal pitch shifts, pacing, and tone in persuasion",
      "Spatial positioning choices and non-verbal meeting alignments",
      "Analyzing team dynamic signals during corporate negotiation tables"
    ],
    ideal_for: "Sales directors, corporate negotiators, HR interview professionals, and managers.",
    outcomes: "Read client intent before they speak, build massive trust using body alignment, and avoid non-verbal indicators of weakness.",
    pricing_desc: "Covers expression libraries, video diagnostic logs, and posture check sheets.",
    duration_desc: "25 hours of expert non-verbal diagnostic coaching and feedback.",
    terms_desc: "Perfect for corporate groups looking to build strong sales negotiation skills.",
    investment_bullets: [
      "Micro-expression diagnostic video reference suites",
      "Non-verbal persuasion checklists and quick reference guides",
      "Sales meeting physical layout and configuration cards",
      "Personal body alignment assessment by a non-verbal behavior expert",
      "Certified Body Language Analyst Credentials"
    ],
    reviews: [
      { name: "Arjun Reddy", location: "Kolkata, WB", text: "The palm and posturing setups are remarkably powerful. Closed a major contract using these signals." },
      { name: "Tanvi Shah", location: "Bengaluru, KA", text: "The stress detection indicators are highly scientifically validated. Brilliant curriculum." },
      { name: "Neha Gupta", location: "Delhi, DL", text: "Excellent micro-expression coaching. Gave me a massive advantage in candidate interviewing." }
    ]
  },
  {
    name: "Relationship Coaching Training",
    file: "relationship-coaching-training.html",
    difficulty: "Intermediate",
    price: "24,000",
    duration: "30 hours",
    desc_short: "Master interpersonal coaching methodologies, active listening scripts, conflict mapping, and establish a coaching brand.",
    desc_main: "A comprehensive coaching training curriculum. You will explore developmental attachment systems, systemic emotional triggers, boundary-setting scripts, and practical conflict resolution models to build your coaching practice.",
    key_learning: [
      "Mastering professional coaching protocols and diagnostic listening",
      "Mapping attachment styles and relational communication patterns",
      "Analyzing systematic conflict triggers and resolution strategies",
      "Structuring boundary-setting dialog scripts for corporate clients",
      "Cultivating intimacy, emotional safety, and active trust",
      "Supporting families through heavy career changes and stressors",
      "Navigating coaching ethics and professional boundaries",
      "Building, marketing, and pricing your coaching services"
    ],
    ideal_for: "Aspiring counselors, relationship advisors, HR managers, and life coaches.",
    outcomes: "Lead structured coaching sessions, resolve complex family or workplace relationship frictions, and launch your own firm.",
    pricing_desc: "Includes coaching manuals, script outlines, and practice setup guides.",
    duration_desc: "30 hours of interactive coaching simulations and case studies.",
    terms_desc: "Meets international guidelines for life coach business licensing.",
    investment_bullets: [
      "Interpersonal conflict diagnostic worksheets and templates",
      "Relational boundary scripts and communication manuals",
      "Standard client onboarding forms and contracting agreements",
      "Direct practice session evaluations by senior relationship mentors",
      "Certified Interpersonal Relationship Coach Credentials"
    ],
    reviews: [
      { name: "Dr. Sunita Sen", location: "Mumbai, MH", text: "The conflict mapping exercises are highly effective. Saved our clients hours of circular debates." },
      { name: "Amit Joshi", location: "Vadodara, GJ", text: "Outstanding onboarding and business setup tips. Already launched my coaching brand." },
      { name: "Sneha Nair", location: "Chennai, TN", text: "The attachment theory mapping is brilliant. Exceptional practical application models." }
    ]
  },
  {
    name: "AI Productivity Power-Up",
    file: "ai-productivity-power-up.html",
    difficulty: "Intermediate",
    price: "38,000",
    duration: "25 hours",
    desc_short: "Supercharge your business workflows using advanced prompt engineering, custom AI agents, database automation, and Zapier connections.",
    desc_main: "Designed to train professionals in generative AI tools (ChatGPT, Claude, Midjourney). Learn prompt logic, custom assistant configurations, automated document creation, and database tools to save 12+ hours every week.",
    key_learning: [
      "Structuring advanced prompt engineering scripts and logics",
      "Automating corporate reporting pipelines with Claude and API models",
      "Generating high-converting copywriting templates with AI writing",
      "Configuring custom GPT assistants for distinct operational roles",
      "Integrating AI automated systems with Zapier and Make tools",
      "Processing massive administrative datasets using advanced analytics",
      "Evaluating AI data security limits and structural bias checking",
      "Constructing automated visual brand assets with Midjourney tools"
    ],
    ideal_for: "Marketing directors, business coordinators, entrepreneurs, and technology operations managers.",
    outcomes: "Establish custom automated data pipelines, scale content production, and automate repetitive document workflows.",
    pricing_desc: "Includes premium custom prompt databases, automation templates, and sandbox access.",
    duration_desc: "25 hours of hands-on prompt workshops and integration labs.",
    terms_desc: "Course content updated monthly to stay aligned with the newest AI models.",
    investment_bullets: [
      "Premium custom prompt libraries for key administrative tasks",
      "Pre-built Zapier and Make automation template directories",
      "AI assistant data configuration guides and checklists",
      "Direct reviews of your custom AI agents by advanced prompt engineers",
      "Certified Business AI Integration Expert Credentials"
    ],
    reviews: [
      { name: "Pranav Shah", location: "Mumbai, MH", text: "Our marketing team saved over 15 hours a week by automating custom report drafting." },
      { name: "Shreya Nair", location: "Bengaluru, KA", text: "Hands-on, avoiding standard hype. The Zapier AI database connection was exceptional." },
      { name: "Gaurav Verma", location: "Noida, UP", text: "Brilliant automation scripts. Transformed our back-office data processing completely." }
    ]
  },
  {
    name: "Resilience Coach Training",
    file: "resilience-coach-training.html",
    difficulty: "Advanced",
    price: "22,000",
    duration: "30 hours",
    desc_short: "Learn cognitive restructuring frameworks, stress inoculation systems, burnout tracking metrics, and career recovery coaching.",
    desc_main: "Provides executive coaches and HR managers with clinical and cognitive frameworks to guide teams through restructures, burnouts, crises, and setbacks.",
    key_learning: [
      "Psychology of neurological stress reactions and burnouts",
      "Applying cognitive behavioral desensitization methodologies",
      "Structuring stress inoculation and adaptability protocols",
      "Supporting corporate executives through heavy organizational shifts",
      "Implementing team recovery plans during corporate adjustments",
      "Mindfulness techniques and physiological regulation checks",
      "Designing personalized stress tolerance diagnostic programs",
      "Ethical coaching requirements and practitioner code policies"
    ],
    ideal_for: "HR heads, executive coaches, department leads, and clinical advisors.",
    outcomes: "Analyze organizational burnout risks, design stress tolerance training, and coach leaders through crises with calm.",
    pricing_desc: "Covers diagnostic stress templates, recovery worksheets, and counselor guidelines.",
    duration_desc: "30 hours of advanced corporate stress diagnostics and resilience study.",
    terms_desc: "Recognized as continuing professional development units.",
    investment_bullets: [
      "Employee burnout rating checklists and corporate scales",
      "Cognitive reframing cards and diagnostic writing sheets",
      "Resilience building workshops and diagnostic templates",
      "Direct project guidance from clinical occupational health coaches",
      "Certified Occupational Resilience Coach Credentials"
    ],
    reviews: [
      { name: "Nitin Sharma", location: "Chandigarh, PB", text: "A vital program. Provided our HR managers with tools to map burnout risks proactively." },
      { name: "Radhika Iyer", location: "Indore, MP", text: "The cognitive restructuring frameworks are highly structured and highly practical." },
      { name: "Sanjay Joshi", location: "Gurugram, HR", text: "Outstanding stress inoculation exercises. Crucial for fast-paced tech startups." }
    ]
  },
  {
    name: "Personal Branding Strategist Training",
    file: "personal-branding-strategist-training.html",
    difficulty: "Advanced",
    price: "65,000",
    duration: "35 hours",
    desc_short: "Master LinkedIn profile optimization, authoritative content calendars, newsletter ecosystems, and executive speaker pitching.",
    desc_main: "Provides senior executives, startup founders, and directors with strategies to position themselves as key industry authorities. Focuses on niche definitions, digital reach, and media pipelines.",
    key_learning: [
      "Defining your unique professional industry authority niche",
      "LinkedIn profile layout auditing and visibility systems",
      "Building a cohesive, scalable multi-channel content schedule",
      "Pitching to corporate media channels and podcast networks",
      "Designing high-impact newsletters and digital lead generation systems",
      "Developing keynote topics and preparing speaker proposals",
      "Establishing monetization frameworks for personal consulting",
      "Analyzing personal brand engagement and visibility metrics"
    ],
    ideal_for: "C-suite executives, startup founders, directors, and public relations specialists.",
    outcomes: "Build an authoritative public profile, secure industry keynote opportunities, and generate inbound consulting deals.",
    pricing_desc: "Includes profile audit checklists, PR pitching scripts, and calendar templates.",
    duration_desc: "35 hours of high-stakes positioning labs and speaker preparations.",
    terms_desc: "Confidentiality assured for executive training and private bookings.",
    investment_bullets: [
      "LinkedIn visual configuration and content templates",
      "Media outlet pitching templates and dynamic proposal letters",
      "Pre-formatted personal publication spreadsheet calculators",
      "Direct profile assessment from a veteran corporate PR advisor",
      "Certified Executive Brand Strategist Credentials"
    ],
    reviews: [
      { name: "Tushar Verma", location: "Mumbai, MH", text: "Incredible LinkedIn visibility guidelines. Signed two executive advising contracts in 60 days." },
      { name: "Priyanka Nair", location: "Bengaluru, KA", text: "The media pitching templates are incredibly practical. Got featured in two key business portals." },
      { name: "Abhishek Rao", location: "Hyderabad, TS", text: "A logical system. Removed the confusion from personal digital positioning." }
    ]
  },
  {
    name: "Decision Making Mastery Training",
    file: "decision-making-mastery-training.html",
    difficulty: "Intermediate",
    price: "25,000",
    duration: "25 hours",
    desc_short: "Master cognitive bias diagnostics, statistical decision tables, risk metrics, and high-pressure operational resolutions.",
    desc_main: "Combines neuroscience, statistical matrices, and decision psychology to help you make rapid, logical decisions under uncertainty. Audit risks and lead group consensus with high accuracy.",
    key_learning: [
      "Psychology of logical judgment and choice configurations",
      "Neutralizing cognitive bias patterns and groupthink issues",
      "Applying probability matrices and decision trees to choices",
      "Heuristics for rapid choice resolution during operational crises",
      "Managing collaborative decisions and consensus alignments",
      "Analyzing data reports to support critical capital allocations",
      "Understanding corporate game theory models and choices",
      "Evaluating choice outcomes and feedback calibration systems"
    ],
    ideal_for: "Operations leads, startup executives, risk managers, and business coordinators.",
    outcomes: "Execute rational decisions under stress, evaluate complex trade-offs, and improve group decision-making speeds.",
    pricing_desc: "Covers probability software tools, decision frameworks, and error check files.",
    duration_desc: "25 hours of decision mock-ups and high-pressure strategic exercises.",
    terms_desc: "Perfect for leadership teams wanting to improve collaborative choice speeds.",
    investment_bullets: [
      "Probability calculation registers and grid sheets",
      "Risk assessment matrix checklists and diagnostic templates",
      "Case archives of high-stakes corporate emergency choices",
      "Mentorship sessions with executive crisis operations consultants",
      "Certified Rational Decisions Analyst Credentials"
    ],
    reviews: [
      { name: "Naveen Shah", location: "Gurugram, HR", text: "The probability matrix tools completely reshaped how we prioritize our project pipeline." },
      { name: "Swathi Iyer", location: "Chennai, TN", text: "Loved the cognitive bias deep-dives. Showed me how subconscious habits skew investments." },
      { name: "Rahul Deshmukh", location: "Mumbai, MH", text: "Extremely structured. Perfect for managers handling fast-moving logistics operations." }
    ]
  },
  {
    name: "The Everyday AI Toolkit",
    file: "the-everyday-ai-toolkit.html",
    difficulty: "Beginner",
    price: "35,000",
    duration: "10 hours",
    desc_short: "Learn fundamental prompt structures, basic document editing aids, search utilities, and clean AI email automations.",
    desc_main: "A friendly, entry-level, non-technical introduction to AI utilities. Learn basic ChatGPT formulas, document summarizing, and quick tasks to save hours every single day.",
    key_learning: [
      "Understanding popular AI tools and administrative systems",
      "Drafting clean, basic prompts for immediate office outputs",
      "Writing emails, summaries, and agendas with AI assistance",
      "Leveraging AI to debug basic spreadsheet formulas and logs",
      "Simple image generation and graphic touch-up options",
      "Using AI tools for fast client research and topic audits",
      "Recognizing AI data privacy and security fundamentals",
      "Configuring simple folder and email automation flows"
    ],
    ideal_for: "Administrative assistants, entry-level staff, teachers, and business owners.",
    outcomes: "Confidently use everyday AI applications to drafts documents, organize files, and handle emails in half the time.",
    pricing_desc: "Includes simple prompt worksheets, bookmark lists, and AI guidelines.",
    duration_desc: "10 hours of hands-on interactive workflows and prompt drills.",
    terms_desc: "Designed for beginners with absolutely zero programming background.",
    investment_bullets: [
      "Simple prompt check lists and quick reference cards",
      "Email and meeting summary prompt formats",
      "Data privacy safety guides for general workspace use",
      "Support forum access and direct tutor responses",
      "Certified Office AI Competency Credentials"
    ],
    reviews: [
      { name: "Harish Rao", location: "Hyderabad, TS", text: "So simple and encouraging! I was afraid of tech, but now I write all my client logs with Claude." },
      { name: "Snehal Patil", location: "Pune, MH", text: "The Excel formula helper guides are amazing. Saved me hours of lookup debugging." },
      { name: "Priya Pillai", location: "Kochi, KL", text: "Highly structured and clear. Ideal for teachers seeking to speed up lesson plan designs." }
    ]
  },
  {
    name: "Motivational Speaker Training",
    file: "motivational-speaker-training.html",
    difficulty: "Advanced",
    price: "42,000",
    duration: "30 hours",
    desc_short: "Master inspiring story structures, stage presence metrics, vocal dynamics, and paid keynote consulting contracts.",
    desc_main: "Provides public speakers, authors, and aspiring presenters with structures to command huge audiences. Learn story arcs, vocal projection, body dynamics, and presentation packaging.",
    key_learning: [
      "Constructing high-impact story arcs, metrics, and hooks",
      "Mastering vocal dynamics, tone, pacing, and dramatic pause",
      "Non-verbal communication, posture, and stage command systems",
      "Fostering deep emotional connection with diverse audiences",
      "Handling tough questions, hecklers, and unexpected interruptions",
      "Creating professional presentation slide decks and speaker reels",
      "Negotiating corporate speaker fees, licensing, and deal terms",
      "Managing stage anxiety, performance breathing, and centering"
    ],
    ideal_for: "Aspiring keynote speakers, corporate coaches, authors, and communication leads.",
    outcomes: "Command large stages with ease, deliver unforgettable personal stories, and pitch for paid corporate speaking roles.",
    pricing_desc: "Covers slide design templates, speaker agreement samples, and speech recording reviews.",
    duration_desc: "30 hours of vocal performance labs and keynote staging drills.",
    terms_desc: "Bulk registrations available for corporate coaching team systems.",
    investment_bullets: [
      "Speaker booking contract templates and rider sheets",
      "keynote speech drafting checklists and hooks decks",
      "High-end presentation slide design templates",
      "Direct speech video evaluations by veteran corporate keynote speakers",
      "Certified Professional Speaker Credentials"
    ],
    reviews: [
      { name: "Vivek Roy", location: "Bengaluru, KA", text: "The story arc templates completely restructured my speeches. Received outstanding feedback on my last keynote." },
      { name: "Nila Sen", location: "New Delhi, DL", text: "Fabulous booking and billing guidelines. Helped me double my keynote consulting rates." },
      { name: "Girish Patel", location: "Surat, GJ", text: "Brilliant vocal coaching labs. The breathing and pacing drills were remarkably effective." }
    ]
  },
  {
    name: "Mindset Mastery Training",
    file: "mindset-mastery-training.html",
    difficulty: "Intermediate",
    price: "20,000",
    duration: "30 hours",
    desc_short: "Replace limiting beliefs with cognitive growth patterns, build deep focus routines, and develop mental resilience.",
    desc_main: "A transformational psychological development framework. Strengthen your internal grit, manage emotional reactiveness, build productivity rituals, and maintain focus under pressure.",
    key_learning: [
      "Science of growth mindset psychology and cognitive focus",
      "Identifying and dismantling negative limiting belief structures",
      "Developing systematic focus, discipline, and flow states",
      "Goal setting and performance-to-action metric alignments",
      "Emotional resilience and stress management reframings",
      "Building high-performance routines and habits tracking",
      "Cognitive reframing practices to handle professional failures",
      "Constructing long-term personal accountability framework systems"
    ],
    ideal_for: "Entrepreneurs, senior managers, professionals, and individuals seeking career acceleration.",
    outcomes: "Approach hard professional challenges with high grit, maintain focus on key results, and eliminate limiting self-doubts.",
    pricing_desc: "Includes behavioral logs, growth logs, and interactive focus worksheets.",
    duration_desc: "30 hours of emotional self-regulation study and performance drills.",
    terms_desc: "Special licensing options for university student groups.",
    investment_bullets: [
      "Cognitive growth diary and daily tracking printables",
      "Habit-loop diagnostic checklists and goal calendars",
      "Stress reframing worksheets and cognitive guide sheets",
      "Direct guidance from registered occupational psychology mentors",
      "Certified Growth Mindset Practitioner Credentials"
    ],
    reviews: [
      { name: "Alia Sen", location: "Mumbai, MH", text: "Mindset Mastery helped me break free of circular self-doubt patterns. High practical impact." },
      { name: "Sameer Verma", location: "Gurugram, HR", text: "Outstanding habit tracking tools. Really helped me focus our team's operational goals." },
      { name: "Divya Nair", location: "Kochi, KL", text: "A lovely cognitive guide. The reframing sheets are exceptional for long-term grit." }
    ]
  },
  {
    name: "Adaptive Leadership Training",
    file: "adaptive-leadership-training.html",
    difficulty: "Beginner",
    price: "26,000",
    duration: "35 hours",
    desc_short: "Lead departments through high-speed transitions, map psychological safety, and delegate in agile structures.",
    desc_main: "Replaces legacy command-and-control styles with modern, empathetic, and agile coordination. Master situational management, corporate change curves, active delegation, and conflict resolution.",
    key_learning: [
      "Applying agile leadership and situational delegation guidelines",
      "Conducting active empathy mapping and safety diagnostics",
      "Managing team resistance during fast corporate restructures",
      "Coordinating decentralized delegation and high-trust rules",
      "Directing remote and distributed multicultural team systems",
      "Conflict management metrics, active mediation, and group trust",
      "Developing business flexibility blueprints and change paths",
      "Executive alignment, vision presentation, and strategy pitching"
    ],
    ideal_for: "Team leaders, new managers, HR managers, and corporate coordinators.",
    outcomes: "Direct high-stakes organizational transitions with minimum pushback, align team outputs, and lead productive groups.",
    pricing_desc: "Includes delegation trackers, empathy decks, and change management tools.",
    duration_desc: "35 hours of situational leadership mock-ups and feedback.",
    terms_desc: "Complies with agile leadership team building corporate frameworks.",
    investment_bullets: [
      "Situational delegation checklists and framework templates",
      "Team psychological safety audit forms and metric cards",
      "Change implementation roadmap guides and logs",
      "Mentorship sessions with executive agile operations coordinators",
      "Certified Adaptive Leader Credentials"
    ],
    reviews: [
      { name: "Kunal Sen", location: "New Delhi, DL", text: "Perfect delegation frameworks. Drastically improved our tech team's operational speed." },
      { name: "Sanya Goel", location: "Noida, UP", text: "Brilliant situational leadership mock setups. Really helped us handle department transitions." },
      { name: "Varun Tej", location: "Hyderabad, TS", text: "Clear, logical, and highly actionable. Essential for newly promoted team managers." }
    ]
  },
  {
    name: "Confidence and Charisma Training",
    file: "confidence-and-charisma-training.html",
    difficulty: "Intermediate",
    price: "62,500",
    duration: "30 hours",
    desc_short: "Master executive vocal projection, magnetic storytelling hooks, physical presence cues, and instant rapport building.",
    desc_main: "Provides professionals with the behavioral skills to command boardrooms and networks. Master physical posture alignments, assertive boundary structures, vocal pacing, and storytelling mechanics.",
    key_learning: [
      "Applying authoritative vocal pacing and structural pausing",
      "Developing magnetic storytelling hooks for executive circles",
      "Projecting physical cues that assert boardroom authority",
      "Building rapid, authentic rapport with high-status contacts",
      "Assertive salary negotiation and career pitching dialogues",
      "Overcoming performance anxiety during intense corporate tables",
      "Mirroring group dynamics to steer collaborative discussions",
      "Developing daily personal charismatic habit configurations"
    ],
    ideal_for: "C-suite executives, senior advisors, business partners, and client relationship managers.",
    outcomes: "Command immediate professional trust, present complex arguments with high charisma, and negotiate from positions of strength.",
    pricing_desc: "Covers video speech diagnostic reviews, pitch cards, and script formats.",
    duration_desc: "30 hours of intensive personal presentation coaching and drills.",
    terms_desc: "Private executive scheduling available on select dates.",
    investment_bullets: [
      "boardroom vocal coaching audio reference drills",
      "storytelling outline cards and dynamic pitch formats",
      "Executive dialogue scripts for networking settings",
      "Video speech review and pacing assessments from elite coaches",
      "Certified Executive Charisma Credentials"
    ],
    reviews: [
      { name: "Amit Reddy", location: "Mumbai, MH", text: "Outstanding vocal pacing tips. Received immediate praise in our annual board meeting." },
      { name: "Swathi Pillai", location: "Bengaluru, KA", text: "The executive storytelling hooks transformed our investor fundraising pitch deck." },
      { name: "Rajesh Nair", location: "Chennai, TN", text: "Highly practical body cues. Boosted my negotiation confidence substantially." }
    ]
  }
];

// Added from Previous Step (Excluding 'Certificate in Leadership & Team Management' and 'Time Management & Productivity Certification')
const prev_new_courses = [
  {
    name: "Professional Development Certification",
    file: "professional-development-certification.html",
    difficulty: "Intermediate",
    price: "22,000",
    duration: "30 hours",
    desc_short: "Acquire systematic corporate performance metrics, professional etiquette standards, and cross-functional project tracking.",
    desc_main: "Designed for mid-level professionals seeking career acceleration. Focuses on corporate operations protocols, presentation standards, task tracking, and conflict resolution systems.",
    key_learning: [
      "Mastering professional corporate meeting protocols",
      "Structuring cross-functional project tracking files",
      "Adopting international business etiquette rules",
      "Designing clean executive presentation slides",
      "Managing workplace dispute resolution paths",
      "Formulating career growth maps and milestones",
      "Tracking department performance indicators",
      "Balancing operational workloads with agile routines"
    ],
    ideal_for: "Mid-level corporate associates, administrative coordinators, and analysts.",
    outcomes: "Align with international business standards, present files confidently to leadership, and run productive department tasks.",
    pricing_desc: "Covers meeting frameworks, task templates, and slide files.",
    duration_desc: "30 hours of structured corporate alignment and task labs.",
    terms_desc: "Billed under standard corporate training invoice schedules.",
    investment_bullets: [
      "Business communication check lists and slide maps",
      "Department task tracker spreadsheets and databases",
      "Professional email writing guidelines and logs",
      "Direct workflow feedback from senior operations directors",
      "Certified Corporate Performance Specialist Credentials"
    ],
    reviews: [
      { name: "Suresh Joshi", location: "Mumbai, MH", text: "A fabulous operations review. The slide frameworks are highly professional." },
      { name: "Meera Nair", location: "Bengaluru, KA", text: "Enhanced my team's project tracking substantially. Highly practical templates." },
      { name: "Karan Sen", location: "Delhi, DL", text: "Excellent workplace dispute resolutions models. Ideal for department leads." }
    ]
  },
  {
    name: "Advanced Career Skills Certification",
    file: "advanced-career-skills-certification.html",
    difficulty: "Advanced",
    price: "45,000",
    duration: "40 hours",
    desc_short: "Master cross-department operations, strategic negotiations, conflict mediation, and corporate resource scheduling.",
    desc_main: "Provides senior associates with advanced management skills. Master organizational layouts, corporate budgeting, subcontractor controls, and cross-functional team coordination.",
    key_learning: [
      "Structuring cross-department workflow schedules",
      "Orchestrating high-value negotiation preparation sheets",
      "Applying advanced mediation styles to group conflicts",
      "Drafting corporate project budgets and variance logs",
      "Managing subcontracting terms and vendor evaluations",
      "Integrating resource allocation and timeline charts",
      "Navigating compliance requirements across departments",
      "Leading technical department presentation briefings"
    ],
    ideal_for: "Senior coordinators, division leaders, operations supervisors, and coordinators.",
    outcomes: "Manage multi-level corporate units, mitigate division resource wastes, and present clear strategic paths to executives.",
    pricing_desc: "Includes resource sheets, budgeting guides, and mediation mock decks.",
    duration_desc: "40 hours of intensive division leadership modeling and review.",
    terms_desc: "Qualifies for corporate skill alignment funding grants.",
    investment_bullets: [
      "Multi-department resource coordination templates",
      "Budget variance checking sheets and trackers",
      "Negotiation contract guidelines and mediation logs",
      "Live advisory sessions with corporate operations consultants",
      "Certified Advanced Business Operations Specialist Credentials"
    ],
    reviews: [
      { name: "Ritu Saxena", location: "Gurugram, HR", text: "The budgeting variance logs resolved our department's resource allocation issues." },
      { name: "Rahul Verma", location: "Pune, MH", text: "Fabulous cross-functional planning drills. Highly recommended for division leads." },
      { name: "Sneha Nair", location: "Chennai, TN", text: "Clear, logical mediation frameworks. Significantly improved our internal logistics." }
    ]
  },
  {
    name: "Workplace Excellence Certification",
    file: "workplace-excellence-certification.html",
    difficulty: "Intermediate",
    price: "28,000",
    duration: "25 hours",
    desc_short: "Achieve superior workplace standards, emotional intelligence protocols, task delegation structures, and agile schedules.",
    desc_main: "Focuses on building a culture of high performance and active collaboration. Master peer-to-peer trust mapping, empathetic conflict management, agile boards, and focus rituals.",
    key_learning: [
      "Fostering psychological safety and active peer trust",
      "Applying emotional intelligence to workplace friction",
      "Configuring agile team task boards and delegation metrics",
      "Developing focus rituals to block operational distractions",
      "Managing collaborative client review processes smoothly",
      "Designing mentor maps to build junior team capacities",
      "Auditing workplace workflows to reduce operational friction",
      "Aligning department goals with general corporate values"
    ],
    ideal_for: "HR coordinators, operational team leads, and project supervisors.",
    outcomes: "Foster trust across department units, optimize team task delegations, and implement agile work processes.",
    pricing_desc: "Includes trust metrics maps, agile cards, and flowcharts.",
    duration_desc: "25 hours of collaborative team dynamics modeling and feedback.",
    terms_desc: "Billed through corporate training purchase orders.",
    investment_bullets: [
      "Peer-to-peer emotional safety audit formats",
      "Agile board setup templates and task metrics cards",
      "Workplace workflow optimization diagnostic guides",
      "Expert feedback from senior organizational development leads",
      "Certified Workplace Excellence Specialist Credentials"
    ],
    reviews: [
      { name: "Pooja Roy", location: "Bengaluru, KA", text: "The agile delegation models changed how we run our daily scrum meetings." },
      { name: "Rajesh Deshmukh", location: "Pune, MH", text: "Outstanding psychological safety checklists. Tremendous impact on team trust." },
      { name: "Snehal Patil", location: "Ahmedabad, GJ", text: "Highly practical conflict management templates. Saved our division lots of friction." }
    ]
  },
  {
    name: "Professional Skills Enhancement Certificate",
    file: "professional-skills-enhancement-certificate.html",
    difficulty: "Intermediate",
    price: "32,000",
    duration: "30 hours",
    desc_short: "Perfect your corporate problem-solving skills, meeting facilitation techniques, agile workflows, and business writing.",
    desc_main: "A comprehensive capacity building curriculum. Master logical analysis models, rapid root-cause diagnostic systems, clear documentation formats, and collaborative meeting designs.",
    key_learning: [
      "Applying logical problem-solving structures to operations",
      "Conducting rapid root-cause diagnostics on workflows",
      "Facilitating brief, action-oriented corporate meetings",
      "Drafting clear documentation and structured updates",
      "Integrating agile schedules into individual task tracking",
      "Navigating peer-to-peer alignments and operational reviews",
      "Using data charts to back team change arguments",
      "Aligning operational timelines with external project paths"
    ],
    ideal_for: "Operations associates, analysts, and project team supervisors.",
    outcomes: "Facilitate efficient team alignments, resolve workflow errors logically, and compile clear executive updates.",
    pricing_desc: "Covers diagnostic frameworks, meeting plans, and documentation logs.",
    duration_desc: "30 hours of advanced task processing and analytical labs.",
    terms_desc: "Corporate booking pricing applies for groups of 5 or more.",
    investment_bullets: [
      "Workflow root-cause diagnostic checking sheets",
      "Meeting facilitator logs and action card formats",
      "Executive briefing template suites and trackers",
      "One-on-one reviews with corporate capability managers",
      "Certified Professional Capability Specialist Credentials"
    ],
    reviews: [
      { name: "Amit Verma", location: "Noida, UP", text: "Outstanding root-cause systems. Really helped debug our warehouse delivery paths." },
      { name: "Sneha Nair", location: "Chennai, TN", text: "The meeting facilitator templates are wonderfully brief and action-focused." },
      { name: "Karthik Nair", location: "Bengaluru, KA", text: "Highly structured. Perfect for analysts wanting to present files to executives." }
    ]
  },
  {
    name: "Corporate Skills Certification",
    file: "corporate-skills-certification.html",
    difficulty: "Advanced",
    price: "38,000",
    duration: "40 hours",
    desc_short: "Master corporate governance, strategic planning indexes, operational risk audits, and C-suite reporting decks.",
    desc_main: "Provides directors and senior advisors with strategic planning frameworks. Master market risk audits, investment justifications, department alignment metrics, and C-suite pitches.",
    key_learning: [
      "Formulating strategic business planning index models",
      "Conducting operational risk and compliance audits",
      "Drafting C-suite reporting decks and business briefs",
      "Aligning department resources with corporate values",
      "Negotiating corporate agreements and partnership rules",
      "Designing change management roadmaps and schedules",
      "Navigating regulatory guidelines and industry rules",
      "Evaluating department contribution to net corporate margins"
    ],
    ideal_for: "Division directors, senior risk managers, and business strategists.",
    outcomes: "Audit operational compliance indexes, construct strategic planning roadmaps, and pitch department budgets to board levels.",
    pricing_desc: "Includes strategic planners, auditing decks, and pitch templates.",
    duration_desc: "40 hours of advanced corporate strategy modeling and diagnostics.",
    terms_desc: "Bulk licensing available for enterprise transformation programs.",
    investment_bullets: [
      "Strategic operational planning calculation matrices",
      "Corporate risk audit templates and compliance sheets",
      "C-suite presentation structures and pitch manuals",
      "Live strategy reviews from veteran enterprise directors",
      "Certified Corporate Strategy Specialist Credentials"
    ],
    reviews: [
      { name: "Vikram Sen", location: "Kolkata, WB", text: "The risk auditing structures are exceptionally thorough. Outstanding planning guides." },
      { name: "Meera Nair", location: "Bengaluru, KA", text: "Excellent C-suite presentation templates. Streamlined our division's budget pitch." },
      { name: "Rohan Dsouza", location: "Mumbai, MH", text: "Highly detailed. A masterclass in corporate operational strategy and metrics." }
    ]
  },
  {
    name: "Professional Growth Certification",
    file: "professional-growth-certification.html",
    difficulty: "Intermediate",
    price: "24,000",
    duration: "30 hours",
    desc_short: "Build lasting professional adaptability, career path models, mentor integrations, and executive networking skills.",
    desc_main: "Focuses on career acceleration and professional branding. Master mentor-mentee alignment systems, personal portfolio development, public speaking pacing, and corporate networking maps.",
    key_learning: [
      "Establishing long-term professional adaptability maps",
      "Building a customized career path and milestone log",
      "Managing mentor-mentee alignments and tracking values",
      "Designing professional portfolios and authority websites",
      "Perfecting personal speaker pacing and network pitching",
      "Orchestrating professional corporate networking logs",
      "Negotiating compensation adjustments and value pitches",
      "Developing daily growth tracking and skill audits"
    ],
    ideal_for: "Emerging leaders, mid-level coordinators, and fast-track professionals.",
    outcomes: "Map long-term career growth milestones, build a robust professional brand, and pitch your value to C-suite managers.",
    pricing_desc: "Includes portfolio layouts, positioning kits, and growth journals.",
    duration_desc: "30 hours of career acceleration labs and speaker feedback.",
    terms_desc: "Flexible individual booking schedules available.",
    investment_bullets: [
      "Personal career path planning diaries and logs",
      "Executive dialogue guides and networking contact sheets",
      "compensation negotiation script files and value templates",
      "Direct portfolio review by a corporate positioning consultant",
      "Certified Career Growth Strategist Credentials"
    ],
    reviews: [
      { name: "Harish Rao", location: "Hyderabad, TS", text: "The career path modeling loops opened my eyes. Landed a promotion in 90 days." },
      { name: "Priya Pillai", location: "Kochi, KL", text: "Fabulous compensation script outlines. Highly practical and highly effective." },
      { name: "Snehal Patil", location: "Pune, MH", text: "Brilliant personal portfolio guides. Really helped clarify my niche." }
    ]
  },
  {
    name: "Career Development Certification",
    file: "career-development-certification.html",
    difficulty: "Beginner",
    price: "20,000",
    duration: "10 hours",
    desc_short: "Learn job application structures, resume writing guidelines, industry interview mockups, and corporate onboarding guides.",
    desc_main: "Designed for entry-level candidates seeking quick corporate placements. Learn resume alignment metrics, cover letter drafts, professional attire guidelines, and interview questions.",
    key_learning: [
      "Structuring job applications and resume alignment rules",
      "Drafting professional cover letters and intro cards",
      "Navigating industry interview mockups and answer loops",
      "Adopting corporate onboarding standards and policies",
      "Using digital search filters and profile optimizations",
      "Managing professional communications with hiring teams",
      "Building workplace confidence and proactive questions",
      "Aligning job expectations with long-term skill metrics"
    ],
    ideal_for: "Recent graduates, entry-level candidates, and career changers.",
    outcomes: "Draft high-converting corporate resumes, pass tough HR panel interviews, and navigate your first corporate month with ease.",
    pricing_desc: "Covers resume files, cover letter guides, and interview logs.",
    duration_desc: "10 hours of hands-on resume reviews and interview mock-ups.",
    terms_desc: "University group placement discounts are available.",
    investment_bullets: [
      "Resume structure checklists and design template files",
      "Hiring panel interview question logs and answer grids",
      "First-month corporate survival checklist cards",
      "Direct resume feedback from experienced recruitment supervisors",
      "Certified Job Readiness Credentials"
    ],
    reviews: [
      { name: "Aman Patel", location: "Ahmedabad, GJ", text: "The interview mock setups were exceptionally realistic. Helped me land my first job!" },
      { name: "Nisha Roy", location: "Bengaluru, KA", text: "Fabulous resume formatting guides. Got three interview invites in two weeks." },
      { name: "Kunal Sen", location: "New Delhi, DL", text: "Clear, logical, and encouraging. Crucial guidance for all university seniors." }
    ]
  },
  {
    name: "Workplace Readiness Certification",
    file: "workplace-readiness-certification.html",
    difficulty: "Beginner",
    price: "25,000",
    duration: "10 hours",
    desc_short: "Acquire basic email writing protocols, meeting behaviors, business attire guidelines, and task management basics.",
    desc_main: "Prepares young graduates for professional office environments. Learn corporate behavior rules, constructive feedback formats, file management basic grids, and project calendar systems.",
    key_learning: [
      "Adopting basic corporate email structures and etiquette",
      "Participating productively in team project meetings",
      "Selecting professional office attire and body codes",
      "Orchestrating task priorities and calendar schedules",
      "Receiving constructive peer feedback with growth mindset",
      "Navigating office filing networks and document security",
      "Communicating deadlines clearly with team coordinators",
      "Handling professional interactions with senior managers"
    ],
    ideal_for: "Hired candidates, interns, and emerging corporate associates.",
    outcomes: "Transition into corporate spaces without friction, write professional office emails, and manage your tasks on time.",
    pricing_desc: "Includes email builders, behavior guides, and scheduling tools.",
    duration_desc: "10 hours of office behavioral desensitization and coaching.",
    terms_desc: "Ideal for corporate client graduate onboarding programs.",
    investment_bullets: [
      "Standard office email drafting reference booklets",
      "Project task configuration guides and calendar templates",
      "Professional workplace behavior checking checklists",
      "Direct behavioral coaching from experienced corporate instructors",
      "Certified Workplace Professional Credentials"
    ],
    reviews: [
      { name: "Rahul Sharma", location: "Mumbai, MH", text: "Helped me understand office communication dynamics. My manager noticed my proactive logs." },
      { name: "Sneha Nair", location: "Noida, UP", text: "The email templates are exceptionally useful. Significantly reduced my drafting anxiety." },
      { name: "Kavita Rao", location: "Visakhapatnam, AP", text: "Highly practical tips. An absolute necessity for any young professional." }
    ]
  },
  {
    name: "Certificate in Business Management",
    file: "certificate-in-business-management.html",
    difficulty: "Advanced",
    price: "42,000",
    duration: "45 hours",
    desc_short: "Master business unit financial variance control, strategic operations design, sales funnel mapping, and vendor management.",
    desc_main: "Provides senior coordinators with a comprehensive business operations toolkit. Master corporate resource scheduling, team performance indicators, operations audits, and compliance grids.",
    key_learning: [
      "Orchestrating business unit financial variance controls",
      "Designing strategic corporate operations layouts",
      "Mapping customer acquisition funnels and sales flows",
      "Directing subcontractor evaluation and vendor terms",
      "Structuring team performance indicator frameworks",
      "Conducting systemic business compliance audits",
      "Managing division resource scheduling and metrics",
      "Aligning product lines with strategic business margins"
    ],
    ideal_for: "Business unit managers, department supervisors, and corporate developers.",
    outcomes: "Optimize department operating budgets, establish high-productivity team workflows, and audit operational margins accurately.",
    pricing_desc: "Covers financial planners, operations guides, and vendor templates.",
    duration_desc: "45 hours of detailed corporate management modeling and review.",
    terms_desc: "Corporate transformation discounts apply for multiple seats.",
    investment_bullets: [
      "Corporate operations plan matrices and calculators",
      "Subcontractor evaluation templates and KPI registers",
      "Financial variance analysis checking spreadsheet databases",
      "Direct advisory sessions with experienced business management advisors",
      "Certified Business Manager Credentials"
    ],
    reviews: [
      { name: "Kunal Shah", location: "Vadodara, GJ", text: "The operational planning models changed how we run our logistics division. Exceptional value." },
      { name: "Ritu Goel", location: "Gurugram, HR", text: "Highly thorough budgeting templates. Streamlined our annual resource presentations." },
      { name: "Aman Sen", location: "Kolkata, WB", text: "Outstanding vendor management guides. Perfect for C-suite preparation." }
    ]
  },
  {
    name: "Certificate in Project Coordination",
    file: "certificate-in-project-coordination.html",
    difficulty: "Intermediate",
    price: "32,000",
    duration: "30 hours",
    desc_short: "Develop systematic cross-functional schedules, task board allocations, status report cards, and budget risk audits.",
    desc_main: "Prepares coordinators to serve as crucial links between operations and C-suite management. Learn to build gantt schedules, track contractor logs, and compile risk reports.",
    key_learning: [
      "Building cross-functional task tracking schedules",
      "Configuring agile team task boards and priorities",
      "Compiling action-focused project status reports",
      "Conducting project budget and timeline risk audits",
      "Coordinating contractor delivery milestones and logs",
      "Mitigating calendar friction across corporate divisions",
      "Tracking team resource allocation hours and metrics",
      "Facilitating daily project progress alignment meetings"
    ],
    ideal_for: "Project coordinators, operations supervisors, and planning leads.",
    outcomes: "Maintain seamless timelines across multiple divisions, identify project delays early, and compile clean progress reports.",
    pricing_desc: "Includes status decks, agile charts, and risk templates.",
    duration_desc: "30 hours of structured project tracking and alignment exercises.",
    terms_desc: "Complies with international coordinator capability standards.",
    investment_bullets: [
      "Project status reporting decks and briefing files",
      "Agile board tracking template directories and databases",
      "Resource allocation log sheets and checking grids",
      "Direct advice and progress reviews from certified senior project directors",
      "Certified Project Coordinator Credentials"
    ],
    reviews: [
      { name: "Nisha Patel", location: "Bengaluru, KA", text: "Excellent cross-functional scheduling formats. Stopped our department's deadline slips." },
      { name: "Aman Roy", location: "Ahmedabad, GJ", text: "Brilliant task board layouts. Streamlined our daily delivery checkpoints." },
      { name: "Vikram Sen", location: "Kolkata, WB", text: "Very detailed risk auditing guides. Exceptional value for coordinators." }
    ]
  },
  {
    name: "Certificate in Office Administration",
    file: "certificate-in-office-administration.html",
    difficulty: "Beginner",
    price: "24,000",
    duration: "10 hours",
    desc_short: "Master workplace file security protocols, corporate event coordination, meeting minutes, and office tech basics.",
    desc_main: "Provides administrative professionals with advanced office coordination skills. Learn spreadsheet record keeping, digital file security, vendor tracking, and board meetings setups.",
    key_learning: [
      "Applying advanced office document filing systems",
      "Coordinating corporate events and facility logs",
      "Drafting accurate boardroom meeting minutes and goals",
      "Navigating office database interfaces and sheets",
      "Auditing administrative vendor billings and contracts",
      "Managing executive schedules and travel coordination",
      "Securing office files, backups, and network logs",
      "Resolving administrative client support emails on time"
    ],
    ideal_for: "Office administrators, executive assistants, and facility leads.",
    outcomes: "Run business office setups without error, secure physical and digital documents, and manage administrative suppliers.",
    pricing_desc: "Covers filing manuals, vendor files, and minute formats.",
    duration_desc: "10 hours of practical administrative coordination and task drills.",
    terms_desc: "Perfect for corporate groups looking to build strong admin teams.",
    investment_bullets: [
      "boardroom meeting minutes drafting templates",
      "Office utility and vendor bill checking spreadsheets",
      "Filing system layouts and data security checklist cards",
      "Direct advice from experienced corporate executive assistants",
      "Certified Office Administrator Credentials"
    ],
    reviews: [
      { name: "Pooja Shah", location: "Mumbai, MH", text: "The data security checklists are wonderfully practical. Improved our corporate storage systems." },
      { name: "Suresh Rao", location: "Hyderabad, TS", text: "Excellent event coordination planners. Saved us huge administrative coordination time." },
      { name: "Komal Patel", location: "Chennai, TN", text: "Brilliant minute drafting guidelines. Highly practical for executive coordinators." }
    ]
  },
  {
    name: "Certificate in Team Leadership",
    file: "certificate-in-team-leadership.html",
    difficulty: "Intermediate",
    price: "35,000",
    duration: "30 hours",
    desc_short: "Foster collaborative trust environments, guide peer conflict resolutions, delegate tasks, and run agile operations.",
    desc_main: "Designed for newly promoted team leads. Master situational communication, agile task allocations, empathetic mediation structures, and performance feedback paths.",
    key_learning: [
      "Fostering collaborative team trust and safety rules",
      "Guiding peer conflict resolution and mediation paths",
      "Delegating department tasks with clear status metrics",
      "Running agile department planning checkpoints",
      "Designing constructive performance feedback dialogues",
      "Setting group goals aligned with strategic values",
      "Mitigating team burnout through balanced schedules",
      "Coordinating multi-level team project progress briefs"
    ],
    ideal_for: "Newly promoted team leads, supervisors, and department heads.",
    outcomes: "Build high-trust collaborative team cultures, delegate tasks without friction, and resolve department conflicts proactively.",
    pricing_desc: "Includes delegation trackers, safety checkers, and feedback templates.",
    duration_desc: "30 hours of interactive leadership simulations and checks.",
    terms_desc: "Qualifies for department leader training corporate allocations.",
    investment_bullets: [
      "Team performance tracking boards and card templates",
      "Conflict resolution dialogue check guides and sheets",
      "Feedback script databases for performance review settings",
      "Direct mentorship coaching from certified organizational leads",
      "Certified Corporate Team Leader Credentials"
    ],
    reviews: [
      { name: "Rahul Verma", location: "Pune, MH", text: "The team feedback scripts are exceptionally useful. My performance reviews are much smoother." },
      { name: "Sneha Nair", location: "Chennai, TN", text: "Fabulous situational delegation models. Boosted our software delivery team morale." },
      { name: "Vikram Nair", location: "Bengaluru, KA", text: "Clear, structured, and highly actionable. Highly recommended for new supervisors." }
    ]
  },
  {
    name: "Certificate in Business Operations",
    file: "certificate-in-business-operations.html",
    difficulty: "Advanced",
    price: "48,000",
    duration: "40 hours",
    desc_short: "Master supply chain log systems, operational budget audits, subcontractor risk evaluations, and process optimizations.",
    desc_main: "Provides operations managers with advanced process design tools. Learn to identify bottleneck paths, optimize material logistics, draft budgets, and monitor compliance.",
    key_learning: [
      "Analyzing supply chain and physical log systems",
      "Auditing corporate operational budgets and variances",
      "Evaluating subcontractor risk and compliance registers",
      "Identifying workflow bottleneck paths and error nodes",
      "Deploying standard operating procedures and check logs",
      "Orchestrating warehouse and transport logistics paths",
      "Integrating resource capacity models and schedule grids",
      "Measuring operational contribution margins on output"
    ],
    ideal_for: "Operations heads, logistics leads, division supervisors, and planning managers.",
    outcomes: "Design high-efficiency supply chain paths, eliminate workflow bottlenecks, and audit operations budgets cleanly.",
    pricing_desc: "Covers capacity planners, SOP formats, and budget templates.",
    duration_desc: "40 hours of advanced operations diagnostics and workflow review.",
    terms_desc: "Special corporate billing pathways apply for multi-user setups.",
    investment_bullets: [
      "SOP configuration checklists and editable drafting forms",
      "Workflow bottleneck analysis modeling spreadsheets",
      "Supply chain resource allocation calculation logs",
      "Live workflow evaluations from veteran enterprise operations directors",
      "Certified Business Operations Professional Credentials"
    ],
    reviews: [
      { name: "Vikram Joshi", location: "Kolkata, WB", text: "The bottleneck modeling sheets helped us optimize our distribution hub capacity." },
      { name: "Deepika Sen", location: "Bengaluru, KA", text: "Excellent operational budget templates. High value for division managers." },
      { name: "Karthik Nair", location: "Kochi, KL", text: "Brilliant SOP structures. Drastically reduced our shipping packaging errors." }
    ]
  },
  {
    name: "Certificate in Supervisory Skills",
    file: "certificate-in-supervisory-skills.html",
    difficulty: "Beginner",
    price: "22,000",
    duration: "10 hours",
    desc_short: "Learn on-ground workforce coordination, shifts scheduling, safety rule monitoring, and daily progress logs.",
    desc_main: "Designed for field and site supervisors. Master daily shift planning, workforce compliance metrics, safety rule enforcements, and field record setups.",
    key_learning: [
      "Coordinating on-ground workforce tasks and schedules",
      "Configuring shift calendars and labor allocations",
      "Enforcing safety rules and workplace safety checks",
      "Drafting daily shift progress logs and summaries",
      "Resolving field team conflicts and behavior errors",
      "Managing tool and material storage inventory registers",
      "Communicating site targets clearly with workers",
      "Escalating operational safety issues to managers"
    ],
    ideal_for: "Workforce supervisors, field leads, construction site leads, and facility leads.",
    outcomes: "Direct daily workforce shifts safely, compile accurate progress logs, and ensure compliance with site regulations.",
    pricing_desc: "Includes shift templates, safety checklists, and field logs.",
    duration_desc: "10 hours of practical supervisor alignment and safety drills.",
    terms_desc: "Corporate safety-compliant supervisor certification framework.",
    investment_bullets: [
      "Daily shift record templates and worker task cards",
      "Workplace safety compliance audit sheets and checklist guides",
      "Field dispute resolution dialogue guides and scripts",
      "Expert feedback from certified safety and operations supervisors",
      "Certified Field Operations Supervisor Credentials"
    ],
    reviews: [
      { name: "Suresh Kumar", location: "Chennai, TN", text: "Highly practical shift log formats. Stopped our field labor scheduling overlaps." },
      { name: "Aditya Joshi", location: "Lucknow, UP", text: "The safety rule checklists are outstanding. Transformed our site safety culture." },
      { name: "Harsh Vardhan", location: "Noida, UP", text: "Excellent conflict resolution tips. Essential for daily warehouse leads." }
    ]
  },
  {
    name: "Advanced MS Excel Certification",
    file: "advanced-ms-excel-certification.html",
    difficulty: "Intermediate",
    price: "32,000",
    duration: "30 hours",
    desc_short: "Master analytical formulas (XLOOKUP, INDEX/MATCH), pivot dashboard designs, macros automation, and database models.",
    desc_main: "Unlock the full processing capability of spreadsheets. Learn nested logical formulas, dynamic data visual dashboards, basic macro automations, and database cleanup keys.",
    key_learning: [
      "Writing nested logical formulas for data transforms",
      "Building clean, dynamic pivot charts and dashboards",
      "Mastering XLOOKUP, INDEX, and MATCH lookup keys",
      "Designing conditional check rules for data validation",
      "Setting up database validation gates and error-proofs",
      "Automating daily reporting steps with basic macro loops",
      "Performing advanced statistic models and forecasting paths",
      "Integrating spreadsheet files with external database feeds"
    ],
    ideal_for: "Analysts, accountants, coordinators, administrative assistants, and business owners.",
    outcomes: "Process massive database worksheets in minutes, build interactive data dashboards, and automate administrative reporting cycles.",
    pricing_desc: "Includes database files, workbook templates, and macro codes.",
    duration_desc: "30 hours of intensive spreadsheet analysis and dashboard labs.",
    terms_desc: "Available for Excel 365, Google Sheets, or local setups.",
    investment_bullets: [
      "Custom pre-programmed lookup formula cheat sheets",
      "Interactive data dashboard layouts and configuration files",
      "Sample analytical database archives for workbook practice",
      "Direct dashboard layout review by a senior financial modeler",
      "Certified Advanced Excel Analyst Credentials"
    ],
    reviews: [
      { name: "Rahul Deshmukh", location: "Mumbai, MH", text: "The VLOOKUP-to-XLOOKUP transition guides are brilliant. My databases load 40% faster." },
      { name: "Sneha Nair", location: "Bengaluru, KA", text: "Fabulous macro templates. Automated our entire weekly billing report sequence." },
      { name: "Amit Joshi", location: "Ahmedabad, GJ", text: "Outstanding dashboard setups. Our corporate directors loved the visual data charts." }
    ]
  },
  {
    name: "Business Communication Certification",
    file: "business-communication-certification.html",
    difficulty: "Intermediate",
    price: "25,000",
    duration: "25 hours",
    desc_short: "Master corporate presentation pitching, executive client scripts, structured brief drafting, and active mediation.",
    desc_main: "Builds premium executive communication skills. Master structured proposal drafting, negotiation dialogue lines, vocal pausing, and department dispute mediation.",
    key_learning: [
      "Drafting clear, concise corporate proposal documents",
      "Structuring persuasive client presentation pitch scripts",
      "Adopting non-verbal presence cues in boardrooms",
      "Mediating cross-department disputes and differences",
      "Running brief, action-oriented corporate team meetings",
      "Tailoring corporate messages for diverse client circles",
      "Understanding negotiation psychology and dynamic offers",
      "Writing structured corporate update briefs for directors"
    ],
    ideal_for: "Client managers, department leads, coordinators, and PR supervisors.",
    outcomes: "Present complex strategies confidently, write clean corporate proposals, and resolve department disputes proactively.",
    pricing_desc: "Covers writing guidelines, negotiation scripts, and video pitches.",
    duration_desc: "25 hours of speech coaching and corporate drafting labs.",
    terms_desc: "Qualifies for professional leadership skill development standards.",
    investment_bullets: [
      "Proposal drafting template kits and structural slide maps",
      "Client dialogue negotiation script files and directories",
      "Non-verbal communication postures quick reference cards",
      "Live presentation evaluations from veteran corporate PR advisors",
      "Certified Executive Communicator Credentials"
    ],
    reviews: [
      { name: "Amit Sharma", location: "New Delhi, DL", text: "The proposal writing structures transformed our sales conversion rates immediately." },
      { name: "Priya Pillai", location: "Kochi, KL", text: "Brilliant vocal pacing exercises. Significantly increased my boardroom presence." },
      { name: "Rahul Verma", location: "Pune, MH", text: "Excellent conflict mediation guides. Wonderfully practical team tips." }
    ]
  },
  {
    name: "Professional Email Writing Certification",
    file: "professional-email-writing-certification.html",
    difficulty: "Beginner",
    price: "20,000",
    duration: "10 hours",
    desc_short: "Learn subject line strategies, structured message layouts, client response scripts, and email folder systems.",
    desc_main: "Provides administrative and coordinator staff with high-efficiency email skills. Learn to write brief, polite, and action-focused emails that receive prompt replies.",
    key_learning: [
      "Designing high-open subject lines for client emails",
      "Structuring concise, polite message layout grids",
      "Drafting professional customer support reply scripts",
      "Managing corporate email folders and archiving loops",
      "Handling sensitive communications and conflict cases",
      "Coordinating meeting updates and calendar invitations",
      "Enforcing company privacy rules in daily emails",
      "Formatting complex email attachments and descriptions"
    ],
    ideal_for: "Administrative staff, support teams, interns, and young professionals.",
    outcomes: "Draft flawless professional emails, reduce message delivery overlaps, and manage customer inquiries with calm poise.",
    pricing_desc: "Includes subject catalogs, reply script kits, and archiving tools.",
    duration_desc: "10 hours of practical email drafting and grammar audits.",
    terms_desc: "Standard corporate license files available for customer teams.",
    investment_bullets: [
      "subject line writing guidelines and template sheets",
      "Client inquiry reply scripts with editable conflict formats",
      "Email folder layout structures and archiving checklists",
      "Direct writing review by an experienced corporate communications editor",
      "Certified Professional Email Writer Credentials"
    ],
    reviews: [
      { name: "Harish Patel", location: "Hyderabad, TS", text: "Brilliant customer reply scripts. Drastically reduced our department's draft cycles." },
      { name: "Sneha Nair", location: "Chennai, TN", text: "Fabulous subject line tips. Our partner response speeds doubled in one month." },
      { name: "Priya Rao", location: "Visakhapatnam, AP", text: "Highly practical email formatting guides. Ideal for newly hired coordinators." }
    ]
  },
  {
    name: "Office Productivity Certification",
    file: "office-productivity-certification.html",
    difficulty: "Intermediate",
    price: "24,000",
    duration: "25 hours",
    desc_short: "Master calendar sequencing, department task tracker databases, corporate archiving loops, and meeting planners.",
    desc_main: "Provides administrative leads with tools to eliminate office chaos. Learn to sequence calendars, configure department task files, coordinate logistics, and run administrative reviews.",
    key_learning: [
      "Sequencing executive calendars and meeting paths",
      "Configuring department task tracker databases",
      "Deploying secure corporate archiving and backup loops",
      "Planning efficient, document-focused meeting schedules",
      "Coordinating local transport and accommodation logistics",
      "Managing office administrative vendor billing checks",
      "Filing secure document formats and record logs",
      "Structuring professional update briefs for coordinators"
    ],
    ideal_for: "Administrative supervisors, office coordinators, and facility planners.",
    outcomes: "Maintain flawless administrative order, manage supplier accounts cleanly, and reduce workspace organization wastes.",
    pricing_desc: "Includes calendar layouts, billing sheets, and tracking models.",
    duration_desc: "25 hours of advanced office coordination and organization labs.",
    terms_desc: "Meets standard professional administrative development guidelines.",
    investment_bullets: [
      "boardroom calendar organization templates and calendars",
      "Vendor bill checking spreadsheets and audit checklist cards",
      "Office archiving file security rules and database logs",
      "Direct guidance and audits from registered administration directors",
      "Certified Office Productivity Specialist Credentials"
    ],
    reviews: [
      { name: "Pooja Shah", location: "Mumbai, MH", text: "The vendor billing trackers saved us multiple billing errors. Wonderful guides." },
      { name: "Suresh Rao", location: "Hyderabad, TS", text: "Brilliant calendar organization methods. Completely resolved scheduling conflicts." },
      { name: "Komal Shah", location: "Chennai, TN", text: "Highly structured. Perfect for coordinators handling multi-level logistics." }
    ]
  }
];

// 13 Brand New Added in Current Step
const brand_new_courses = [
  {
    name: "Workplace Efficiency Certification",
    file: "workplace-efficiency-certification.html",
    difficulty: "Intermediate",
    price: "26,000",
    duration: "30 hours",
    desc_short: "Master workplace waste elimination, advanced time auditing, workflow mapping, and department focus blocks.",
    desc_main: "Provides operations leads with tools to analyze workplace layouts, map task sequences, audit time losses, and structure high-performance department schedules.",
    key_learning: [
      "Identifying operational time loss nodes in office layouts",
      "Conducting granular individual time and activity audits",
      "Mapping cross-department workflow sequences cleanly",
      "Deploying structural focus blocks to eliminate overlaps",
      "Analyzing administrative cost centers and capacity grids",
      "Setting up high-productivity department task routines",
      "Mitigating meeting duration creep and scheduling loops",
      "Aligning team daily tasks with core delivery milestones"
    ],
    ideal_for: "Operations Leads, Division Supervisors, and Business Coordinators.",
    outcomes: "Eliminate operational waste from office workflows, decrease task completion times, and run high-efficiency schedules.",
    pricing_desc: "Includes workflow mapping sheets, time logs, and focus blocks.",
    duration_desc: "30 hours of advanced task optimization and layout diagnostics.",
    terms_desc: "Corporate billing structured through standard invoice systems.",
    investment_bullets: [
      "Time logging and activities analysis workbook sheets",
      "Workflow diagnostic cards and bottleneck templates",
      "Standard organizational efficiency baseline checkers",
      "Direct advice from certified lean operations consultants",
      "Certified Workplace Efficiency Professional Credentials"
    ],
    reviews: [
      { name: "Rahul Sen", location: "Pune, MH", text: "Excellent time logging templates. Showed us how our admin team was losing 8 hours a week." },
      { name: "Sneha Pillai", location: "Kochi, KL", text: "Highly thorough workflow mapping guides. Streamlined our order delivery pipeline." },
      { name: "Vikram Nair", location: "Bengaluru, KA", text: "Practical and highly effective. Replaced long meetings with highly focused scrum blocks." }
    ]
  },
  {
    name: "Data Handling Certification",
    file: "data-handling-certification.html",
    difficulty: "Intermediate",
    price: "32,000",
    duration: "25 hours",
    desc_short: "Master analytical data checks, database cleans, CSV transform pipelines, and secure storage logs.",
    desc_main: "Builds advanced technical data processing skills. Master spreadsheet data cleaning, database error validations, secure CSV migrations, and information privacy protocols.",
    key_learning: [
      "Applying advanced analytical data checking formulas",
      "Deploying database clean routines and duplicate removal",
      "Configuring CSV data transform and upload pipelines",
      "Securing client information logs and access gates",
      "Designing conditional checks to detect entry errors",
      "Managing database migration paths with minimum data loss",
      "Navigating digital storage privacy regulations and laws",
      "Facilitating structured database backup and restore logs"
    ],
    ideal_for: "Analysts, Database Coordinators, and Administrative Leads.",
    outcomes: "Process large transactional databases cleanly, secure sensitive candidate logs, and remove duplicate data records.",
    pricing_desc: "Covers data cleaning workbook files, template cards, and security logs.",
    duration_desc: "25 hours of technical database processing and clean loops.",
    terms_desc: "Compatible with standard data security regulatory guidelines.",
    investment_bullets: [
      "Pre-programmed data checking formulas cheat cards",
      "Database cleaning checklists and error logging sheets",
      "Secure file migration guides and CSV diagnostic models",
      "Direct workbook code reviews by professional database architects",
      "Certified Database Operations Analyst Credentials"
    ],
    reviews: [
      { name: "Amit Sharma", location: "Noida, UP", text: "Outstanding data cleaning models. Cleaned our 10,000-row CRM database in minutes." },
      { name: "Priya Nair", location: "Chennai, TN", text: "Fabulous file migration guides. Secured our client records without any loss." },
      { name: "Karthik Pillai", location: "Bengaluru, KA", text: "Highly structured. Perfect for analysts wanting to secure cloud databases." }
    ]
  },
  {
    name: "Digital Marketing Certification",
    file: "digital-marketing-certification.html",
    difficulty: "Intermediate",
    price: "38,000",
    duration: "30 hours",
    desc_short: "Master search engine optimization audits, client acquisition funnels, digital ad metrics, and conversion paths.",
    desc_main: "A comprehensive digital marketing execution program. Master search engine indexing, paid ad tracking, custom customer journey maps, and automated lead acquisition scripts.",
    key_learning: [
      "Conducting comprehensive SEO audits and site log checks",
      "Structuring converting client acquisition funnel grids",
      "Orchestrating visual content calendars and scheduling",
      "Analyzing paid ad metrics, click-throughs, and spend",
      "Configuring automated email drip lead capture flows",
      "Evaluating landing page conversions and visual loops",
      "Navigating digital privacy guidelines and ad policies",
      "Measuring marketing contribution to net division sales"
    ],
    ideal_for: "Digital Marketing Managers, Content Directors, and Business Owners.",
    outcomes: "Launch high-converting digital campaigns, optimize ad budget spends, and automate client acquisition paths.",
    pricing_desc: "Includes marketing templates, ad budget boards, and audit manuals.",
    duration_desc: "30 hours of intensive digital marketing drills and analysis.",
    terms_desc: "Meets standard professional marketing competency specifications.",
    investment_bullets: [
      "Search Engine Optimization auditing check lists and spreadsheets",
      "Customer journey mapping visual boards and cards",
      "Paid ad budget allocation tools and performance tables",
      "Direct project reviews by experienced digital agency directors",
      "Certified Digital Marketing Strategist Credentials"
    ],
    reviews: [
      { name: "Amit Reddy", location: "Mumbai, MH", text: "The customer acquisition funnel layouts are amazingly logical. Boosted our leads by 20%." },
      { name: "Priya Patel", location: "Ahmedabad, GJ", text: "Outstanding ad spend tracking models. Showed us exactly where we were losing budget." },
      { name: "Rahul Verma", location: "Pune, MH", text: "Fabulous SEO checklist cards. Replaced third-party agency logs with simple internal steps." }
    ]
  },
  {
    name: "Social Media Management Certification",
    file: "social-media-management-certification.html",
    difficulty: "Intermediate",
    price: "28,000",
    duration: "25 hours",
    desc_short: "Master social content scheduling, brand narrative grids, community engagement metrics, and agency briefs.",
    desc_main: "Provides content leads with advanced channel management tools. Learn to map brand narrative grids, schedule cross-channel releases, analyze community trends, and draft briefs.",
    key_learning: [
      "Structuring cross-channel social scheduling boards",
      "Designing cohesive brand narrative content grids",
      "Measuring community engagement trends and reactions",
      "Drafting clear visual design and writing agency briefs",
      "Coordinating social channel exit and response scripts",
      "Mitigating brand reputation risks and customer issues",
      "Analyzing social channel performance dashboards and metrics",
      "Developing micro-influencer outreach contracts and schedules"
    ],
    ideal_for: "Social Media Leads, Brand Executives, and PR Coordinators.",
    outcomes: "Manage large corporate social media channels cleanly, draft high-performing visual schedules, and handle public comments with poise.",
    pricing_desc: "Covers brand grids, brief checklists, and response scripts.",
    duration_desc: "25 hours of channel management staging and metric check reviews.",
    terms_desc: "Corporate booking plans available for digital creative teams.",
    investment_bullets: [
      "Cross-channel content scheduling spreadsheets and logs",
      "Brand response script libraries with editable crisis cards",
      "Micro-influencer contracting templates and tracking sheets",
      "Live content scheduling reviews from corporate PR advisors",
      "Certified Social Media Manager Credentials"
    ],
    reviews: [
      { name: "Ritu Saxena", location: "Gurugram, HR", text: "The response script libraries saved our community coordinators during a sensitive system outage." },
      { name: "Sneha Nair", location: "Bengaluru, KA", text: "Brilliant scheduling spreadsheets. Extremely useful for managing multiple platforms." },
      { name: "Karan Sen", location: "Delhi, DL", text: "Excellent agency briefing checklist cards. Stopped our design loops completely." }
    ]
  },
  {
    name: "Content Writing Certification",
    file: "content-writing-certification.html",
    difficulty: "Beginner",
    price: "22,000",
    duration: "10 hours",
    desc_short: "Learn business writing hooks, corporate structural outlines, SEO keyword maps, and editorial check rules.",
    desc_main: "A practical, capacity-building content development course. Master corporate blog outlines, SEO keyword maps, editing checks, and customer research tools.",
    key_learning: [
      "Structuring engaging business writing hooks and leads",
      "Developing concise, informative corporate outlines",
      "Integrating SEO keywords into writing naturally",
      "Applying advanced spelling, grammar, and style check rules",
      "Drafting high-converting client support pages and FAQs",
      "Researching customer search intent before writing blocks",
      "Structuring professional update emails and newsletters",
      "Managing content assets, folders, and edit sequences"
    ],
    ideal_for: "Copywriters, Support Executives, and Editorial Assistants.",
    outcomes: "Draft clean, structured copy that ranks highly on search engines, and write email subject loops that prompt immediate reader actions.",
    pricing_desc: "Includes writing outlines, editing checklists, and formatting tools.",
    duration_desc: "10 hours of practical writing labs and copy audits.",
    terms_desc: "Excellent entry-level capacity building certification framework.",
    investment_bullets: [
      "Corporate copy structuring cheat cards and outlines",
      "Editorial quality checking spreadsheets and logs",
      "SEO keyword integration guidelines and diagnostic cards",
      "Direct writing review by an experienced corporate communications editor",
      "Certified Content Writing Professional Credentials"
    ],
    reviews: [
      { name: "Harish Rao", location: "Hyderabad, TS", text: "Wonderfully clear writing models. Replaced generic templates with concise, engaging blocks." },
      { name: "Snehal Patel", location: "Pune, MH", text: "The SEO keyword maps are exceptionally easy to follow. Highly practical exercises." },
      { name: "Priya Pillai", location: "Kochi, KL", text: "Brilliant copywriting structures. Ideal for administrators handling corporate newsletters." }
    ]
  },
  {
    name: "Customer Relationship Management Certification",
    file: "customer-relationship-management-certification.html",
    difficulty: "Intermediate",
    price: "35,000",
    duration: "30 hours",
    desc_short: "Master customer support diagnostic logs, CRM database gates, relationship tracking tables, and resolution scripts.",
    desc_main: "Provides customer success heads with advanced operational tracking systems. Learn to resolve tickets cleanly, schedule pipeline steps, manage loyalty programs, and map support metrics.",
    key_learning: [
      "Deploying customer support diagnostic logs and formats",
      "Configuring CRM database pipelines and access doors",
      "Analyzing customer lifetime value and tracking tables",
      "Structuring resolution scripts for sensitive support cases",
      "Integrating support metrics with client update calendars",
      "Coordinating corporate customer loyalty programs and metrics",
      "Securing client account data and information vaults",
      "Leading technical support performance audits and logs"
    ],
    ideal_for: "Customer Success Leads, Account Managers, and CRM Coordinators.",
    outcomes: "Manage massive customer relationship databases cleanly, resolve critical support cases logically, and improve customer retention indexes.",
    pricing_desc: "Covers ticket checklists, resolution scripts, and performance databases.",
    duration_desc: "30 hours of advanced CRM diagnostics and simulation labs.",
    terms_desc: "Fits with major enterprise CRM software workflows.",
    investment_bullets: [
      "Client onboarding verification templates and registers",
      "CRM pipeline milestone trackers and dashboard cards",
      "Resolution script databases for customer conflict cases",
      "Direct mentorship from certified customer experience supervisors",
      "Certified CRM Operations Specialist Credentials"
    ],
    reviews: [
      { name: "Vikram Joshi", location: "Mumbai, MH", text: "The resolution scripts completely restructured our call center onboarding curriculum. Fabulous!" },
      { name: "Deepika Sen", location: "Bengaluru, KA", text: "Excellent CRM pipeline spreadsheets. Drastically reduced client onboarding times." },
      { name: "Karthik Nair", location: "Chennai, TN", text: "Highly detailed. A masterclass in client retention metrics and logistics." }
    ]
  },
  {
    name: "Brand Communication Certification",
    file: "brand-communication-certification.html",
    difficulty: "Advanced",
    price: "42,000",
    duration: "40 hours",
    desc_short: "Master corporate identity design standards, brand narrative manuals, corporate press briefs, and executive scripts.",
    desc_main: "Provides senior positioning leads with advanced brand narrative alignment systems. Master standard guidelines, press relations pipelines, internal communication matrices, and crisis decks.",
    key_learning: [
      "Formulating standard corporate brand communication books",
      "Designing consistent brand narrative templates and logs",
      "Structuring corporate press briefs and media statements",
      "Coordinating internal communication updates and cards",
      "Negotiating corporate spokesperson boundaries and guides",
      "Designing crisis communication decks and emergency paths",
      "Navigating industry communication rules and policies",
      "Measuring brand equity indexing and audience feedback"
    ],
    ideal_for: "Positioning Leads, Corporate Directors, and Communications Directors.",
    outcomes: "Establish airtight corporate brand identity standards, lead media relations pipelines, and direct crisis communication steps with complete poise.",
    pricing_desc: "Includes brand manuals, media outlines, and crisis templates.",
    duration_desc: "40 hours of advanced brand narrative modeling and reviews.",
    terms_desc: "Perfect for directors looking to build premium brand authority.",
    investment_bullets: [
      "Corporate media spokesperson dialogue guidelines",
      "Crisis communication checklist cards and process flowcharts",
      "Press release drafting templates and distribution tables",
      "Live positioning evaluations from veteran corporate PR advisors",
      "Certified Brand Communications Specialist Credentials"
    ],
    reviews: [
      { name: "Vikram Sen", location: "Kolkata, WB", text: "The crisis communication checkers saved our operations division during a logistics incident." },
      { name: "Meera Nair", location: "Bengaluru, KA", text: "Excellent press release layouts. Streamlined our quarterly corporate messaging pitches." },
      { name: "Rohan Dsouza", location: "Goa", text: "Highly practical guidelines. A masterclass in public communications and positioning." }
    ]
  },
  {
    name: "Online Marketing Certification",
    file: "online-marketing-certification.html",
    difficulty: "Beginner",
    price: "24,000",
    duration: "10 hours",
    desc_short: "Learn business ad layouts, customer search checks, local listing audits, and clean newsletter automations.",
    desc_main: "Designed for beginners looking to market products online. Master basic Google ad configurations, social calendars, local listing maps, and newsletter automation grids.",
    key_learning: [
      "Structuring business ad layouts and messaging grids",
      "Conducting basic customer search check audits",
      "Optimizing local business listings and profile maps",
      "Configuring simple email newsletter automated steps",
      "Designing conversion-focused ad banner assets",
      "Using local community platforms to acquire leads",
      "Recognizing online advertising policies and rules",
      "Tracking daily marketing acquisition clicks and cost logs"
    ],
    ideal_for: "Small Business Owners, Interns, and Freelancers.",
    outcomes: "Generate professional online ads, secure top ranks in local map results, and launch automated customer newsletter flows.",
    pricing_desc: "Includes ad blueprints, calendar tools, and local audit guides.",
    duration_desc: "10 hours of practical marketing setups and campaign drills.",
    terms_desc: "Requires absolutely zero prior marketing or tech experience.",
    investment_bullets: [
      "Local business listing optimization checklist cards",
      "Online ad banner copy templates and design guides",
      "Newsletter calendar setup spreadsheets and logs",
      "Direct advice and feedback from experienced marketing agency leads",
      "Certified Online Marketing Coordinator Credentials"
    ],
    reviews: [
      { name: "Harish Rao", location: "Hyderabad, TS", text: "Perfect for small shops! Our local map ranking shot up, bringing in 5 new inquiries." },
      { name: "Snehal Patel", location: "Pune, MH", text: "The ad banners models are wonderfully brief and action-focused." },
      { name: "Priya Pillai", location: "Kochi, KL", text: "Excellent email campaign guides. Ideal for administrative staff managing newsletters." }
    ]
  },
  {
    name: "Public Relations Certification",
    file: "public-relations-certification.html",
    difficulty: "Advanced",
    price: "45,000",
    duration: "40 hours",
    desc_short: "Master media relation strategies, editor pitching templates, corporate press portfolios, and executive speech coaching.",
    desc_main: "Provides senior PR professionals with tools to manage global media reach. Master editor pitching channels, custom media contact databases, press statement architectures, and crisis controls.",
    key_learning: [
      "Designing authoritative corporate press portfolio files",
      "Drafting high-converting media pitching template guides",
      "Coordinating executive spokesperson speech protocols",
      "Configuring secure, updated media contact databases",
      "Building strategic media advisory announcements and logs",
      "Directing crisis response setups and reputation metrics",
      "Measuring corporate public goodwill index values",
      "Navigating editorial privacy rules and industry laws"
    ],
    ideal_for: "PR managers, brand communication leads, corporate spokespersons, and advisors.",
    outcomes: "Secure premium organic press placements, train executive teams for high-stakes media circles, and lead reputation recovery.",
    pricing_desc: "Covers media files, pitch registers, and crisis outlines.",
    duration_desc: "40 hours of intensive public relations modeling and coaching.",
    terms_desc: "Qualifies as a professional continuing PR accreditation.",
    investment_bullets: [
      "Media pitch checklist templates and editor script files",
      "Crisis public message templates and dynamic response decks",
      "Spokesperson press training guides and checklist cards",
      "Live pitching evaluations from veteran media communications advisors",
      "Certified Public Relations Consultant Credentials"
    ],
    reviews: [
      { name: "Tushar Verma", location: "Mumbai, MH", text: "The editor pitching templates are incredibly effective. Secured organic coverage in 3 weeks." },
      { name: "Priyanka Nair", location: "Bengaluru, KA", text: "Brilliant reputation crisis guides. Perfectly protected our client's brand." },
      { name: "Abhishek Rao", location: "Hyderabad, TS", text: "A robust, logical system. Essential for anyone handling public corporate messaging." }
    ]
  },
  {
    name: "Web Development Certification",
    file: "web-development-certification.html",
    difficulty: "Advanced",
    price: "42,000",
    duration: "35 hours",
    desc_short: "Master front-end semantic HTML5 layouts, responsive CSS3 grids, programming log scripts, and secure FTP setups.",
    desc_main: "Designed to build technical programming capacity. Master web document structuring, responsive grid alignments, JavaScript logical flows, server connections, and security gates.",
    key_learning: [
      "Structuring websites with semantic HTML5 document gates",
      "Designing fully responsive layouts using CSS3 Flex/Grid",
      "Writing logical programming scripts to build interactions",
      "Configuring secure local networks and file backup loops",
      "Debugging technical coding errors with diagnostic tools",
      "Securing website code directories against standard leaks",
      "Leveraging FTP server channels and cloud control files",
      "Navigating responsive cross-browser testing rules"
    ],
    ideal_for: "Aspiring Developers, IT Specialists, and Systems Coordinators.",
    outcomes: "Compile responsive front-end website pages, troubleshoot database interface systems, and deploy websites to live cloud networks.",
    pricing_desc: "Includes programming code libraries, templates, and sandbox server spaces.",
    duration_desc: "35 hours of intensive technical coding labs and build checks.",
    terms_desc: "Covers standard W3C responsive web design parameters.",
    investment_bullets: [
      "CSS responsive grid layouts and starter template packages",
      "Coding diagnostics scripts and error check lists",
      "FTP network configuration blueprints and guidelines",
      "Direct code structure reviews by certified senior software engineers",
      "Certified Front-End Web Developer Credentials"
    ],
    reviews: [
      { name: "Rahul Deshmukh", location: "Mumbai, MH", text: "The responsive CSS grid modules transformed my design workflows. Highly structured coding labs." },
      { name: "Sneha Nair", location: "Bengaluru, KA", text: "Fabulous programming logic scripts. Drastically reduced my website debugging hours." },
      { name: "Amit Joshi", location: "Ahmedabad, GJ", text: "Outstanding server deployment setups. Excellent support from engineering mentors." }
    ]
  },
  {
    name: "Computer Applications Certification",
    file: "computer-applications-certification.html",
    difficulty: "Beginner",
    price: "20,000",
    duration: "10 hours",
    desc_short: "Learn core database navigation keys, sheet layouts, word processing rules, and secure document transfers.",
    desc_main: "Provides complete beginners with essential computer application skills. Learn word processing grids, administrative spreadsheet logs, presentation formats, and secure email attachments.",
    key_learning: [
      "Navigating database applications and operational tabs",
      "Structuring professional administrative spreadsheets and charts",
      "Applying standard word processing formatting guidelines",
      "Designing clear, engaging meeting presentation slides",
      "Managing workplace files, folders, and compression logs",
      "Transmitting secure email attachments and data files",
      "Identifying phishing email risks and browser security gateways",
      "Automating daily file backups with cloud integrations"
    ],
    ideal_for: "Administrative staff, interns, entry-level candidates, and students.",
    outcomes: "Operate general office applications without error, format complex doc files, and organize secure office folder networks.",
    pricing_desc: "Covers application worksheets, document formats, and browser files.",
    duration_desc: "10 hours of practical application processing and task labs.",
    terms_desc: "Ideal for basic capability building corporate transformations.",
    investment_bullets: [
      "Excel keyboard shortcut reference cards and guidelines",
      "Word document formatting standards checklist booklets",
      "workplace cybersecurity safety and password security cards",
      "Direct software diagnostic coaching from experienced computer tutors",
      "Certified Computer Applications Coordinator Credentials"
    ],
    reviews: [
      { name: "Harish Patel", location: "Hyderabad, TS", text: "Wonderful introductory guides. Replaced my manual administrative steps with spreadsheets." },
      { name: "Snehal Patil", location: "Pune, MH", text: "The browser safety tips are wonderfully practical. Every new associate needs this." },
      { name: "Priya Rao", location: "Visakhapatnam, AP", text: "Highly practical document templates. Extremely useful for administrative coordinators." }
    ]
  },
  {
    name: "IT Skills Certification",
    file: "it-skills-certification.html",
    difficulty: "Beginner",
    price: "25,000",
    duration: "10 hours",
    desc_short: "Learn hardware diagnostics checks, router setups, office data backup loops, and simple virus removals.",
    desc_main: "Designed for emerging IT support technicians. Learn systematic device hardware checks, local network setups, software update checks, and browser security gates.",
    key_learning: [
      "Conducting systematic IT hardware diagnostic checks",
      "Configuring local office routers and wireless nodes",
      "Deploying secure database data backup loops",
      "Troubleshooting computer operating system launch bugs",
      "Identifying and removing malware, spyware, and files",
      "Managing corporate password rules and security gates",
      "Configuring local office network printer connections",
      "Escalating advanced server failures to software developers"
    ],
    ideal_for: "IT Support Associates, Helpdesk Staff, and Network Assistant leads.",
    outcomes: "Set up and secure local office networks, identify device hardware failures, and secure company databases from standard leaks.",
    pricing_desc: "Includes diagnostic logs, network manuals, and security blueprints.",
    duration_desc: "10 hours of hands-on device troubleshooting and network drills.",
    terms_desc: "Conforms with standard enterprise IT helper guidelines.",
    investment_bullets: [
      "Hardware diagnostic checking flowcharts and guidelines",
      "Office network security setup manuals and router rules",
      "workplace password safety registers and checklists",
      "Direct technical diagnostic coaching from experienced IT supervisors",
      "Certified IT Support Technician Credentials"
    ],
    reviews: [
      { name: "Rahul Sharma", location: "Mumbai, MH", text: "The network router diagnostic guides are exceptionally realistic. Solved our print loops." },
      { name: "Sneha Nair", location: "Noida, UP", text: "Excellent data backup guidelines. Perfectly secured our division's file storage systems." },
      { name: "Kavita Rao", location: "Visakhapatnam, AP", text: "Highly practical tips. An absolute necessity for any aspiring network helper." }
    ]
  },
  {
    name: "Software Proficiency Certification",
    file: "software-proficiency-certification.html",
    difficulty: "Intermediate",
    price: "32,000",
    duration: "25 hours",
    desc_short: "Master specialized administrative database boards, CRM pipeline gates, scheduling software, and backup loops.",
    desc_main: "Provides administrative leads with tools to master advanced software databases. Learn database inputs, pipeline schedules, security logs, and collaborative board formats.",
    key_learning: [
      "Navigating administrative database engines and sheets",
      "Configuring sales CRM pipeline steps and access gates",
      "Deploying corporate scheduling and calendars software",
      "Securing administrative database files and backup loops",
      "Debugging operational software log errors with diagnostics",
      "Integrating software boards with corporate tracking tools",
      "Navigating document management platforms and regulations",
      "Leading technical software audits and update processes"
    ],
    ideal_for: "Administrative Leads, Database Assistants, and Operations Supervisors.",
    outcomes: "Audit and run advanced software databases cleanly, resolve pipeline scheduling errors, and secure data networks from loss.",
    pricing_desc: "Covers software logs, database checklists, and backup plans.",
    duration_desc: "25 hours of advanced software staging and update drills.",
    terms_desc: "Perfect for coordinators handling multi-level digital setups.",
    investment_bullets: [
      "CRM configuration checklists and database starter forms",
      "workplace software backup planning calendars and sheets",
      "Database access security guidelines and checklist cards",
      "Direct advice and progress audits from registered technology leads",
      "Certified Software Operations Professional Credentials"
    ],
    reviews: [
      { name: "Pooja Shah", location: "Mumbai, MH", text: "The software backup calendars saved us multiple database errors. Wonderful logs." },
      { name: "Suresh Rao", location: "Hyderabad, TS", text: "Brilliant CRM database setups. Completely resolved our division's data overlaps." },
      { name: "Komal Shah", location: "Chennai, TN", text: "Highly structured. Perfect for coordinators handling database administration." }
    ]
  },
  {
    name: "Customer Service Certification",
    file: "customer-service-certification.html",
    difficulty: "Beginner",
    price: "24,000",
    duration: "20 hours",
    desc_short: "Master empathetic communication, verbal de-escalation paths, ticket systems, and customer satisfaction metrics.",
    desc_main: "Provides customer support professionals with foundational and advanced competencies. Learn active listening scripts, conflict management, ticket systems (SLA/escalation), phone etiquette, and customer loyalty paradigms.",
    key_learning: [
      "Empathetic customer engagement and active listening keys",
      "Defusing angry clients with tactical verbal paths",
      "Managing helpdesk ticket lifecycles and SLA matrices",
      "Mastering multi-channel etiquette: phone, live chat, and emails",
      "Measuring client satisfaction metrics: CSAT, NPS, and CES",
      "Establishing professional client boundaries under pressure",
      "Using modern CRM software databases and tracking portals",
      "Coordinating support desk handovers and shift logs"
    ],
    ideal_for: "Helpdesk support agents, client relations coordinators, frontline representatives, and service heads.",
    outcomes: "Confidently resolve complex client complaints, lower escalation rates, boost CSAT feedback scores, and build strong brand loyalty.",
    pricing_desc: "Includes ticket templates, script manuals, and simulated case studies.",
    duration_desc: "20 hours of immersive verbal scenarios and support drills.",
    terms_desc: "Corporate billing and cohort-based pricing packages are available.",
    investment_bullets: [
      "Standard support ticket and email response template sets",
      "De-escalation verbal dialog booklets and quick reference cards",
      "Interactive customer crisis simulation scenarios",
      "Feedback sessions with experienced customer success directors",
      "Certified Customer Service Specialist Credentials"
    ],
    reviews: [
      { name: "Anil Mehta", location: "Mumbai, MH", text: "The de-escalation dialogue models significantly boosted our helpdesk first-contact resolution rates by 12%." },
      { name: "Sneha Nair", location: "Bengaluru, KA", text: "Outstanding multi-channel etiquette guides. Extremely practical for frontline team boarding." },
      { name: "Ritu Sharma", location: "Delhi, DL", text: "Highly practical tips. An absolute necessity for any frontline customer support coordinator." }
    ]
  },
  {
    name: "Website Management Certification",
    file: "website-management-certification.html",
    difficulty: "Intermediate",
    price: "28,000",
    duration: "25 hours",
    desc_short: "Master web server administration, domain configurations, content management systems (CMS), and site speed optimization metrics.",
    desc_main: "Provides IT administrators and digital coordinators with advanced practical website management competencies. Learn domain/DNS routing, SSL certificates, CMS administration, speed optimization, and basic web security audits.",
    key_learning: [
      "Navigating server cPanels and domain DNS routing registers",
      "Deploying SSL security certificates and enforcing HTTPS paths",
      "Administering corporate Content Management Systems (CMS)",
      "Optimizing page load speeds and analyzing core web vitals",
      "Configuring backup schedules and automated recovery files",
      "Conducting basic web security scans and mitigating leaks",
      "Analyzing website analytics, traffic spikes, and user metrics",
      "Coordinating domain migrations and hosting server updates"
    ],
    ideal_for: "Digital operators, web administrators, marketing operations managers, and IT support specialists.",
    outcomes: "Confidently administer company web servers, optimize site loading times, secure user databases, and coordinate server migrations cleanly.",
    pricing_desc: "Includes server checklists, DNS setup guides, and backup template logs.",
    duration_desc: "25 hours of active server management and site speed diagnostics drills.",
    terms_desc: "Corporate billing and enterprise training custom options available.",
    investment_bullets: [
      "Standard web server and hosting setup check lists",
      "Domain DNS migration and SSL deployment booklets",
      "Interactive site speed optimization diagnostic workbooks",
      "Feedback reviews from senior website and operations systems leads",
      "Certified Website Management Professional Credentials"
    ],
    reviews: [
      { name: "Suresh Kumar", location: "Chennai, TN", text: "Outstanding DNS and server migration checklists. Solved our company site's hosting transition smoothly." },
      { name: "Pooja Patil", location: "Pune, MH", text: "Fabulous page speed diagnostic guides. Reduced our client landing page loading times by 35%." },
      { name: "Kunal Shah", location: "Vadodara, GJ", text: "Highly practical tips. An absolute necessity for any aspiring web operations administrator." }
    ]
  }
];

// Combine all 51 courses dynamically in a loop that ensures 100% unique metadata injection
const masterList = [...masterCoursesList, ...prev_new_courses, ...brand_new_courses];

// Rebuild courses_data directly from the hardcoded masterList (51 courses)
const courses_data = masterList.map((course, index) => {
  const hoursMatch = course.duration.match(/^(\d+)\s*hours/i);
  let finalDuration = course.duration;
  let finalDurationDesc = course.duration_desc || `This is a highly structured ${course.duration} coaching program.`;

  if (hoursMatch) {
    const h = parseInt(hoursMatch[1]);
    let startHour = h - 10;
    let endHour = h;
    
    if (h <= 15) {
      startHour = 15;
      endHour = 25;
    } else {
      if (startHour < 15) {
        startHour = 15;
      }
      if (endHour > 50) {
        endHour = 50;
      }
    }
    
    const rangeStr = `${startHour} to ${endHour}`;
    finalDuration = `${rangeStr} hours`;
    
    // Replace the original duration number + hours in duration_desc if it exists
    finalDurationDesc = finalDurationDesc.replace(new RegExp(`\\b${h}\\s*hours\\b`, 'gi'), `${rangeStr} hours`);
  }

  return {
    name: course.name,
    file: course.file,
    price: course.price,
    duration: finalDuration,
    difficulty: course.difficulty,
    image: UNIQUE_BG_IMAGES[index], // Assign unique image (1-to-1 mapping)
    desc_short: course.desc_short,
    desc_main: course.desc_main,
    key_learning: course.key_learning,
    ideal_for: course.ideal_for,
    outcomes: course.outcomes,
    reviews: course.reviews,
    pricing_desc: course.pricing_desc || "Professional certification program designed to deliver maximum career value.",
    duration_desc: finalDurationDesc,
    terms_desc: course.terms_desc || "Custom packages are available based on your specific requirements.",
    investment_bullets: course.investment_bullets || [
      "Access to standard reference decks",
      "Practical work sheets and checklists",
      "Structured diagnostic case studies",
      "Direct guidance reviews from senior advisors",
      "Authorized Certification of Completion"
    ]
  };
});

// HTML detail template with floating glassmorphism slider arrows inside the Hero cover
const template = (course, prevFile, nextFile) => {
  const desc_main_html = course.desc_main.split('\n\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('\n');
  const key_learning_html = course.key_learning.map(item => `<li>${item}</li>`).join('\n');
  const investment_bullets_html = course.investment_bullets.map(item => `<li>${item}</li>`).join('\n');
  
  let reviews_html = "";
  course.reviews.forEach(rev => {
    reviews_html += `
      <div class="review-card">
        <h4>${rev.name}</h4>
        <div class="location">${rev.location}</div>
        <p>"${rev.text}"</p>
      </div>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${course.name} Certification | ELITE TOOLISTIC</title>
  <meta name="description" content="Enroll in ${course.name} Certification at ELITE TOOLISTIC. ${course.desc_short} Structured ${course.duration} certification program with industry-relevant case studies." />
  <meta name="keywords" content="${course.name}, professional certification, ELITE TOOLISTIC, online course, career training, business management" />
  
  <meta property="og:title" content="${course.name} Certification | ELITE TOOLISTIC" />
  <meta property="og:description" content="${course.desc_short} structured ${course.duration} coaching." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.elitetoolistic.com/${course.file}" />
  <meta property="og:image" content="${course.image}" />
  
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="cart.css" />
  <style>
    .course-detail-hero {
      position: relative;
      background-image: url('${course.image}');
      background-size: cover;
      background-position: center;
      padding: 9rem 5% 5rem;
      text-align: center;
      color: white;
      border-bottom: 2px solid var(--border);
    }
    .course-detail-hero::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(6, 44, 99, 0.88);
    }
    .course-detail-hero > * {
      position: relative;
      z-index: 2;
    }
    .course-detail-hero-badge {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #ffffff;
      margin-bottom: 1rem;
      display: inline-block;
      padding: 4px 14px;
      border: 1px solid rgba(0, 108, 254, 0.7);
      background: rgba(0, 108, 254, 0.25);
    }
    .course-detail-hero h1 {
      font-family: var(--font-serif);
      font-size: clamp(2.2rem, 4.5vw, 3.8rem);
      font-weight: 700;
      letter-spacing: -1px;
      margin-bottom: 1.25rem;
      line-height: 1.15;
      color: #ffffff;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    .course-detail-hero .subtitle {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 1.15rem;
      line-height: 1.6;
      max-width: 750px;
      margin: 0 auto;
      color: #e0edfd;
    }

    .hero-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      padding: 8px 14px;
      background: rgba(6, 44, 99, 0.9);
      border: 1.5px solid rgba(255, 255, 255, 0.4);
      color: white;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      text-decoration: none;
      z-index: 10;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: var(--transition);
    }
    .hero-nav-arrow:hover {
      background: var(--blue-accent);
      color: var(--white);
      border-color: var(--blue-accent);
    }
    .hero-nav-arrow.arrow-left { left: 2%; }
    .hero-nav-arrow.arrow-right { right: 2%; }

    .course-content-section {
      background: var(--surface);
      padding: 5rem 5%;
      display: grid;
      grid-template-columns: 1.3fr 0.7fr;
      gap: 4rem;
      align-items: start;
      border-bottom: 2px solid var(--border);
    }
    
    .about-course h2 {
      font-family: var(--font-serif);
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--black);
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      letter-spacing: -0.5px;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 0.5rem;
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
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 1.5px solid var(--navy-brand);
      transition: var(--transition);
    }
    .enroll-btn-large:hover {
      background: var(--blue-accent);
      border-color: var(--blue-accent);
      color: var(--white);
    }

    .reviews-section {
      margin-top: 4rem;
      border-top: 2px solid var(--border);
      padding-top: 2.5rem;
    }
    .review-card {
      background: var(--bg);
      padding: 1.75rem;
      margin-bottom: 1.25rem;
      border: 1px solid var(--border);
      border-left: 4px solid var(--seal-red);
    }
    .review-card h4 {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--black);
      margin-bottom: 0.2rem;
    }
    .review-card .location {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--ink-faint);
      margin-bottom: 0.75rem;
      text-transform: uppercase;
    }
    .review-card p {
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
  
  <span class="course-detail-hero-badge">Certification Syllabus</span>
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
    <p><strong>Curricular Duration:</strong> Structured ${course.duration} certification curriculum designed for rigorous practical capability acquisition, organizational leadership, and industry-oriented standards.</p>

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
  <p class="section-label-sm">Enrollment Registry</p>
  <h2 style="font-family:var(--font-serif);font-size:2.4rem;margin-bottom:1.5rem;">Ready to Begin This Course?</h2>
  <a href="contact.html" class="enroll-btn-large">Enquire Now →</a>
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
};

// Generate HTML File for each course with circular slider links
const totalCourses = courses_data.length;
courses_data.forEach((course, index) => {
  const prevCourse = courses_data[(index - 1 + totalCourses) % totalCourses];
  const nextCourse = courses_data[(index + 1) % totalCourses];
  
  const htmlContent = template(course, prevCourse.file, nextCourse.file);
  fs.writeFileSync(course.file, htmlContent, 'utf-8');
  if (fs.existsSync('courses') && fs.statSync('courses').isDirectory()) {
    fs.writeFileSync(path.join('courses', course.file), htmlContent, 'utf-8');
  }
  console.log(`Generated detail page: ${course.file}`);
});

// Generate courses.html with all 51 cards grid
let catalog_cards_html = "";
courses_data.forEach(course => {
  let tag_class = "tag-beginner";
  if (course.difficulty === "Intermediate") {
    tag_class = "tag-intermediate";
  } else if (course.difficulty === "Advanced") {
    tag_class = "tag-advanced";
  }

  catalog_cards_html += `
    <div class="catalog-card">
      <div class="course-image">
        <a href="${course.file}"><img src="${course.image}" alt="${course.name} Certification" /></a>
      </div>
      <div class="card-content" style="padding: 1.5rem; display:flex; flex-direction:column; flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
          <span class="catalog-tag ${tag_class}">${course.difficulty.toUpperCase()}</span>
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--ink-faint); font-weight:700;">${course.duration}</span>
        </div>
        <h3 style="font-family:var(--font-serif); font-size:1.2rem; font-weight:700; margin-bottom:0.75rem; line-height:1.35;"><a href="${course.file}" style="color:inherit; text-decoration:none;">${course.name}</a></h3>
        <p style="font-size:0.9rem; color:var(--ink-muted); line-height:1.6; margin-bottom:1.5rem; flex-grow:1;">${course.desc_short}</p>
        <div class="catalog-price" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:1rem;">
          <span class="price" style="font-family:var(--font-mono); font-size:1.15rem; font-weight:700;">₹${course.price}</span>
          <a href="${course.file}" style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; text-transform:uppercase; text-decoration:underline;">View Course →</a>
        </div>
      </div>
    </div>`;
});

const courses_page_html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>All Courses &amp; Certifications | ELITE TOOLISTIC</title>
  <meta name="description" content="Explore ELITE TOOLISTIC's complete register of 51 professional certification diplomas and corporate training curricula."/>
  <meta name="keywords" content="professional courses, corporate training, excel certification, leadership certificate, ELITE TOOLISTIC catalog" />
  
  <meta property="og:title" content="All Courses &amp; Certifications | ELITE TOOLISTIC" />
  <meta property="og:description" content="Explore our complete register of 51 professional certification diplomas." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.elitetoolistic.com/courses.html" />
  
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="cart.css"/>
  <link rel="icon" type="image/png" href="images/LOGO.png" />
  <style>
    .courses-page-hero {
      background: var(--bg);
      border-bottom: 2px solid var(--border);
      padding: 4.5rem 5% 3.5rem;
    }
    .course-catalog { padding: 5rem 5%; background: var(--surface); border-bottom: 2px solid var(--border); }
    .catalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
    
    .catalog-card {
      background: var(--surface); border: 1.5px solid var(--border);
      display: flex; flex-direction: column;
      transition: var(--transition);
    }
    .catalog-card:hover {
      background: var(--surface);
      border-color: var(--blue-accent);
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
    }
    
    .catalog-tag {
      font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; padding: 2px 6px;
    }
    .tag-beginner { background: var(--blue-light); color: var(--navy-brand); border: 1px solid var(--blue-border); }
    .tag-intermediate { background: var(--blue-subtle); color: var(--navy-brand); border: 1px solid var(--blue-accent); }
    .tag-advanced { background: var(--navy-brand); color: var(--white); border: 1px solid var(--navy-brand); }
    
    @media (max-width: 1100px) {
      .catalog-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 750px) {
      .catalog-grid { grid-template-columns: 1fr; }
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
  <p class="page-hero-sub">51 specialized diplomas, executive masterclasses, and certified disciplines formulated for engineering practitioners, corporate managers, and organizational leaders.</p>
</section>

<section class="course-catalog">
  <p class="section-label-sm">Course Catalog</p>
  <h2 class="section-h2">All Fifty-One Accredited Courses</h2>
  <div class="catalog-grid">
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
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
</script>
</body>
</html>`;

fs.writeFileSync("courses.html", courses_page_html, 'utf-8');
console.log("courses.html regenerated successfully with 51 unique courses!");
console.log("ALL 51 COURSE DETAIL PAGES COMPLETED SUCCESSFULLY!");

