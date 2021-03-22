import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import path from 'path';
import pkg from './package.json';

export default [
  {
    input: './src/index.ts',
    output: [{ file: path.join('dist', pkg.module), format: 'es' }],
    plugins: [
      peerDepsExternal({ includeDependencies: true }),
      typescript({
        check: true,
        typescript: require('typescript'),
        tsconfig: './tsconfig.build.json',
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: [{ file: path.join('dist', pkg.main), format: 'cjs' }],
    plugins: [
      peerDepsExternal({ includeDependencies: true }),
      typescript({
        check: true,
        typescript: require('typescript'),
        tsconfig: './tsconfig.build.json',
      }),
    ],
  },
];
