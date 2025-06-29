import type { ButtonMapping } from '../../shared/types/game';
import type { DifficultyMode } from '../../shared/types/navigation';

/**
 * Generate scrambled button mappings based on difficulty mode
 */
export const generateButtonMapping = (mode: DifficultyMode): ButtonMapping => {
  switch (mode) {
    case 'easy':
      return {
        numbers: scrambleNumbers(),
        operators: {}, // Operators work normally in easy mode
      };
    case 'medium':
      return {
        numbers: scrambleNumbers(),
        operators: scrambleOperators(),
      };
    case 'hard':
      return scrambleNumbersAndOperators();
    case 'hardcore':
      return scrambleEverything();
    case 'godtier':
      return scrambleEverythingIncludingDisplay();
    default:
      return { numbers: {}, operators: {} };
  }
};

/**
 * Scramble only numbers (0-9) for Easy mode
 */
const scrambleNumbers = (): { [key: string]: string } => {
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const shuffled = [...numbers];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  
  // Create mapping from original to scrambled
  const mapping: { [key: string]: string } = {};
  numbers.forEach((original, index) => {
    mapping[original] = shuffled[index]!;
  });
  
  return mapping;
};

/**
 * Scramble only operators for Medium mode
 */
const scrambleOperators = (): { [key: string]: string } => {
  const operators = ['+', '-', '×', '÷'];
  const shuffled = [...operators];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  
  const mapping: { [key: string]: string } = {};
  operators.forEach((original, index) => {
    mapping[original] = shuffled[index]!;
  });
  
  return mapping;
};

/**
 * Mix numbers and operators together for Hard mode
 */
const scrambleNumbersAndOperators = (): ButtonMapping => {
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const operators = ['+', '-', '×', '÷'];
  const allButtons = [...numbers, ...operators];
  const shuffled = [...allButtons];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  
  // Create separate mappings for numbers and operators
  const numberMapping: { [key: string]: string } = {};
  const operatorMapping: { [key: string]: string } = {};
  
  let shuffleIndex = 0;
  
  // Map numbers
  numbers.forEach(num => {
    numberMapping[num] = shuffled[shuffleIndex]!;
    shuffleIndex++;
  });
  
  // Map operators
  operators.forEach(op => {
    operatorMapping[op] = shuffled[shuffleIndex]!;
    shuffleIndex++;
  });
  
  return {
    numbers: numberMapping,
    operators: operatorMapping,
  };
};

/**
 * Scramble everything except delete for Hardcore mode
 */
const scrambleEverything = (): ButtonMapping => {
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const operators = ['+', '-', '×', '÷'];
  const actions = ['=']; // Delete always works normally
  const allButtons = [...numbers, ...operators, ...actions];
  const shuffled = [...allButtons];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  
  const numberMapping: { [key: string]: string } = {};
  const operatorMapping: { [key: string]: string } = {};
  const actionMapping: { [key: string]: string } = {};
  
  let shuffleIndex = 0;
  
  // Map numbers
  numbers.forEach(num => {
    numberMapping[num] = shuffled[shuffleIndex]!;
    shuffleIndex++;
  });
  
  // Map operators
  operators.forEach(op => {
    operatorMapping[op] = shuffled[shuffleIndex]!;
    shuffleIndex++;
  });
  
  // Map actions (equals button)
  actions.forEach(action => {
    actionMapping[action] = shuffled[shuffleIndex]!;
    shuffleIndex++;
  });
  
  return {
    numbers: numberMapping,
    operators: { ...operatorMapping, ...actionMapping },
  };
};

/**
 * God Tier mode - even the display lies
 */
const scrambleEverythingIncludingDisplay = (): ButtonMapping => {
  const baseMapping = scrambleEverything();
  
  // Create display mapping that shows different values than what's actually input
  const displayMapping: { [key: string]: string } = {};
  const allValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '×', '÷', '='];
  const shuffledDisplay = [...allValues];
  
  // Shuffle display values
  for (let i = shuffledDisplay.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDisplay[i], shuffledDisplay[j]] = [shuffledDisplay[j]!, shuffledDisplay[i]!];
  }
  
  // Map each actual value to a different display value
  allValues.forEach((value, index) => {
    displayMapping[value] = shuffledDisplay[index]!;
  });
  
  return {
    ...baseMapping,
    display: displayMapping,
  };
};

/**
 * Apply button mapping to get actual value when button is pressed
 */
export const getActualValue = (buttonId: string, mapping: ButtonMapping): string => {
  // Delete button always works normally
  if (buttonId === 'delete') {
    return 'delete';
  }
  
  // Check if it's a number
  if (/^\d$/.test(buttonId)) {
    return mapping.numbers[buttonId] || buttonId;
  }
  
  // Convert text-based operator IDs to mathematical notation
  const operatorMap: { [key: string]: string } = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷',
    'equals': '='
  };
  
  // Check if it's a text-based operator ID
  if (operatorMap[buttonId]) {
    const mathSymbol = operatorMap[buttonId];
    return mapping.operators[mathSymbol] || mathSymbol;
  }
  
  // Check if it's already a mathematical symbol
  if (['+', '-', '×', '÷', '='].includes(buttonId)) {
    return mapping.operators[buttonId] || buttonId;
  }
  
  // Default to original value
  return buttonId;
};

/**
 * Get display value for God Tier mode (what user sees vs what's actually input)
 */
export const getDisplayValue = (actualValue: string, mapping: ButtonMapping): string => {
  if (mapping.display && mapping.display[actualValue]) {
    return mapping.display[actualValue];
  }
  return actualValue;
};