interface AgentInput {
  projectPath: string
}

interface TestAgentInput extends AgentInput {
  // Additional properties for TestAgent
}

interface CoverageAgentInput extends AgentInput {
  // Additional properties for CoverageAgent
}

interface MutationAgentInput extends AgentInput {
  // Additional properties for MutationAgent
}

interface LinterAgentInput extends AgentInput {
  // Additional properties for LinterAgent
}

export { AgentInput, TestAgentInput, CoverageAgentInput, MutationAgentInput, LinterAgentInput }
