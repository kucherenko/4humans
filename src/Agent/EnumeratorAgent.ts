import { Agent } from './Agent'
import { InputItem } from '../types/input-item'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { EnumeratorAgentModelInput } from './types'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { enumeratorAgentPrompt } from './prompts'

export class EnumeratorAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, enumeratorAgentPrompt)
  }

  async process(input: InputItem): Promise<string> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])
    const modelInput: EnumeratorAgentModelInput = {
      code: input.code,
      tests: Object.values(input.tests),
    }
    return chain.invoke({
      ...modelInput,
    })
  }
}
