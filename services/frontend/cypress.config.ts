import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://testing.os4ml.wogra.com',
    defaultCommandTimeout: 30000,
    experimentalStudio: true
  },
});
