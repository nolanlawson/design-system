const branch = require('git-branch');
const resolution = { width: 1024, height: 768 };

const currentBranch = branch.sync();

const vrtMode = process.env.VRT_MODE;
const VRT_MODE_CHROME = "chrome";
const VRT_MODE_FULL = "full";

const browsersToTest = () => {
  const browserTests = [
    { width: resolution.width, height: resolution.height, name: 'chrome' },
    { width: resolution.width, height: resolution.height, name: 'firefox' },
    { width: resolution.width, height: resolution.height, name: 'safari' },
    { width: resolution.width, height: resolution.height, name: 'edgechromium' }
  ]

  return browserTests.filter(test => {
    return vrtMode === VRT_MODE_FULL || (vrtMode === VRT_MODE_CHROME && test.name === VRT_MODE_CHROME)
  })
}

module.exports = {
  apiKey: process.env.APPLITOOLS_API_KEY,
  appName: 'SLDS',
  matchLevel: 'Strict',
  ignoreDisplacements: true,
  properties: [{ name: 'Group', value: 'desktop' }],
  batchName: process.env.CI ? undefined : '',
  branchName: process.env.CI
    ? undefined
    : `localRun/${process.env.LOGNAME}/${currentBranch}`,
  parentBranchName: process.env.CI ? undefined : `localRun/${currentBranch}`,
  showLogs: process.env.CI || false,
  showStorybookOutput: process.env.CI || false,
  // saveDebugData: false,
  exitcode: false,
  testConcurrency: 100,
  serverUrl: 'https://salesforceuxeyesapi.applitools.com',
  testBlueprintPattern: '.*',
  testNamePattern: '^(?:.+|) ?Sink',
  include: function({ kind, name }) {
    return (
      new RegExp(this.testBlueprintPattern, 'gi').test(kind) &&
      new RegExp(this.testNamePattern, 'gi').test(name)
    );
  },
  puppeteerOptions: process.env.CIRCLECI
    ? { executablePath: '/usr/bin/google-chrome' }
    : undefined,
  waitBeforeScreenshot: 1000,
  browser: browsersToTest()
};
