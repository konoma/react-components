import type { ReactNode } from 'react';
import { I18nContext } from './I18nContext.ts';

export default function ComponentsWrapper({ children, locale }: Readonly<{ children: ReactNode, locale?: string }>) {
  return <I18nContext value={{ locale: locale ?? 'en' }}>{children}</I18nContext>;
}
