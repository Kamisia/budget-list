module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  moduleNameMapper: {

    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg|png|jpg|jpeg|gif|webp|avif)$": "<rootDir>/src/test/fileMock.ts",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/e2e/"],
};
