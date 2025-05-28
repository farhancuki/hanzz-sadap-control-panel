interface RippleOptions {
  color?: string;
  duration?: number;
  opacity?: number;
}

export const createRipple = (
  event: React.MouseEvent<HTMLElement>,
  options: RippleOptions = {}
) => {
  const element = event.currentTarget;
  
  // Get element position
  const rect = element.getBoundingClientRect();
  
  // Calculate ripple size (should be the largest dimension of the element)
  const size = Math.max(rect.width, rect.height);
  
  // Calculate ripple position
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  // Create ripple element
  const ripple = document.createElement('span');
  
  // Apply styles
  ripple.style.position = 'absolute';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.top = `${y}px`;
  ripple.style.left = `${x}px`;
  ripple.style.borderRadius = '50%';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = `ripple ${options.duration || 600}ms linear`;
  ripple.style.backgroundColor = options.color || 'rgba(255, 255, 255, 0.7)';
  ripple.style.opacity = options.opacity?.toString() || '0.6';
  
  // Add ripple class for easier removal
  ripple.classList.add('ripple-effect');
  
  // Ensure the element has relative or absolute positioning
  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }
  
  // Ensure overflow is hidden
  element.style.overflow = 'hidden';
  
  // Remove existing ripples
  const existingRipples = element.getElementsByClassName('ripple-effect');
  if (existingRipples.length > 0) {
    existingRipples[0].remove();
  }
  
  // Add ripple to element
  element.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, options.duration || 600);
};

// Add keyframes for ripple animation to document
export const addRippleStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleEl);
};