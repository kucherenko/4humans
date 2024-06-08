const testAgentPrompt = `
  Act as a software developer. Analyze the provided test report and identify any issues with the current tests. 

  Test report:
  {testReport}

  Code:
  {code}

  Existing tests:
  {tests}

  Return the improved tests in the following format:
  ---<path to test>---
  <test code>
  ---end---
  `

const coverageAgentPrompt = `
  Act as a software developer. Analyze the test coverage report for the provided code and identify parts of the code that are not covered by tests.
  Write tests to cover the uncovered parts of the code.

  Coverage report:
  {coverage}

  Code:
  {code}

  Return the new tests in the following format:
  ---<path to test>---
  <test code>
  ---end---
  `

const mutationAgentPrompt = `
  Act as a software developer. Perform mutation testing on the provided codebase. Identify weak tests and suggest improvements or additional tests to catch mutations.

  Code:
  {code}

  Tests:
  {tests}

  Mutation report:
  {mutationReport}

  Return the improved tests in the following format:
  ---<path to test>---
  <test code>
  ---end---
  `

const linterAgentPrompt = `
  Act as a software developer. Analyze the codebase for any linter issues. Suggest and implement improvements to fix the linter issues.

  Code:
  {code}

  Linter issues:
  {linterIssues}

  Return the improved code with linter issues fixed in the following format:
  ---<path to code file>---
  <code>
  ---end---
  `

export { testAgentPrompt, coverageAgentPrompt, mutationAgentPrompt, linterAgentPrompt }