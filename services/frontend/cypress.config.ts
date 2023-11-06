import { defineConfig } from 'cypress';

const isDev = process.env['CYPRESS_dev'] === 'true';

export default defineConfig({
  video: true,
  e2e: {
    baseUrl: isDev
      ? 'http://localhost:4200/'
      : 'https://testing.os4ml.wogra.com',
    defaultCommandTimeout: 30000,
    experimentalStudio: true,
  },
});
