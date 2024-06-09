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
  path: string
  code: string
  tests: string
  coverageReport: string
}

export interface EnumeratorAgentModelInput {
  code: string
  tests: string[]
}

export interface AgentResult {
  files: Record<string, string>[]
  suggestions: string[]
  status?: 'ok' | 'error'
}

export { AgentInput, TestAgentModelInput, CoverageAgentModelInput, RepoSource }
