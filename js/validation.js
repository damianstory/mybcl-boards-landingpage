/**
 * myBlueprint Career Launch - Form Validation Module
 * Handles client-side email validation and form state management
 */

class FormValidator {
    constructor() {
        this.patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        };
        
        this.messages = {
            required: 'Email address is required',
            invalidEmail: 'Please enter a valid email address',
            networkError: 'Network error. Please check your connection and try again.',
            serverError: 'Something went wrong. Please try again later.',
            success: 'Thank you! We\'ll notify you as soon as the agenda is released.'
        };
    }

    /**
     * Validates email format
     * @param {string} email - Email address to validate
     * @returns {Object} - Validation result with isValid and message
     */
    validateEmail(email) {
        // Check if email is provided
        if (!email || email.trim() === '') {
            return {
                isValid: false,
                message: this.messages.required
            };
        }

        // Trim and normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check email format
        if (!this.patterns.email.test(normalizedEmail)) {
            return {
                isValid: false,
                message: this.messages.invalidEmail
            };
        }

        // Check for common typos in domains
        const suspiciousDomains = [
            'gmail.co', 'gmail.cm', 'gmai.com', 'gmial.com',
            'yahoo.co', 'yahoo.cm', 'hotmail.co', 'hotmail.cm',
            'outlook.co', 'outlook.cm'
        ];

        const domain = normalizedEmail.split('@')[1];
        if (suspiciousDomains.includes(domain)) {
            return {
                isValid: false,
                message: 'Please check your email domain spelling'
            };
        }

        return {
            isValid: true,
            message: '',
            email: normalizedEmail
        };
    }

    /**
     * Real-time validation for input field
     * @param {HTMLInputElement} input - Email input element
     * @param {HTMLElement} errorElement - Error message element
     */
    attachRealTimeValidation(input, errorElement) {
        let validationTimeout;

        // Validate on blur (when user leaves field)
        input.addEventListener('blur', () => {
            const result = this.validateEmail(input.value);
            this.displayError(errorElement, result.isValid ? '' : result.message);
            this.updateInputState(input, result.isValid);
        });

        // Debounced validation on input (while typing)
        input.addEventListener('input', () => {
            clearTimeout(validationTimeout);
            
            // Clear previous errors while typing
            if (input.value.length > 0) {
                this.displayError(errorElement, '');
                input.classList.remove('invalid');
            }

            // Validate after user stops typing
            validationTimeout = setTimeout(() => {
                if (input.value.length > 3) { // Only validate if reasonable length
                    const result = this.validateEmail(input.value);
                    if (!result.isValid) {
                        this.displayError(errorElement, result.message);
                        this.updateInputState(input, false);
                    } else {
                        this.updateInputState(input, true);
                    }
                }
            }, 500);
        });

        // Clear validation on focus (when user clicks back into field)
        input.addEventListener('focus', () => {
            clearTimeout(validationTimeout);
            input.classList.remove('invalid');
            this.displayError(errorElement, '');
        });
    }

    /**
     * Updates input visual state based on validation
     * @param {HTMLInputElement} input - Input element
     * @param {boolean} isValid - Whether input is valid
     */
    updateInputState(input, isValid) {
        if (isValid) {
            input.classList.remove('invalid');
            input.setAttribute('aria-invalid', 'false');
        } else {
            input.classList.add('invalid');
            input.setAttribute('aria-invalid', 'true');
        }
    }

    /**
     * Displays error message in accessible way
     * @param {HTMLElement} errorElement - Error message container
     * @param {string} message - Error message to display
     */
    displayError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
            
            // Announce error to screen readers
            if (message) {
                errorElement.setAttribute('aria-live', 'assertive');
            } else {
                errorElement.removeAttribute('aria-live');
            }
        }
    }

    /**
     * Validates entire form before submission
     * @param {HTMLFormElement} form - Form element
     * @returns {Object} - Validation result
     */
    validateForm(form) {
        const emailInput = form.querySelector('#email');
        const emailResult = this.validateEmail(emailInput.value);

        // Update UI based on validation result
        const errorElement = form.querySelector('#email-error');
        this.displayError(errorElement, emailResult.isValid ? '' : emailResult.message);
        this.updateInputState(emailInput, emailResult.isValid);

        return {
            isValid: emailResult.isValid,
            data: emailResult.isValid ? { email: emailResult.email } : null,
            message: emailResult.message
        };
    }

    /**
     * Sanitizes email input to prevent XSS
     * @param {string} email - Raw email input
     * @returns {string} - Sanitized email
     */
    sanitizeEmail(email) {
        if (typeof email !== 'string') return '';
        
        return email
            .trim()
            .toLowerCase()
            .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
            .substring(0, 254); // Limit email length (RFC 5321 limit)
    }

    /**
     * Checks if email domain appears to be educational
     * @param {string} email - Email address
     * @returns {boolean} - Whether domain appears educational
     */
    isEducationalEmail(email) {
        const eduDomains = [
            '.edu', '.ac.', '.edu.', 
            'school', 'college', 'university',
            'board', 'district'
        ];
        
        const normalizedEmail = email.toLowerCase();
        return eduDomains.some(domain => normalizedEmail.includes(domain));
    }

    /**
     * Provides friendly success message based on email type
     * @param {string} email - Validated email address
     * @returns {string} - Personalized success message
     */
    getSuccessMessage(email) {
        if (this.isEducationalEmail(email)) {
            return 'Thank you! We\'ll send the agenda details to your educational email address as soon as they\'re available.';
        }
        return this.messages.success;
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
} else {
    // Make available globally for browser use
    window.FormValidator = FormValidator;
}