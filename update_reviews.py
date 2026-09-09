import os
import re

courses_reviews = {
    "construction-project-management.html": [
        ("Rahul Verma – Mumbai, Maharashtra", "The Construction Project Management course gave me practical insights into scheduling and resource allocation. My sites are running much more efficiently now!"),
        ("Sneha Joshi – Pune, Maharashtra", "An excellent program. It bridged the gap between theoretical project management and on-ground execution perfectly. Highly recommended for civil engineers."),
        ("Karthik N. – Chennai, Tamil Nadu", "I feel much more equipped to handle large-scale construction projects. The modules on cost control and risk management were incredibly detailed.")
    ],
    "energy-management-certification.html": [
        ("Aditi Rao – Bengaluru, Karnataka", "The Energy Management Certification is top-notch. It helped me implement sustainable practices at my facility, significantly reducing our monthly overheads."),
        ("Vikrant Singh – Delhi", "Very comprehensive! The instructors clearly understand industry standards. This certification added immense value to my professional profile."),
        ("Priya Menon – Kochi, Kerala", "I learned so much about energy auditing and optimization. The practical case studies made complex topics very easy to grasp and apply.")
    ],
    "certified-commercial-contracts-manager.html": [
        ("Suresh Nair – Hyderabad, Telangana", "A must-do for anyone handling corporate contracts. The course clarified complex legal jargon and taught me how to draft watertight agreements."),
        ("Neha Gupta – Gurugram, Haryana", "The real-world scenarios discussed in the Certified Commercial Contracts Manager course prepared me for actual negotiations. Brilliant content!"),
        ("Arun Desai – Ahmedabad, Gujarat", "This training boosted my confidence in contract administration. I can now identify risks and manage vendor compliance with ease.")
    ],
    "advanced-civil-execution.html": [
        ("Manoj Kumar – Jaipur, Rajasthan", "Advanced Civil Execution covers everything a site engineer needs. The modern techniques discussed have already saved us time on our current project."),
        ("Pooja Sharma – Chandigarh", "The depth of knowledge provided is fantastic. From foundation work to finishing, the structured approach of this course is highly practical."),
        ("Ravi Teja – Visakhapatnam, Andhra Pradesh", "This course is a game-changer. It taught me advanced methodologies that I was able to immediately implement on my construction site.")
    ],
    "projects-in-controlled-environments.html": [
        ("Amitabh Bose – Kolkata, West Bengal", "Learning about controlled environments was fascinating. The framework provided is robust and highly adaptable to various IT projects."),
        ("Divya Patel – Surat, Gujarat", "A highly structured and well-delivered course. I now have a clear understanding of how to manage project phases effectively with minimal risks."),
        ("Farhan Ali – Lucknow, Uttar Pradesh", "The training gave me the exact tools I needed to control project scopes and deliverables. The templates provided are incredibly useful.")
    ],
    "contract-and-claims-management.html": [
        ("Sanjay Reddy – Hyderabad, Telangana", "Dealing with construction claims used to be a nightmare. This course broke down the process logically and taught me how to mitigate disputes."),
        ("Anita Desai – Mumbai, Maharashtra", "The strategies taught for handling claims and dispute resolution are brilliant. I feel much more secure managing contractor relationships now."),
        ("Rajesh Khanna – Delhi", "Very practical insights into contract law and claims. The real-life examples helped me understand how to protect my company's interests.")
    ],
    "body-language-expert-training.html": [
        ("Kavita Iyer – Chennai, Tamil Nadu", "This training completely changed how I interact in meetings. Being able to read micro-expressions has given me a huge advantage in negotiations."),
        ("Siddharth Mehra – Bengaluru, Karnataka", "Fascinating course! I learned how to project confidence non-verbally, which has significantly improved my executive presence."),
        ("Roshni Sen – Kolkata, West Bengal", "The Body Language Expert Training was an eye-opener. It helped me understand the unspoken dynamics in my team and improve communication.")
    ],
    "relationship-coaching-training.html": [
        ("Meghna Das – Pune, Maharashtra", "The frameworks taught here are profound. I feel fully equipped to start my own relationship coaching practice and guide clients effectively."),
        ("Nitin Agarwal – Noida, Uttar Pradesh", "A deeply empathetic and structured course. It taught me active listening and conflict resolution skills that are invaluable in coaching."),
        ("Geeta Pillai – Thiruvananthapuram, Kerala", "This course exceeded my expectations. The practical coaching exercises helped me build the confidence to handle complex interpersonal dynamics.")
    ],
    "-ai-productivity-power-up.html": [
        ("Tariq Khan – Hyderabad, Telangana", "AI Productivity Power-Up is exactly what I needed. I’ve automated half of my daily repetitive tasks thanks to the tools introduced here!"),
        ("Shweta Singh – Gurugram, Haryana", "Incredible value! This course demystified AI for me. I am now using prompt engineering to write reports in a fraction of the time."),
        ("Pranav Joshi – Ahmedabad, Gujarat", "A highly relevant course for today's digital age. It transformed how my team approaches problem-solving and daily workflow management.")
    ],
    "resilience-coach-training.html": [
        ("Ankita Roy – Kolkata, West Bengal", "The psychological frameworks provided in this course are powerful. I feel ready to help my clients navigate stress and bounce back from setbacks."),
        ("Deepak Chawla – Delhi", "Resilience Coach Training provided me with practical exercises that actually work. It’s been a transformative experience for both me and my trainees."),
        ("Shruti Nair – Bengaluru, Karnataka", "An inspiring and well-structured program. I learned how to foster mental toughness and emotional balance, which is so crucial right now.")
    ],
    "personal-branding-strategist-training.html": [
        ("Vishal Mehta – Mumbai, Maharashtra", "This course gave me a clear roadmap to building an authentic personal brand. My LinkedIn engagement has skyrocketed since applying these strategies!"),
        ("Kiran Bedi – Chandigarh", "A masterclass in personal branding. The course taught me how to articulate my unique value proposition and stand out in my industry."),
        ("Arjun Kapoor – Jaipur, Rajasthan", "The Personal Branding Strategist training is fantastic. It covers everything from visual identity to content strategy in a very practical way.")
    ],
    "decision-making-mastery-training.html": [
        ("Sonia Banerjee – Bengaluru, Karnataka", "Decision Making Mastery helped me overcome analysis paralysis. I now use the frameworks taught to make quick, data-driven decisions confidently."),
        ("Rahul Chatterjee – Kolkata, West Bengal", "A brilliant course for leaders. It taught me how to evaluate risks objectively and align decisions with long-term strategic goals."),
        ("Neha Wadhwa – Pune, Maharashtra", "The training was highly interactive and thought-provoking. The cognitive bias modules were particularly eye-opening for me.")
    ],
    "the-everyday-ai-toolkit.html": [
        ("Vivek Sharma – Delhi", "The Everyday AI Toolkit is perfect for beginners and professionals alike. It introduced me to practical AI apps that save me hours every week."),
        ("Anjali Gupta – Lucknow, Uttar Pradesh", "I loved how practical this course was! I started using the AI tools on day one to streamline my content creation and email management."),
        ("Gaurav Singh – Surat, Gujarat", "A very accessible and useful course. It cuts through the hype and shows you exactly how to use AI for everyday productivity.")
    ],
    "motivational-speaker-training.html": [
        ("Prakash Raj – Hyderabad, Telangana", "This training helped me find my voice. The modules on storytelling and stage presence gave me the confidence to deliver impactful keynote speeches."),
        ("Sunita Reddy – Visakhapatnam, Andhra Pradesh", "Motivational Speaker Training is phenomenal! The instructor’s feedback helped me refine my delivery and connect emotionally with my audience."),
        ("Tarun K. – Chennai, Tamil Nadu", "A highly empowering course. I learned how to structure my speeches to inspire action. I just booked my first major speaking gig!")
    ],
    "mindset-mastery-training.html": [
        ("Alia Bhatt – Mumbai, Maharashtra", "Mindset Mastery completely shifted my perspective. The exercises helped me break limiting beliefs and approach challenges with a growth mindset."),
        ("Sameer Verma – Gurugram, Haryana", "An incredibly powerful course. It taught me how to reframe negative thoughts and maintain focus and positivity in high-stress situations."),
        ("Divya Menon – Kochi, Kerala", "This course is life-changing. The daily practices suggested have significantly improved my mental clarity and overall well-being.")
    ],
    "adaptive-leadership-training.html": [
        ("Vikram Rao – Hyderabad, Telangana", "This course helped me develop flexibility and resilience in leadership. I now feel confident guiding my team through change and uncertainty with clarity and purpose."),
        ("Meera Sharma – Delhi", "Adaptive Leadership Training taught me practical strategies to handle challenging situations and lead with empathy. It has truly enhanced my decision-making and team collaboration skills."),
        ("Aarav Patel – Ahmedabad, Gujarat", "I gained valuable insights into adaptive leadership frameworks and emotional intelligence. The course empowered me to inspire my team and navigate complex workplace scenarios effectively.")
    ],
    "confidence-and-charisma-training.html": [
        ("Aisha Khan – Lucknow, Uttar Pradesh", "This course completely changed how I view myself. I finally feel confident in meetings and presentations! The practical exercises were a game changer."),
        ("Rohan Patel – Ahmedabad, Gujarat", "This course helped me transform the way I present myself. I learned how to communicate with energy and authenticity, and people have started noticing the difference."),
        ("Ananya Iyer – Bengaluru, Karnataka", "The training was engaging and full of practical insights. It taught me how to carry myself with poise and connect with others more naturally. I now feel more comfortable networking.")
    ],
    "self-confidence-building-training.html": [
        ("Priyanka Das – Kolkata, West Bengal", "The Self-Confidence Building Training was exactly what I needed to step out of my comfort zone. The actionable steps provided are easy to follow and highly effective."),
        ("Manish Tiwari – Bhopal, Madhya Pradesh", "A fantastic course! It helped me identify my self-sabotaging patterns and replace them with empowering habits. I feel like a new person."),
        ("Sneha Reddy – Bengaluru, Karnataka", "This program gave me the tools to assert myself professionally. The guided reflections and role-playing scenarios were incredibly helpful.")
    ]
}

def update_reviews():
    for filename, reviews in courses_reviews.items():
        filepath = os.path.join('/Users/devendrakumar/isn', filename)
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r') as f:
            content = f.read()

        reviews_html = f'''
<h2>Learner Reviews &amp; Feedback </h2>
<p>Hear from professionals who’ve experienced growth through our courses. Their feedback reflects the impact of I-SUCESSNODE’s practical learning approach and personalized guidance.</p>
<h3>{reviews[0][0]}</h3>
<p>"{reviews[0][1]}"</p>
<h3>{reviews[1][0]}</h3>
<p>"{reviews[1][1]}"</p>
<h3>{reviews[2][0]}</h3>
<p>"{reviews[2][1]}"</p>
'''
        
        # Check if Learner Reviews already exist
        if '<h2>Learner Reviews' in content or '<h2>Learner Reviews &amp; Feedback' in content:
            # Replace from Learner reviews up to the end of the about-course div
            # The regex will match <h2>Learner Reviews... up to the first </div>
            new_content = re.sub(r'<h2[^>]*>Learner Reviews.*?</div>', reviews_html + '\n  </div>', content, flags=re.IGNORECASE | re.DOTALL)
        else:
            # Append to the end of about-course div
            new_content = content.replace('  </div>\n  \n  <div class="info-boxes">', reviews_html + '\n  </div>\n  \n  <div class="info-boxes">')
            
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated reviews for {filename}")
        else:
            print(f"Could not update {filename} (pattern not found)")

if __name__ == "__main__":
    update_reviews()
