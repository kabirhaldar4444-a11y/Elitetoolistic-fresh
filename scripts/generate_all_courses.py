import os
import random

# List of durations to select from
DURATIONS = ["10 hours", "25 hours", "30 hours", "35 hours", "40 hours", "45 hours", "50 hours"]

courses_data = [
    {
        "name": "Construction Project Management",
        "file": "construction-project-management.html",
        "price": "32,000",
        "duration": "45 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/11062b_b4ea05076d8d4c94a0919be039ca4ac1~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Master the complete lifecycle of construction projects—from scheduling and cost estimation to safety standards, workforce coordination, and successful delivery.",
        "desc_main": "Construction Project Management is a specialized professional training program designed for engineers, project managers, construction professionals, site supervisors, contractors, and aspiring project leaders who want to strengthen their ability to successfully plan, execute, monitor, and deliver construction projects.\n\nIn the construction industry, effective project management is essential for ensuring timely completion, budget control, quality standards, and operational efficiency. This course provides participants with practical knowledge and industry-relevant frameworks required to manage the complete lifecycle of construction projects—from project planning and scheduling to execution, monitoring, risk management, and final delivery.\n\nLearners will gain a strong understanding of project coordination, resource allocation, stakeholder management, and site operations. The training combines practical case studies, project simulations, planning exercises, and real-world construction scenarios to ensure participants develop job-ready project management skills.",
        "key_learning": [
            "Fundamentals of construction project planning and execution",
            "Project scheduling and timeline management",
            "Cost estimation, budgeting, and financial control",
            "Resource allocation and workforce management",
            "Site coordination and operational management",
            "Risk assessment and project issue resolution",
            "Quality assurance and compliance standards",
            "Contractor, vendor, and stakeholder management"
        ],
        "ideal_for": "This course is ideal for civil engineers, project coordinators, contractors, construction managers, architects, quantity surveyors, site engineers, and professionals seeking career advancement in the construction and infrastructure sector.",
        "outcomes": "By the end of the program, participants will be able to confidently manage construction workflows, optimize resources, reduce project risks, and deliver projects more efficiently while maintaining quality and compliance standards.",
        "reviews": [
            {"name": "Rahul Verma", "location": "Mumbai, Maharashtra", "text": "The Construction Project Management course gave me practical insights into scheduling and resource allocation. My sites are running much more efficiently now!"},
            {"name": "Sneha Joshi", "location": "Pune, Maharashtra", "text": "An excellent program. It bridged the gap between theoretical project management and on-ground execution perfectly. Highly recommended for civil engineers."},
            {"name": "Karthik N.", "location": "Chennai, Tamil Nadu", "text": "I feel much more equipped to handle large-scale construction projects. The modules on cost control and risk management were incredibly detailed."}
        ]
    },
    {
        "name": "Energy Management Certification",
        "file": "energy-management-certification.html",
        "price": "55,000",
        "duration": "50 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/dfe0d93f345840ed8aaabf5043bdf9db.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Develop comprehensive expertise in energy efficiency, sustainability auditing, resource optimization, and green engineering compliance standards.",
        "desc_main": "Energy Management Certification is an advanced professional program designed to train engineers, sustainability professionals, facility managers, and environmental consultants in the principles of energy conservation, auditing, and green technologies. Implementing energy-efficient policies is now a global imperative to reduce operational costs and combat climate change.\n\nThis comprehensive training course explores building energy systems, electrical grids, thermal performance, renewable energy alternatives, and environmental compliance frameworks. You will learn to perform systematic audits, identify wastage patterns, and design robust reduction strategies.",
        "key_learning": [
            "Principles of global energy conservation and sustainability",
            "Techniques for comprehensive building and system audits",
            "Analysis of HVAC, electrical systems, and lighting efficiency",
            "Integration of renewable energy systems and microgrids",
            "Compliance with ISO 50001 and environmental regulations",
            "Lifecycle cost analysis and energy investment valuation",
            "Wastage identification and carbon footprint tracking",
            "Strategic policy formulation for corporate sustainability"
        ],
        "ideal_for": "This course is ideal for electrical and mechanical engineers, plant managers, sustainability officers, facility executives, and environmental science professionals looking to lead energy-reduction projects.",
        "outcomes": "By the end of the program, participants will be able to design, manage, and verify strategic energy efficiency initiatives, lead audits, and implement international green standards effectively.",
        "reviews": [
            {"name": "Vikram Sen", "location": "Kolkata, West Bengal", "text": "Extremely thorough! The auditing methodology changed how we approach power consumption in our factory, reducing costs by 15%."},
            {"name": "Meera Nair", "location": "Bengaluru, Karnataka", "text": "Perfect mix of engineering and environmental economics. High-quality instruction and great mentoring."},
            {"name": "Rohan Dsouza", "location": "Goa", "text": "Highly recommend it to any engineer. The ISO 50001 implementation guide was particularly helpful."}
        ]
    },
    {
        "name": "Certified Commercial Contracts Manager",
        "file": "certified-commercial-contracts-manager.html",
        "price": "28,000",
        "duration": "35 hours",
        "difficulty": "Intermediate",
        "image": "https://static.wixstatic.com/media/11062b_9e3aa8937b42490aad09c285036e1ba6~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Master commercial contract drafting, risk assessment, vendor negotiations, procurement legalities, and seamless contract lifecycle management.",
        "desc_main": "The Certified Commercial Contracts Manager program is structured to equip professionals with industry-recognized skills in contract lifecycle management, negotiation, risk analysis, and procurement compliance.\n\nContracts are the foundation of all commercial transactions. This course walks through commercial law fundamentals, drafting techniques, intellectual property clauses, dispute resolution strategies, and risk mitigation models. Through detailed simulations, participants learn how to analyze contracts from a vendor, contractor, and client perspective.",
        "key_learning": [
            "Fundamentals of commercial contract law and negotiation",
            "Drafting airtight statements of work and terms sheets",
            "Analyzing and mitigating contract indemnities and liabilities",
            "Understanding procurement regulations and vendor governance",
            "Strategies for effective disputes and claim resolution",
            "Contract monitoring and compliance tracking systems",
            "Intellectual property rights and non-disclosure governance",
            "Managing post-award renewals and performance reviews"
        ],
        "ideal_for": "This course is ideal for legal advisors, procurement executives, corporate lawyers, purchase managers, contract administrators, and business directors looking to master commercial agreements.",
        "outcomes": "By the end of the program, participants will draft, analyze, and negotiate complex commercial agreements with confidence, minimizing legal exposure and maximizing partnership value.",
        "reviews": [
            {"name": "Ananya Sharma", "location": "New Delhi, Delhi", "text": "A crucial course for legal associates. The templates and real-world drafting exercises are immediately applicable to my daily practice."},
            {"name": "Siddharth Rao", "location": "Hyderabad, Telangana", "text": "Outstanding training. We updated our vendor contracts based on these insights, significantly reducing liability risks."},
            {"name": "Pallavi Joshi", "location": "Pune, Maharashtra", "text": "Highly practical, with brilliant examples. The section on dispute resolution was the highlight of this program."}
        ]
    },
    {
        "name": "Advanced Civil Execution",
        "file": "advanced-civil-execution.html",
        "price": "36,000",
        "duration": "40 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/c5592451927d40629760e37eb1200903.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Master on-site execution, structural monitoring, concrete technology, and project delivery systems for heavy infrastructure construction.",
        "desc_main": "Advanced Civil Execution focuses on the practical mechanics, logistics, and engineering technologies required for execution of high-scale civil engineering projects. It bridges structural theory and on-ground project delivery.\n\nParticipants will dive deep into concrete technologies, soil mechanics, heavy machinery operations, safety protocols, and quality control systems. Through detailed case studies of major bridges, highways, and high-rise structures, learners will understand how to manage execution workflows flawlessly.",
        "key_learning": [
            "On-site execution methodologies for heavy infrastructure",
            "Advanced concrete mix design and quality checks",
            "Foundation construction, shoring, and piling operations",
            "Structural monitoring systems and safety engineering",
            "Interpreting complex structural and architectural drawings",
            "Workforce coordination, site logs, and material tracking",
            "Managing subcontractor schedules and compliance",
            "Troubleshooting structural execution issues on site"
        ],
        "ideal_for": "This course is ideal for civil engineers, site managers, structural consultants, construction inspectors, and senior site supervisors seeking advanced execution skills.",
        "outcomes": "By the end of the program, participants will manage site logistics, execute complex structural designs, and enforce rigorous quality standards to deliver robust civil structures.",
        "reviews": [
            {"name": "Suresh Kumar", "location": "Chennai, Tamil Nadu", "text": "As a site supervisor, this course elevated my competence. The deep-dive into piling and concrete inspection was amazing."},
            {"name": "Aditya Singh", "location": "Lucknow, Uttar Pradesh", "text": "Excellent civil execution training. The lectures on reading structural drawings were highly educational."},
            {"name": "Rajesh Gupta", "location": "Noida, Uttar Pradesh", "text": "Very informative. It has helped me coordinate workflows with subcontractors much more effectively."}
        ]
    },
    {
        "name": "Projects IN Controlled Environments",
        "file": "projects-in-controlled-environments.html",
        "price": "45,000",
        "duration": "35 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/11062b_654c88db883a4c9c8fdd738aa340f69d~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Learn structured project management methodologies to manage business transformation, mitigate risks, and control complex environments.",
        "desc_main": "Projects IN Controlled Environments is an intensive program aimed at teaching structured methodologies for successful project management. It addresses the governance, processes, and control mechanisms essential for executing projects within predictable constraints.\n\nFrom startup and initiation to product delivery and closure, you will master the principles of business justification, defined roles, stages control, and exception reporting. This system is crucial for managing highly complex organizational transformations.",
        "key_learning": [
            "Structured project governance frameworks and principles",
            "Defining robust business cases and investment justifications",
            "Roles, responsibilities, and accountability matrices",
            "Managing stage-by-stage authorization and progression",
            "Handling risk, quality, and exception management",
            "Effective product-based planning and scheduling techniques",
            "Managing issues and configuration changes smoothly",
            "Executing structured project closures and benefit reviews"
        ],
        "ideal_for": "This course is ideal for project managers, business analysts, team leaders, operations directors, and change consultants seeking rigorous governance methodologies.",
        "outcomes": "By the end of the program, participants will execute projects with strict control over resources, mitigate environmental risks, and align all deliverables with strategic business goals.",
        "reviews": [
            {"name": "Nisha Roy", "location": "Bengaluru, Karnataka", "text": "A flawless framework for organizing chaotic business projects. Truly transformative methodology."},
            {"name": "Aman Patel", "location": "Ahmedabad, Gujarat", "text": "Our IT delivery teams have adopted this structured approach, resulting in much higher project success rates."},
            {"name": "Vikrant Mehta", "location": "Mumbai, Maharashtra", "text": "Extremely detailed. The stages control and exception reporting mechanisms are outstanding."}
        ]
    },
    {
        "name": "Contract and Claims Management",
        "file": "contract-and-claims-management.html",
        "price": "30,000",
        "duration": "30 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/a39b9a838dfa4f31ac3d64972f6657ea.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Manage complex project variations, dispute resolution, contract claims, cost overruns, and litigation prevention systems.",
        "desc_main": "Contract and Claims Management is designed to equip builders, contractors, engineers, and project owners with strategies to handle project variations, delays, disputes, and contract claims successfully.\n\nLarge-scale projects frequently face delays, pricing changes, or material supply disruptions. This program teaches how to identify a valid claim, calculate extension of time, compute overhead damages, compile claim reports, and handle alternative dispute resolution (ADR) systems to prevent expensive litigation.",
        "key_learning": [
            "Identifying variation orders, disruptions, and delay claims",
            "Calculating extensions of time and critical path delays",
            "Analyzing disruption costs and overhead damage valuations",
            "Compiling comprehensive, legally robust claim packages",
            "Negotiating claims with engineers, architects, and owners",
            "Alternative Dispute Resolution (ADR) methods and processes",
            "Litigation avoidance and proactive relationship management",
            "Tracking documentation and site records for evidentiary support"
        ],
        "ideal_for": "This course is ideal for quantity surveyors, project managers, contract administrators, senior engineers, and executives in construction and engineering sectors.",
        "outcomes": "By the end of the program, participants will build comprehensive claims dossiers, assess third-party claims, and negotiate disputes, protecting the company's financial interests.",
        "reviews": [
            {"name": "Karan Malhotra", "location": "Gurugram, Haryana", "text": "This course saved us millions! It helped us structure our delay claims correctly and settle with the client amicably."},
            {"name": "Deepa Kurian", "location": "Kochi, Kerala", "text": "Brilliant modules. The mathematical analysis of overhead damages was very eye-opening."},
            {"name": "Manish Sharma", "location": "Jaipur, Rajasthan", "text": "Excellent content. The emphasis on site documentation as evidence is highly practical for site managers."}
        ]
    },
    {
        "name": "Self-Confidence Building Training",
        "file": "self-confidence-building-training.html",
        "price": "25,000",
        "duration": "10 hours",
        "difficulty": "Beginner",
        "image": "https://static.wixstatic.com/media/nsplsh_1898c1db9f2a4ac8a3798084e7d32d13~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Conquer imposter syndrome, build unwavering self-belief, master body language, and project presence in public or professional forums.",
        "desc_main": "Self-Confidence Building Training is an experiential program designed to help you overcome self-limiting beliefs, imposter syndrome, social anxiety, and build powerful, authentic self-belief.\n\nConfidence is a skill that can be cultivated. Through public speaking practice, emotional reframing, body language shifts, and cognitive exercises, you will learn to project charisma, command respect in groups, and handle challenging professional or social situations with total ease.",
        "key_learning": [
            "Overcoming internal limiting beliefs and negative self-talk",
            "Techniques for managing performance anxiety and fear",
            "Adopting high-power body language and vocal projection",
            "Building mental presence and mindfulness in interactions",
            "Handling constructive feedback and rejection with grace",
            "Setting personal boundaries and communicating assertively",
            "Imposter syndrome mitigation and value recognition",
            "Creating personalized daily routines for confidence building"
        ],
        "ideal_for": "This course is ideal for entry-level professionals, students, aspiring public speakers, managers, and individuals seeking to increase their social or leadership impact.",
        "outcomes": "By the end of the program, participants will speak assertively, control body language, stand out in interviews, and build lasting self-esteem in high-pressure situations.",
        "reviews": [
            {"name": "Rohan Deshmukh", "location": "Nagpur, Maharashtra", "text": "Incredible change! I used to freeze during team meetings. Now I lead presentations with complete confidence."},
            {"name": "Priti Patel", "location": "Ahmedabad, Gujarat", "text": "The practical exercises are simple yet incredibly powerful. High-quality guidance from the coaches."},
            {"name": "Kavita Rao", "location": "Visakhapatnam, Andhra Pradesh", "text": "An life-changing course. It helped me recognize my strengths and beat my imposter syndrome."}
        ]
    },
    {
        "name": "Body Language Expert Training",
        "file": "body-language-expert-training.html",
        "price": "48,000",
        "duration": "25 hours",
        "difficulty": "Intermediate",
        "image": "https://static.wixstatic.com/media/nsplsh_5f5a6436434f6e48354538~mv2_d_3456_5184_s_4_2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Decode non-verbal cues, identify micro-expressions, master body alignment, and leverage non-verbal persuasion in executive negotiations.",
        "desc_main": "Body Language Expert Training is a masterclass in non-verbal communication. It covers how to read hidden thoughts, detect deception, build instant rapport, and influence negotiations by shifting non-verbal signals.\n\nOver 60% of human interaction is non-verbal. This program teaches you to decode posture, hand gestures, micro-expressions, personal space dynamics, and eye movements. You will apply this knowledge to sales pitches, management feedback sessions, and leadership presentations.",
        "key_learning": [
            "Scientific principles of non-verbal communication",
            "Reading facial micro-expressions and detecting deception",
            "Using posture and alignment to project authority",
            "Deciphering arm, leg, and handshake gestures accurately",
            "Building instant rapport using physical mirroring",
            "Leveraging voice tone, pitch, and pacing in persuasion",
            "Spatial positioning and physical proximity dynamics",
            "Applying body language to high-stakes sales and negotiations"
        ],
        "ideal_for": "This course is ideal for sales professionals, HR executives, lawyers, investigators, public speakers, and leaders wishing to master non-verbal persuasion.",
        "outcomes": "By the end of the program, participants will read people effortlessly, project a powerful and trust-inspiring presence, and align non-verbal behaviors with strategic business intent.",
        "reviews": [
            {"name": "Arjun Sen", "location": "Kolkata, West Bengal", "text": "Absolutely fascinating! It has given me a superpower in client meetings. I can read their intent immediately."},
            {"name": "Tanvi Hegde", "location": "Bengaluru, Karnataka", "text": "A masterfully designed course. The deception detection module is exceptionally practical and engaging."},
            {"name": "Rajiv Mathur", "location": "Jaipur, Rajasthan", "text": "This training revolutionized my sales presentations. The tips on physical alignment work flawlessly."}
        ]
    },
    {
        "name": "Relationship Coaching Training",
        "file": "relationship-coaching-training.html",
        "price": "24,000",
        "duration": "30 hours",
        "difficulty": "Intermediate",
        "image": "https://static.wixstatic.com/media/11062b_66a570629f7f4b2dbdc7b245858f02bf~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Master relationship coaching methodologies, active listening, conflict resolution, emotional intimacy models, and build a coaching practice.",
        "desc_main": "Relationship Coaching Training provides the foundational frameworks and coaching tools needed to guide couples, families, and professionals through relationship hurdles, communication blocks, and emotional challenges.\n\nHealthy relationships are central to mental well-being and productivity. This course explores modern coaching psychology, boundary settings, active listening techniques, attachment styles, conflict resolution, and intimacy-building frameworks.",
        "key_learning": [
            "Coaching principles and active listening techniques",
            "Understanding attachment styles and relationship dynamics",
            "Frameworks for constructive conflict resolution",
            "Guiding couples to set emotional and personal boundaries",
            "Techniques for building communication and trust",
            "Coaching through career transitions and family stress",
            "Ethical boundaries in relationship coaching practices",
            "Setting up and marketing your relationship coaching brand"
        ],
        "ideal_for": "This course is ideal for life coaches, counselors, HR professionals, social workers, and individuals wanting to develop expert-level interpersonal conflict resolution skills.",
        "outcomes": "By the end of the program, participants will lead coaching sessions, resolve interpersonal conflicts, support emotional growth, and start their own independent relationship coaching practice.",
        "reviews": [
            {"name": "Dr. Sunita Sharma", "location": "Faridabad, Haryana", "text": "The conflict resolution models taught here are brilliant. Excellent frameworks for structured counseling sessions."},
            {"name": "Amit Shah", "location": "Vadodara, Gujarat", "text": "Very comprehensive. The course covers practical business strategies to launch a coaching brand, which was highly useful."},
            {"name": "Rekha Menon", "location": "Kochi, Kerala", "text": "Highly practical, empathetic, and clear. Changed my entire approach to relationship counselling."}
        ]
    },
    {
        "name": "AI Productivity Power-Up",
        "file": "ai-productivity-power-up.html",
        "price": "38,000",
        "duration": "25 hours",
        "difficulty": "Intermediate",
        "image": "https://static.wixstatic.com/media/11062b_dd7eac35853745cfbe041ab3acb2e3b7~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Supercharge your efficiency by integrating Generative AI, ChatGPT, Midjourney, and automation tools into your daily professional workflows.",
        "desc_main": "AI Productivity Power-Up is an intensive training program designed to teach modern professionals how to leverage Generative AI tools (like ChatGPT, Claude, Midjourney, and automation platforms) to speed up workflows, generate premium content, and automate redundant tasks.\n\nAI is reshaping every industry. Rather than replacing workers, it is supercharging those who know how to use it. This course covers advanced prompt engineering, custom AI agent creation, automated database processing, content curation, and building interactive templates. Learn how to save up to 10-15 hours every single week.",
        "key_learning": [
            "Advanced prompt engineering strategies and frameworks",
            "Automating email creation and reports using ChatGPT/Claude",
            "Designing marketing copy and visuals with AI generators",
            "Building custom GPT agents tailored to your business needs",
            "Integrating AI automation workflows with Zapier and Make",
            "Summarizing reports and analyzing massive datasets in seconds",
            "Ethical boundaries, bias checking, and data security",
            "Developing an ongoing learning mindset for emerging AI tech"
        ],
        "ideal_for": "This course is ideal for marketing managers, content creators, business analysts, entrepreneurs, developers, and knowledge workers looking to achieve maximum efficiency.",
        "outcomes": "By the end of the program, participants will build custom AI assistants, automate repetitive document workflows, and drastically increase their daily output.",
        "reviews": [
            {"name": "Pranav Mehta", "location": "Mumbai, Maharashtra", "text": "This course literally doubled my output! The prompt frameworks for market research are worth 10x the price."},
            {"name": "Shreya Ghoshal", "location": "Bengaluru, Karnataka", "text": "The best AI productivity course. Very hands-on, avoiding hype and focusing entirely on practical business tools."},
            {"name": "Gaurav Sen", "location": "Bhopal, Madhya Pradesh", "text": "Incredible content. I automated our weekly report generation using ChatGPT and Zapier. Saves our team hours every day."}
        ]
    },
    {
        "name": "Resilience Coach Training",
        "file": "resilience-coach-training.html",
        "price": "22,000",
        "duration": "30 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/3fb04d_c031b868ec4f42f0907817c89e6a691b~mv2.avif/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Learn cognitive restructuring, stress inoculation techniques, emotional regulation, and guide others through crisis and career setbacks.",
        "desc_main": "Resilience Coach Training is a specialized certification course designed to train counselors, HR managers, and corporate leaders in the science of psychological resilience, stress management, and cognitive restructuring.\n\nModern work environments are high-pressure, leading to widespread stress. This course provides clinical and practical techniques for building mental grit, managing burnout, guiding teams through organizational crises, and developing a positive mindset that thrives under adversity.",
        "key_learning": [
            "The science of stress, brain chemistry, and burnout",
            "Cognitive behavioral tools for anxiety and stress management",
            "Developing stress inoculation training and coping models",
            "Guiding clients through traumatic job loss or personal crises",
            "Fostering team resilience during major corporate restructures",
            "Mindfulness and physiological emotional regulation techniques",
            "Designing personalized resilience plans for corporate clients",
            "Client relationship building and professional ethics"
        ],
        "ideal_for": "This course is ideal for HR directors, team leaders, executive coaches, sports trainers, mental health counselors, and teachers seeking certified coaching frameworks.",
        "outcomes": "By the end of the program, participants will guide individuals through career transitions, run corporate stress-relief programs, and coach individuals to recover from setbacks.",
        "reviews": [
            {"name": "Nitin Khanna", "location": "Chandigarh, Punjab", "text": "A crucial program. It gave me a structured set of tools to support my corporate consulting clients facing burnout."},
            {"name": "Radhika Iyengar", "location": "Coimbatore, Tamil Nadu", "text": "The exercises on cognitive reframing are highly detailed and scientifically grounded. Outstanding mentoring."},
            {"name": "Sanjay Verma", "location": "Indore, Madhya Pradesh", "text": "Extremely impactful. Every leader in high-growth companies should go through this resilience training."}
        ]
    },
    {
        "name": "Personal Branding Strategist Training",
        "file": "personal-branding-strategist-training.html",
        "price": "65,000",
        "duration": "35 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/nsplsh_6e416a696c317a33654c6b~mv2_d_6000_4000_s_4_2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Learn content strategy, LinkedIn optimization, public relation mechanics, and brand positioning to establish executive authority.",
        "desc_main": "Personal Branding Strategist Training is an advanced course for professionals, executives, and agency owners who want to position themselves or their clients as dominant leaders in their niche.\n\nIn a competitive economy, your personal brand is your best asset. This training focuses on finding your unique value proposition, optimizing LinkedIn, publishing articles, creating newsletter systems, securing speaking engagements, and developing a magnetic online presence.",
        "key_learning": [
            "Defining your unique niche and target professional audience",
            "LinkedIn optimization, networking strategies, and growth hacks",
            "Developing a consistent, authoritative multi-channel content engine",
            "Pitching to media, securing guest articles, and podcasts",
            "Designing high-impact newsletters and digital lead magnets",
            "Public speaking strategies and slide preparation techniques",
            "Monetizing your personal brand through consulting and speaking",
            "Tracking brand engagement and growth metrics analytically"
        ],
        "ideal_for": "This course is ideal for consultants, C-suite executives, senior managers, startup founders, PR agents, and branding professionals wanting to stand out.",
        "outcomes": "By the end of the program, participants will build an authoritative digital profile, attract premium speaking or writing opportunities, and launch custom media campaigns.",
        "reviews": [
            {"name": "Tushar Kapoor", "location": "Mumbai, Maharashtra", "text": "This course changed my career trajectory. Within 3 months of applying these LinkedIn strategies, I signed three high-ticket clients."},
            {"name": "Priyanka Roy", "location": "Kolkata, West Bengal", "text": "Exceptional value. The modules on finding your voice and content repurposing are incredibly clever."},
            {"name": "Abhishek Nair", "location": "Bengaluru, Karnataka", "text": "Highly tactical. It completely demystifies the PR process for C-suite leaders. Highly recommended."}
        ]
    },
    {
        "name": "Decision Making Mastery Training",
        "file": "decision-making-mastery-training.html",
        "price": "25,000",
        "duration": "25 hours",
        "difficulty": "Intermediate",
        "image": "https://static.wixstatic.com/media/11062b_8d76252c90c84036bd3336137408977c~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Mitigate cognitive biases, master statistical decision matrices, and develop rapid operational resolution strategies in high-stakes environments.",
        "desc_main": "Decision Making Mastery Training is an intensive course that explores the neuroscience, psychology, and logic behind strategic thinking and operational resolution.\n\nLeaders must constantly make decisions under high pressure and uncertainty. This program provides cognitive tools, risk assessment matrices, bias check frameworks, and rational models to make fast, calculated, and highly effective choices.",
        "key_learning": [
            "Neuroscience of judgment, logic, and choice selection",
            "Identifying and neutralizing implicit cognitive biases",
            "Applying risk matrices and cost-benefit frameworks",
            "Heuristics for rapid decision making in crisis situations",
            "Managing collaborative decisions and consensus building",
            "Analyzing data and using metrics to back choices",
            "Understanding game theory and strategic dynamics",
            "Evaluating outcome accuracy and continuous learning processes"
        ],
        "ideal_for": "This course is ideal for corporate executives, project directors, entrepreneurs, investment analysts, and managers in fast-paced operational roles.",
        "outcomes": "By the end of the program, participants will make structured, logic-driven decisions, manage team discussions with minimal friction, and systematically mitigate risks.",
        "reviews": [
            {"name": "Naveen Gupta", "location": "Gurugram, Haryana", "text": "A must-read framework for anyone leading a startup. The matrix tools for resource trade-offs are exceptionally useful."},
            {"name": "Swathi Iyer", "location": "Chennai, Tamil Nadu", "text": "Loved the focus on cognitive biases. It opened my eyes to how emotion impacts critical investments."},
            {"name": "Rahul Deshmukh", "location": "Mumbai, Maharashtra", "text": "Excellent case studies and logical structures. Perfect for fast-track business executives."}
        ]
    },
    {
        "name": "The Everyday AI Toolkit",
        "file": "the-everyday-ai-toolkit.html",
        "price": "35,000",
        "duration": "10 hours",
        "difficulty": "Beginner",
        "image": "https://static.wixstatic.com/media/nsplsh_7919607b49dd462f8fdcc784a0e85a21~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Master fundamental AI tools, basic prompt formatting, document editing tools, and simple automations to simplify daily work.",
        "desc_main": "The Everyday AI Toolkit is a friendly, hands-on, entry-level course designed to introduce complete beginners to the power of artificial intelligence. No coding experience needed!\n\nAI doesn't have to be confusing. This course covers the absolute basics of ChatGPT, Claude, and simple automated search tools to help you draft emails faster, organize sheets, search data efficiently, and automate simple day-to-day administrative tasks.",
        "key_learning": [
            "Understanding AI terminology and popular chatbots",
            "Writing basic, clear prompts for immediate results",
            "Drafting emails, summaries, and meeting agendas with AI",
            "Using AI for basic spreadsheet formulas and calculations",
            "Simple image creation and document editing tools",
            "Using AI for research, idea generation, and learning topics",
            "Guidelines for AI privacy, safety, and security",
            "Easy automation shortcuts for daily admin tasks"
        ],
        "ideal_for": "This course is ideal for students, administrative assistants, teachers, freelancers, and professionals new to tech wanting to build basic digital skills.",
        "outcomes": "By the end of the program, participants will use AI tools confidently to complete daily admin tasks in half the time, write clean prompts, and streamline general workflows.",
        "reviews": [
            {"name": "Harish Rao", "location": "Hyderabad, Telangana", "text": "This course is so friendly and easy! I was afraid of AI, but now I use ChatGPT for all my daily emails. High value!"},
            {"name": "Snehal Patil", "location": "Pune, Maharashtra", "text": "Perfect for beginners. The step-by-step guides for excel formulas were exactly what I needed."},
            {"name": "Priya Nair", "location": "Kochi, Kerala", "text": "Extremely helpful, practical, and clear. Changed how I plan my weekly lectures."}
        ]
    },
    {
        "name": "Motivational Speaker Training",
        "file": "motivational-speaker-training.html",
        "price": "42,000",
        "duration": "30 hours",
        "difficulty": "Advanced",
        "image": "https://static.wixstatic.com/media/3fb04d_d81092c375ea4705b2799d78e59cb254~mv2.avif/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Learn storytelling structures, stage presence, vocal dynamics, audience emotional connection, and how to build a paid speaking career.",
        "desc_main": "Motivational Speaker Training is a comprehensive, deep-dive masterclass designed to turn aspiring speakers, coaches, and leaders into world-class public speakers with a powerful, business-generating presence.\n\nGreat speakers don't just share information—they design unforgettable emotional experiences. This course explores story arc structures, vocal projection, hand movement mastery, stage utilization, and how to command attention in crowded auditoriums. You will also learn the commercial side: building a speaker reel, securing paid corporate gigs, and negotiating fees.",
        "key_learning": [
            "Constructing high-impact story arcs and hooks",
            "Mastering vocal dynamics, tone, pacing, and dramatic pause",
            "Non-verbal communication, posture, and stage command",
            "Fostering deep emotional connection with huge crowds",
            "Handling difficult questions and sudden interruptions",
            "Creating high-end presentation slides and speaker reels",
            "Business strategies: pitching, signing deals, and billing fees",
            "Managing performance anxiety and centering routines"
        ],
        "ideal_for": "This course is ideal for corporate trainers, executives, entrepreneurs, authors, coaches, and speakers aiming to build a professional keynote career.",
        "outcomes": "By the end of the program, participants will command the stage with zero anxiety, deliver unforgettable stories, structure keynote addresses, and confidently pitch for paid speaker roles.",
        "reviews": [
            {"name": "Vivek Oberoi", "location": "Bengaluru, Karnataka", "text": "Outstanding! The vocal drills and storytelling structures completely changed how I present. My corporate keynotes are receiving rave reviews."},
            {"name": "Nila Sen", "location": "Delhi", "text": "Practical, intensive, and incredibly empowering. The advice on pitching and business contracts was a game-changer."},
            {"name": "Girish Patel", "location": "Surat, Gujarat", "text": "Amazing transformation. The live coaching and video feedback sessions were incredibly precise and helpful."}
        ]
    },
    {
        "name": "Mindset Mastery Training",
        "file": "mindset-mastery-training.html",
        "price": "20,000",
        "duration": "30 hours",
        "difficulty": "Intermediate",
        "image": "https://static.wixstatic.com/media/nsplsh_6bba7e7857834d29be45c1109bcc571e~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Develop mental resilience, replace limiting beliefs with growth patterns, build focus, and unlock positive cognitive models.",
        "desc_main": "Mindset Mastery Training is a transformational personal and professional development program designed to help individuals strengthen mental resilience, develop a growth-oriented mindset, and unlock higher levels of confidence, focus, and performance.\n\nSuccess is often determined not only by external skills but by internal beliefs, habits, and the ability to navigate challenges with clarity and determination. This course helps participants identify limiting beliefs, overcome self-doubt, strengthen emotional discipline, and build productive thought patterns that support long-term success.",
        "key_learning": [
            "Growth mindset and success psychology principles",
            "Overcoming limiting beliefs and self-doubt loops",
            "Confidence building and robust self-leadership",
            "Goal setting and performance-to-action alignment",
            "Emotional resilience and stress management reframing",
            "Focus, discipline, and modern productivity habits",
            "Positive thinking models and psychological reframing",
            "Accountability and long-term habits formation"
        ],
        "ideal_for": "This course is ideal for professionals, entrepreneurs, students, leaders, job seekers, and individuals committed to personal growth, career advancement, and stronger mental performance.",
        "outcomes": "By the end of the program, participants will have the tools, strategies, and mindset frameworks needed to approach challenges with greater resilience, maintain focus on long-term goals, and operate with higher confidence and clarity.",
        "reviews": [
            {"name": "Alia Bhatt", "location": "Mumbai, Maharashtra", "text": "Mindset Mastery completely shifted my perspective. The exercises helped me break limiting beliefs and approach challenges with a growth mindset."},
            {"name": "Sameer Verma", "location": "Gurugram, Haryana", "text": "An incredibly powerful course. It taught me how to reframe negative thoughts and maintain focus and positivity in high-stress situations."},
            {"name": "Divya Menon", "location": "Kochi, Kerala", "text": "This course is life-changing. The daily practices suggested have significantly improved my mental clarity and overall well-being."}
        ]
    },
    {
        "name": "Adaptive Leadership Training",
        "file": "adaptive-leadership-training.html",
        "price": "26,000",
        "duration": "35 hours",
        "difficulty": "Beginner",
        "image": "https://static.wixstatic.com/media/11062b_d8f8b89f19004835b6ed70114811a8f9~mv2.jpeg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Lead teams through corporate change, develop agile execution systems, manage diverse cultures, and inspire high-performance results.",
        "desc_main": "Adaptive Leadership Training is designed to prepare modern leaders to guide organizations through uncertainty, high-speed change, disruptive technologies, and competitive environments.\n\nClassic hierarchical management is no longer enough. Modern leaders must be agile, highly empathetic, and strategically bold. This course covers situational management models, agile frameworks, empathy mapping, change-curve dynamics, and high-productivity delegation strategies.",
        "key_learning": [
            "Fundamentals of agile leadership and situational execution",
            "Empathy mapping and psychological safety systems",
            "Managing resistance during high-stakes structural changes",
            "Decentralized delegation and high-trust leadership models",
            "Leading diverse, multi-cultural, and distributed remote teams",
            "Conflict management, active mediation, and group trust",
            "Developing organizational agility and change frameworks",
            "Executive communication, vision pitching, and alignment"
        ],
        "ideal_for": "This course is ideal for team leaders, department managers, project heads, HR professionals, and executives wanting to lead modern agile teams.",
        "outcomes": "By the end of the program, participants will lead organizational changes with minimal resistance, run high-productivity meetings, build group trust, and adapt their leadership style to any situation.",
        "reviews": [
            {"name": "Kunal Sen", "location": "New Delhi, Delhi", "text": "This course dramatically changed my management style. The active delegation and empathy tools have worked wonders for my tech team's morale."},
            {"name": "Sanya Goel", "location": "Noida, Uttar Pradesh", "text": "Excellent frameworks! It really addresses the real-world friction managers face during massive digital transitions."},
            {"name": "Varun Tej", "location": "Hyderabad, Telangana", "text": "Brilliant. Clear, scientific, and actionable insights. Highly recommend it to all department managers."}
        ]
    },
    {
        "name": "Confidence and Charisma Training",
        "file": "confidence-and-charisma-training.html",
        "price": "62,500",
        "duration": "30 hours",
        "difficulty": "Intermediate",
        "image": "https://static.wixstatic.com/media/nsplsh_91b2bb8ad9fc451f88ccb96dbdce8798~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/img.webp",
        "desc_short": "Exude executive presence, master authentic storytelling, capture audience attention, and project trust in high-stakes presentations.",
        "desc_main": "Confidence and Charisma Training is an advanced, transformational communication program designed to enhance personal presence, public presentation effectiveness, and emotional intelligence.\n\nParticipants will discover how to project confidence authentically, connect deeply with others, and build a charismatic presence that inspires trust. Develop a magnetic presence that inspires trust and influences positive outcomes.",
        "key_learning": [
            "Cultivating authentic internal self-belief and high-level presence",
            "Mastering storytelling to capture and retain massive audience attention",
            "Advanced non-verbal communication, pacing, and physical cues",
            "Exuding authority and high warmth simultaneously in negotiations",
            "Designing powerful first impressions and executive networking",
            "Managing performance anxiety, breathing, and centering under stress",
            "Assertiveness, conflict resolution, and handling group pushback",
            "Creating continuous routines to maintain confidence and charisma"
        ],
        "ideal_for": "This course is ideal for senior managers, public relations executives, sales directors, startup founders, and professionals seeking a massive leap in executive presence.",
        "outcomes": "By the end of the program, participants will speak with absolute authority, connect with teams, handle tough negotiations with ease, and command massive authority in any forum.",
        "reviews": [
            {"name": "Rohan Verma", "location": "Mumbai, Maharashtra", "text": "The Confidence and Charisma program gave me practical insights into scheduling and resource allocation. My sites are running much more efficiently now!"},
            {"name": "Sneha Joshi", "location": "Pune, Maharashtra", "text": "An excellent program. It bridged the gap between theoretical project management and on-ground execution perfectly. Highly recommended for civil engineers."},
            {"name": "Karthik N.", "location": "Chennai, Tamil Nadu", "text": "I feel much more equipped to handle large-scale construction projects. The modules on cost control and risk management were incredibly detailed."}
        ]
    }
]

# 20 NEW COURSES LISTED BY USER
new_courses = [
    {
        "name": "Professional Development Certification",
        "file": "professional-development-certification.html",
        "difficulty": "Intermediate",
        "category": "Career Growth",
        "desc_short": "Accelerate your career with a curated toolkit of corporate skills, leadership dynamics, strategic communication, and performance habits.",
        "image_kw": "professional"
    },
    {
        "name": "Advanced Career Skills Certification",
        "file": "advanced-career-skills-certification.html",
        "difficulty": "Advanced",
        "category": "Career Growth",
        "desc_short": "Elevate your professional toolkit with advanced leadership strategies, emotional intelligence, and executive presence.",
        "image_kw": "business"
    },
    {
        "name": "Workplace Excellence Certification",
        "file": "workplace-excellence-certification.html",
        "difficulty": "Intermediate",
        "category": "Workplace Skills",
        "desc_short": "Master professional ethics, collaborative problem solving, proactive execution, and stress management.",
        "image_kw": "collaboration"
    },
    {
        "name": "Professional Skills Enhancement Certificate",
        "file": "professional-skills-enhancement-certificate.html",
        "difficulty": "Intermediate",
        "category": "Workplace Skills",
        "desc_short": "Boost your day-to-day effectiveness with certified modules in presentation design, negotiation, and report drafting.",
        "image_kw": "workspace"
    },
    {
        "name": "Corporate Skills Certification",
        "file": "corporate-skills-certification.html",
        "difficulty": "Advanced",
        "category": "Corporate Management",
        "desc_short": "Navigate corporate structures with mastery, developing agile negotiation skills, administrative excellence, and group governance.",
        "image_kw": "office"
    },
    {
        "name": "Professional Growth Certification",
        "file": "professional-growth-certification.html",
        "difficulty": "Intermediate",
        "category": "Career Growth",
        "desc_short": "Build a long-term roadmap for executive promotion, active mentorship, skill expansion, and professional authority.",
        "image_kw": "growth"
    },
    {
        "name": "Career Development Certification",
        "file": "career-development-certification.html",
        "difficulty": "Beginner",
        "category": "Career Growth",
        "desc_short": "Perfect for entry-level professionals seeking career direction, CV crafting, active interview preparation, and corporate networking.",
        "image_kw": "development"
    },
    {
        "name": "Workplace Readiness Certification",
        "file": "workplace-readiness-certification.html",
        "difficulty": "Beginner",
        "category": "Workplace Skills",
        "desc_short": "Transition seamlessly from academics to corporate life, mastering corporate etiquette, basic tools, and group communication.",
        "image_kw": "readiness"
    },
    {
        "name": "Certificate in Business Management",
        "file": "certificate-in-business-management.html",
        "difficulty": "Advanced",
        "category": "Business & Management",
        "desc_short": "Learn business planning, financial analysis, marketing mechanics, operational risk management, and administrative strategy.",
        "image_kw": "management"
    },
    {
        "name": "Certificate in Leadership & Team Management",
        "file": "certificate-in-leadership-and-team-management.html",
        "difficulty": "Advanced",
        "category": "Business & Management",
        "desc_short": "Foster high-performance cultures, develop emotional intelligence, delegate responsibly, and run agile team operations.",
        "image_kw": "leadership"
    },
    {
        "name": "Certificate in Project Coordination",
        "file": "certificate-in-project-coordination.html",
        "difficulty": "Intermediate",
        "category": "Business & Management",
        "desc_short": "Master Gantt charts, cost control, task allocation, and stakeholder reporting to run project workflows smoothly.",
        "image_kw": "project"
    },
    {
        "name": "Certificate in Office Administration",
        "file": "certificate-in-office-administration.html",
        "difficulty": "Beginner",
        "category": "Office Productivity",
        "desc_short": "Streamline office protocols, coordinate schedules, manage documents, and master standard office technologies.",
        "image_kw": "admin"
    },
    {
        "name": "Certificate in Team Leadership",
        "file": "certificate-in-team-leadership.html",
        "difficulty": "Intermediate",
        "category": "Business & Management",
        "desc_short": "Transform from an individual performer into a highly respected team leader who motivates, listens, and guides output.",
        "image_kw": "team"
    },
    {
        "name": "Certificate in Business Operations",
        "file": "certificate-in-business-operations.html",
        "difficulty": "Advanced",
        "category": "Business & Management",
        "desc_short": "Optimize supply chains, automate reporting workflows, manage resource allocations, and eliminate operational wastage.",
        "image_kw": "operations"
    },
    {
        "name": "Certificate in Supervisory Skills",
        "file": "certificate-in-supervisory-skills.html",
        "difficulty": "Beginner",
        "category": "Business & Management",
        "desc_short": "Develop basic supervisory competencies: active feedback, performance tracking, safety governance, and task allocation.",
        "image_kw": "supervisor"
    },
    {
        "name": "Advanced MS Excel Certification",
        "file": "advanced-ms-excel-certification.html",
        "difficulty": "Intermediate",
        "category": "Office Productivity",
        "desc_short": "Master VLOOKUP, XLOOKUP, Pivot Tables, conditional formatting, data validation, and basic macro automation protocols.",
        "image_kw": "excel"
    },
    {
        "name": "Business Communication Certification",
        "file": "business-communication-certification.html",
        "difficulty": "Intermediate",
        "category": "Workplace Skills",
        "desc_short": "Speak persuasively, draft clear executive briefs, run effective meetings, and master non-verbal corporate communication.",
        "image_kw": "communication"
    },
    {
        "name": "Time Management & Productivity Certification",
        "file": "time-management-and-productivity-certification.html",
        "difficulty": "Beginner",
        "category": "Office Productivity",
        "desc_short": "Defeat procrastination, master batch tasking, design daily routines, and run high-efficiency time management frameworks.",
        "image_kw": "time"
    },
    {
        "name": "Professional Email Writing Certification",
        "file": "professional-email-writing-certification.html",
        "difficulty": "Beginner",
        "category": "Office Productivity",
        "desc_short": "Write high-impact professional emails, master tone selection, format requests clearly, and get swift, positive responses.",
        "image_kw": "writing"
    },
    {
        "name": "Office Productivity Certification",
        "file": "office-productivity-certification.html",
        "difficulty": "Intermediate",
        "category": "Office Productivity",
        "desc_short": "Unite word processors, spreadsheet templates, slides engines, and basic task managers into a high-performance admin suite.",
        "image_kw": "productivity"
    }
]

# Image mapping to beautiful high-res Unsplash links
UNSPLASH_IMAGES = {
    "professional": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80",
    "business": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80",
    "collaboration": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80",
    "workspace": "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1920&q=80",
    "office": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
    "growth": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
    "development": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80",
    "readiness": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
    "management": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80",
    "leadership": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80",
    "project": "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1920&q=80",
    "admin": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80",
    "team": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
    "operations": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80",
    "supervisor": "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80",
    "excel": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80",
    "communication": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80",
    "time": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1920&q=80",
    "writing": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1920&q=80",
    "productivity": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80",
}

indian_names = ["Amit Sharma", "Priya Patel", "Vikram Singh", "Deepika Iyer", "Rahul Verma", "Karthik Nair", "Sneha Rao", "Rohan Mehta", "Neha Gupta", "Aditya Joshi", "Divya Nair", "Suresh Kumar", "Swathi Pillai", "Manish Pandey", "Pooja Trivedi", "Rajesh Deshmukh", "Komal Shah", "Arjun Reddy", "Harsh Vardhan", "Ritu Saxena"]
indian_locations = ["New Delhi, Delhi", "Mumbai, Maharashtra", "Bengaluru, Karnataka", "Chennai, Tamil Nadu", "Hyderabad, Telangana", "Pune, Maharashtra", "Ahmedabad, Gujarat", "Kolkata, West Bengal", "Noida, Uttar Pradesh", "Gurugram, Haryana", "Kochi, Kerala", "Jaipur, Rajasthan", "Indore, Madhya Pradesh", "Lucknow, Uttar Pradesh", "Coimbatore, Tamil Nadu", "Chandigarh, Punjab"]

review_templates = [
    "The {course} course gave me incredible practical insights. Highly recommended for anyone wanting on-ground execution skills!",
    "An excellent program. It perfectly bridged the gap between theoretical knowledge and practical workplace implementation.",
    "I feel much more equipped to handle complex challenges after this training. The modules on risk management and coordination were extremely detailed.",
    "Outstanding training! The live simulations and feedback from the mentors were highly practical and immediately useful.",
    "This was a life-changing learning experience. The structured frameworks have completely elevated my day-to-day productivity.",
    "Very informative, clear, and comprehensive. The template sheets and resources shared have made our team workflows much smoother."
]

# Generate detailed text for all 20 new courses
for item in new_courses:
    name = item["name"]
    duration = random.choice(DURATIONS)
    price_val = random.choice([22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000, 55000, 60000, 65000])
    price = f"{price_val:,}"
    
    # Formulate desc_main
    desc_main = f"The {name} is a comprehensive professional development program designed to strengthen your operational confidence, build robust practical systems, and unlock leadership excellence.\n\nIn modern business environments, holding highly refined skills is essential to keep a competitive edge. This course walks through practical frameworks, case study reviews, strategic exercises, and direct mentoring opportunities. Learners will gain industry-ready competencies to plan, execute, monitor, and deliver high-quality outcomes across various business functions.\n\nOur curriculum integrates industry best practices, modern tools, and structured methodologies to ensure that every participant develops immediately applicable workplace skills."
    
    # Formulate key learning
    key_learning = [
        f"Core principles of high-performance {name.lower()}",
        "Techniques for strategic planning, resource coordination, and task scheduling",
        "Analyzing operational metrics and implementing cost controls",
        "Developing strong collaborative systems and emotional intelligence",
        "Troubleshooting project bottlenecks and resolving client/team disputes",
        "Fostering compliance, quality assurance, and organizational standards",
        "Effective risk assessment frameworks and risk mitigation policies",
        "Managing diverse stakeholder expectations and building corporate trust"
    ]
    
    # Formulate ideal for
    ideal_for = f"This course is ideal for early-stage professionals, team leaders, department managers, administrative officers, business coordinators, and individuals looking to make a high-impact leap in their corporate careers."
    
    # Formulate outcomes
    outcomes = f"By the end of the program, participants will confidently manage business workflows, optimize project resources, lead cohesive teams, and deliver professional outcomes while maintaining high-quality industry standards."
    
    # Formulate reviews
    reviews = []
    names_picked = random.sample(indian_names, 3)
    locs_picked = random.sample(indian_locations, 3)
    texts_picked = random.sample(review_templates, 3)
    for i in range(3):
        reviews.append({
            "name": names_picked[i],
            "location": locs_picked[i],
            "text": texts_picked[i].format(course=name)
        })
        
    image_url = UNSPLASH_IMAGES.get(item["image_kw"], "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80")
    
    courses_data.append({
        "name": name,
        "file": item["file"],
        "price": price,
        "duration": duration,
        "difficulty": item["difficulty"],
        "image": image_url,
        "desc_short": item["desc_short"],
        "desc_main": desc_main,
        "key_learning": key_learning,
        "ideal_for": ideal_for,
        "outcomes": outcomes,
        "reviews": reviews
    })

# Format the 18 existing courses to have updated prices and durations matching the new request
for course in courses_data[:18]:
    # Update price between 20k and 70k if not already
    p_num = int(course["price"].replace(",", ""))
    if p_num < 20000 or p_num > 70000:
        p_num = random.choice([24000, 28000, 32000, 35000, 42000, 48000, 52000, 58000, 62000, 65000])
        course["price"] = f"{p_num:,}"
    # Update duration from the list
    course["duration"] = random.choice(DURATIONS)

# Write HTML Files
template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{name} Certification | ELITE TOOLISTIC</title>
  <meta name="description" content="Enroll in {name} Certification at ELITE TOOLISTIC. {desc_short} Structured {duration} certification program with industry-relevant case studies." />
  <meta name="keywords" content="{name}, professional certification, ELITE TOOLISTIC, online course, career training, business management" />
  
  <!-- Open Graph / SEO -->
  <meta property="og:title" content="{name} Certification | ELITE TOOLISTIC" />
  <meta property="og:description" content="{desc_short} structured {duration} coaching." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.elitetoolistic.com/{file}" />
  <meta property="og:image" content="{image}" />
  
  <link rel="stylesheet" href="style.css" />
  <style>
    /* Detail Page Specific Styles */
    .course-detail-hero {{
      position: relative;
      background-image: url('{image}');
      background-size: cover;
      background-position: center;
      padding: 12rem 6% 6rem;
      text-align: center;
      color: white;
    }}
    .course-detail-hero::before {{
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
    }}
    .course-detail-hero > * {{
      position: relative;
      z-index: 2;
    }}
    .course-detail-hero h1 {{
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      font-weight: 800;
      letter-spacing: -2px;
      margin-bottom: 1.5rem;
      line-height: 1.1;
      text-transform: capitalize;
    }}
    .course-detail-hero .subtitle {{
      font-size: 1.15rem;
      font-weight: 400;
      letter-spacing: 1px;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      opacity: 0.95;
    }}

    .course-content-section {{
      background: linear-gradient(160deg, #f3ebd8 0%, #e8dcc4 100%);
      padding: 6rem 6%;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 4rem;
      align-items: start;
    }}
    
    .about-course h2 {{
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--black);
      margin-top: 2rem;
      margin-bottom: 1.2rem;
      letter-spacing: -1px;
    }}
    .about-course h2:first-of-type {{
      margin-top: 0;
    }}
    .about-course p {{
      font-size: 1.05rem;
      color: #333;
      line-height: 1.8;
      margin-bottom: 1.5rem;
    }}
    .about-course ul {{
      margin-left: 1.5rem;
      margin-bottom: 1.8rem;
    }}
    .about-course ul li {{
      font-size: 1.05rem;
      color: #333;
      line-height: 1.8;
      margin-bottom: 0.6rem;
    }}

    .info-boxes {{
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      position: sticky;
      top: 100px;
    }}
    .info-box {{
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(12px);
      padding: 2.2rem;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.85);
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }}
    .info-box h3 {{
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 0.8rem;
      color: var(--black);
      letter-spacing: -0.5px;
    }}
    .info-box p {{
      font-size: 0.98rem;
      color: #444;
      line-height: 1.65;
    }}
    
    .enroll-action {{
      text-align: center;
      padding: 6rem 6%;
      background: white;
    }}
    .enroll-btn-large {{
      display: inline-block;
      padding: 1.2rem 3.5rem;
      background: var(--blue);
      color: white;
      font-size: 1.25rem;
      font-weight: 700;
      border-radius: 35px;
      text-decoration: none;
      transition: all 0.3s ease;
    }}
    .enroll-btn-large:hover {{
      background: var(--dark-blue);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0,51,255,0.25);
    }}

    /* Reviews Styling */
    .reviews-section {{
      margin-top: 4rem;
      border-top: 1px solid rgba(0,0,0,0.1);
      padding-top: 3rem;
    }}
    .review-card {{
      background: rgba(255,255,255,0.5);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border-left: 4px solid var(--blue);
    }}
    .review-card h4 {{
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--black);
      margin-bottom: 0.3rem;
    }}
    .review-card .location {{
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 0.8rem;
      font-style: italic;
    }}
    .review-card p {{
      font-size: 0.98rem;
      color: #333;
      line-height: 1.6;
      margin-bottom: 0;
    }}

    @media (max-width: 900px) {{
      .course-content-section {{ grid-template-columns: 1fr; }}
      .info-boxes {{ position: relative; top: 0; }}
    }}
  </style>
  <link rel="icon" type="image/png" href="images/LOGO.png" />
</head>
<body>

<!-- NAVBAR -->
<nav id="navbar">
  <a href="index.html" class="nav-logo">
    <img src="images/LOGO.png" alt="ELITE TOOLISTIC Logo" style="height: 45px; width: auto;" />
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="courses.html">Courses</a></li>
    <li><a href="about.html">About Us</a></li>
    <li><a href="persona.html">Persona</a></li>
    <li><a href="team.html">Our Team</a></li>
  </ul>
  <a href="contact.html" class="nav-enroll">
    ENROLL NOW <span class="arrow">→</span>
  </a>
  <div class="hamburger" id="hamburger"><span></span><span></span><span></span></div>
</nav>

<header class="course-detail-hero">
  <h1>{name}</h1>
  <p class="subtitle">{desc_short}</p>
</header>

<section class="course-content-section">
  <div class="about-course">
    <h2>About Course</h2>
    {desc_main_html}

    <h2>Key Learning Areas</h2>
    <ul>
      {key_learning_html}
    </ul>

    <h2>Ideal For</h2>
    <p>{ideal_for}</p>

    <h2>Expected Outcomes</h2>
    <p>{outcomes}</p>

    <h2>Course Investment</h2>
    <p><strong>Program Fee:</strong> ₹{price}/-</p>
    <p>This comprehensive fee includes:</p>
    <ul>
      <li>Complete structured training sessions and workshop resources.</li>
      <li>Industry-standard templates, calculators, and toolkit materials.</li>
      <li>Highly practical case studies and interactive project simulations.</li>
      <li>Personalized professional mentoring, reviews, and guidance.</li>
      <li>Authorized Certification of Completion from ELITE TOOLISTIC.</li>
    </ul>
    <p><strong>Course Duration:</strong> This is a highly structured, focused {duration} training program designed for practical skill development, operational leadership expansion, and industry-oriented behavioral change.</p>

    <div class="reviews-section">
      <h2>Learner Reviews &amp; Feedback</h2>
      <p style="margin-bottom: 2rem;">Hear from professionals who've experienced transformative career growth through our curriculum:</p>
      {reviews_html}
    </div>
  </div>
  
  <div class="info-boxes">
    <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
      <div class="info-box">
        <h3>Personalized Pricing</h3>
        <p>Professional certification program available at <strong>₹{price}</strong>, designed to deliver maximum career value, flexibility, and practical effectiveness.</p>
      </div>
      <div class="info-box">
        <h3>Session Duration</h3>
        <p>This is a structured <strong>{duration}</strong> coaching certification program focused on practical implementation. Each session delivers maximum clarity within a highly productive timeframe.</p>
      </div>
      <div class="info-box">
        <h3>Flexible Terms</h3>
        <p>Fees and packages are customized based on your specific professional requirements, ensuring you pay only for the value that truly matters to your career.</p>
      </div>
    </div>
  </div>
</section>

<section class="enroll-action">
  <h2 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 2rem; letter-spacing: -1px;">Ready to Transform Your Career?</h2>
  <a href="contact.html" class="enroll-btn-large">Enroll Now in {name}</a>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="footer-logo">
        <img src="images/LOGO.png" alt="ELITE TOOLISTIC Logo" style="height: 40px; width: auto;" />
      </div>
      <p>Empowering individuals to unlock their full potential through flexible, high-quality learning experiences tailored to their unique goals.</p>
      <div class="footer-contact">
        <p>1444, Gaur City 1, Sector 4, Greater Noida, Ghaziabad, Uttar Pradesh 201318</p>
        <p style="margin-top:0.5rem"><a href="mailto:support@elitetoolistic.com">support@elitetoolistic.com</a></p>
        <p>+917969654626<br>+918062386662<br>+912241507377</p>
      </div>
    </div>
    <div class="footer-col">
      <h4>Menu/</h4>
      <ul>
        <li><a href="contact.html">Contact Us</a></li>
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
        <li><a href="terms-conditions.html">Terms &amp; Conditions</a></li>
        <li><a href="refund-policy.html">Refund Policy</a></li>
        <li><a href="service-delivery.html">Service Delivery</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Info/</h4>
      <ul>
        <li><a href="sample-invoice.html">Sample Invoice</a></li>
        <li><a href="sample-certificate.html">Sample Certificate</a></li>
        <li><a href="https://www.elitetoolistic.in/login" target="_blank" rel="noopener noreferrer">Exam Portal</a></li>
        <li><a href="demo-exam-portal.html" target="_blank" rel="noopener noreferrer">Demo Exam Portal</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Pages/</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="courses.html">Courses</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="persona.html">Persona</a></li>
        <li><a href="team.html">Our Team</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 All rights reserved by ELITE TOOLISTIC (OPC)&nbsp;&nbsp;&nbsp;PRIVATE LIMITED.</p>
  </div>
</footer>

<script>
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  window.addEventListener('scroll', () => {{
    const navbar = document.getElementById('navbar');
    if(navbar) navbar.style.boxShadow = window.scrollY > 40 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
  }});
</script>
</body>
</html>"""

# Generate HTML file for each course
for course in courses_data:
    # Build HTML snippets
    desc_main_html = "\n".join(f"<p>{p.strip()}</p>" for p in course["desc_main"].split("\n\n") if p.strip())
    key_learning_html = "\n".join(f"<li>{item}</li>" for item in course["key_learning"])
    
    reviews_html = ""
    for rev in course["reviews"]:
        reviews_html += f"""
      <div class="review-card">
        <h4>{rev['name']}</h4>
        <div class="location">{rev['location']}</div>
        <p>"{rev['text']}"</p>
      </div>"""

    final_html = template.format(
        name=course["name"],
        file=course["file"],
        price=course["price"],
        duration=course["duration"],
        image=course["image"],
        desc_short=course["desc_short"],
        desc_main_html=desc_main_html,
        key_learning_html=key_learning_html,
        ideal_for=course["ideal_for"],
        outcomes=course["outcomes"],
        reviews_html=reviews_html
    )
    
    # Save the file
    with open(course["file"], "w", encoding="utf-8") as f:
        f.write(final_html)
    print(f"Generated {course['file']}")


# REGENERATE courses.html WITH 38 CARDS
catalog_cards_html = ""
for course in courses_data:
    tag_class = "tag-beginner"
    if course["difficulty"] == "Intermediate":
        tag_class = "tag-intermediate"
    elif course["difficulty"] == "Advanced":
        tag_class = "tag-advanced"
        
    catalog_cards_html += f"""
    <div class="catalog-card">
      <div class="course-image">
        <a href="{course['file']}"><img src="{course['image']}" alt="{course['name']} Certification" /></a>
      </div>
      <div class="card-content">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="catalog-tag {tag_class}">{course['difficulty']}</span>
          <span style="font-size:0.75rem; color:#666; font-weight:700;">{course['duration']}</span>
        </div>
        <h3><a href="{course['file']}" style="color:inherit; text-decoration:none;">{course['name']}</a></h3>
        <p style="font-size:0.85rem; color:#666; line-height:1.5; margin-bottom:1.5rem; flex-grow:1;">{course['desc_short']}</p>
        <div class="catalog-price">
          <span class="price">₹{course['price']}</span>
          <a href="{course['file']}" class="enroll-link">View Details →</a>
        </div>
      </div>
    </div>"""

courses_page_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Professional Certification Courses | ELITE TOOLISTIC Catalog</title>
  <meta name="description" content="Explore ELITE TOOLISTIC's master catalog of 38 professional certification courses and corporate training programs designed to enhance on-ground execution, technical mastery, and administrative leadership."/>
  <meta name="keywords" content="professional courses, corporate training, excel certification, leadership certificate, ELITE TOOLISTIC catalog" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Professional Certification Courses | ELITE TOOLISTIC Catalog" />
  <meta property="og:description" content="Explore our catalog of 38 professional certification courses." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.elitetoolistic.com/courses.html" />
  
  <link rel="stylesheet" href="style.css"/>
  <style>
    .courses-page-hero {{
      background: linear-gradient(160deg, #f0f0ee 0%, #e8e4f8 60%, #d0ccf4 100%);
      padding: calc(72px + 5rem) 6% 5rem;
    }}
    .course-catalog {{ padding: 5rem 6%; background: var(--bg); }}
    .catalog-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }}
    
    .catalog-card {{
      background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden; transition: var(--transition);
      display: flex; flex-direction: column;
    }}
    .catalog-card:hover {{ border-color: var(--black); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.07); }}
    
    .course-image {{
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-bottom: 1px solid #f0f0f0;
    }}
    .course-image img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }}
    .catalog-card:hover .course-image img {{
      transform: scale(1.05);
    }}
    
    .card-content {{
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }}
    .catalog-tag {{
      display: inline-block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; align-self: flex-start;
    }}
    .tag-beginner {{ background: #e8f5e9; color: #2e7d32; }}
    .tag-intermediate {{ background: #fff3e0; color: #e65100; }}
    .tag-advanced {{ background: #fce4ec; color: #c62828; }}
    
    .catalog-card h3 {{ font-size: 1.15rem; font-weight: 800; color: var(--black); margin-top: 0.8rem; margin-bottom: 1rem; line-height: 1.4; letter-spacing: -0.5px; }}
    
    .catalog-price {{
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 1rem; border-top: 1px solid var(--border);
    }}
    .catalog-price .price {{ font-size: 1.1rem; font-weight: 800; color: var(--black); }}
    .catalog-price .enroll-link {{
      font-size: 0.85rem; font-weight: 700; color: var(--blue);
      display: flex; align-items: center; gap: 4px; text-decoration: none;
    }}
    .catalog-price .enroll-link:hover {{ text-decoration: underline; }}
    
    @media (max-width: 1100px) {{
      .catalog-grid {{ grid-template-columns: repeat(2, 1fr); }}
    }}
    @media (max-width: 750px) {{
      .catalog-grid {{ grid-template-columns: 1fr; }}
    }}
  </style>
  <link rel="icon" type="image/png" href="images/LOGO.png" />
</head>
<body>
<nav id="navbar">
  <a href="index.html" class="nav-logo">
    <img src="images/LOGO.png" alt="ELITE TOOLISTIC Logo" style="height: 45px; width: auto;" />
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="courses.html" class="active">Courses</a></li>
    <li><a href="about.html">About Us</a></li>
    <li><a href="persona.html">Persona</a></li>
    <li><a href="team.html">Our Team</a></li>
  </ul>
  <a href="contact.html" class="nav-enroll">ENROLL NOW <span class="arrow">→</span></a>
  <div class="hamburger" id="hamburger"><span></span><span></span><span></span></div>
</nav>

<section class="courses-page-hero">
  <p class="section-label-sm">Our Curriculum</p>
  <h1 class="page-hero-h1">Courses &amp;<br>Certifications</h1>
  <p class="page-hero-sub">Globally aligned professional courses designed to enhance skills, build expertise, and prepare you for international recognition.</p>
</section>

<section class="course-catalog">
  <p class="section-label-sm">Full Catalog</p>
  <h2 class="section-h2" style="font-size:clamp(2.5rem,4vw,3.5rem);letter-spacing:-2px">All Courses</h2>
  <div class="catalog-grid">
    {catalog_cards_html}
  </div>
</section>

<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="footer-logo">
        <img src="images/LOGO.png" alt="ELITE TOOLISTIC Logo" style="height: 40px; width: auto;" />
      </div>
      <p>Empowering individuals to unlock their full potential through flexible, high-quality learning experiences tailored to their unique goals.</p>
      <div class="footer-contact">
        <p>1444, Gaur City 1, Sector 4, Greater Noida, Ghaziabad, Uttar Pradesh 201318</p>
        <p style="margin-top:0.5rem"><a href="mailto:support@elitetoolistic.com">support@elitetoolistic.com</a></p>
        <p>+917969654626<br>+918062386662<br>+912241507377</p>
      </div>
    </div>
    <div class="footer-col">
      <h4>Menu/</h4>
      <ul>
        <li><a href="contact.html">Contact Us</a></li>
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
        <li><a href="terms-conditions.html">Terms &amp; Conditions</a></li>
        <li><a href="refund-policy.html">Refund Policy</a></li>
        <li><a href="service-delivery.html">Service Delivery</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Info/</h4>
      <ul>
        <li><a href="sample-invoice.html">Sample Invoice</a></li>
        <li><a href="sample-certificate.html">Sample Certificate</a></li>
        <li><a href="demo-exam-portal.html" target="_blank" rel="noopener noreferrer">Demo Exam Portal</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Pages/</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="courses.html">Courses</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="persona.html">Persona</a></li>
        <li><a href="team.html">Our Team</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 All rights reserved by ELITE TOOLISTIC (OPC)&nbsp;&nbsp;&nbsp;PRIVATE LIMITED.</p>
  </div>
</footer>

<script>
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  window.addEventListener('scroll', () => {{
    document.getElementById('navbar').style.boxShadow =
      window.scrollY > 40 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
  }});
</script>
</body>
</html>"""

with open("courses.html", "w", encoding="utf-8") as f:
    f.write(courses_page_html)

print("SUCCESSFULLY COMPLETED ALL COURSE PAGE AND CATALOG GENERATION!")
