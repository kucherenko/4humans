import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { testAgentPrompt } from './prompts'
import { TestAgentInput, TestAgentModelInput } from './types'
import { InputItem } from '../types/input-item'

class TestAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, testAgentPrompt)
  }

  async process(_input: InputItem): Promise<string> {
    /*
     * TODO:
     *  1. prepare prompt ✅
     *  2. format data to pass to model ✅
     *  3. call model ✅
     *  4. format output for console display
     *  5. return data back to orchestrator (future)
     */

    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])

    return chain.invoke({
      ...this.modelInput,
    })
  }

  private get modelInput(): TestAgentModelInput {
    const i = this.input as TestAgentInput
    return {
      testReport: JSON.stringify(i?.report, null, 2),
      code: JSON.stringify(i?.code, null, 2),
      tests: JSON.stringify(i?.tests, null, 2),
    }
  }
}

export { TestAgent }
