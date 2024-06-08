import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { coverageAgentPrompt } from './prompts'
import { CoverageAgentModelInput } from './types'
import { InputItem } from '../types/input-item'
import { describeCoverageReport } from '../utils/uncoverad'
import { Coverage } from '../types/coverage'

class CoverageAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, coverageAgentPrompt)
  }

  async process(input: InputItem): Promise<Record<string, string>> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])

    const modelInput: CoverageAgentModelInput = {
      path: input.path,
      code: input.code,
      tests: JSON.stringify(input.tests),
      coverageReport: JSON.stringify(describeCoverageReport(input.coverage as Coverage)),
    }

    const answer = await chain.invoke({
      ...modelInput,
    })

    return this.parseAnswer(answer)
  }

  private parseAnswer = (answer: string): Record<string, string> => {
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

    return result
  }
}

export { CoverageAgent }
