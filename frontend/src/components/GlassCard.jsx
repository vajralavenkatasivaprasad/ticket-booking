import React from 'react';

const GlassCard = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`glass-card ${className}`} 
      style={{
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1.25rem',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
