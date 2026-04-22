import { createContext } from 'react';

export const ErrorContext = createContext<{
  errors: Record<string, string[]>
  setErrors: (errors: Record<string, string[]>) => void
}>({
  errors: {} as Record<string, string[]>,
  setErrors: () => {

  },
});
