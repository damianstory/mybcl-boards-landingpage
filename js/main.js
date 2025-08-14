/**
 * myBlueprint Career Launch - Main Application Orchestrator
 * Coordinates component initialization and global event handling
 */

class CareerLaunchApp {
    constructor() {
        this.validator = new FormValidator();
        
        // Component instances
        this.heroCarousel = null;
        this.heroForm = null;
        this.bentoGrid = null;
        this.footer = null;
        
        // Global configuration
        this.zohoConfig = {
            endpoint: process.env.ZOHO_ENDPOINT || 'https://api.zoho.com/crm/v2/Leads',
            authToken: process.env.ZOHO_AUTH_TOKEN || '',
            timeout: 10000
        };

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }

        // Setup error handling
        window.addEventListener('error', (event) => this.handleGlobalError(event));
        window.addEventListener('unhandledrejection', (event) => this.handlePromiseRejection(event));
    }

    /**
     * Setup all components and event listeners
     */
    setupEventListeners() {
        // Initialize all components
        this.initializeComponents();
        
        // Setup global keyboard navigation
        this.setupKeyboardNavigation();
        
        // Performance monitoring
        this.trackPerformance();
    }
    
    /**
     * Initialize all components
     */
    initializeComponents() {
        try {
            // Initialize Hero Carousel
            this.heroCarousel = new HeroCarousel();
            console.log('Hero Carousel initialized:', this.heroCarousel.getState());
        } catch (error) {
            console.error('Hero Carousel initialization failed:', error);
        }
        
        try {
            // Initialize Hero Form
            this.heroForm = new HeroForm(this.validator, this.zohoConfig);
            console.log('Hero Form initialized:', this.heroForm.getState());
        } catch (error) {
            console.error('Hero Form initialization failed:', error);
        }
        
        try {
            // Initialize Bento Grid
            this.bentoGrid = new BentoGrid();
            console.log('Bento Grid initialized:', this.bentoGrid.getState());
        } catch (error) {
            console.error('Bento Grid initialization failed:', error);
        }
        
        try {
            // Initialize Footer
            this.footer = new Footer();
            console.log('Footer initialized:', this.footer.getState());
        } catch (error) {
            console.error('Footer initialization failed:', error);
        }
    }

    /**
     * Get application state (for debugging and monitoring)
     */
    getApplicationState() {
        return {
            heroCarousel: this.heroCarousel?.getState(),
            heroForm: this.heroForm?.getState(),
            bentoGrid: this.bentoGrid?.getState(),
            footer: this.footer?.getState(),
            validator: !!this.validator,
            zohoConfig: {
                hasEndpoint: !!this.zohoConfig.endpoint,
                hasAuthToken: !!this.zohoConfig.authToken,
                timeout: this.zohoConfig.timeout
            }
        };
    }

    /**
     * Destroy all components (cleanup)
     */
    destroy() {
        try {
            if (this.heroCarousel) {
                this.heroCarousel.destroy();
            }
        } catch (error) {
            console.warn('Error destroying Hero Carousel:', error);
        }
        
        try {
            if (this.heroForm) {
                this.heroForm.destroy();
            }
        } catch (error) {
            console.warn('Error destroying Hero Form:', error);
        }
        
        try {
            if (this.bentoGrid) {
                this.bentoGrid.destroy();
            }
        } catch (error) {
            console.warn('Error destroying Bento Grid:', error);
        }
        
        try {
            if (this.footer) {
                this.footer.destroy();
            }
        } catch (error) {
            console.warn('Error destroying Footer:', error);
        }
        
        // Clear references
        this.heroCarousel = null;
        this.heroForm = null;
        this.bentoGrid = null;
        this.footer = null;
        this.validator = null;
    }

    /**
     * Setup global keyboard navigation
     */
    setupKeyboardNavigation() {
        // Escape key for global actions
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Clear form messages if any are shown
                if (this.heroForm) {
                    this.heroForm.clearMessages();
                }
                
                // Show footer if hidden on mobile
                if (this.footer && window.innerWidth <= 767) {
                    this.footer.forceShow();
                }
            }
        });

        // Setup global tab order
        this.setupGlobalTabOrder();
    }
    
    /**
     * Setup global tab order for main interactive elements
     */
    setupGlobalTabOrder() {
        const mainFocusableElements = [
            document.querySelector('#email'),
            document.querySelector('.cta-button'),
            document.querySelector('.footer-link')
        ].filter(el => el !== null);

        mainFocusableElements.forEach((element, index) => {
            element.setAttribute('tabindex', '0');
        });
    }

    /**
     * Track performance metrics
     */
    trackPerformance() {
        // Track page load performance
        window.addEventListener('load', () => {
            try {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                if (loadTime > 2000) { // Alert if load time > 2s
                    console.warn(`Page load time: ${loadTime}ms (target: <2000ms)`);
                }

            } catch (error) {
                console.warn('Performance tracking failed:', error);
            }
        });
    }

    /**
     * Handle global errors
     * @param {ErrorEvent} event - Error event
     */
    handleGlobalError(event) {
        console.error('Global application error:', event.error);
        
        // Log component states for debugging
        console.log('Application state at error:', this.getApplicationState());
        
        // Attempt to recover or provide feedback
        try {
            if (event.error?.message?.includes('component')) {
                console.warn('Component error detected, attempting graceful degradation');
            }
        } catch (recoveryError) {
            console.error('Error recovery failed:', recoveryError);
        }
    }

    /**
     * Handle unhandled promise rejections
     * @param {PromiseRejectionEvent} event - Promise rejection event
     */
    handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        console.log('Application state at rejection:', this.getApplicationState());
        event.preventDefault();
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for required browser features
    if (typeof fetch === 'undefined' || typeof Promise === 'undefined') {
        console.error('Browser not supported: Missing required features');
        
        const messagesElement = document.getElementById('form-messages');
        if (messagesElement) {
            messagesElement.className = 'form-messages error show';
            messagesElement.textContent = 'Your browser is not supported. Please update to a modern browser.';
        }
        return;
    }

    // Initialize main application with all components
    try {
        const app = new CareerLaunchApp();
        
        // Make app available globally for debugging
        window.careerLaunchApp = app;
        
        console.log('🚀 myBlueprint Career Launch initialized successfully');
        console.log('Application state:', app.getApplicationState());
        
    } catch (error) {
        console.error('Failed to initialize Career Launch application:', error);
        
        // Fallback: try to initialize basic carousel at least
        try {
            new HeroCarousel();
            console.log('Fallback: Hero carousel initialized independently');
        } catch (fallbackError) {
            console.error('Complete initialization failure:', fallbackError);
        }
    }
});