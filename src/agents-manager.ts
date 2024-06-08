import { Agent } from './Agent/Agent'
import { FinalInputData } from './types/final-input-data'
import { logger } from './logger'

export class AgentsManager {
  private agents: Agent[] = []

  constructor(private finalInputData: FinalInputData) {}

  addAgent(agent: Agent) {
    this.agents.push(agent)
  }

  async run() {
    logger.log('Running agents...')
    const results = []
    for (const file of Object.keys(this.finalInputData?.files)) {
      logger.log(`Processing file: ${file}`)
      for (const agent of this.agents) {
        results.push(await agent.process())
      }
    }
    console.log(results)
    return results
  }
}
