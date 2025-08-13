/**
 * myBlueprint Career Launch - Main Application
 * Handles form submission, Zoho API integration, and user interactions
 */

class CareerLaunchApp {
    constructor() {
        this.validator = new FormValidator();
        this.isSubmitting = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Zoho configuration (will be set from environment or config)
        this.zohoConfig = {
            endpoint: process.env.ZOHO_ENDPOINT || 'https://api.zoho.com/crm/v2/Leads',
            authToken: process.env.ZOHO_AUTH_TOKEN || '', // To be provided
            timeout: 10000 // 10 seconds
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
     * Setup all event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('email-form');
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('email-error');

        if (!form || !emailInput || !errorElement) {
            console.error('Required form elements not found');
            return;
        }

        // Setup form validation
        this.validator.attachRealTimeValidation(emailInput, errorElement);

        // Handle form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Handle Enter key in email field
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isSubmitting) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });

        // Setup keyboard navigation
        this.setupKeyboardNavigation();

        // Performance monitoring
        this.trackPerformance();
    }

    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    async handleFormSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) return;

        const form = event.target;
        const button = form.querySelector('.cta-button');
        const messagesElement = document.getElementById('form-messages');

        // Clear any previous messages
        this.clearMessages();

        // Validate form
        const validationResult = this.validator.validateForm(form);
        if (!validationResult.isValid) {
            this.focusOnError();
            return;
        }

        try {
            this.setLoadingState(button, true);
            this.isSubmitting = true;

            // Submit to Zoho
            const result = await this.submitToZoho(validationResult.data);

            if (result.success) {
                this.showSuccess(messagesElement, validationResult.data.email);
                this.resetForm(form);
                this.trackConversion(validationResult.data.email);
            } else {
                throw new Error(result.message || 'Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmissionError(error, messagesElement);
            
        } finally {
            this.setLoadingState(button, false);
            this.isSubmitting = false;
        }
    }

    /**
     * Submit data to Zoho CRM
     * @param {Object} data - Form data to submit
     * @returns {Promise<Object>} - Submission result
     */
    async submitToZoho(data) {
        // If no auth token, use fallback method
        if (!this.zohoConfig.authToken) {
            console.warn('Zoho auth token not configured, using fallback');
            return this.simulateSubmission(data);
        }

        const payload = {
            data: [{
                Email: data.email,
                Lead_Source: 'Career Launch Landing Page',
                Lead_Status: 'Not Contacted',
                Company: 'Educational Institution',
                Last_Name: data.email.split('@')[0], // Use email prefix as temporary last name
                Description: `Interested in myBlueprint Career Launch event on December 2nd. Signed up for agenda notifications.`
            }]
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${this.zohoConfig.authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(this.zohoConfig.timeout)
        };

        try {
            const response = await fetch(this.zohoConfig.endpoint, requestOptions);
            const result = await response.json();

            if (response.ok && result.data && result.data[0].status === 'success') {
                return { success: true, id: result.data[0].details.id };
            } else {
                const errorMsg = result.data?.[0]?.message || result.message || 'API request failed';
                throw new Error(errorMsg);
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection.');
            }
            
            // Retry logic for network errors
            if (this.retryCount < this.maxRetries && this.isNetworkError(error)) {
                this.retryCount++;
                console.log(`Retrying submission (attempt ${this.retryCount})`);
                await this.delay(1000 * this.retryCount); // Exponential backoff
                return this.submitToZoho(data);
            }

            throw error;
        }
    }

    /**
     * Fallback submission method (for testing without Zoho credentials)
     * @param {Object} data - Form data
     * @returns {Promise<Object>} - Simulated result
     */
    async simulateSubmission(data) {
        // Simulate network delay
        await this.delay(1500);

        // Simulate occasional failures for testing
        if (Math.random() < 0.1) { // 10% failure rate
            throw new Error('Simulated network error');
        }

        return {
            success: true,
            id: 'sim_' + Date.now(),
            message: 'Simulation successful'
        };
    }

    /**
     * Set loading state on submit button
     * @param {HTMLElement} button - Submit button
     * @param {boolean} isLoading - Whether to show loading state
     */
    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            button.querySelector('.button-text').textContent = 'Submitting...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
            button.querySelector('.button-text').textContent = 'Notify Me';
        }
    }

    /**
     * Show success message
     * @param {HTMLElement} messagesElement - Messages container
     * @param {string} email - Submitted email for personalization
     */
    showSuccess(messagesElement, email) {
        const message = this.validator.getSuccessMessage(email);
        messagesElement.className = 'form-messages success show';
        messagesElement.textContent = message;
        messagesElement.setAttribute('role', 'status');
        messagesElement.setAttribute('aria-live', 'polite');

        // Auto-hide success message after 10 seconds
        setTimeout(() => {
            if (messagesElement.classList.contains('success')) {
                messagesElement.classList.remove('show');
            }
        }, 10000);
    }

    /**
     * Handle submission errors
     * @param {Error} error - The error that occurred
     * @param {HTMLElement} messagesElement - Messages container
     */
    handleSubmissionError(error, messagesElement) {
        let errorMessage;

        if (this.isNetworkError(error)) {
            errorMessage = this.validator.messages.networkError;
        } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
            errorMessage = 'Request timed out. Please try again.';
        } else {
            errorMessage = this.validator.messages.serverError;
        }

        messagesElement.className = 'form-messages error show';
        messagesElement.textContent = errorMessage;
        messagesElement.setAttribute('role', 'alert');
        messagesElement.setAttribute('aria-live', 'assertive');

        // Focus back on email field for retry
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.focus();
        }, 100);
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        const messagesElement = document.getElementById('form-messages');
        if (messagesElement) {
            messagesElement.className = 'form-messages';
            messagesElement.textContent = '';
            messagesElement.removeAttribute('role');
            messagesElement.removeAttribute('aria-live');
        }
    }

    /**
     * Reset form to initial state
     * @param {HTMLFormElement} form - Form to reset
     */
    resetForm(form) {
        const emailInput = form.querySelector('#email');
        if (emailInput) {
            emailInput.value = '';
            emailInput.classList.remove('invalid');
            emailInput.removeAttribute('aria-invalid');
        }

        const errorElement = form.querySelector('#email-error');
        if (errorElement) {
            this.validator.displayError(errorElement, '');
        }

        this.retryCount = 0;
    }

    /**
     * Focus on first error field
     */
    focusOnError() {
        const errorInput = document.querySelector('.form-input.invalid');
        if (errorInput) {
            errorInput.focus();
        }
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Escape key clears messages
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearMessages();
            }
        });

        // Ensure proper tab order
        const focusableElements = [
            document.querySelector('.logo'),
            document.querySelector('#email'),
            document.querySelector('.cta-button')
        ].filter(el => el !== null);

        focusableElements.forEach((element, index) => {
            element.setAttribute('tabindex', index === 0 ? '0' : '0');
        });
    }

    /**
     * Track conversion for analytics
     * @param {string} email - Email that converted
     */
    trackConversion(email) {
        try {
            // Log conversion (could be sent to analytics service)
            const conversionData = {
                event: 'email_signup',
                email_domain: email.split('@')[1],
                timestamp: new Date().toISOString(),
                page: 'career_launch_landing',
                is_educational: this.validator.isEducationalEmail(email)
            };

            console.log('Conversion tracked:', conversionData);

            // Could integrate with Google Analytics, mixpanel, etc.
            // gtag('event', 'conversion', conversionData);

        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
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
        console.error('Global error:', event.error);
        
        // Show user-friendly error if form-related
        if (event.error && event.error.message && event.error.message.includes('form')) {
            const messagesElement = document.getElementById('form-messages');
            if (messagesElement) {
                this.handleSubmissionError(new Error('An unexpected error occurred'), messagesElement);
            }
        }
    }

    /**
     * Handle unhandled promise rejections
     * @param {PromiseRejectionEvent} event - Promise rejection event
     */
    handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent the default console error
    }

    /**
     * Check if error is network-related
     * @param {Error} error - Error to check
     * @returns {boolean} - Whether error is network-related
     */
    isNetworkError(error) {
        const networkErrors = [
            'network', 'fetch', 'connection', 'timeout', 
            'dns', 'offline', 'cors', 'blocked'
        ];
        
        const errorMessage = (error.message || '').toLowerCase();
        return networkErrors.some(keyword => errorMessage.includes(keyword));
    }

    /**
     * Utility function to create delays
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
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

    // Initialize app
    try {
        new CareerLaunchApp();
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});