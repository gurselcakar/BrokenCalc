import { useState, useCallback } from 'react';
import type { ButtonMapping } from '../../shared/types/game';
import { getActualValue, getDisplayValue } from '../utils/buttonScrambler';

interface CalculatorState {
  display: string;
  userInput: string;
  lastResult?: number;
  showResult: boolean;
}

interface UseCalculatorProps {
  buttonMapping: ButtonMapping;
  onEquationComplete?: (equation: string, result: number) => void;
  disabled?: boolean;
}

export const useCalculator = ({
  buttonMapping,
  onEquationComplete,
  disabled = false,
}: UseCalculatorProps) => {
  const [state, setState] = useState<CalculatorState>({
    display: '',
    userInput: '',
    showResult: false,
  });

  // Handle button press with scrambling logic
  const handleButtonPress = useCallback((buttonId: string) => {
    if (disabled) return;

    // Get the actual value based on button mapping
    const actualValue = getActualValue(buttonId, buttonMapping);
    
    setState(prev => {
      let newUserInput = prev.userInput;
      let newDisplay = prev.display;
      let newShowResult = false;
      let newLastResult = prev.lastResult;

      if (actualValue === 'delete') {
        // Delete last character
        newUserInput = newUserInput.slice(0, -1);
        newDisplay = newUserInput;
      } else if (actualValue === '=') {
        // Calculate result
        if (newUserInput) {
          try {
            const result = evaluateExpression(newUserInput);
            newLastResult = result;
            newShowResult = true;
            newDisplay = result.toString();
            
            // Notify parent component
            onEquationComplete?.(newUserInput, result);
          } catch (error) {
            console.error('Calculation error:', error);
            newDisplay = 'ERROR';
          }
        }
      } else {
        // Add number or operator
        newUserInput += actualValue;
        
        // For God Tier mode, show different value than what's actually input
        const displayValue = getDisplayValue(actualValue, buttonMapping);
        newDisplay = prev.display + displayValue;
        
        // Clear result display when user continues typing
        if (prev.showResult) {
          newUserInput = actualValue;
          newDisplay = getDisplayValue(actualValue, buttonMapping);
          newShowResult = false;
          newLastResult = undefined;
        }
      }

      return {
        display: newDisplay,
        userInput: newUserInput,
        showResult: newShowResult,
        ...(newLastResult !== undefined && { lastResult: newLastResult }),
      };
    });
  }, [buttonMapping, onEquationComplete, disabled]);

  // Clear calculator state
  const clear = useCallback(() => {
    setState({
      display: '',
      userInput: '',
      showResult: false,
    });
  }, []);

  // Get current equation for display (real-time building)
  const getCurrentEquation = useCallback(() => {
    return state.userInput;
  }, [state.userInput]);

  return {
    display: state.display,
    userInput: state.userInput,
    lastResult: state.lastResult,
    showResult: state.showResult,
    handleButtonPress,
    clear,
    getCurrentEquation,
  };
};

/**
 * Safely evaluate a mathematical expression
 */
const evaluateExpression = (expression: string): number => {
  // Remove spaces
  const cleaned = expression.replace(/\s/g, '');
  
  // Validate expression contains only allowed characters
  if (!/^[\d+\-×÷.()]+$/.test(cleaned)) {
    throw new Error('Invalid characters in expression');
  }
  
  // Replace mathematical symbols with JavaScript operators
  const jsExpression = cleaned
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  
  // Use Function constructor for safer evaluation than eval
  try {
    const result = new Function(`return ${jsExpression}`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid calculation result');
    }
    
    return Math.round(result * 1000) / 1000; // Round to 3 decimal places
  } catch (error) {
    throw new Error('Failed to evaluate expression');
  }
};