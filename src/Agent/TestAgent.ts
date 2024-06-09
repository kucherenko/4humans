import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { testAgentPrompt } from './prompts'
import { InputItem } from '../types/input-item'
import { AgentResult, TestAgentModelInput } from 'src/Agent/types'
import { parseAgentAnswer } from './utils/parseAgentAnswer'

class TestAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, testAgentPrompt)
  }

  async process(_input: InputItem): Promise<AgentResult> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])

    const modelInput: TestAgentModelInput = {
      code: _input.code,
      tests: _input.tests[_input.path] || '',
      testReport: JSON.stringify(_input.report, null, 2),
    }

    const answer = await chain.invoke({
      ...modelInput,
    })

    return parseAgentAnswer(answer)
  }
}

export { TestAgent }
