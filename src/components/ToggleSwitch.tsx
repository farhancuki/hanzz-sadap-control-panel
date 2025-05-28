import React from 'react';
import { createRipple } from '../utils/ripple';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  className,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    createRipple(e, {
      color: checked ? 'rgba(209, 213, 219, 0.8)' : 'rgba(59, 130, 246, 0.5)',
      duration: 400
    });
    onChange(!checked);
  };
  
  return (
    <div className={`flex items-center ${className || ''}`}>
      <label 
        className="relative inline-flex items-center cursor-pointer"
        onClick={handleClick}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={() => {}}
        />
        <div 
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <div 
            className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-1'
            }`} 
          />
        </div>
        {label && (
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default ToggleSwitch;