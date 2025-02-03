import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      borderRadius: {
        'krc-button': 'var(--krc-button-borderRadius, 1.5rem)',
        'krc-select': 'var(--krc-select-borderRadius, 1.5rem)',
        'krc-modal': 'var(--krc-modal-borderRadius, 0.5rem)',
        'krc-tag': 'var(--krc-tag-borderRadius, 0.75rem)',
        'krc-tagList': 'var(--krc-tagList-borderRadius, 1.5rem)',
        'krc-tagListAdd': 'var(--krc-tagListAdd-borderRadius, 0.75rem)',
        'krc-input': 'var(--krc-input-borderRadius, 1.5rem)',
        'krc-phoneInput': 'var(--krc-phoneInput-borderRadius, 1.5rem)',
        'krc-checkbox': 'var(--krc-checkbox-borderRadius, 0.25rem)',
        'krc-textarea': 'var(--krc-textarea-borderRadius, 1rem)',
        'krc-radiobuttonGroup': 'var(--krc-radiobuttonGroup-borderRadius, 0.5rem)',
        'krc-table': 'var(--krc-table-borderRadius, 1rem)',
        'krc-tableColumnChooser': 'var(--krc-tableColumnChooser-borderRadius, 0.375rem)',
        'krc-tableActions': 'var(--krc-tableActions-borderRadius, 0.375rem)',
      },
    },
  },
  plugins: [],
};
export default config;

export const tailwindContent = config.content as string[];
