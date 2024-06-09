import { Agent } from './Agent/Agent'
import { FinalInputData } from './types/final-input-data'
import { logger } from './logger'
import { InputItem } from './types/input-item'
import { State } from './state'
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
    private retry: number = 0,
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

    // go through each pair(file with tests) and run the agents
    const pairs = this.finalInputData?.files ? Object.entries(this.finalInputData?.files) : []

    const tasks: [string, string[], Agent, number][] = []

    for (const pair of pairs) {
      for (const agent of this.agents) {
        tasks.push([...pair, agent, 0])
      }
    }

    while (tasks.length) {
      const task = tasks.shift()
      if (!task) {
        continue
      }
      const [file, tests, agent, retry] = task

      logger.info(`Processing file: ${file}`, retry)

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

      const result = await agent.process(input)

      const { files, suggestions } = result

      for (const [file, content] of files) {
        if (existsSync(file)) {
          logger.info(`Writing file: ${file}`)
          writeFileSync(file, content)
        }
      }

      const testsResult = runTests(this.config, { install: false })
      logger.log('Tests result:', testsResult.status)
      if (testsResult.status) {
        logger.error(testsResult.stderr.toString())
        for (const [file] of files) {
          if (existsSync(file)) {
            writeFileSync(file, this.state.getFinalFile(file))
          }
        }
        if (Number(retry) < this.retry) {
          tasks.push([file, tests, agent, Number(retry) + 1])
        }
      } else {
        for (const [file, content] of files) {
          if (existsSync(file)) {
            this.state.setFile(file, content)
            suggestions.forEach((suggestion: string) => this.state.addSuggestions(file, suggestion))
          }
        }
      }
    }
    return this.state
  }
}
