import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { linterAgentPrompt } from './prompts'
import { LinterAgentInput } from './types'

class LinterAgent extends Agent {
  constructor(model: BaseChatModel, input: LinterAgentInput) {
    super(model, linterAgentPrompt, input)
  }

  async process(): Promise<never> {
    throw new Error('Method not implemented.')
  }
}

export { LinterAgent }
