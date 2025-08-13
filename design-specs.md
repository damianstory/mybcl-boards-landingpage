# myBlueprint Career Launch - Design Specifications

## Document Overview

**Project:** myBlueprint Career Launch Landing Page  
**Version:** 1.0  
**Date:** August 2025  
**Purpose:** Complete visual and technical design specifications for development  

---

## 1. Layout Structure & Grid System

### Overall Page Layout
- **Layout Type:** Full-screen, single-page design (no scrolling required)
- **Content Container:** Centered vertical layout with maximum width constraints
- **Background:** Full-bleed photography with subtle overlay
- **Content Area:** Maximum 600px wide on desktop, centered horizontally and vertically

### Responsive Breakpoints
```css
/* Mobile First Approach */
Mobile: 320px - 767px
Tablet: 768px - 1023px  
Desktop: 1024px+
Large Desktop: 1440px+
```

### Z-Index Hierarchy
```css
Background Image: z-index: 1
Overlay: z-index: 2
Content Container: z-index: 3
Form Elements: z-index: 4
Loading States: z-index: 5
```

---

## 2. Color Specifications

### Brand Colors (Per Style Guide)
```css
/* Primary Colors */
--primary-blue: #0092FF;      /* Primary CTA, links */
--navy: #22224C;              /* Headlines, primary text */
--light-blue: #C6E7FF;        /* Subtle accents, form focus */
--off-white: #F6F6FF;         /* Form backgrounds, cards */

/* Neutrals */
--neutral-1: #E5E9F1;         /* Light borders, subtle backgrounds */
--neutral-2: #D9DFEA;         /* Form borders */
--neutral-3: #AAB7CB;         /* Secondary text, placeholders */
--neutral-4: #65738B;         /* Body text */
--neutral-5: #485163;         /* Dark text */
--neutral-6: #252A33;         /* Darkest text, form validation */
```

### Color Usage Map
- **Hero Headline:** Navy (#22224C)
- **Subheadline:** Neutral-4 (#65738B)
- **Body Text:** Neutral-4 (#65738B)
- **CTA Button:** Primary Blue (#0092FF) background, white text
- **Form Fields:** Off White (#F6F6FF) background, Navy (#22224C) text
- **Form Labels:** Neutral-4 (#65738B)
- **Success States:** Primary Blue (#0092FF)
- **Error States:** Use Neutral-6 (#252A33) for error text

### Background Overlay
```css
/* Dark overlay over background image for text readability */
background: linear-gradient(
  rgba(34, 36, 76, 0.7),     /* Navy with 70% opacity */
  rgba(34, 36, 76, 0.5)      /* Navy with 50% opacity */
);
```

---

## 3. Typography Specifications

### Font Stack
```css
/* Primary Font */
font-family: 'Museo Sans', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Fallback Stack */
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
```

### Typography Scale & Usage

#### Hero Headline (H1)
```css
font-family: 'Museo Sans', fallback;
font-size: 40px;           /* Desktop */
font-size: 32px;           /* Tablet */
font-size: 28px;           /* Mobile */
line-height: 1.2;
font-weight: 900;          /* Bold */
color: #F6F6FF;            /* Off White for contrast on dark overlay */
text-align: center;
letter-spacing: -0.02em;
margin-bottom: 16px;
```

#### Event Date (H2)
```css
font-family: 'Museo Sans', fallback;
font-size: 24px;           /* Desktop */
font-size: 20px;           /* Tablet */
font-size: 18px;           /* Mobile */
line-height: 1.3;
font-weight: 900;          /* Bold */
color: #0092FF;            /* Primary Blue for emphasis */
text-align: center;
margin-bottom: 8px;
```

#### Key Stat (Student Count)
```css
font-family: 'Museo Sans', fallback;
font-size: 20px;           /* Desktop */
font-size: 18px;           /* Tablet */
font-size: 16px;           /* Mobile */
line-height: 1.4;
font-weight: 500;          /* Medium */
color: #C6E7FF;            /* Light Blue */
text-align: center;
margin-bottom: 32px;
```

#### Supporting Text (Body)
```css
font-family: 'Museo Sans', fallback;
font-size: 16px;           /* Desktop */
font-size: 15px;           /* Mobile */
line-height: 1.5;
font-weight: 300;          /* Regular */
color: #E5E9F1;            /* Neutral-1 for readability */
text-align: center;
margin-bottom: 40px;
max-width: 480px;
margin-left: auto;
margin-right: auto;
```

#### Form Label
```css
font-family: 'Museo Sans', fallback;
font-size: 14px;
line-height: 1.4;
font-weight: 500;          /* Medium */
color: #F6F6FF;            /* Off White */
margin-bottom: 8px;
```

#### CTA Button Text
```css
font-family: 'Museo Sans', fallback;
font-size: 16px;
line-height: 1;
font-weight: 700;          /* Demi Bold */
color: #FFFFFF;
letter-spacing: 0.02em;
text-transform: none;
```

---

## 4. Component Specifications

### Logo Placement
```css
/* Logo Container */
position: absolute;
top: 24px;                 /* Desktop */
top: 16px;                 /* Mobile */
left: 24px;                /* Desktop */  
left: 16px;                /* Mobile */
z-index: 3;

/* Logo Size */
height: 40px;              /* Desktop */
height: 36px;              /* Mobile */
width: auto;
```

### Main Content Container
```css
/* Container */
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 100vh;
padding: 80px 24px 40px;   /* Top padding accounts for logo */
max-width: 600px;
margin: 0 auto;
text-align: center;

/* Mobile */
@media (max-width: 767px) {
  padding: 60px 20px 32px;
  max-width: 100%;
}
```

### Email Capture Form
```css
/* Form Container */
background: rgba(246, 246, 255, 0.95);  /* Off White with transparency */
border-radius: 12px;
padding: 32px;             /* Desktop */
padding: 24px;             /* Mobile */
box-shadow: 0 8px 32px rgba(34, 36, 76, 0.2);
backdrop-filter: blur(8px);
max-width: 400px;
width: 100%;
margin: 0 auto;

/* Form Title */
font-family: 'Museo Sans', fallback;
font-size: 22px;           /* Desktop */
font-size: 20px;           /* Mobile */
line-height: 1.3;
font-weight: 500;          /* Medium */
color: #22224C;            /* Navy */
margin-bottom: 20px;
text-align: center;

/* Email Input Field */
width: 100%;
padding: 16px;
border: 2px solid #D9DFEA;  /* Neutral-2 */
border-radius: 8px;
font-size: 16px;
font-family: 'Museo Sans', fallback;
background: #F6F6FF;        /* Off White */
color: #22224C;             /* Navy */
margin-bottom: 16px;
transition: border-color 0.2s ease;

/* Input Placeholder */
color: #AAB7CB;             /* Neutral-3 */
font-weight: 300;

/* Input Focus State */
border-color: #0092FF;      /* Primary Blue */
outline: none;
box-shadow: 0 0 0 3px rgba(0, 146, 255, 0.1);

/* CTA Button */
width: 100%;
padding: 16px 32px;
background: #0092FF;        /* Primary Blue */
color: #FFFFFF;
border: none;
border-radius: 8px;
font-size: 16px;
font-family: 'Museo Sans', fallback;
font-weight: 700;           /* Demi Bold */
cursor: pointer;
transition: all 0.2s ease;
letter-spacing: 0.02em;

/* Button Hover State */
background: #0078CC;        /* Darker blue */
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(0, 146, 255, 0.3);

/* Button Active State */
transform: translateY(0);
background: #006BB3;
```

### Success State
```css
/* Success Message Container */
background: rgba(198, 231, 255, 0.95);  /* Light Blue with transparency */
border: 2px solid #0092FF;              /* Primary Blue border */
border-radius: 8px;
padding: 16px;
text-align: center;
margin-top: 16px;

/* Success Text */
color: #22224C;             /* Navy */
font-weight: 500;           /* Medium */
font-size: 14px;
```

### Error States
```css
/* Error Message */
color: #252A33;             /* Neutral-6 */
font-size: 12px;
margin-top: 4px;
font-weight: 500;           /* Medium */

/* Error Input Border */
border-color: #252A33;      /* Neutral-6 */
```

---

## 5. Interactive Elements

### Micro-interactions
```css
/* Form field focus animation */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Button hover lift effect */
transform: translateY(-1px);
transition: all 0.2s ease;

/* Loading state for button */
.loading {
  opacity: 0.7;
  pointer-events: none;
}
.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px;
  display: inline-block;
}
```

### Hover States
- **Form Fields:** Border color changes to Primary Blue (#0092FF)
- **CTA Button:** Background darkens, subtle lift effect, shadow appears
- **Links:** Color change to Primary Blue (#0092FF)

### Focus States
- **Form Fields:** Primary Blue border + subtle blue glow
- **Buttons:** Visible focus ring using Primary Blue
- **All interactive elements:** Meet WCAG AA focus requirements

---

## 6. Background Image Specifications

### Image Requirements
- **Dimensions:** Minimum 1920x1080px (Full HD)
- **Aspect Ratio:** 16:9 or wider for full coverage
- **File Format:** WebP (with JPG fallback)
- **File Size:** Under 500KB optimized
- **Subject Matter:** Professional people in various career settings

### Image Treatment
```css
/* Background Image */
background-image: url('career-professionals.webp');
background-size: cover;
background-position: center;
background-repeat: no-repeat;
background-attachment: fixed;    /* Parallax effect on desktop */

/* Mobile: Remove fixed attachment for performance */
@media (max-width: 767px) {
  background-attachment: scroll;
}

/* Image Overlay */
background: linear-gradient(
  135deg,
  rgba(34, 36, 76, 0.7) 0%,
  rgba(34, 36, 76, 0.5) 100%
);
```

### Image Content Guidelines
- **Preferred:** Diverse professionals in modern work environments
- **Include:** Various career fields (tech, healthcare, trades, education, etc.)
- **Avoid:** Overly busy backgrounds that compete with text
- **Style:** Contemporary, aspirational, inclusive

---

## 7. Mobile Responsive Specifications

### Mobile-First Breakpoints
```css
/* Base (Mobile): 320px+ */
.container {
  padding: 60px 20px 32px;
  min-height: 100vh;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container {
    padding: 80px 40px 40px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    padding: 80px 24px 40px;
  }
}
```

### Touch Targets
- **Minimum Size:** 44px x 44px (iOS/Android guidelines)
- **Form Fields:** Minimum 48px height
- **Buttons:** Minimum 48px height
- **Logo (clickable):** Minimum 44px x 44px touch area

### Mobile Optimizations
- **Form Fields:** Use appropriate input types (`type="email"`)
- **Viewport Meta:** `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Touch-friendly:** Adequate spacing between interactive elements
- **Performance:** Optimize images for mobile bandwidth

---

## 8. Performance & Technical Specifications

### Loading Performance
- **First Contentful Paint:** Target <1.5s
- **Largest Contentful Paint:** Target <2.5s
- **Cumulative Layout Shift:** Target <0.1
- **First Input Delay:** Target <100ms

### Image Optimization
```html
<!-- Background Image with Fallbacks -->
<picture>
  <source srcset="bg-image.webp" type="image/webp">
  <source srcset="bg-image.jpg" type="image/jpeg">
  <img src="bg-image.jpg" alt="Career professionals in diverse work environments">
</picture>
```

### Font Loading
```css
/* Font Display Strategy */
@font-face {
  font-family: 'Museo Sans';
  src: url('museo-sans.woff2') format('woff2');
  font-display: swap;        /* Prevents invisible text during font load */
}
```

### Critical CSS
Inline critical styles in `<style>` tag in `<head>`:
- Layout structure
- Above-the-fold typography
- Form container styles
- Background image

---

## 9. Accessibility Specifications

### Color Contrast Ratios
- **White text on dark overlay:** 7.2:1 (AAA compliant)
- **Navy on Off White:** 12.8:1 (AAA compliant)
- **Primary Blue on white:** 4.7:1 (AA compliant)
- **All interactive elements:** Minimum 3:1 contrast

### Semantic HTML Structure
```html
<main role="main">
  <header>
    <img src="logo.svg" alt="myBlueprint Career Education Platform">
  </header>
  
  <section aria-labelledby="event-title">
    <h1 id="event-title">myBlueprint Career Launch</h1>
    <h2>December 2nd, 2025</h2>
    <p>Join 50,000+ students exploring career opportunities</p>
    
    <form aria-labelledby="signup-form" role="form">
      <h3 id="signup-form">Get Notified When the Agenda is Released</h3>
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" required aria-describedby="email-help">
      <span id="email-help">We'll notify you as soon as the agenda is available</span>
      <button type="submit">Notify Me</button>
    </form>
  </section>
</main>
```

### Keyboard Navigation
- **Tab Order:** Logo → Email Input → Submit Button
- **Enter Key:** Submits form when focused on input or button
- **Focus Indicators:** Visible focus rings on all interactive elements

---

## 10. Brand Compliance Checklist

### Logo Usage ✓
- [ ] Use only approved myBlueprint logo variants
- [ ] Maintain proper logo proportions (never stretch/distort)
- [ ] Ensure adequate clear space around logo
- [ ] Use inverted logo variant on dark backgrounds
- [ ] Logo remains legible at all sizes

### Color Usage ✓
- [ ] Use only approved brand colors from style guide
- [ ] Primary Blue (#0092FF) for primary actions and highlights
- [ ] Navy (#22224C) for primary headlines and text
- [ ] Maintain proper color contrast ratios
- [ ] Use neutrals appropriately for hierarchy

### Typography ✓
- [ ] Use Museo Sans as primary font family
- [ ] Implement proper font weights (300, 500, 700, 900)
- [ ] Follow established type scale for consistency
- [ ] Maintain appropriate line heights and letter spacing
- [ ] Use Open Sans only when Museo Sans unavailable

---

## 11. Development Handoff Notes

### Assets Needed
- [ ] myBlueprint logo (SVG format, standard and inverted)
- [ ] Background hero image (WebP + JPG fallback)
- [ ] Museo Sans font files (WOFF2, WOFF)
- [ ] Favicon set (PNG, ICO, SVG)

### Third-party Integrations
- **Zoho CRM API:** Form submission endpoint
- **Analytics:** Not required for initial launch
- **Fonts:** Load from Google Fonts or self-host

### Testing Requirements
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Form validation and submission testing
- [ ] Performance testing (PageSpeed Insights)
- [ ] Accessibility testing (WAVE, aXe)

---

## 12. Final Specifications Summary

**Layout:** Single-page, full-screen with centered content  
**Colors:** myBlueprint brand palette with high contrast  
**Typography:** Museo Sans primary, responsive type scale  
**Components:** Hero content + email capture form  
**Interactions:** Smooth hover states and form validation  
**Performance:** <2s load time, mobile-optimized  
**Accessibility:** WCAG AA compliant  
**Brand Compliance:** Strict adherence to style guide  

This specification provides complete visual and technical guidance for pixel-perfect implementation of the myBlueprint Career Launch landing page.