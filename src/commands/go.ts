import { ArgumentsCamelCase, Argv } from 'yargs'
import { logger } from '../logger'
import degit from 'degit'
import { bold } from 'picocolors'
import { existsSync, readFileSync, readJSONSync } from 'fs-extra'
import { CoverageAgent, LinterAgent, MutationAgent, TestAgent } from '../Agent'
import { ChatOpenAI } from '@langchain/openai'
import { parse } from 'junit2json'
import { getTestsForUncoveredFiles } from '../utils/uncoverad'
import { spawnSync } from 'node:child_process'

interface GoArgv {
  repo?: string
  path?: string
  skipCloning?: boolean
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
    .option('skip-cloning', {
      alias: 's',
      type: 'boolean',
      default: false,
      describe: 'Skip cloning the repository.',
    })
}

export async function handler(argv: ArgumentsCamelCase<GoArgv>) {
  const { repo = '', path } = argv

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

  logger.log(tests.status, tests.stderr.toString())

  const report = existsSync(config.test.report) ? await parse(readFileSync(config.test.report, 'utf-8').toString()) : ''
  const coverageReport = existsSync(config.test.coverage) ? readJSONSync(config.test.coverage) : {}

  const finalInputData = {
    execution: report,
    uncovered: getTestsForUncoveredFiles(coverageReport),
    coverage: coverageReport,
    errors: tests.status ? tests.stderr.toString() : '',
  }

  logger.debug(finalInputData)

  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-16k',
  })

  const coverageAgent = new CoverageAgent(model, {} as never)
  const linterAgent = new LinterAgent(model, {} as never)
  const mutationAgent = new MutationAgent(model, {} as never)
  const testAgent = new TestAgent(model, {} as never)

  await coverageAgent.process()
  await linterAgent.process()
  await mutationAgent.process()
  await testAgent.process()

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
