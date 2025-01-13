import type { Config } from 'jest';

const config: Config = {
  rootDir: './',
  preset: 'ts-jest', // Utilisation de ts-jest
  testEnvironment: 'jest-environment-jsdom', // Environnement pour les tests React
  setupFilesAfterEnv: ['./setupTests.ts'], // Configuration des tests
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transformateur TypeScript et React
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Gestion des fichiers CSS
  },
};

export default config;