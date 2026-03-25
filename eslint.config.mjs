import { createRequire } from 'module';
import eslintConfigPrettier from 'eslint-config-prettier';

const require = createRequire(import.meta.url);
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

const config = [...nextCoreWebVitals, eslintConfigPrettier];
export default config;
