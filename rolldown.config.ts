import { defineConfig } from 'rolldown'

export default defineConfig({
  platform: 'node',
  input: './src/cli.ts',
  output: {
    cleanDir: true,
    dir: './dist',
    format: 'esm',
    entryFileNames: '[name].mjs',
    minify: true,
    banner: '#!/usr/bin/env node',
  },
})
