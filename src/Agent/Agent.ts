import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { ChatPromptTemplate } from '@langchain/core/prompts'

import { AgentInput } from './types'
import { AgentPrompt } from './prompts'

abstract class Agent {
  protected model: BaseChatModel
  protected prompt: ChatPromptTemplate
  protected input: AgentInput

  protected constructor(model: BaseChatModel, prompt: AgentPrompt, input: AgentInput) {
    this.model = model
    this.prompt = ChatPromptTemplate.fromMessages(prompt)
    this.input = input
  }

  abstract process(): Promise<string>
}

export { Agent }
