import type { Config } from 'prettier'

export default {
  arrowParens: 'avoid',
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-packagejson'],
} satisfies Config
