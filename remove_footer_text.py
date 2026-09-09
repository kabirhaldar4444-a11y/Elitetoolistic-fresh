import os
import re

courses = [
    "construction-project-management.html",
    "energy-management-certification.html",
    "certified-commercial-contracts-manager.html",
    "advanced-civil-execution.html",
    "projects-in-controlled-environments.html",
    "contract-and-claims-management.html",
    "body-language-expert-training.html",
    "relationship-coaching-training.html",
    "-ai-productivity-power-up.html",
    "resilience-coach-training.html",
    "personal-branding-strategist-training.html",
    "decision-making-mastery-training.html",
    "the-everyday-ai-toolkit.html",
    "motivational-speaker-training.html",
    "mindset-mastery-training.html",
    "adaptive-leadership-training.html",
    "confidence-and-charisma-training.html",
    "self-confidence-building-training.html"
]

for filename in courses:
    filepath = os.path.join('/Users/devendrakumar/isn', filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()

    # The block we want to remove starts with <h2>Start Your Learning Journey
    # and ends before the closing </div> of the <div class="about-course">
    # Because there are no other </div> tags inside about-course typically,
    # or we can just remove from <h2>Start Your Learning Journey up to "  </div>"
    
    # Regex to match <h2>Start Your Learning Journey... up to the end of that block.
    # It looks like:
    # <h2>Start Your Learning Journey with Us! </h2>
    # <p>Embark on the AI Adventure. Let&#x27;s Get Started</p>
    # ENROLL NOW First Name * Last name * Email * Address What Topic Are You Interested In? * Submit
    
    new_content = re.sub(r'<h2>Start Your Learning Journey.*?Submit', '', content, flags=re.IGNORECASE | re.DOTALL)
    
    # Also sometimes it might not have "Submit" at the end if the parser missed it, so let's do a broader regex if the first one doesn't change anything.
    if new_content == content:
        new_content = re.sub(r'<h2>Start Your Learning Journey.*?</div>\s*<div class="info-boxes">', '</div>\n  \n  <div class="info-boxes">', content, flags=re.IGNORECASE | re.DOTALL)
        
    # Clean up any trailing whitespace before the </div>
    new_content = re.sub(r'\s+</div>\s*<div class="info-boxes">', '\n  </div>\n  \n  <div class="info-boxes">', new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"No changes needed for {filename}")
