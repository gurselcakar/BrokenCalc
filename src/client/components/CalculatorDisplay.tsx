import React from 'react';
import '../styles/vintage-calculator.css';

interface CalculatorDisplayProps {
  children: React.ReactNode;
  calculatorButtons?: React.ReactNode;
  isTransitioning?: boolean;
  className?: string;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  children,
  calculatorButtons,
  isTransitioning = false,
  className = '',
}) => {
  return (
    <div className="vintage-calculator w-full max-w-lg mx-auto h-full flex flex-col">
      {/* Calculator Header with Brand and Solar Panel */}
      <div className="calc-header flex justify-between items-start mb-3 p-3 flex-shrink-0">
        <div className="calc-brand text-left flex-1">
          <div className="calc-brand-name text-xl">CASIO</div>
          <div className="calc-model text-sm">fx-85GT X</div>
          <div className="calc-series text-xs">CLASSWIZ</div>
        </div>
        <div className="solar-panel w-20 h-10">
          <div className="solar-cells">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="solar-cell" />
            ))}
          </div>
        </div>
      </div>
      
      {/* LCD Display - Only this area gets the retro-refresh animation */}
      <div className={`lcd-display ${className} flex-shrink-0 h-56 p-4 mb-3 flex flex-col justify-start overflow-hidden`}>
        <div className={`lcd-content ${isTransitioning ? 'retro-refresh' : ''} h-full w-full overflow-y-auto scrollable-container`}>
          {children}
        </div>
      </div>

      {/* Calculator Buttons Area - No animation applied here */}
      {calculatorButtons && (
        <div className="calculator-buttons-area flex-1 flex flex-col p-4 min-h-0">
          {calculatorButtons}
        </div>
      )}
    </div>
  );
};