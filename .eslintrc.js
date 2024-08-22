module.exports = {
  plugins: ['@stylistic'],
  extends: 'next/core-web-vitals',
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    '@stylistic/indent': ['error', 2],
    'prefer-const': 'warn',
    'object-curly-spacing': ['warn', 'always', { 
      'objectsInObjects': false,
      'arraysInObjects': false,
    }],
    'array-bracket-spacing': ['warn', 'never'],
  }
}
  