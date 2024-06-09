import { AgentResult } from '../types'

function parseAgentAnswer(answer: string): AgentResult {
  const result: Record<string, string> = {}
  const regex = /---(.+?)---([\s\S]*?)---end---/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(answer)) !== null) {
    if (match[1] && match[2]) {
      const filePath = match[1].trim()
      const code = match[2].trim()
      result[filePath] = code
    }
  }

  return result as never as AgentResult
}

export { parseAgentAnswer }
