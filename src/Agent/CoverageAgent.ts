import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { coverageAgentPrompt } from './prompts'
import { CoverageAgentInput } from './types'

class CoverageAgent extends Agent {
  constructor(model: BaseChatModel, input: CoverageAgentInput) {
    super(model, coverageAgentPrompt, input)
  }

  async process(): Promise<never> {
    throw new Error('Method not implemented.')
  }
}

export { CoverageAgent }
