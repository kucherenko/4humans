import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { linterAgentPrompt } from './prompts'
import { LinterAgentInput } from './types'
import { InputItem } from '../types/input-item'

class LinterAgent extends Agent {
  constructor(model: BaseChatModel, input: LinterAgentInput) {
    super(model, linterAgentPrompt, input)
  }

  async process(_input: InputItem): Promise<string> {
    return Promise.resolve('')
  }
}

export { LinterAgent }
