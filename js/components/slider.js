/**
 * Hero Carousel Component
 * Handles CSS-based continuous horizontal scrolling with hover controls
 */
class HeroCarousel {
    constructor() {
        this.carousel = document.querySelector('.hero-carousel');
        this.track = document.querySelector('.carousel-track');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (!this.carousel || !this.track || this.slides.length === 0) {
            console.warn('Hero Carousel: No carousel elements found');
            return false;
        }
        
        // Setup hover pause functionality
        this.setupHoverControls();
        
        // Preload all images
        this.preloadImages();
        
        // Setup accessibility
        this.setupAccessibility();
        
        return true;
    }
    
    setupHoverControls() {
        // Only enable hover pause on devices that support hover
        if (window.matchMedia('(hover: hover)').matches) {
            this.carousel.addEventListener('mouseenter', () => {
                this.pauseAnimation();
            });
            
            this.carousel.addEventListener('mouseleave', () => {
                this.resumeAnimation();
            });
        }
    }
    
    pauseAnimation() {
        this.isPaused = true;
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
    }
    
    resumeAnimation() {
        this.isPaused = false;
        if (this.track) {
            this.track.style.animationPlayState = 'running';
        }
    }
    
    preloadImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && !img.complete) {
                // Create a new image to preload
                const preloadImg = new Image();
                preloadImg.src = img.src;
                
                // Handle load errors gracefully
                preloadImg.onerror = () => {
                    console.warn(`Hero Carousel: Failed to load image ${img.src}`);
                };
            }
        });
    }
    
    setupAccessibility() {
        // Update aria-label with descriptive text
        if (this.carousel) {
            this.carousel.setAttribute('aria-label', 'Continuous carousel showing diverse career professionals');
        }
        
        // Set proper aria attributes on slides (handle duplicates)
        this.slides.forEach((slide, index) => {
            const slideNumber = (index % 10) + 1; // Map duplicates back to original numbers
            slide.setAttribute('aria-label', `Career professional ${slideNumber} of 10`);
        });
    }
    
    // Public method to check if carousel is running
    isRunning() {
        return this.carousel && this.track && !this.isPaused;
    }
    
    // Public method to get carousel state
    getState() {
        return {
            isInitialized: !!(this.carousel && this.track && this.slides.length > 0),
            isPaused: this.isPaused,
            slideCount: this.slides.length,
            isVisible: this.carousel ? !this.carousel.hidden : false
        };
    }
    
    // Public method to destroy carousel (cleanup)
    destroy() {
        if (this.carousel) {
            // Remove event listeners
            this.carousel.removeEventListener('mouseenter', this.pauseAnimation.bind(this));
            this.carousel.removeEventListener('mouseleave', this.resumeAnimation.bind(this));
            
            // Stop animation
            if (this.track) {
                this.track.style.animationPlayState = 'paused';
            }
        }
        
        // Clear references
        this.carousel = null;
        this.track = null;
        this.slides = null;
    }
}

// Export for ES6 modules and global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroCarousel;
} else {
    window.HeroCarousel = HeroCarousel;
}