import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { coverageAgentPrompt } from './prompts'
import { CoverageAgentInput } from './types'

class CoverageAgent extends Agent {
  constructor(model: BaseChatModel, input: CoverageAgentInput) {
    super(model, coverageAgentPrompt, input)
  }

  async process(): Promise<string> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])

    return chain.invoke({
      ...this.input,
    })
  }
}

export { CoverageAgent }
