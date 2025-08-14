/**
 * Footer Component
 * Handles footer interactions, responsive behavior, and analytics
 */
class Footer {
    constructor() {
        this.footer = document.querySelector('.footer-bar');
        this.footerContent = document.querySelector('.footer-content');
        this.footerLinks = document.querySelectorAll('.footer-link');
        this.lastScrollY = window.scrollY;
        this.isHidden = false;
        
        this.init();
    }
    
    init() {
        if (!this.footer) {
            console.warn('Footer: Footer element not found');
            return false;
        }
        
        // Setup link interactions
        this.setupLinkTracking();
        
        // Setup responsive behavior
        this.setupResponsiveBehavior();
        
        // Setup accessibility enhancements
        this.setupAccessibility();
        
        // Setup email link functionality
        this.setupEmailLink();
        
        return true;
    }
    
    setupLinkTracking() {
        this.footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const linkText = link.textContent.trim();
                const linkHref = link.href;
                
                // Track link clicks for analytics
                this.trackLinkClick(linkText, linkHref);
                
                // Handle email links specially
                if (linkHref.startsWith('mailto:')) {
                    this.handleEmailClick(e, linkHref);
                }
                
                // Handle external links
                if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
                    this.handleExternalLink(e, linkHref);
                }
            });
            
            // Add keyboard navigation support
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }
    
    setupResponsiveBehavior() {
        // Handle footer layout on different screen sizes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.adjustFooterLayout();
            }, 150);
        });
        
        // Initial layout adjustment
        this.adjustFooterLayout();
        
        // Setup scroll behavior for mobile (optional auto-hide)
        if (window.innerWidth <= 767) {
            this.setupMobileScrollBehavior();
        }
    }
    
    adjustFooterLayout() {
        if (!this.footerContent) return;
        
        const screenWidth = window.innerWidth;
        
        // Adjust footer content layout based on screen size
        if (screenWidth <= 480) {
            // Very small screens: Stack vertically
            this.footerContent.style.flexDirection = 'column';
            this.footerContent.style.gap = '4px';
            this.footer.style.padding = '8px 0';
        } else if (screenWidth <= 767) {
            // Mobile: Wrap but keep horizontal
            this.footerContent.style.flexDirection = 'row';
            this.footerContent.style.flexWrap = 'wrap';
            this.footerContent.style.gap = '2px';
            this.footer.style.padding = '12px 0';
        } else {
            // Tablet and desktop: Single line
            this.footerContent.style.flexDirection = 'row';
            this.footerContent.style.flexWrap = 'nowrap';
            this.footerContent.style.gap = 'normal';
            this.footer.style.padding = '12px 0';
        }
    }
    
    setupMobileScrollBehavior() {
        // Optional: Hide footer on scroll down, show on scroll up (mobile only)
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const scrollDifference = currentScrollY - this.lastScrollY;
                
                // Only hide/show if scrolled a significant amount
                if (Math.abs(scrollDifference) > 10) {
                    if (scrollDifference > 0 && currentScrollY > 100) {
                        // Scrolling down - hide footer
                        this.hideFooter();
                    } else {
                        // Scrolling up - show footer
                        this.showFooter();
                    }
                }
                
                this.lastScrollY = currentScrollY;
            }, 100);
        }, { passive: true });
    }
    
    setupAccessibility() {
        // Enhance accessibility for footer links
        this.footerLinks.forEach((link, index) => {
            // Add descriptive aria-labels
            if (link.href.startsWith('mailto:')) {
                link.setAttribute('aria-label', `Send email to ${link.textContent.trim()}`);
            } else if (link.href.includes('myblueprint.ca')) {
                link.setAttribute('aria-label', 'Visit myBlueprint website (opens in new tab)');
            }
            
            // Ensure proper tab order
            link.setAttribute('tabindex', '0');
        });
        
        // Add landmark role to footer
        this.footer.setAttribute('role', 'contentinfo');
        this.footer.setAttribute('aria-label', 'Site footer with contact information');
    }
    
    setupEmailLink() {
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.addEventListener('click', (e) => {
                // Track email interactions
                this.trackEmailInteraction(emailLink.href);
                
                // Add subtle visual feedback
                emailLink.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    emailLink.style.transform = '';
                }, 150);
            });
        }
    }
    
    hideFooter() {
        if (!this.isHidden) {
            this.footer.style.transform = 'translateY(100%)';
            this.footer.style.transition = 'transform 0.3s ease-in-out';
            this.isHidden = true;
        }
    }
    
    showFooter() {
        if (this.isHidden) {
            this.footer.style.transform = 'translateY(0)';
            this.footer.style.transition = 'transform 0.3s ease-in-out';
            this.isHidden = false;
        }
    }
    
    trackLinkClick(linkText, linkHref) {
        try {
            const trackingData = {
                event: 'footer_link_click',
                link_text: linkText,
                link_url: linkHref,
                timestamp: new Date().toISOString(),
                page: 'career_launch_landing'
            };
            
            console.log('Footer: Link click tracked:', trackingData);
            
            // Could integrate with analytics service here
            // gtag('event', 'click', trackingData);
            
        } catch (error) {
            console.warn('Footer: Link tracking failed:', error);
        }
    }
    
    trackEmailInteraction(emailHref) {
        try {
            const trackingData = {
                event: 'email_contact_attempt',
                email: emailHref.replace('mailto:', ''),
                timestamp: new Date().toISOString(),
                source: 'footer'
            };
            
            console.log('Footer: Email interaction tracked:', trackingData);
            
        } catch (error) {
            console.warn('Footer: Email tracking failed:', error);
        }
    }
    
    handleEmailClick(event, emailHref) {
        // Check if email client is available
        const email = emailHref.replace('mailto:', '');
        
        // For mobile devices, ensure proper email handling
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            // Mobile device - email link should work natively
            console.log('Footer: Opening email client on mobile device');
        } else {
            // Desktop - might want to provide fallback or copy option
            console.log('Footer: Opening email client on desktop');
        }
    }
    
    handleExternalLink(event, linkHref) {
        // Add analytics tracking for external links
        this.trackExternalLink(linkHref);
        
        // Optional: Add confirmation for external links
        if (linkHref.includes('myblueprint.ca')) {
            console.log('Footer: Navigating to myBlueprint website');
        }
    }
    
    trackExternalLink(linkHref) {
        try {
            const trackingData = {
                event: 'external_link_click',
                destination: linkHref,
                timestamp: new Date().toISOString(),
                source: 'footer'
            };
            
            console.log('Footer: External link tracked:', trackingData);
            
        } catch (error) {
            console.warn('Footer: External link tracking failed:', error);
        }
    }
    
    // Public method to get footer state
    getState() {
        return {
            isInitialized: !!this.footer,
            isHidden: this.isHidden,
            linkCount: this.footerLinks.length,
            isFixed: this.footer ? this.footer.style.position === 'fixed' : false,
            currentLayout: window.innerWidth <= 480 ? 'stacked' : 
                          window.innerWidth <= 767 ? 'wrapped' : 'single-line'
        };
    }
    
    // Public method to force show footer
    forceShow() {
        this.showFooter();
    }
    
    // Public method to update footer content
    updateContent(newContent) {
        if (this.footerContent && newContent) {
            this.footerContent.innerHTML = newContent;
            // Re-setup after content change
            this.footerLinks = document.querySelectorAll('.footer-link');
            this.setupLinkTracking();
            this.setupAccessibility();
        }
    }
    
    // Public method to destroy component
    destroy() {
        // Remove event listeners
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Clear references
        this.footer = null;
        this.footerContent = null;
        this.footerLinks = null;
    }
}

// Export for ES6 modules and global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
} else {
    window.Footer = Footer;
}