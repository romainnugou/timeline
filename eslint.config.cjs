module.exports = [
  {
    files: ['*.ts'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@angular-eslint/recommended',
    ],
    parserOptions: {
      project: ['./tsconfig.json'],
      createDefaultProgram: true,
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['*.html'],
    extends: ['plugin:@angular-eslint/template/recommended'],
    rules: {},
  },
];
