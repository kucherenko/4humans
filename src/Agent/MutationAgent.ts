import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { mutationAgentPrompt } from './prompts'
import { InputItem } from '../types/input-item'

class MutationAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, mutationAgentPrompt)
  }

  async process(_input: InputItem): Promise<string> {
    return Promise.resolve('')
  }
}

export { MutationAgent }
