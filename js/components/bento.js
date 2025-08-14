/**
 * Bento Grid Component
 * Handles video loading, accessibility, and responsive interactions
 */
class BentoGrid {
    constructor() {
        this.bentoGrid = document.querySelector('.bento-grid');
        this.videoCard = document.querySelector('.bento-card-video');
        this.iframe = document.querySelector('.video-container iframe');
        this.eventCards = document.querySelectorAll('.event-details-card');
        this.isVideoLoaded = false;
        
        this.init();
    }
    
    init() {
        if (!this.bentoGrid) {
            console.warn('Bento Grid: Container not found');
            return false;
        }
        
        // Setup lazy video loading
        this.setupLazyVideoLoading();
        
        // Setup accessibility features
        this.setupAccessibility();
        
        // Setup responsive interactions
        this.setupResponsiveInteractions();
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
        
        return true;
    }
    
    setupLazyVideoLoading() {
        if (!this.iframe) return;
        
        // Set up intersection observer for video loading
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVideoLoaded) {
                    this.loadVideo();
                    videoObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        if (this.videoCard) {
            videoObserver.observe(this.videoCard);
        }
    }
    
    loadVideo() {
        if (!this.iframe || this.isVideoLoaded) return;
        
        // Add loading attribute if not already present
        if (!this.iframe.hasAttribute('loading')) {
            this.iframe.setAttribute('loading', 'lazy');
        }
        
        // Enhance video accessibility
        this.iframe.setAttribute('title', 'OECD Career Fair Value Video');
        
        this.isVideoLoaded = true;
        console.log('Bento Grid: Video loaded successfully');
    }
    
    setupAccessibility() {
        // Enhance keyboard navigation for cards
        const allCards = document.querySelectorAll('.bento-card');
        
        allCards.forEach((card, index) => {
            // Make cards focusable if they contain interactive content
            if (card.querySelector('iframe') || card.querySelector('button') || card.querySelector('a')) {
                card.setAttribute('tabindex', '0');
                
                // Add keyboard interaction for card focus
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        const interactive = card.querySelector('iframe, button, a');
                        if (interactive) {
                            e.preventDefault();
                            interactive.focus();
                        }
                    }
                });
            }
            
            // Enhance ARIA labels for screen readers
            if (card.classList.contains('event-details-card')) {
                card.setAttribute('aria-label', 'Event details and information card');
            } else if (card.classList.contains('bento-card-video')) {
                card.setAttribute('aria-label', 'Educational video about career fairs');
            }
        });
        
        // Enhance icon accessibility
        const icons = document.querySelectorAll('.event-detail-icon svg');
        icons.forEach(icon => {
            icon.setAttribute('role', 'img');
            icon.setAttribute('focusable', 'false');
        });
    }
    
    setupResponsiveInteractions() {
        // Add touch-friendly interactions for mobile
        if ('ontouchstart' in window) {
            const cards = document.querySelectorAll('.bento-card');
            
            cards.forEach(card => {
                // Add subtle touch feedback
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'scale(0.98)';
                }, { passive: true });
                
                card.addEventListener('touchend', () => {
                    card.style.transform = '';
                }, { passive: true });
                
                card.addEventListener('touchcancel', () => {
                    card.style.transform = '';
                }, { passive: true });
            });
        }
        
        // Setup responsive layout adjustments
        this.handleResponsiveLayout();
        
        // Listen for window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResponsiveLayout();
            }, 150);
        });
    }
    
    handleResponsiveLayout() {
        if (!this.bentoGrid) return;
        
        const screenWidth = window.innerWidth;
        
        // Adjust grid layout based on screen size
        if (screenWidth < 768) {
            // Mobile: Single column
            this.bentoGrid.style.gridTemplateColumns = '1fr';
        } else if (screenWidth < 850) {
            // Tablet narrow: Single column to prevent squeeze
            this.bentoGrid.style.gridTemplateColumns = '1fr';
        } else {
            // Tablet wide and desktop: Two columns
            this.bentoGrid.style.gridTemplateColumns = '1fr 1fr';
        }
    }
    
    setupIntersectionObserver() {
        // Setup animation observer for cards
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animation for multiple cards
                    const delay = Array.from(this.bentoGrid.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.animationDelay = `${delay}ms`;
                    }, delay);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all bento cards
        const cards = document.querySelectorAll('.bento-card');
        cards.forEach(card => {
            animationObserver.observe(card);
        });
    }
    
    // Public method to refresh video
    refreshVideo() {
        if (this.iframe) {
            const src = this.iframe.src;
            this.iframe.src = '';
            setTimeout(() => {
                this.iframe.src = src;
            }, 100);
        }
    }
    
    // Public method to get component state
    getState() {
        return {
            isInitialized: !!this.bentoGrid,
            isVideoLoaded: this.isVideoLoaded,
            cardCount: this.eventCards.length,
            hasVideo: !!this.iframe,
            currentLayout: window.innerWidth < 768 ? 'mobile' : 
                          window.innerWidth < 850 ? 'tablet-narrow' : 'desktop'
        };
    }
    
    // Public method to update video accessibility
    enhanceVideoAccessibility(title, description) {
        if (this.iframe) {
            if (title) {
                this.iframe.setAttribute('title', title);
            }
            if (description) {
                this.iframe.setAttribute('aria-describedby', description);
            }
        }
    }
    
    // Public method to add custom event handlers
    addEventHandler(selector, event, handler) {
        const elements = this.bentoGrid.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener(event, handler);
        });
    }
    
    // Public method to destroy component
    destroy() {
        // Remove event listeners and observers
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        if (this.videoObserver) {
            this.videoObserver.disconnect();
        }
        
        // Clear any timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Clear references
        this.bentoGrid = null;
        this.videoCard = null;
        this.iframe = null;
        this.eventCards = null;
    }
}

// Export for ES6 modules and global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BentoGrid;
} else {
    window.BentoGrid = BentoGrid;
}