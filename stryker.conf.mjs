// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
import { execSync } from 'child_process';

const revision = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: 'yarn',
  reporters: ['progress', 'dashboard'],
  testRunner: 'jest',
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.',
  coverageAnalysis: 'perTest',
  ignorePatterns: ['lib'],
  dashboard: {
    project: 'github.com/BedrockStreaming/immutable-set',
    version: revision,
  }
};
export default config;
