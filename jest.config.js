// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  // Map test-renderer to react-test-renderer for @testing-library/react-native
  moduleNameMapper: {
    '^test-renderer$': 'react-test-renderer',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  // Optional: collect coverage
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
};
