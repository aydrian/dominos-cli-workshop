/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
    },
  },
})
