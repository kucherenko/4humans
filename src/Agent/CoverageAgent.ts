import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { coverageAgentPrompt } from './prompts'
import { CoverageAgentInput, CoverageAgentModelInput } from './types'
import { prepareCoverageAgentInput } from './utils/prepareCoverageAgentInput'

class CoverageAgent extends Agent {
  constructor(model: BaseChatModel, input: CoverageAgentInput) {
    super(model, coverageAgentPrompt, input)
  }

  async process(): Promise<string> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])
    const modelInput = await this.getModelInput()
    return chain.invoke({
      ...modelInput,
    })
  }

  private async getModelInput(): Promise<CoverageAgentModelInput> {
    return await prepareCoverageAgentInput(this.input as CoverageAgentInput)
  }
}

export { CoverageAgent }
