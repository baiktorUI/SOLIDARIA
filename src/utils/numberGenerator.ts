import { create } from 'zustand';

interface NumberStore {
  availableNumbers: Set<number>;
  usedNumbers: Set<number>;
  initialize: () => void;
  getNextNumber: () => number | null;
  reset: () => void;
}

export const useNumberStore = create<NumberStore>((set, get) => ({
  availableNumbers: new Set(Array.from({ length: 90 }, (_, i) => i + 1)),
  usedNumbers: new Set<number>(),
  
  initialize: () => {
    set({
      availableNumbers: new Set(Array.from({ length: 90 }, (_, i) => i + 1)),
      usedNumbers: new Set<number>()
    });
  },
  
  getNextNumber: () => {
    const { availableNumbers, usedNumbers } = get();
    if (availableNumbers.size === 0) return null;
    
    const numbers = Array.from(availableNumbers);
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const selectedNumber = numbers[randomIndex];
    
    availableNumbers.delete(selectedNumber);
    usedNumbers.add(selectedNumber);
    
    set({ availableNumbers, usedNumbers });
    return selectedNumber;
  },
  
  reset: () => {
    set({
      availableNumbers: new Set(Array.from({ length: 90 }, (_, i) => i + 1)),
      usedNumbers: new Set<number>()
    });
  }
}));