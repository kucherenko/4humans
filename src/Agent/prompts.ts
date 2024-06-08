import { BaseMessagePromptTemplateLike, ChatPromptTemplate } from '@langchain/core/prompts'
import { InputValues } from '@langchain/core/memory'

type AgentPrompt = (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]

const testAgentPrompt: AgentPrompt = [
  [
    'system',
    `
  Act as a principal software engineer in Typescript and JavaScript and expert in Unit Testing following RITE way, where tests should be Readable, Isolated, Thorough, Explict.

  Use these practices to analyze the provided test report and identify any issues with the current tests.

  Be succint for analysis, use emojis for visual feedback.

  If code is good, just say it's good.

  If code is not satisfactory, provide instructions on how to improve the unit tests code, use code blocks instead of writing all code again.

  Code:
  {code}

  Existing tests:
  {tests}

  Return the improved tests in the following format:
  ---<path to test>---
  <test code analysis>
  ---end---
  `,
  ],
]

const coverageAgentPrompt: AgentPrompt = [
  [
    'system',
    `Act as a experienced software developer. Analyze the test coverage report for the provided code and identify parts of the code that are not covered by tests. 
    Write tests to cover the uncovered parts of the code. Only write a code in your answer. If no tests are needed, just say that the code is fully covered.
    
    Code:
    {code}
  
    Existing tests:
    {tests}
    
    Coverage report:
    {coverageReport}
  
   Return the improved tests in the following format:
  ---<path to test>---
  <test code>
  ---end---
   `,
  ],
]

const mutationAgentPrompt: AgentPrompt = [
  [
    'system',
    `
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
  `,
  ],
]

const linterAgentPrompt: AgentPrompt = [
  [
    'system',
    `
  Act as a software developer. Analyze the codebase for any linter issues. Suggest and implement improvements to fix the linter issues.

  Code:
  {code}

  Linter issues:
  {linterIssues}

  Return the improved code with linter issues fixed in the following format:
  ---<path to code file>---
  <code>
  ---end---
  `,
  ],
]

export { testAgentPrompt, coverageAgentPrompt, mutationAgentPrompt, linterAgentPrompt, AgentPrompt }
