# myBlueprint Career Launch Landing Page

## Project Overview
Single-page, mobile-responsive landing page for the "myBlueprint Career Launch" virtual career fair event (December 2nd). Primary goal: email capture for agenda release notifications. Target audience: school board leads and high school educators.

## Key Reference Documents
- **@prd.md**: Complete Product Requirements Document with business objectives, user stories, and technical requirements
- **@design-specs.md**: Detailed design specifications including exact measurements, colors, typography scales, component specs, and responsive breakpoints

Always reference these documents for detailed specifications, measurements, and requirements.

## Technology Stack
- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **Deployment**: Cloud Code platform
- **Form Integration**: Zoho API for email capture
- **Typography**: Museo Sans (primary), Open Sans (fallback)
- **Images**: WebP with JPG fallbacks, optimized for performance

## Key Commands
- `npm run build`: Build and optimize for production
- `npm run dev`: Start local development server
- `npm run test`: Run form validation tests
- `npm start`: Start the application locally

## Brand Guidelines (CRITICAL)
- **Colors**: Use ONLY myBlueprint brand colors from style guide
  - Primary Blue: #0092FF
  - Navy: #22224C  
  - Light Blue: #C6E7FF
  - Off White: #F6F6FF
  - Neutrals: #E5E9F1, #D9DFEA, #AAB7CB, #65738B, #485163, #252A33
- **Typography**: Museo Sans (900/700/500/300 weights), Open Sans fallback
- **Logo**: Use proper myBlueprint logo, never distort or alter colors
- **Contrast**: Maintain WCAG AA compliance (minimum 4.5:1 ratio)

## Code Style Requirements
- Use modern ES6+ JavaScript (import/export syntax)
- CSS Grid and Flexbox for layouts (no CSS frameworks)
- Mobile-first responsive design approach
- Semantic HTML5 elements with proper ARIA labels
- BEM methodology for CSS class naming
- No external dependencies beyond font loading and form API

## Performance Requirements
- Target <2s load time on mobile
- Optimize all images (WebP format preferred)
- Inline critical CSS in `<head>`
- Use `font-display: swap` for custom fonts
- Implement lazy loading for non-critical assets

## Form Integration Specs
- Single email input field with validation
- Integrate with Zoho API (credentials will be provided)
- Client-side validation: email format, required field
- Server-side validation and error handling
- Success state with confirmation message
- Loading states during submission
- NEVER use localStorage or sessionStorage (not supported in Claude.ai environment)

## Layout Structure
- Full-screen background image with dark overlay
- Centered vertical content container (max-width: 600px)
- Logo positioned top-left
- Hero headline, date, student count, supporting text
- Email capture form with prominent CTA button
- Single page, no scrolling required

## Content Specifications
- **Event Name**: "myBlueprint Career Launch"
- **Event Date**: "December 2nd" (prominent display)
- **Key Stat**: "50,000+ students attending" 
- **CTA**: "Get Notified When Agenda is Released" or similar
- **Tone**: Professional, innovative, urgent (FOMO)

## Responsive Breakpoints
```css
Mobile: 320px - 767px
Tablet: 768px - 1023px  
Desktop: 1024px+
Large: 1440px+
```

## Accessibility Requirements
- Semantic HTML structure with proper headings hierarchy
- Form labels properly associated with inputs
- Keyboard navigation support (tab order: logo → email → submit)
- Focus indicators on all interactive elements
- Alt text for all images including logo
- Color contrast minimum 4.5:1 for normal text, 3:1 for large text

## File Structure
```
/
├── index.html          # Main landing page
├── styles/
│   ├── main.css        # Main styles
│   └── responsive.css  # Media queries
├── js/
│   ├── main.js         # Form handling and interactions
│   └── validation.js   # Form validation logic
├── images/
│   ├── logo.svg        # myBlueprint logo
│   ├── bg-hero.webp    # Background image
│   └── bg-hero.jpg     # Background fallback
└── fonts/              # Museo Sans font files
```

## Development Notes
- Test form submission thoroughly before deployment
- Verify brand compliance against provided style guide
- Check performance with PageSpeed Insights
- Test across browsers: Chrome, Safari, Firefox, Edge
- Validate HTML and check accessibility with tools
- Ensure mobile touch targets are minimum 44px
- Background image should feature diverse professionals in career settings

## Deployment Checklist
- [ ] Form API integration tested and working
- [ ] All images optimized and compressed
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Brand guidelines compliance confirmed
- [ ] Performance targets met (<2s load time)
- [ ] Accessibility validation passed
- [ ] Meta tags and favicon implemented

## Important Constraints
- NO external CSS/JS frameworks (Bootstrap, Tailwind, jQuery, etc.)
- NO localStorage/sessionStorage usage
- NO complex animations that impact performance
- MUST maintain exact brand colors and typography
- MUST be fully functional without JavaScript as fallback
- MUST work on all modern browsers and mobile devices

## Success Metrics
- Primary: Email conversion rate >25%
- Secondary: Page load time <2s on mobile
- Accessibility: WCAG AA compliant
- Performance: 90+ PageSpeed score