import { AgentResult } from '../types'
import { parseStringPromise } from 'xml2js'
import { logger } from '../../logger'

async function parseAgentAnswer(answer: string): Promise<AgentResult> {
  const result: AgentResult = {
    suggestions: [],
    files: [],
  }
  const regex = /---(.+?)---([\s\S]*?)---end---/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(answer)) !== null) {
    if (match[1] && match[2]) {
      const filePath = match[1].trim()
      const codeBlock = match[2].trim()

      try {
        const xmlObject = await parseStringPromise(codeBlock, { trim: true, explicitArray: false })
        const suggestion = xmlObject.block.suggestion
        const code = xmlObject.block.code.trim()
        const file = xmlObject.block.file.trim()

        result.suggestions.push(suggestion + '\n' + code)
        result.files.push([filePath, file])
      } catch (error) {
        logger.error('Error parsing agent answer')
      }
    }
  }

  return result
}

export { parseAgentAnswer }
