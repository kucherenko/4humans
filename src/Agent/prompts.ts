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

  If code is not satisfactory, provide instructions on how to improve the unit tests code using blocks of code instead of writing all code again.

  Code:
  {code}

  Existing test:
  {tests}

  Return analysis of tests in the following format:
  ---<path to test>---
  <test code analysis>
  ---end---
  Use Github Markdown format for the output with 3 backticks for code snippets and headings as needed
  `,
  ],
]

export const enumeratorAgentPrompt: AgentPrompt = [
  [
    'system',
    `Act as a software developer. Analyze tests for the provided code and identify Enumerator anti-pattern.
     Enumerator - Unit tests where each test case method name is only an enumeration, e.g. test1, test2, test3. As a result, the intention of the test case is unclear, and the only way to be sure is to read the test case code and pray for clarity.
    Write list of blocks with the issues and suggest improvements.

     Code:
    {code}

    Existing tests:
    {tests}

   Return the list short (up to 200 symbols) and clear suggestions for code blocks to improve them, skip the recommendation if it is not Enumerator anti-pattern.

  ---path to test file---
  {
    "suggestions": [{"text": "<suggestion text>", "code": "<block of code with anti-pattern>"],
    
    "files": [
      {"file": "<full test content file>"}
    ]
  }
  <block>
  <suggestion>Suggestion</suggestion>
  <code>
    <!CDATA[<block of code with anti-pattern>]>
  </code>
  <file>
    <!CDATA[<full test content file>]>
  </file>
  </block>
  ---end---

  Use Github Markdown format for the output with 3 backticks for code snippets and headings as needed
   `,
  ],
]

const coverageAgentPrompt: AgentPrompt = [
  [
    'system',
    `Act as a experienced software developer. Analyze the test coverage report for the provided code which has uncovered lines, branches and functions, and identify parts of the code that are not covered by tests. 
    Write tests to cover the uncovered parts of the code. Only write a code in your answer. If no tests are needed, just say that the code is fully covered.
    Use only real path to test from the input.

    Path to code file:
    {path}

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
  Use Github Markdown format for the output with 3 backticks for code snippets and headings as needed
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
  Use Github Markdown format for the output with 3 backticks for code snippets and headings as needed
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
  Use Github Markdown format for the output with 3 backticks for code snippets and headings as needed
  `,
  ],
]

export { testAgentPrompt, coverageAgentPrompt, mutationAgentPrompt, linterAgentPrompt, AgentPrompt }
