import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      <circle cx="12" cy="12" r="2.5" className="logo-ring logo-ring-1" />
      <circle cx="12" cy="12" r="5.5" className="logo-ring logo-ring-2" />
      <circle cx="12" cy="12" r="8.5" className="logo-ring logo-ring-3" />
      <circle cx="12" cy="12" r="11.25" className="logo-ring logo-ring-4" />
    </svg>
  );
};

export default Logo;
