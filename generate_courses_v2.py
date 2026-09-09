import urllib.request
import re
import os
import time
import html

courses = [
    {"file": "construction-project-management.html", "url": "https://www.elitetoolistic.com/constructionprojectmanagement", "name": "Construction Project Management", "price": "32,000"},
    {"file": "energy-management-certification.html", "url": "https://www.elitetoolistic.com/energymanagementcertification", "name": "Energy Management Certification", "price": "75,000"},
    {"file": "certified-commercial-contracts-manager.html", "url": "https://www.elitetoolistic.com/resiliencecoachtraining-1", "name": "Certified Commercial Contracts Manager", "price": "15,000"},
    {"file": "advanced-civil-execution.html", "url": "https://www.elitetoolistic.com/advancedcivilexecution", "name": "Advanced Civil Execution", "price": "36,000"},
    {"file": "projects-in-controlled-environments.html", "url": "https://www.elitetoolistic.com/projectsincontrolledenvironments", "name": "Projects IN Controlled Environments", "price": "45,000"},
    {"file": "contract-and-claims-management.html", "url": "https://www.elitetoolistic.com/contractandclaimsmanagement", "name": "Contract and Claims Management", "price": "30,000"},
    {"file": "body-language-expert-training.html", "url": "https://www.elitetoolistic.com/bodylanguageexperttraining", "name": "Body Language Expert Training", "price": "75,000"},
    {"file": "relationship-coaching-training.html", "url": "https://www.elitetoolistic.com/relationshipcoachingtraining", "name": "Relationship Coaching Training", "price": "15,000"},
    {"file": "-ai-productivity-power-up.html", "url": "https://www.elitetoolistic.com/ai-productivity-power-up", "name": "​AI Productivity Power-Up", "price": "60,000"},
    {"file": "resilience-coach-training.html", "url": "https://www.elitetoolistic.com/resiliencecoachtraining", "name": "Resilience Coach Training", "price": "15,000"},
    {"file": "personal-branding-strategist-training.html", "url": "https://www.elitetoolistic.com/personalbrandingstrategisttraining", "name": "Personal Branding Strategist Training", "price": "65,000"},
    {"file": "decision-making-mastery-training.html", "url": "https://www.elitetoolistic.com/decision-making-mastery-training", "name": "Decision Making Mastery Training", "price": "25,000"},
    {"file": "the-everyday-ai-toolkit.html", "url": "https://www.elitetoolistic.com/the-everyday-ai-toolkit", "name": "The Everyday AI Toolkit", "price": "45,000"},
    {"file": "motivational-speaker-training.html", "url": "https://www.elitetoolistic.com/motivationalspeakertraining", "name": "Motivational Speaker Training", "price": "45,000"},
    {"file": "mindset-mastery-training.html", "url": "https://www.elitetoolistic.com/mindsetmasterytraining", "name": "Mindset Mastery Training", "price": "20,000"},
    {"file": "adaptive-leadership-training.html", "url": "https://www.elitetoolistic.com/adaptive-leadership-training", "name": "Adaptive Leadership Training", "price": "20,000"},
    {"file": "confidence-and-charisma-training.html", "url": "https://www.elitetoolistic.com/confidence-and-charisma-training", "name": "Confidence and Charisma Training", "price": "62,500"},
]

courses_html_path = '/Users/devendrakumar/isn/courses.html'
with open(courses_html_path, 'r') as f:
    courses_html_content = f.read()

images_dict = {}
matches = re.findall(r'<a href="([^"]+)"><img src="([^"]+)"', courses_html_content)
for link, img in matches:
    images_dict[link] = img

template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{name} | ELITE TOOLISTIC</title>
  <meta name="description" content="Enroll in {name} at ELITE TOOLISTIC. {desc_short}" />
  <link rel="stylesheet" href="style.css" />
  <style>
    /* Detail Page Specific Styles */
    .course-detail-hero {{
      position: relative;
      background-image: url('{hero_img}');
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
      background: rgba(0, 0, 0, 0.4);
    }}
    .course-detail-hero > * {{
      position: relative;
      z-index: 2;
    }}
    .course-detail-hero h1 {{
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 800;
      letter-spacing: -2px;
      margin-bottom: 1rem;
      line-height: 1.1;
    }}
    .course-detail-hero .subtitle {{
      font-size: 1.2rem;
      font-weight: 400;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.9;
    }}

    .course-content-section {{
      background: linear-gradient(160deg, #f3ebd8 0%, #e8dcc4 100%);
      padding: 6rem 6%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }}
    
    .about-course h2 {{
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--black);
      margin-bottom: 1.5rem;
    }}
    .about-course p {{
      font-size: 1.05rem;
      color: #333;
      line-height: 1.8;
      margin-bottom: 1.5rem;
    }}
    .about-course ul {{
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
    }}
    .about-course ul li {{
      font-size: 1.05rem;
      color: #333;
      line-height: 1.8;
      margin-bottom: 0.5rem;
    }}

    .info-boxes {{
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }}
    .info-box {{
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.8);
      box-shadow: 0 10px 30px rgba(0,0,0,0.02);
    }}
    .info-box h3 {{
      font-size: 1.2rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: var(--black);
    }}
    .info-box p {{
      font-size: 0.95rem;
      color: #444;
      line-height: 1.6;
    }}
    .info-box ul {{
      margin-left: 1.2rem;
      margin-top: 0.5rem;
    }}
    .info-box ul li {{
      font-size: 0.95rem;
      color: #444;
      line-height: 1.6;
      margin-bottom: 0.2rem;
    }}
    
    .enroll-action {{
      text-align: center;
      padding: 4rem 6%;
      background: white;
    }}
    .enroll-btn-large {{
      display: inline-block;
      padding: 1.2rem 3rem;
      background: var(--blue);
      color: white;
      font-size: 1.2rem;
      font-weight: 700;
      border-radius: 30px;
      text-decoration: none;
      transition: all 0.3s ease;
    }}
    .enroll-btn-large:hover {{
      background: var(--dark-blue);
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0,51,255,0.2);
    }}

    @media (max-width: 900px) {{
      .course-content-section {{ grid-template-columns: 1fr; }}
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
{content_paragraphs}
    
    <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--black); margin-top: 2rem; margin-bottom: 1rem;">Key Learning Areas</h3>
    <ul>
{list_items}
    </ul>

    <p style="margin-top: 1.5rem;">By the end of the program, participants will be able to confidently apply these skills and create structured pathways for personal growth and professional success.</p>
  </div>
  
  <div class="info-boxes">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <div class="info-box">
        <h3>Personalized Pricing</h3>
        <p>Professional program available at <strong>₹{price}</strong>, designed to deliver maximum value, adaptability, and career effectiveness.</p>
      </div>
      <div class="info-box">
        <h3>Session Duration</h3>
        <p>This is a structured 3-month coaching certification program focused on practical implementation. Each session is designed to deliver maximum value within a productive timeframe.</p>
      </div>
    </div>
    <div class="info-box" style="margin-top: 1.5rem;">
      <h3>What's Included</h3>
      <ul>
        <li>Complete training sessions</li>
        <li>Specialized tools and practical frameworks</li>
        <li>Real-world exercises and guided activities</li>
        <li>Personalized mentoring and feedback</li>
        <li>Certification of Completion</li>
      </ul>
    </div>
    <div class="info-box" style="margin-top: 1.5rem; text-align: center;">
      <h3>Flexible Terms</h3>
      <p>Fees are customized based on your specific needs, ensuring you pay only for what truly matters.</p>
    </div>
  </div>
</section>

<section class="enroll-action">
  <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 2rem;">Ready to Transform Your Career?</h2>
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
        <p>DLF Prime Towers, Plot No 79 & 80, Mata Mohalla, Pocket F, Okhla Phase I, Okhla Industrial Estate, New Delhi, Delhi 110020</p>
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
        <li><a href="https://elitetoolisticapp.vercel.app/" target="_blank" rel="noopener noreferrer">Exam Portal</a></li>
        <li><a href="demo-exam-portal.html">Demo Exam Portal</a></li>
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

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return html.unescape(cleantext.strip())

for course in courses:
    print(f"Processing {course['name']}...")
    try:
        req = urllib.request.Request(course['url'], headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        time.sleep(1.5) # Sleep to avoid 429
        with urllib.request.urlopen(req) as response:
            html_content = response.read().decode('utf-8', errors='ignore')
            
            # Extract og:description
            og_desc_match = re.search(r'<meta property="og:description" content="([^"]+)"', html_content)
            desc_short = html.unescape(og_desc_match.group(1)) if og_desc_match else "Unlock your potential and build professional confidence."
            
            # Extract paragraphs - Look for sequence of wixui-rich-text__text
            paragraphs = []
            para_matches = re.findall(r'<p class="font_8 wixui-rich-text__text">(.*?)</p>', html_content, re.DOTALL)
            for match in para_matches:
                text = clean_html(match)
                if len(text) > 80 and text not in paragraphs and 'rights reserved' not in text and 'Subscribe' not in text and 'key areas such as' not in text:
                    paragraphs.append(text)
            
            # Form paragraph string
            # Take the first 3 or 4 paragraphs
            content_paragraphs = ""
            for p in paragraphs[:4]:
                content_paragraphs += f"    <p>{p}</p>\n"
            if not content_paragraphs:
                 content_paragraphs = f"    <p>{course['name']} is a transformational professional development program designed for individuals who want to build expertise, emotional adaptability, and the ability to thrive through challenges.</p>"
            
            # Extract list items
            list_items = []
            ul_matches = re.findall(r'<ul[^>]*>(.*?)</ul>', html_content, re.DOTALL)
            if ul_matches:
                for ul in ul_matches:
                    li_matches = re.findall(r'<li[^>]*>(.*?)</li>', ul, re.DOTALL)
                    if li_matches:
                        for li in li_matches:
                            text = clean_html(li)
                            if len(text) > 5 and text not in list_items:
                                list_items.append(text)
                        if len(list_items) > 2:
                            break # Found the main list

            list_items_text = ""
            if list_items:
                for item in list_items:
                    list_items_text += f"      <li>{item}</li>\n"
            else:
                for item in [
                    "Foundations of professional mastery and growth",
                    "Advanced techniques in the respective domain",
                    "Strategic thinking and leadership skills",
                    "Practical applications and case studies",
                    "Confidence building and interpersonal communication",
                    "Building sustainable habits for success",
                ]:
                    list_items_text += f"      <li>{item}</li>\n"
                
            img_url = images_dict.get(course['file'], 'https://static.wixstatic.com/media/nsplsh_1898c1db9f2a4ac8a3798084e7d32d13~mv2.jpg/v1/fill/w_1920,h_600,al_c,q_85/img.webp')
            img_url = img_url.replace('w_600,h_400', 'w_1920,h_600')

            final_html = template.format(
                name=course['name'],
                desc_short=desc_short,
                hero_img=img_url,
                content_paragraphs=content_paragraphs,
                list_items=list_items_text,
                price=course['price']
            )
            
            out_path = os.path.join('/Users/devendrakumar/isn', course['file'])
            with open(out_path, 'w') as f:
                f.write(final_html)
            print(f"Created {course['file']}")
            
    except Exception as e:
        print(f"Error processing {course['name']}: {e}")

