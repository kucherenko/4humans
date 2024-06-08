import { ArgumentsCamelCase, Argv } from 'yargs'
import { logger } from '../logger'
import degit from 'degit'
import { bold } from 'picocolors'
import { readJSONSync } from 'fs-extra'
import { CoverageAgent, LinterAgent, MutationAgent, TestAgent } from '../Agent'
import { ChatOpenAI } from '@langchain/openai'

interface GoArgv {
  repo?: string
  path?: string
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

  await degit(repo).clone(pathInput as string)
  logger.success(`Repository ${bold(repo)} cloned to ${bold(path)}...`)
  logger.success('Start analysis...')
  process.chdir(pathInput as string)
  const config = readJSONSync('.4humans.json')
  logger.box(config)

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
