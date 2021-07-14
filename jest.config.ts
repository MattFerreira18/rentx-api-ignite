export default {
  bail: false,
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '@src/(.*)': ['<rootDir>/src/$1'],
    '@configs/(.*)': ['<rootDir>/src/configs/$1'],
    '@utils/(.*)': ['<rootDir>/src/utils/$1'],
    '@modules/(.*)': ['<rootDir>/src/modules/$1'],
    '@shared/(.*)': ['<rootDir>/src/shared/$1'],
    '@errors/(.*)': ['<rootDir>/src/shared/errors/$1'],
    '@providers/(.*)': ['<rootDir>/src/shared/providers/$1'],
  },
};
