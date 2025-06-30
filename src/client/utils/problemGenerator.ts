import type { MathProblem } from '../../shared/types/game';
import type { DifficultyMode } from '../../shared/types/navigation';

/**
 * Generate a math problem based on difficulty mode
 */
export const generateProblem = (mode: DifficultyMode): MathProblem => {
  switch (mode) {
    case 'easy':
      return generateEasyProblem();
    case 'medium':
      return generateMediumProblem();
    case 'hard':
      return generateHardProblem();
    case 'hardcore':
      return generateHardcoreProblem();
    case 'godtier':
      return generateGodTierProblem();
    default:
      return generateEasyProblem();
  }
};

/**
 * Generate Easy mode problems: single-digit addition and subtraction
 */
const generateEasyProblem = (): MathProblem => {
  const operations = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  if (operation === '+') {
    // Addition: result between 2 and 18 (1+1 to 9+9)
    const result = Math.floor(Math.random() * 17) + 2; // 2-18
    const solutions = generateAdditionSolutions(result);
    
    return {
      equation: `_ + _ = ${result}`,
      targetValue: result,
      possibleSolutions: solutions,
      difficulty: 'easy',
    };
  } else {
    // Subtraction: first number 2-18, result 1-9
    const result = Math.floor(Math.random() * 9) + 1; // 1-9
    const firstNumber = result + Math.floor(Math.random() * 9) + 1; // result+1 to result+9
    const solutions = generateSubtractionSolutions(firstNumber, result);
    
    return {
      equation: `_ - _ = ${result}`,
      targetValue: result,
      possibleSolutions: solutions,
      difficulty: 'easy',
    };
  }
};

/**
 * Generate Medium mode problems: single-digit with all four operations
 */
const generateMediumProblem = (): MathProblem => {
  const operations = ['+', '-', '×', '÷'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  switch (operation) {
    case '+':
      return generateEasyProblem(); // Same as easy for addition
    case '-':
      return generateEasyProblem(); // Same as easy for subtraction
    case '×': {
      // Multiplication: single digits, result up to 81
      const factor1 = Math.floor(Math.random() * 9) + 1; // 1-9
      const factor2 = Math.floor(Math.random() * 9) + 1; // 1-9
      const result = factor1 * factor2;
      const solutions = generateMultiplicationSolutions(result);
      
      return {
        equation: `_ × _ = ${result}`,
        targetValue: result,
        possibleSolutions: solutions,
        difficulty: 'medium',
      };
    }
    case '÷': {
      // Division: ensure clean division
      const divisor = Math.floor(Math.random() * 9) + 1; // 1-9
      const quotient = Math.floor(Math.random() * 9) + 1; // 1-9
      const dividend = divisor * quotient;
      const divSolutions = [`${dividend}÷${divisor}`];
      
      return {
        equation: `_ ÷ _ = ${quotient}`,
        targetValue: quotient,
        possibleSolutions: divSolutions,
        difficulty: 'medium',
      };
    }
    default:
      return generateEasyProblem();
  }
};

/**
 * Generate Hard mode problems: two-digit operations
 */
const generateHardProblem = (): MathProblem => {
  const operations = ['+', '×'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  if (operation === '+') {
    // Two-digit addition: 10-99 + 10-99
    const result = Math.floor(Math.random() * 80) + 20; // 20-99
    const solutions = generateTwoDigitAdditionSolutions(result);
    
    return {
      equation: `_ _ + _ _ = ${result}`,
      targetValue: result,
      possibleSolutions: solutions,
      difficulty: 'hard',
    };
  } else {
    // Two-digit multiplication: 10-99 × single digit
    const singleDigit = Math.floor(Math.random() * 9) + 1; // 1-9
    const twoDigit = Math.floor(Math.random() * 90) + 10; // 10-99
    const result = twoDigit * singleDigit;
    const solutions = [`${twoDigit}×${singleDigit}`, `${singleDigit}×${twoDigit}`];
    
    return {
      equation: `_ _ × _ = ${result}`,
      targetValue: result,
      possibleSolutions: solutions,
      difficulty: 'hard',
    };
  }
};

/**
 * Generate Hardcore mode problems: most challenging combinations
 */
const generateHardcoreProblem = (): MathProblem => {
  // Mix of hard two-digit and complex single-digit operations
  const problemTypes = ['two-digit-add', 'two-digit-mult', 'complex-single'];
  const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
  
  if (type === 'complex-single') {
    // Complex single-digit with multiple operations possible
    const result = Math.floor(Math.random() * 50) + 10; // 10-59
    const solutions = generateComplexSolutions(result);
    
    return {
      equation: `_ ? _ = ${result}`,
      targetValue: result,
      possibleSolutions: solutions,
      difficulty: 'hardcore',
    };
  } else {
    // Use hard mode generation
    return { ...generateHardProblem(), difficulty: 'hardcore' };
  }
};

/**
 * Generate God Tier problem: single "impossible" challenge
 */
const generateGodTierProblem = (): MathProblem => {
  // The ultimate challenge - a specific problem that's very difficult
  const godTierProblems = [
    {
      equation: '_ _ _ = 42',
      targetValue: 42,
      possibleSolutions: ['6×7', '7×6', '84÷2', '21+21', '50-8'],
    },
    {
      equation: '_ _ _ = 100',
      targetValue: 100,
      possibleSolutions: ['10×10', '50+50', '200÷2', '99+1'],
    },
  ];
  
  const problem = godTierProblems[Math.floor(Math.random() * godTierProblems.length)]!;
  
  return {
    ...problem,
    difficulty: 'godtier',
  };
};

/**
 * Generate all possible single-digit addition solutions for a target
 */
const generateAdditionSolutions = (target: number): string[] => {
  const solutions: string[] = [];
  
  for (let a = 0; a <= 9; a++) {
    for (let b = 0; b <= 9; b++) {
      if (a + b === target) {
        solutions.push(`${a}+${b}`);
      }
    }
  }
  
  return solutions;
};

/**
 * Generate subtraction solutions
 */
const generateSubtractionSolutions = (minuend: number, result: number): string[] => {
  const solutions: string[] = [];
  const subtrahend = minuend - result;
  
  if (subtrahend >= 0 && subtrahend <= 9 && minuend <= 18) {
    solutions.push(`${minuend}-${subtrahend}`);
  }
  
  return solutions;
};

/**
 * Generate multiplication solutions for a target
 */
const generateMultiplicationSolutions = (target: number): string[] => {
  const solutions: string[] = [];
  
  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
      if (a * b === target) {
        solutions.push(`${a}×${b}`);
        if (a !== b) {
          solutions.push(`${b}×${a}`);
        }
      }
    }
  }
  
  return solutions;
};

/**
 * Generate two-digit addition solutions
 */
const generateTwoDigitAdditionSolutions = (target: number): string[] => {
  const solutions: string[] = [];
  
  for (let a = 10; a <= 99; a++) {
    const b = target - a;
    if (b >= 10 && b <= 99) {
      solutions.push(`${a}+${b}`);
    }
  }
  
  return solutions.slice(0, 10); // Limit to first 10 solutions
};

/**
 * Generate complex solutions using multiple operations
 */
const generateComplexSolutions = (target: number): string[] => {
  const solutions: string[] = [];
  
  // Add some addition solutions
  solutions.push(...generateAdditionSolutions(target).slice(0, 3));
  
  // Add some multiplication solutions
  solutions.push(...generateMultiplicationSolutions(target).slice(0, 3));
  
  // Add some subtraction solutions
  for (let a = target + 1; a <= target + 20 && a <= 99; a++) {
    const b = a - target;
    if (b >= 1 && b <= 9) {
      solutions.push(`${a}-${b}`);
    }
  }
  
  return solutions.slice(0, 8); // Limit total solutions
};

/**
 * Validate if a user's equation equals the target value
 */
export const validateEquation = (equation: string, targetValue: number): boolean => {
  try {
    // Parse and evaluate the equation
    const result = evaluateEquation(equation);
    const isValid = Math.abs(result - targetValue) < 0.001; // Handle floating point precision

    return isValid;
  } catch (error) {
    console.error('❌ Validation error:', error);
    return false;
  }
};

/**
 * Simple and safe basic math evaluator for validation
 */
const evaluateBasicMathForValidation = (expression: string): number => {
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
 * Safely evaluate a mathematical equation
 */
const evaluateEquation = (equation: string): number => {
  // Remove spaces and validate characters
  const cleaned = equation.replace(/\s/g, '');
  
  // Only allow numbers, +, -, ×, ÷
  if (!/^[\d+\-×÷.]+$/.test(cleaned)) {
    throw new Error('Invalid characters in equation');
  }
  
  // Replace × and ÷ with * and /
  const jsExpression = cleaned.replace(/×/g, '*').replace(/÷/g, '/');
  
  // Use our safe math evaluator instead of Function constructor
  return evaluateBasicMathForValidation(jsExpression);
};