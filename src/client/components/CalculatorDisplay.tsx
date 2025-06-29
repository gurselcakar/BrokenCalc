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
      {/* Calculator Header with Brand and Solar Panel */}
      <div className="calc-header">
        <div className="calc-brand">
          <div className="calc-brand-name">CASIO</div>
          <div className="calc-model">fx-85GT X</div>
          <div className="calc-series">CLASSWIZ</div>
        </div>
        <div className="solar-panel">
          <div className="solar-cells">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="solar-cell" />
            ))}
          </div>
        </div>
      </div>
      
      {/* LCD Display */}
      <div className={`lcd-display ${isTransitioning ? 'retro-refresh' : ''} ${className}`}>
        {children}
      </div>
    </div>
  );
};