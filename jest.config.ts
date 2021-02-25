export default {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: [
    "**/__tests__/*.test.ts"
  ],
};
