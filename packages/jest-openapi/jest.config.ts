import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '..',
  roots: ['<rootDir>/jest-openapi', '<rootDir>/openapi-validator'],
  moduleNameMapper: {
    '^@ehuelsmann/openapi-validator$': '<rootDir>/openapi-validator/index.ts',
  },
  collectCoverageFrom: [
    '<rootDir>/jest-openapi/src/**/*',
    '<rootDir>/openapi-validator/lib/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
