import React from 'react';
import logo from '../assets/logo/logo.png';

export const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <img 
        src={logo} 
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};