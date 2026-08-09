import nextConfig from 'eslint-config-next'
import eslintConfigPrettier from 'eslint-config-prettier'

const eslintConfig = [
  {
    ignores: ['**/next-env.d.ts', '.next/**', 'node_modules/**'],
  },
  ...nextConfig,
  eslintConfigPrettier,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],
      'react/display-name': 'error',
      'react/jsx-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
]

export default eslintConfig
