import React from 'react';
import '../styles/vintage-calculator.css';

interface CalculatorDisplayProps {
  children: React.ReactNode;
  isTransitioning?: boolean;
  className?: string;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  children,
  isTransitioning = false,
  className = '',
}) => {
  return (
    <div className="vintage-calculator">
      {/* Brand Name and Model */}
      <div className="calc-brand">
        <div className="calc-brand-name">CALCO</div>
        <div className="calc-model">FX-420B</div>
      </div>
      
      {/* LCD Display */}
      <div className={`lcd-display ${isTransitioning ? 'retro-refresh' : ''} ${className}`}>
        {children}
      </div>
    </div>
  );
};