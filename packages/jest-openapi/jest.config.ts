import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '..',
  roots: ['<rootDir>/jest-openapi', '<rootDir>/openapi-validator'],
  moduleNameMapper: {
    '^@ehuelsmann/openapi-validator$': '<rootDir>/openapi-validator/index.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/jest-openapi/tsconfig.json' }],
  },
  collectCoverageFrom: [
    '<rootDir>/jest-openapi/src/**/*',
    '<rootDir>/openapi-validator/lib/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98,
    },
  },
};

export default config;
