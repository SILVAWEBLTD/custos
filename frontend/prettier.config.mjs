/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
