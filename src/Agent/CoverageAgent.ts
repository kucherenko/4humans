import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

import { Agent } from './Agent'
import { coverageAgentPrompt } from './prompts'
import { AgentResult, CoverageAgentModelInput } from './types'
import { InputItem } from '../types/input-item'
import { describeCoverageReport } from '../utils/uncoverad'
import { Coverage } from '../types/coverage'
import { parseAgentAnswer } from './utils/parseAgentAnswer'

class CoverageAgent extends Agent {
  constructor(model: BaseChatModel) {
    super(model, coverageAgentPrompt)
  }

  async process(input: InputItem): Promise<AgentResult> {
    const outputParser = new StringOutputParser({})

    const chain = RunnableSequence.from([this.prompt, this.model, outputParser])

    const modelInput: CoverageAgentModelInput = {
      code: input.code,
      tests: JSON.stringify(input.tests),
      coverageReport: JSON.stringify(describeCoverageReport(input.coverage as Coverage)),
    }

    const answer = await chain.invoke({
      ...modelInput,
    })

    return parseAgentAnswer(answer)
  }
}

export { CoverageAgent }
