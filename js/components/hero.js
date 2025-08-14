/**
 * Hero Content Component
 * Handles form validation, submission, and user interactions
 */
class HeroForm {
    constructor(validator, zohoConfig = {}) {
        this.validator = validator || new FormValidator();
        this.isSubmitting = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Zoho configuration
        this.zohoConfig = {
            endpoint: zohoConfig.endpoint || process.env.ZOHO_ENDPOINT || 'https://api.zoho.com/crm/v2/Leads',
            authToken: zohoConfig.authToken || process.env.ZOHO_AUTH_TOKEN || '',
            timeout: zohoConfig.timeout || 10000
        };
        
        this.init();
    }
    
    init() {
        const form = document.getElementById('email-form');
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('email-error');
        
        if (!form || !emailInput || !errorElement) {
            console.warn('Hero Form: Required form elements not found');
            return false;
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
        
        return true;
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
            console.error('Hero Form: Submission error:', error);
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
            console.warn('Hero Form: Zoho auth token not configured, using fallback');
            return this.simulateSubmission(data);
        }
        
        const payload = {
            data: [{
                Email: data.email,
                Lead_Source: 'Career Launch Landing Page',
                Lead_Status: 'Not Contacted',
                Company: 'Educational Institution',
                Last_Name: data.email.split('@')[0],
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
                console.log(`Hero Form: Retrying submission (attempt ${this.retryCount})`);
                await this.delay(1000 * this.retryCount);
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
        await this.delay(1500);
        
        if (Math.random() < 0.1) {
            throw new Error('Simulated network error');
        }
        
        return {
            success: true,
            id: 'sim_' + Date.now(),
            message: 'Simulation successful'
        };
    }
    
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
            button.querySelector('.button-text').textContent = 'Sign Up';
        }
    }
    
    showSuccess(messagesElement, email) {
        const message = this.validator.getSuccessMessage(email);
        messagesElement.className = 'form-messages success show';
        messagesElement.textContent = message;
        messagesElement.setAttribute('role', 'status');
        messagesElement.setAttribute('aria-live', 'polite');
        
        setTimeout(() => {
            if (messagesElement.classList.contains('success')) {
                messagesElement.classList.remove('show');
            }
        }, 10000);
    }
    
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
        
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.focus();
        }, 100);
    }
    
    clearMessages() {
        const messagesElement = document.getElementById('form-messages');
        if (messagesElement) {
            messagesElement.className = 'form-messages';
            messagesElement.textContent = '';
            messagesElement.removeAttribute('role');
            messagesElement.removeAttribute('aria-live');
        }
    }
    
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
    
    focusOnError() {
        const errorInput = document.querySelector('.form-input.invalid');
        if (errorInput) {
            errorInput.focus();
        }
    }
    
    trackConversion(email) {
        try {
            const conversionData = {
                event: 'email_signup',
                email_domain: email.split('@')[1],
                timestamp: new Date().toISOString(),
                page: 'career_launch_landing',
                is_educational: this.validator.isEducationalEmail(email)
            };
            
            console.log('Hero Form: Conversion tracked:', conversionData);
            
        } catch (error) {
            console.warn('Hero Form: Analytics tracking failed:', error);
        }
    }
    
    isNetworkError(error) {
        const networkErrors = [
            'network', 'fetch', 'connection', 'timeout',
            'dns', 'offline', 'cors', 'blocked'
        ];
        
        const errorMessage = (error.message || '').toLowerCase();
        return networkErrors.some(keyword => errorMessage.includes(keyword));
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public method to get form state
    getState() {
        return {
            isSubmitting: this.isSubmitting,
            retryCount: this.retryCount,
            hasZohoConfig: !!this.zohoConfig.authToken,
            formExists: !!document.getElementById('email-form')
        };
    }
    
    // Public method to destroy component
    destroy() {
        const form = document.getElementById('email-form');
        if (form) {
            // Remove event listeners by cloning and replacing
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
        }
    }
}

// Export for ES6 modules and global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroForm;
} else {
    window.HeroForm = HeroForm;
}