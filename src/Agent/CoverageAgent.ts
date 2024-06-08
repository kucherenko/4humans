import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { coverageAgentPrompt } from './prompts'
import { CoverageAgentModelInput } from './types'
import { InputItem } from '../types/input-item'

class CoverageAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, coverageAgentPrompt)
  }

  async process(input: InputItem): Promise<string> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])
    const modelInput: CoverageAgentModelInput = {
      code: input.code,
      tests: input.tests[input.path] || '',
    }
    return chain.invoke({
      ...modelInput,
    })
  }
}

export { CoverageAgent }
