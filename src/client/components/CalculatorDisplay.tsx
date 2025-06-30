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
    <div className="vintage-calculator w-full max-w-lg mx-auto h-full max-h-full flex flex-col overflow-hidden">
      {/* Calculator Header with Brand and Solar Panel */}
      <div className="calc-header flex justify-between items-start mb-2 p-3 flex-shrink-0">
        <div className="calc-brand text-left flex-1">
          <div className="calc-brand-name text-lg sm:text-xl">C4S!0</div>
          <div className="calc-model text-xs sm:text-sm">fx-error X</div>
          <div className="calc-series text-xs">CLASSRIZZ</div>
        </div>
        <div className="solar-panel w-16 h-8 sm:w-20 sm:h-10">
          <div className="solar-cells">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="solar-cell" />
            ))}
          </div>
        </div>
      </div>
      
      {/* LCD Display - Responsive and constrained height */}
      <div className={`lcd-display ${isTransitioning ? 'retro-refresh' : ''} ${className} flex-shrink-0 h-32 sm:h-40 md:h-48 lg:h-56 p-3 sm:p-4 mb-2 flex flex-col justify-start overflow-hidden`}>
        <div className="h-full w-full overflow-y-auto scrollable-container">
          {children}
        </div>
      </div>

      {/* Calculator Buttons Area - Flex grow with proper constraints */}
      {calculatorButtons && (
        <div className="calculator-buttons-area flex-1 flex flex-col p-2 sm:p-3 md:p-4 min-h-0 overflow-hidden">
          <div className="h-full w-full">
            {calculatorButtons}
          </div>
        </div>
      )}
    </div>
  );
};