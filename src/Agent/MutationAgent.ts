import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { mutationAgentPrompt } from './prompts'
import { MutationAgentInput } from './types'

class MutationAgent extends Agent {
  constructor(model: BaseChatModel, input: MutationAgentInput) {
    super(model, mutationAgentPrompt, input)
  }

  async process(): Promise<never> {
    throw new Error('Method not implemented.')
  }
}

export { MutationAgent }
