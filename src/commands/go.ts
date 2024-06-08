import { ArgumentsCamelCase, Argv } from 'yargs'
import { logger } from '../logger'
import degit from 'degit'
import { bold } from 'picocolors'
import { existsSync, readFileSync, readJSONSync } from 'fs-extra'
import { CoverageAgent /*, LinterAgent, MutationAgent, TestAgent*/, TestAgent } from '../Agent'
import { parse } from 'junit2json'
import { getTestsFiles } from '../utils/uncoverad'
import { spawnSync } from 'node:child_process'
import { AIModel, getAIModel } from '../utils/chatModels'
import { FinalInputData } from '../types/final-input-data'
import { AgentsManager } from '../agents-manager'

interface GoArgv {
  repo?: string
  path?: string
  skipCloning?: boolean
  model?: AIModel
}

export const command = 'go <repo>'
export const describe = 'Basic command to display information about the CLI application.'
export const aliases = ['g']

export function builder(yargs: Argv) {
  return yargs
    .positional('repo', {
      type: 'string',
      default: '',
      describe: 'The repository to start tests analysis.',
    })
    .option('path', {
      alias: 'p',
      type: 'string',
      default: '',
      describe: 'The path to clone the repository.',
    })
    .option('model', {
      alias: 'm',
      type: 'string',
      default: 'ollama',
      describe: 'The AI model to use for agents.',
    })
    .option('skip-cloning', {
      alias: 's',
      type: 'boolean',
      default: false,
      describe: 'Skip cloning the repository.',
    })
}

export async function handler(argv: ArgumentsCamelCase<GoArgv>) {
  const { repo = '', path, model } = argv

  let pathInput = path

  if (!path) {
    const repoName = repo.split('/').pop()
    pathInput = await logger.prompt<{ type: 'text'; initial: string }>('Enter the path to clone the repository', {
      initial: `./${repoName}`,
      type: 'text',
    })
  }
  if (!existsSync(pathInput as string)) {
    await degit(repo).clone(pathInput as string)
    logger.success(`Repository ${bold(repo)} cloned to ${bold(path)}...`)
  } else {
    logger.success(`Repository ${bold(repo)} already cloned to ${bold(path)}...`)
  }

  process.chdir(pathInput as string)

  logger.success('Start analysis...')

  const config = existsSync('.4humans.json')
    ? readJSONSync('.4humans.json')
    : {
        install: 'pnpm install',
        test: {
          command: 'pnpm test -- --coverage',
          coverage: './coverage/coverage-final.json',
          report: './reports/report.xml',
        },
      }

  spawnSync(config.install, {
    shell: true,
  })
  const tests = spawnSync(config.test.command, {
    shell: true,
  })

  const report = existsSync(config.test.report) ? await parse(readFileSync(config.test.report, 'utf-8').toString()) : ''
  const coverageReport = existsSync(config.test.coverage) ? readJSONSync(config.test.coverage) : {}
  const uncovered = await getTestsFiles(coverageReport, {
    uncoveredOnly: true,
  })
  const files = await getTestsFiles(coverageReport)
  const finalInputData: FinalInputData = {
    execution: report,
    uncovered,
    files,
    coverage: coverageReport,
    errors: tests.status ? tests.stderr.toString() : '',
  }

  logger.log(finalInputData)

  const agentModel = getAIModel(model)

  const testAgent = new TestAgent(agentModel)
  const coverageAgent = new CoverageAgent(agentModel)
  // const linterAgent = new LinterAgent(agentModel)
  // const mutationAgent = new MutationAgent(agentModel)

  const agentManager = new AgentsManager(finalInputData)
  agentManager.addAgent(testAgent)
  agentManager.addAgent(coverageAgent)
  // agentManager.addAgent(linterAgent)
  // agentManager.addAgent(mutationAgent)

  await agentManager.run()

  /**
   *
   * {"code.ts": {
   *   tests: [...],
   *   coverage: {...},
   *   mutation: {...}
   * }}
   *
   * Data -> Agent -> Orchestrator -> Report (files: {"path": "code", issues: []}) -> Html
   *
   *
   *
   * class CovAgent implements Agent{
   *
   *   constructor(private model) {}
   *
   *   process(input: CovArentInput) {
   *
   *   }
   * }
   *
   * test report
   * uncovered code
   * code tree
   * mutation testing - out of scope for MVP
   * linter issues
   *
   * code not included in tests, but covered -> indirect test
   *
   * TestAgent
   * CoverageAgent
   * MutationAgent
   * LinterAgent
   *
   *
   */
}
