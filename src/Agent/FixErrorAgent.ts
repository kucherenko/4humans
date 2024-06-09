import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { fixErrorAgentPrompt } from './prompts'
import { AgentResult, FixErrorAgentModelInput } from './types'
import { InputItem } from '../types/input-item'
import { extractAgentResult } from '../utils/parser'
import { logger } from '../logger'

export class FixErrorAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, fixErrorAgentPrompt)
  }

  async process(input: InputItem): Promise<AgentResult> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])

    const modelInput: FixErrorAgentModelInput = {
      code: `// file name: ${input.path}\n${input.code}`,
      tests: Object.entries(input.tests)
        .map(([test, code]) => {
          return `// file name: ${test}\n${code}`
        })
        .join('\n/* ---file separator--- */\n'),
      error: input.error as string,
    }

    const answer = await chain.invoke({
      ...modelInput,
    })

    logger.log(answer)
    const result = extractAgentResult(answer)
    logger.log(result)
    return result
  }
}
