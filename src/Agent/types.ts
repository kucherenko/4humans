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

interface CoverageAgentInput extends AgentInput {
  code: string
  tests: string
}

interface MutationAgentInput extends AgentInput {
  // Additional properties for MutationAgent
}

interface LinterAgentInput extends AgentInput {
  // Additional properties for LinterAgent
}

export { AgentInput, TestAgentInput, TestAgentModelInput, CoverageAgentInput, MutationAgentInput, LinterAgentInput }
