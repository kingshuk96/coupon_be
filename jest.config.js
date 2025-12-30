/* eslint-disable @typescript-eslint/no-require-imports */
const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^@app$': '<rootDir>/src/app.ts',
    '^@config$': '<rootDir>/src/config/index.ts',
    '^@utils$': '<rootDir>/src/utils/index.ts',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  },
};
