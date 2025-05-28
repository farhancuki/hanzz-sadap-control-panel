import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone } from 'lucide-react';

const DeveloperInfo: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Setup text scrolling effect
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const textElement = scrollRef.current;
    const textWidth = textElement.scrollWidth;
    const parentWidth = textElement.parentElement?.clientWidth || 0;
    
    if (textWidth <= parentWidth) return;
    
    const animateScroll = () => {
      if (!textElement) return;
      
      const animation = textElement.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translateX(-${textWidth}px)` }
        ],
        {
          duration: textWidth * 40, // Adjust speed
          iterations: Infinity
        }
      );
      
      return animation;
    };
    
    const animation = animateScroll();
    
    return () => {
      animation?.cancel();
    };
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-lg shadow-lg p-4 mb-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Developer Information</h3>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div ref={scrollRef} className="inline-block">
              <span className="text-yellow-300 font-medium text-lg">
                Professional Control Panel Developer - Expert in IoT Solutions
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Phone size={18} className="text-green-300" />
            <a 
              href="https://wa.me/628881382817" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-200 transition"
            >
              +628881382817
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={18} className="text-green-300" />
            <a 
              href="https://wa.me/6283824299082" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-200 transition"
            >
              +6283824299082
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare size={18} className="text-blue-300" />
            <a 
              href="https://whatsapp.com/channel/0029Vay9jnG65yDFJDN6tG1j" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 transition"
            >
              WhatsApp Channel
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeveloperInfo;