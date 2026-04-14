import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30000,
    setupFiles: ['./tests/setup.js'],
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: [
        'src/app.js',
        'src/container.js',
        'src/Infrastructures/database/postgres/pool.js',
      ],
    },
  },
});
