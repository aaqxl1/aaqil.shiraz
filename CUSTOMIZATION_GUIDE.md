# 🎨 Customization Guide

This guide will help you quickly personalize your portfolio website with your own information.

## 📝 Essential Updates

### 1. Personal Information (index.html)

**Line 8**: Update the page title
```html
<title>Your Name - Portfolio</title>
```

**Line 19**: Update navigation logo
```html
<span class="logo-text">YourName</span>
```

**Line 32**: Update your name in the hero section
```html
Hi, I'm <span class="highlight">Your Full Name</span>
```

**Line 126**: Update footer copyright
```html
<p>&copy; 2024 Your Full Name. All rights reserved.</p>
```

### 2. Contact Information (index.html)

**Lines 428-438**: Update contact details
```html
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <span>your.email@example.com</span>
</div>
<div class="contact-item">
    <i class="fas fa-phone"></i>
    <span>+1 (555) 123-4567</span>
</div>
<div class="contact-item">
    <i class="fas fa-map-marker-alt"></i>
    <span>Your City, Country</span>
</div>
```

**Lines 440-456**: Update social media links
```html
<a href="https://linkedin.com/in/yourprofile" class="social-link">
    <i class="fab fa-linkedin"></i>
</a>
<a href="https://github.com/yourusername" class="social-link">
    <i class="fab fa-github"></i>
</a>
<!-- Add your actual profile URLs -->
```

### 3. Professional Titles (script.js)

**Lines 87-92**: Update the typing animation texts
```javascript
const texts = [
    'Your Professional Title',
    'Your Specialty',
    'Your Expertise',
    'Your Passion'
];
```

### 4. Skills Section (index.html)

**Lines 185-206**: Update your technical skills and percentages
```html
<div class="skill-item">
    <span class="skill-name">Your Skill</span>
    <div class="skill-bar">
        <div class="skill-progress" data-width="85%"></div>
    </div>
</div>
```

**Lines 210-237**: Update technology icons with your stack
```html
<div class="tech-item">
    <i class="fab fa-your-icon"></i>
    <span>Your Technology</span>
</div>
```

### 5. Projects Section (index.html)

**Lines 248-344**: Replace the three project cards with your actual projects

For each project, update:
- Project title
- Project description
- Technology tags
- Project links (href="#" should point to live demo or GitHub)

Example:
```html
<div class="project-card">
    <div class="project-image">
        <!-- Add actual project image here -->
        <div class="project-overlay">
            <a href="https://your-project-demo.com" class="project-link">
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Name</h3>
        <p class="project-description">
            Your project description explaining what it does and the problem it solves.
        </p>
        <div class="project-tags">
            <span class="tag">Technology 1</span>
            <span class="tag">Technology 2</span>
        </div>
    </div>
</div>
```

### 6. About Section Statistics (index.html)

**Lines 146-158**: Update your statistics
```html
<div class="stat">
    <span class="stat-number" data-target="25">0</span>
    <span class="stat-label">Projects Completed</span>
</div>
<div class="stat">
    <span class="stat-number" data-target="2">0</span>
    <span class="stat-label">Years Experience</span>
</div>
<div class="stat">
    <span class="stat-number" data-target="50">0</span>
    <span class="stat-label">Happy Clients</span>
</div>
```

### 7. About Section Text (index.html)

**Lines 136-144**: Update your personal description
```html
<p>
    Write about yourself, your background, and what drives you professionally.
</p>
<p>
    Add more details about your experience, goals, and what makes you unique.
</p>
```

## 🖼️ Adding Images

### Profile Photo
Replace the placeholder in the about section (around line 160):
```html
<div class="about-image">
    <img src="your-photo.jpg" alt="Your Name" class="profile-image">
</div>
```

Add this CSS to style.css:
```css
.profile-image {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

### Project Images
Replace the project placeholders with actual screenshots:
```html
<div class="project-image">
    <img src="project1-screenshot.jpg" alt="Project Name">
    <div class="project-overlay">
        <a href="https://your-project.com" class="project-link">
            <i class="fas fa-external-link-alt"></i>
        </a>
    </div>
</div>
```

## 🎨 Color Customization

### Primary Colors (style.css)
Find the gradient definitions and update the colors:

**Main gradient** (appears in multiple places):
```css
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

**Common locations**:
- Line 49: Navigation logo
- Line 97: Hero section background
- Line 298: Section titles
- Line 463: Skill progress bars
- Line 536: Project tags
- Line 606: Social links

### Quick Color Scheme Ideas:
- **Blue to Purple**: `#667eea` to `#764ba2` (current)
- **Pink to Orange**: `#ff9a8b` to `#fecfef`
- **Green to Blue**: `#a8edea` to `#fed6e3`
- **Dark Theme**: `#2c3e50` to `#3498db`

## 📧 Contact Form Setup

### Option 1: Formspree (Recommended)
1. Go to [formspree.io](https://formspree.io)
2. Sign up for free
3. Create a new form
4. Replace the form action in index.html:

```html
<form id="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
```

### Option 2: EmailJS
1. Sign up at [emailjs.com](https://emailjs.com)
2. Follow their integration guide
3. Replace the JavaScript form handling in script.js

## 🚀 Deployment Checklist

Before deploying:
- [ ] Updated all personal information
- [ ] Added real project links
- [ ] Tested contact form
- [ ] Added actual images
- [ ] Updated social media links
- [ ] Customized colors (optional)
- [ ] Tested on mobile devices
- [ ] Verified all links work

## 🔧 Advanced Customizations

### Adding New Sections
To add a new section, follow this pattern:
1. Add navigation link
2. Create section HTML
3. Add corresponding CSS
4. Update JavaScript smooth scrolling

### Performance Optimization
- Compress images before uploading
- Minify CSS and JavaScript for production
- Use WebP format for images when possible

### SEO Improvements
- Add meta description in `<head>`
- Use relevant keywords in content
- Add structured data markup
- Create a sitemap.xml

Need more help? Check the main README.md file for detailed instructions!
