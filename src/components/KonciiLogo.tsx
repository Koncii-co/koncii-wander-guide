
import React from 'react';

interface KonciiLogoProps {
  className?: string;
  size?: number;
}

const KonciiLogo: React.FC<KonciiLogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hat */}
      <ellipse cx="50" cy="25" rx="35" ry="20" fill="currentColor" opacity="0.9"/>
      <rect x="15" y="32" width="70" height="4" rx="2" fill="currentColor" opacity="0.9"/>
      <ellipse cx="20" cy="34" rx="6" ry="3" fill="currentColor" opacity="0.9"/>
      <ellipse cx="80" cy="34" rx="6" ry="3" fill="currentColor" opacity="0.9"/>
      
      {/* Face Circle */}
      <circle cx="50" cy="55" r="30" fill="white" stroke="currentColor" strokeWidth="4"/>
      
      {/* Eyes */}
      <circle cx="42" cy="48" r="3" fill="currentColor"/>
      <circle cx="58" cy="48" r="3" fill="currentColor"/>
      
      {/* Mustache */}
      <path d="M 35 60 Q 42 58 50 60 Q 58 58 65 60 Q 58 65 50 63 Q 42 65 35 60 Z" fill="currentColor"/>
      
      {/* Smile */}
      <path d="M 40 68 Q 50 75 60 68" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* Headset */}
      <circle cx="82" cy="50" r="8" fill="currentColor" opacity="0.8"/>
      <rect x="78" y="46" width="8" height="8" rx="1" fill="white"/>
      <path d="M 82 58 Q 85 65 88 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
};

export default KonciiLogo;
