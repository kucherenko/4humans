import { AgentResult } from './types'
import { Agent } from './Agent'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { testAgentPrompt } from './prompts'
import { InputItem } from '../types/input-item'

export class DummyAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, testAgentPrompt)
  }

  async process(input: InputItem): Promise<AgentResult> {
    return {
      files: Object.entries(input.tests).map(([test, code]) => {
        return [test, code + ' \n// ' + Math.random()]
      }),
      status: 'ok',
      suggestions: ['Try to improve the code quality', 'Add more tests'],
    }
  }
}
