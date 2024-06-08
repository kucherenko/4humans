import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { testAgentPrompt } from './prompts'
import { TestAgentInput } from './types'

class TestAgent extends Agent {
  constructor(model: BaseChatModel, input: TestAgentInput) {
    super(model, testAgentPrompt, input)
  }

  async process(): Promise<never> {
    throw new Error('Method not implemented.')
  }
}

export { TestAgent }
