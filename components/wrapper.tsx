import { createContext, type ReactNode } from 'react';

export const i18nContext = createContext({ locale: 'en' });

export default function ComponentsWrapper({ children, locale }: { children: ReactNode; locale?: string }) {
  return <i18nContext.Provider value={{ locale: locale ?? 'en' }}>{children}</i18nContext.Provider>;
}
