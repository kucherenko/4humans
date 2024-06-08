import { Agent } from './Agent/Agent'
import { FinalInputData } from './types/final-input-data'
import { logger } from './logger'
import { readFileSync } from 'fs-extra'

export class AgentsManager {
  private agents: Agent[] = []

  constructor(private finalInputData: FinalInputData) {}

  addAgent(agent: Agent) {
    this.agents.push(agent)
  }

  async run() {
    logger.log('Running agents...')
    const results = []

    const { coverage = {} }: { coverage: Record<string, object> } = this.finalInputData

    for (const [file, tests] of Object.entries(this.finalInputData?.files)) {
      logger.log(`Processing file: ${file}`)
      const fileCoverage = coverage[file] || {}
      const input = {
        path: file,
        code: readFileSync(file).toString(),
        tests: tests.reduce((acc: Record<string, string>, test: string) => {
          acc[test] = readFileSync(test).toString()
          return acc
        }, {}),
        coverage: fileCoverage,
      }
      logger.debug(input)
      for (const agent of this.agents) {
        results.push(await agent.process())
      }
    }
    return results
  }
}
