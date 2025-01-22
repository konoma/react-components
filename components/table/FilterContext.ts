import { createContext } from 'react';

export const FilterContext = createContext<{
  filters: Record<string, string>;
  setFilters: (errors: Record<string, string>) => Promise<void>;
}>({
  filters: {} as Record<string, string>,
  setFilters: async () => {
    return;
  },
});
