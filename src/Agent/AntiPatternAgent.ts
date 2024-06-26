import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { Agent } from './Agent'
import { InputItem } from '../types/input-item'
import { AgentResult, EnumeratorAgentModelInput } from './types'
import { antiPatternAgentPrompt } from './prompts'
import { extractAgentResult } from '../utils/parser'

export class AntiPatternAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, antiPatternAgentPrompt)
  }

  async process(input: InputItem): Promise<AgentResult> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])
    const modelInput: EnumeratorAgentModelInput = {
      code: `// file name: ${input.path}\n${input.code}`,
      tests: [
        Object.entries(input.tests)
          .map(([test, code]) => {
            return `// file name: ${test}\n${code}`
          })
          .join('\n/* ----- file separator------- */\n'),
      ],
    }
    const answer = await chain.invoke({
      ...modelInput,
    })

    return extractAgentResult(answer)
  }
}
