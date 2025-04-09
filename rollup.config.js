import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };
import { addDirective } from 'rollup-plugin-add-directive';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [
      addDirective(),
      commonjs({
        include: ['node_modules/**'],
      }),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/__tests__/**'],
      }),
    ],

    watch: {
      include: 'src/**',
      exclude: 'node_modules/**'
    },
    external: ['react', 'react-dom', '@emotion/styled', '@emotion/react'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/cjs/index.d.ts', format: 'cjs' }],
    plugins: [dts()],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
