import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  sourcemap: true,
});
