interface AgentInput {}

interface TestAgentInput extends AgentInput {
  // Additional properties for TestAgent
  code: Record<string, string>
  tests: Record<string, string>[]
  report: Record<string, string>
}

interface TestAgentModelInput {
  testReport: string
  code: string
  tests: string
}

interface RepoSource {
  code: string
  tests: string
}

interface CoverageAgentModelInput {
  path: string
  code: string
  tests: string
  coverageReport: string
}

export interface EnumeratorAgentModelInput {
  code: string
  tests: string[]
}

interface CoverageAgentInput extends AgentInput {
  codePath: string
  testsPaths: string[]
}

interface MutationAgentInput extends AgentInput {
  // Additional properties for MutationAgent
}

interface LinterAgentInput extends AgentInput {
  // Additional properties for LinterAgent
}

export interface AgentResult {
  files: [string, string][]
  suggestions: string[]
  status?: 'ok' | 'error'
}

export {
  AgentInput,
  TestAgentInput,
  TestAgentModelInput,
  CoverageAgentInput,
  CoverageAgentModelInput,
  MutationAgentInput,
  LinterAgentInput,
  RepoSource,
}
