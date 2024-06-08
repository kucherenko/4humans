import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { PromptTemplate } from '@langchain/core/prompts'

import { AgentInput } from './types'

abstract class Agent {
  protected model: BaseChatModel
  protected prompt: PromptTemplate
  protected input: AgentInput

  protected constructor(model: BaseChatModel, prompt: string, input: AgentInput) {
    this.model = model
    this.prompt = PromptTemplate.fromTemplate(prompt)
    this.input = input
  }

  abstract process(): Promise<never>
}

export { Agent }
