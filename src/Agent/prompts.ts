import { BaseMessagePromptTemplateLike, ChatPromptTemplate } from '@langchain/core/prompts'
import { InputValues } from '@langchain/core/memory'

type AgentPrompt = (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[]

const testAgentPrompt: AgentPrompt = [
  [
    'system',
    `
  Act as a principal software engineer and expert in Unit Testing following RITE way, where tests should be Readable, Isolated, Thorough, Explict.

  Use these practices to analyze the provided test report and identify any issues with the current tests.

  Be succint for analysis, use emojis for visual feedback.

  If code is good, just say it's good.

  If code is not satisfactory, provide instructions on how to improve the unit tests code using blocks of code instead of writing all code again.

  Code:
  {code}

  Existing test:
  {tests}

  Use only real path to test file from the input. Return analysis of tests strictly in the XML Schema:
   
   ---<path to test file>---
  <block>
  <suggestion>Suggestion</suggestion>
  <code>
    <!CDATA[<block of code for suggestion>]>
  </code>
  <file>
    <!CDATA[<full test content file>]>
  </file>
  </block>
   ---end--- 
  `,
  ],
]

const antiPatternAgentPrompt: AgentPrompt = [
  [
    'system',
    `Act as a software developer. Analyze tests for the provided code and identify anti-pattern from the list provided below.
      1. Cuckoo: A test method that sits in the same unit test but does not really belong there.
      2. Anal Probe: A test that uses unhealthy methods, such as reading private fields using reflection.
      3. Conjoined Twins: Tests called unit tests but are actually integration tests due to no isolation between the system-under-test and the tests.
      4. Happy Path: Tests only the expected results without testing for boundaries and exceptions.
      5. Giant: A valid unit test that spans thousands of lines and many test cases, often indicating a God Object in the system-under-test.
      6. Mockery: A unit test with excessive mocks, stubs, and/or fakes, leading to testing the mocks instead of the system-under-test.
      7. Inspector: A unit test that violates encapsulation to achieve 100% code coverage, making refactoring difficult.
      8. Generous Leftovers: One unit test creates data that another test reuses, leading to failures if the "generator" test runs afterward or not at all.
      9. Nitpicker: A unit test comparing complete output when only small parts are relevant, requiring frequent updates for otherwise unimportant details.
      10. Secret Catcher: A test that relies on an exception to be thrown and caught by the testing framework, appearing to do no testing due to the absence of assertions.
      11. Dodger: A unit test with lots of tests for minor side effects but never tests the core desired behavior.
      12. Greedy Catcher: A unit test that catches exceptions and swallows the stack trace, sometimes logging the error but allowing the test to pass.
      13. Sequencer: A unit test that depends on items in an unordered list appearing in the same order during assertions.
      14. Enumerator: Unit tests where each test case method name is only an enumeration (e.g., test1, test2), making the test's intention unclear.
      15. Excessive Setup: A test requiring a lot of setup work, making it difficult to ascertain what is being tested due to the setup "noise."
      16. Line Hitter: Tests that merely hit the code without doing any output analysis, falsely appearing to cover everything.
      17. The Liar: A test that passes in every scenario without validating any behavior, failing to discover any new bugs.
     
    Code:
    {code}

    Existing tests:
    {tests}

   Return the list short (up to 200 symbols) and clear suggestions for code blocks to improve them, skip the recommendation if it is not anti-pattern from the given list.
   Use only real path to test file from the input. Return analysis of tests strictly in the XML Schema:
   
   ---<path to test file>---
  <block>
  <suggestion>Suggestion</suggestion>
  <code>
    <!CDATA[<block of code for suggestion>]>
  </code>
  <file>
    <!CDATA[<full test content file>]>
  </file>
  </block>
   ---end---
   `,
  ],
]

const coverageAgentPrompt: AgentPrompt = [
  [
    'system',
    `Act as an experienced software developer. Analyze the test coverage report for the provided code which has uncovered lines, branches and functions, and identify parts of the code that are not covered by tests. 
    Write tests to cover the uncovered parts of the code. Only write a code in your answer. If no tests are needed, just say that the code is fully covered.
    Use only real path to test file from the input.

    Code:
    {code}

    Existing tests:
    {tests}

    Coverage report:
    {coverageReport}

   Use only real path to test file from the input. Return analysis of tests strictly in the XML Schema:
   
   ---<path to test file>---
  <block>
  <suggestion>Suggestion</suggestion>
  <code>
    <!CDATA[<block of code for suggestion>]>
  </code>
  <file>
    <!CDATA[<full test content file>]>
  </file>
  </block>
   ---end---
   `,
  ],
]

export { testAgentPrompt, coverageAgentPrompt, antiPatternAgentPrompt, AgentPrompt }
