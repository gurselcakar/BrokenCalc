import React from 'react';
import type { CalculatorButton } from '../../shared/types/game';

interface CalculatorProps {
  onButtonPress: (buttonId: string) => void;
  disabled?: boolean;
  className?: string;
}

// Define the 5x4 calculator layout with + above - for better navigation
const CALCULATOR_BUTTONS: CalculatorButton[] = [
  // Row 1: Delete (spans 3 cells) + Divide
  { id: 'delete', displayLabel: '⌫', actualValue: 'delete', type: 'action', gridPosition: { row: 0, col: 0, span: 3 } },
  { id: 'divide', displayLabel: '÷', actualValue: '÷', type: 'operator', gridPosition: { row: 0, col: 3 } },
  
  // Row 2: 7, 8, 9, Add (moved + up for better navigation)
  { id: '7', displayLabel: '7', actualValue: '7', type: 'number', gridPosition: { row: 1, col: 0 } },
  { id: '8', displayLabel: '8', actualValue: '8', type: 'number', gridPosition: { row: 1, col: 1 } },
  { id: '9', displayLabel: '9', actualValue: '9', type: 'number', gridPosition: { row: 1, col: 2 } },
  { id: 'add', displayLabel: '+', actualValue: '+', type: 'operator', gridPosition: { row: 1, col: 3 } },
  
  // Row 3: 4, 5, 6, Subtract (moved - down for better navigation)
  { id: '4', displayLabel: '4', actualValue: '4', type: 'number', gridPosition: { row: 2, col: 0 } },
  { id: '5', displayLabel: '5', actualValue: '5', type: 'number', gridPosition: { row: 2, col: 1 } },
  { id: '6', displayLabel: '6', actualValue: '6', type: 'number', gridPosition: { row: 2, col: 2 } },
  { id: 'subtract', displayLabel: '-', actualValue: '-', type: 'operator', gridPosition: { row: 2, col: 3 } },
  
  // Row 4: 1, 2, 3, Multiply
  { id: '1', displayLabel: '1', actualValue: '1', type: 'number', gridPosition: { row: 3, col: 0 } },
  { id: '2', displayLabel: '2', actualValue: '2', type: 'number', gridPosition: { row: 3, col: 1 } },
  { id: '3', displayLabel: '3', actualValue: '3', type: 'number', gridPosition: { row: 3, col: 2 } },
  { id: 'multiply', displayLabel: '×', actualValue: '×', type: 'operator', gridPosition: { row: 3, col: 3 } },
  
  // Row 5: Empty, 0, Empty, Equals
  { id: '0', displayLabel: '0', actualValue: '0', type: 'number', gridPosition: { row: 4, col: 1 } },
  { id: 'equals', displayLabel: '=', actualValue: '=', type: 'action', gridPosition: { row: 4, col: 3 } },
];

export const Calculator: React.FC<CalculatorProps> = ({
  onButtonPress,
  disabled = false,
  className = '',
}) => {
  const handleButtonClick = (buttonId: string) => {
    if (!disabled) {
      onButtonPress(buttonId);
    }
  };

  const renderButton = (button: CalculatorButton) => {
    const baseClasses = `
      calc-button
      ${button.type === 'number' ? 'calc-button-number' : ''}
      ${button.type === 'operator' ? 'calc-button-operator' : ''}
      ${button.type === 'action' ? 'calc-button-action' : ''}
      ${disabled ? 'calc-button-disabled' : ''}
      rounded-lg font-semibold flex items-center justify-center
      text-sm md:text-base lg:text-lg px-2 py-2 h-full
      transition-all duration-150 active:scale-95
    `.replace(/\s+/g, ' ').trim();

    const gridStyle = {
      gridRow: button.gridPosition.row + 1,
      gridColumn: button.gridPosition.span 
        ? `${button.gridPosition.col + 1} / span ${button.gridPosition.span}`
        : button.gridPosition.col + 1,
    };

    return (
      <button
        key={button.id}
        className={baseClasses}
        style={gridStyle}
        onClick={() => handleButtonClick(button.id)}
        disabled={disabled}
        aria-label={`Calculator button ${button.displayLabel}`}
      >
        {button.displayLabel}
      </button>
    );
  };

  // Create empty cells for positions that don't have buttons
  const renderEmptyCell = (row: number, col: number) => (
    <div
      key={`empty-${row}-${col}`}
      className="calc-button-empty"
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
      }}
    />
  );

  return (
    <div className={`calculator-grid ${className} grid grid-cols-4 grid-rows-5 gap-2 w-full h-full`}>
      {/* Render all buttons */}
      {CALCULATOR_BUTTONS.map(renderButton)}
      
      {/* Render empty cells for row 5 positions 0 and 2 */}
      {renderEmptyCell(4, 0)}
      {renderEmptyCell(4, 2)}
    </div>
  );
};