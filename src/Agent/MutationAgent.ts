import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { mutationAgentPrompt } from './prompts'
import { MutationAgentInput } from './types'
import { InputItem } from '../types/input-item'

class MutationAgent extends Agent {
  constructor(model: BaseChatModel, input: MutationAgentInput) {
    super(model, mutationAgentPrompt, input)
  }

  async process(_input: InputItem): Promise<string> {
    return Promise.resolve('')
  }
}

export { MutationAgent }
