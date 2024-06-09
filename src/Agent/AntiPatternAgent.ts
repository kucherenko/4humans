import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { InputItem } from '../types/input-item'
import { AgentResult, EnumeratorAgentModelInput } from './types'
import { antiPatternAgentPrompt } from './prompts'
import { parseAgentAnswer } from './utils/parseAgentAnswer'

export class AntiPatternAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, antiPatternAgentPrompt)
  }

  async process(input: InputItem): Promise<AgentResult> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])
    const modelInput: EnumeratorAgentModelInput = {
      code: input.code,
      tests: Object.values(input.tests),
    }
    const answer = await chain.invoke({
      ...modelInput,
    })

    return parseAgentAnswer(answer)
  }
}
