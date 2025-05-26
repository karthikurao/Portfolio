// src/context/CursorContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the possible variants for the cursor
export type CursorVariant = 'default' | 'link-hover' | 'button-hover' | 'text-input'; // Add more as needed

interface CursorContextType {
  variant: CursorVariant;
  setVariant: Dispatch<SetStateAction<CursorVariant>>; // Allow setting the variant
}

// Create the context with a default undefined value
const CursorContext = createContext<CursorContextType | undefined>(undefined);

// Create the provider component
export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<CursorVariant>('default');

  return (
    <CursorContext.Provider value={{ variant, setVariant }}>
      {children}
    </CursorContext.Provider>
  );
};

// Custom hook to easily use the cursor context
export const useCursor = (): CursorContextType => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};