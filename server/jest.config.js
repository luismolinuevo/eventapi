export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest',  // If you're using Babel
    },
    moduleDirectories: ['node_modules', 'src'],
    testMatch: ['**/tests/**/*.test.js'], // Match test files in the 'tests' folder
  };
  