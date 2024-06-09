interface AgentInput {}

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
  code: string
  tests: string
  coverageReport: string
}

export interface FixErrorAgentModelInput {
  code: string
  tests: string
  error: string
}

export interface EnumeratorAgentModelInput {
  code: string
  tests: string[]
}

export interface AgentResult {
  files: [string, string][]
  suggestions: [string, string][]
}

export { AgentInput, TestAgentModelInput, CoverageAgentModelInput, RepoSource }
