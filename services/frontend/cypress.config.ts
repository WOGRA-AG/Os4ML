import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 30000,
    experimentalStudio: true,
  },
});
