/**
 * Advanced Tilt Effect
 * Pure JavaScript implementation with customizable parameters
 * 
 * @author kakajan
 * @github https://github.com/kakajan
 * @description Educational project for teaching 3D transforms and mouse interactions
 */

class TiltEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.settings = {
            maxTilt: parseFloat(element.getAttribute('data-max-tilt')) || options.maxTilt || 15,
            speed: parseFloat(element.getAttribute('data-speed')) || options.speed || 300,
            scale: parseFloat(element.getAttribute('data-scale')) || options.scale || 1,
            glare: element.getAttribute('data-glare') === 'true' || options.glare || false,
            reverse: element.getAttribute('data-reverse') === 'true' || options.reverse || false,
            easing: options.easing || 'cubic-bezier(0.23, 1, 0.32, 1)',
        };

        this.width = null;
        this.height = null;
        this.left = null;
        this.top = null;
        this.transitionTimeout = null;
        this.updateBind = this.update.bind(this);
        this.resetBind = this.reset.bind(this);

        this.init();
    }

    init() {
        this.element.style.willChange = 'transform';
        this.element.style.transition = `transform ${this.settings.speed}ms ${this.settings.easing}`;
        
        // Add event listeners
        this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.element.addEventListener('mousemove', this.updateBind);
        this.element.addEventListener('mouseleave', this.resetBind);

        // Find or create shine element
        this.shineElement = this.element.querySelector('.tilt-shine');
    }

    getValues(e) {
        const rect = this.element.getBoundingClientRect();
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = rect.left;
        this.top = rect.top;

        const x = (e.clientX - this.left) / this.width;
        const y = (e.clientY - this.top) / this.height;

        const percentageX = x * 100;
        const percentageY = y * 100;

        const tiltX = ((this.settings.maxTilt / 2) - (y * this.settings.maxTilt)).toFixed(2);
        const tiltY = ((x * this.settings.maxTilt) - (this.settings.maxTilt / 2)).toFixed(2);

        const reverseMultiplier = this.settings.reverse ? -1 : 1;

        return {
            tiltX: tiltX * reverseMultiplier,
            tiltY: tiltY * reverseMultiplier,
            percentageX,
            percentageY,
            angle: Math.atan2(e.clientX - (this.left + this.width / 2), -(e.clientY - (this.top + this.height / 2))) * (180 / Math.PI)
        };
    }

    onMouseEnter() {
        this.updateElementPosition();
        this.element.style.willChange = 'transform';
        
        // Remove transition temporarily for smooth entry
        if (this.transitionTimeout) {
            clearTimeout(this.transitionTimeout);
        }
    }

    update(e) {
        const values = this.getValues(e);
        
        // Apply tilt transform
        this.element.style.transform = `
            perspective(1000px)
            rotateX(${values.tiltX}deg)
            rotateY(${values.tiltY}deg)
            scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})
        `;

        // Update shine effect
        if (this.shineElement) {
            this.shineElement.style.backgroundImage = `
                radial-gradient(circle at ${values.percentageX}% ${values.percentageY}%, 
                rgba(255,255,255,0.3), 
                transparent 50%)
            `;
            this.shineElement.style.opacity = '1';
        }

        // Update shadow for depth effect
        if (this.element.classList.contains('tilt-shadow')) {
            const shadowX = (values.tiltY / this.settings.maxTilt) * 20;
            const shadowY = (values.tiltX / this.settings.maxTilt) * -20;
            const shadowBlur = 30 + Math.abs(values.tiltX) + Math.abs(values.tiltY);
            
            this.element.style.boxShadow = `
                ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.3),
                ${shadowX * 0.5}px ${shadowY * 0.5}px ${shadowBlur * 0.5}px rgba(0, 0, 0, 0.2)
            `;
        }

        // Trigger custom event
        this.element.dispatchEvent(new CustomEvent('tiltChange', {
            detail: values
        }));
    }

    reset() {
        this.element.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;

        // Reset shine
        if (this.shineElement) {
            this.shineElement.style.opacity = '0';
        }

        // Reset shadow
        if (this.element.classList.contains('tilt-shadow')) {
            this.element.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        }

        // Allow transition on reset
        this.transitionTimeout = setTimeout(() => {
            this.element.style.willChange = 'auto';
        }, this.settings.speed);
    }

    updateElementPosition() {
        const rect = this.element.getBoundingClientRect();
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = rect.left;
        this.top = rect.top;
    }

    destroy() {
        this.element.removeEventListener('mouseenter', this.onMouseEnter);
        this.element.removeEventListener('mousemove', this.updateBind);
        this.element.removeEventListener('mouseleave', this.resetBind);
        this.element.style.transform = '';
        this.element.style.transition = '';
        this.element.style.willChange = '';
    }
}

// Auto-initialize all elements with data-tilt attribute
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    const tiltInstances = [];

    tiltElements.forEach((element) => {
        const instance = new TiltEffect(element);
        tiltInstances.push(instance);
    });

    // Optional: Make instances globally accessible
    window.tiltInstances = tiltInstances;

    // Update positions on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            tiltInstances.forEach(instance => instance.updateElementPosition());
        }, 250);
    });

    // Add parallax effect to inner content (optional enhancement)
    tiltElements.forEach((element) => {
        const innerElement = element.querySelector('.tilt-card-inner');
        if (innerElement) {
            element.addEventListener('tiltChange', (e) => {
                const { tiltX, tiltY } = e.detail;
                // Subtle parallax movement for inner content
                innerElement.style.transform = `translateZ(50px) translateX(${tiltY * 0.5}px) translateY(${tiltX * -0.5}px)`;
            });
        }
    });

    console.log(`✨ Tilt Effect initialized on ${tiltElements.length} elements`);
    console.log(`📚 Educational project by @kakajan - https://github.com/kakajan`);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TiltEffect;
}