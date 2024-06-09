import { Agent } from './Agent/Agent'
import { FinalInputData } from './types/final-input-data'
import { logger } from './logger'
import { InputItem } from './types/input-item'
import { State } from './state'
import { AgentResult } from './Agent/types'
import { existsSync, readJSONSync, writeFileSync } from 'fs-extra'
import { runTests } from './utils/run-tests'

interface Config {
  install: string
  test: {
    command: string
    coverage: string
  }
}

export class AgentsManager {
  private agents: Agent[] = []
  private state: State = new State()

  constructor(
    private finalInputData: FinalInputData,
    private config: Config,
  ) {}

  init() {
    const files = this.finalInputData.files

    const setOfFiles = new Set<string>()
    for (const [file, tests] of Object.entries(files)) {
      setOfFiles.add(file)
      tests.forEach((test) => setOfFiles.add(test))
    }
    this.state.init(Array.from(setOfFiles))
  }

  addAgent(agent: Agent) {
    this.agents.push(agent)
  }

  async run() {
    logger.log('Running agents...')
    logger.debug('Config:', this.config)

    const results: Array<string | Record<string, string> | AgentResult> = []

    // go through each pair(file with tests) and run the agents
    const pairs = this.finalInputData?.files ? Object.entries(this.finalInputData?.files) : []
    while (pairs.length) {
      const pair = pairs.shift()
      if (!pair) {
        continue
      }
      const [file, tests] = pair
      logger.info(`Processing file: ${file}`)
      const { test } = this.config
      const coverageReport = existsSync(test?.coverage as string) ? readJSONSync(test?.coverage as string) : {}
      const fileCoverage = coverageReport[file] || {}

      const input: InputItem = {
        path: file,
        code: this.state.getFinalFile(file),
        tests: tests.reduce((acc: Record<string, string>, test: string) => {
          acc[test] = this.state.getFinalFile(test)
          return acc
        }, {}),
        coverage: fileCoverage,
        report: this.finalInputData.execution,
      }

      for (const agent of this.agents) {
        const result = await agent.process(input)
        const { files, suggestions } = result
        for (const [file, content] of Object.entries(files)) {
          if (existsSync(file)) {
            writeFileSync(file, content.toString())
          }
        }
        const tests = runTests(this.config, { install: false })
        if (tests.status) {
          logger.error(tests.stderr.toString())
          for (const [file] of Object.entries(files)) {
            if (existsSync(file)) {
              writeFileSync(file, this.state.getFinalFile(file))
            }
          }
        } else {
          for (const [file, content] of Object.entries(files)) {
            if (existsSync(file)) {
              this.state.setFile(file, content.toString())
              suggestions.forEach((suggestion) => this.state.addSuggestions(file, suggestion))
            }
          }
        }
      }
    }
    return results
  }
}
