import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  coverageDirectory: 'coverage',
  roots: ['<rootDir>/tests'],
  // collectCoverageFrom: [
  //   '<rootDir>/src/**/*.ts',
  //   '!<rootDir>/src/main/**'
  // ],
};

export default config;