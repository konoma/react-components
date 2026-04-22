import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  nextjs: true,
  rules: {
    'style/semi': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-case-declarations': 'off',
    'next/no-img-element': 'off',
    // TODO: Reevaluate
    'react/set-state-in-effect': 'off',
  },
  ignores: ['src/services/api/generated/**'],
});
