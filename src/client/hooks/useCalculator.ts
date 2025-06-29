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
        // Clear result when deleting
        newLastResult = undefined;
        newShowResult = false;
      } else if (actualValue === '=') {
        // Calculate result
        console.log('🧮 Equals pressed! UserInput:', newUserInput);
        if (newUserInput) {
          try {
            console.log('🔢 About to evaluate expression:', newUserInput);
            const result = evaluateExpression(newUserInput);
            console.log('✅ Calculation result:', result);
            newLastResult = result;
            newShowResult = true;
            newDisplay = result.toString();
            
            // Notify parent component
            onEquationComplete?.(newUserInput, result);
            console.log('📤 Notified parent with result:', result);
          } catch (error) {
            console.error('❌ Calculation error:', error);
            newDisplay = 'ERROR';
            newShowResult = true;
          }
        } else {
          console.log('⚠️ No user input to calculate');
        }
      } else {
        // Add number or operator
        
        // If we were showing a result, clear it and start fresh
        if (prev.showResult) {
          newUserInput = actualValue;
          newShowResult = false;
          newLastResult = undefined;
        } else {
          newUserInput += actualValue;
        }
        
        // For God Tier mode, show different value than what's actually input
        const displayValue = getDisplayValue(actualValue, buttonMapping);
        
        if (prev.showResult) {
          // Starting fresh after a result
          newDisplay = displayValue;
        } else {
          newDisplay = prev.display + displayValue;
        }
      }

      const finalState = {
        display: newDisplay,
        userInput: newUserInput,
        showResult: newShowResult,
        ...(newLastResult !== undefined && { lastResult: newLastResult }),
      };
      

      return finalState;
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
 * Simple and safe basic math evaluator
 */
const evaluateBasicMath = (expression: string): number => {
  // Handle simple two-operand expressions like "6-4", "3+5", "2*7", "8/2"
  const match = expression.match(/^(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)$/);
  
  if (!match) {
    throw new Error('Invalid expression format');
  }
  
  const [, leftStr, operator, rightStr] = match;
  if (!leftStr || !operator || !rightStr) {
    throw new Error('Failed to parse expression components');
  }
  
  const left = parseFloat(leftStr);
  const right = parseFloat(rightStr);
  
  console.log('🔢 Parsed operands:', { left, operator, right });
  
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      if (right === 0) throw new Error('Division by zero');
      return left / right;
    default:
      throw new Error('Unsupported operator');
  }
};

/**
 * Safely evaluate a mathematical expression
 */
const evaluateExpression = (expression: string): number => {
  console.log('🔍 Starting evaluation of:', expression);
  
  // Remove spaces
  const cleaned = expression.replace(/\s/g, '');
  console.log('🧹 After cleaning:', cleaned);
  
  // Validate expression contains only allowed characters
  const isValid = /^[\d+\-×÷.()]+$/.test(cleaned);
  console.log('✅ Validation check:', isValid, 'for pattern:', /^[\d+\-×÷.()]+$/);
  if (!isValid) {
    console.error('❌ Invalid characters in expression:', cleaned);
    throw new Error('Invalid characters in expression');
  }
  
  // Replace mathematical symbols with JavaScript operators
  const jsExpression = cleaned
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  console.log('🔀 JS expression:', jsExpression);
  
  // Use a simple math evaluator instead of Function constructor
  try {
    console.log('🚀 About to evaluate:', jsExpression);
    const result = evaluateBasicMath(jsExpression);
    console.log('📊 Raw result:', result, 'type:', typeof result);
    
    if (typeof result !== 'number' || !isFinite(result)) {
      console.error('❌ Invalid result type or not finite:', result);
      throw new Error('Invalid calculation result');
    }
    
    const rounded = Math.round(result * 1000) / 1000; // Round to 3 decimal places
    console.log('🎯 Final rounded result:', rounded);
    return rounded;
  } catch (error) {
    console.error('❌ Evaluation failed:', error);
    throw new Error('Failed to evaluate expression');
  }
};