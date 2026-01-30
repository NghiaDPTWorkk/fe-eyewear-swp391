import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // 1. TẮT lỗi Refresh (đã chỉnh từ warn -> off)
      'react-refresh/only-export-components': 'off',

      // 2. CHUYỂN lỗi biến không sử dụng thành cảnh báo nhẹ (để không bị đỏ file)
      '@typescript-eslint/no-unused-vars': 'off',

      // 3. TẮT cảnh báo 'any' (đã chỉnh từ warn -> off)
      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/consistent-type-imports': 'error',

      // General
      'no-console': 'off', // Tắt luôn cho đỡ vướng
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      eqeqeq: ['error', 'always'],

      // Code Style
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-trailing-spaces': 'error',

      // 4. TẮT giới hạn số dòng file (đã chỉnh từ warn -> off)
      'max-lines': 'off'
    }
  },
  {
    files: ['**/*.types.ts', '**/*.d.ts', '*.config.{js,ts}', 'vite.config.ts', 'vitest.config.ts'],
    rules: {
      'max-lines': 'off'
    }
  },
  eslintConfigPrettier
)
