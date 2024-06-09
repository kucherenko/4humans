import { ArgumentsCamelCase, Argv } from 'yargs'
import { logger } from '../logger'
import degit from 'degit'
import 'colors'
import { bold, yellow } from 'picocolors'
import { existsSync, readFileSync, readJSONSync, writeFileSync } from 'fs-extra'
import { parse } from 'junit2json'
import { getTestsFiles } from '../utils/uncoverad'
import { AIModel, getAIModel } from '../utils/chatModels'
import { FinalInputData } from '../types/final-input-data'
import { AgentsManager } from '../agents-manager'
import { runTests } from '../utils/run-tests'
import { DummyAgent } from '../Agent/DummyAgent'
import { diffChars } from 'diff'

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

  let pathInput: string = path as string

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

  const tests = runTests(config, { install: true })

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

  const agentModel = getAIModel(model)

  const agentManager = new AgentsManager(finalInputData, config)

  agentManager.init()

  agentManager.addAgent(new DummyAgent(agentModel))

  const results = await agentManager.run()

  try {
    for (const [file, result] of Object.entries(results.getReport())) {
      logger.info(`We have suggestions for file: ${file}`)
      const diff = diffChars(result.old, result.new)
      diff.forEach((part) => {
        // green for additions, red for deletions
        const text = part.added ? part.value.bgGreen : part.removed ? part.value.bgRed : part.value
        process.stderr.write(text)
      })
      result.suggestions.forEach((suggestion: string) => {
        logger.info(yellow(suggestion))
      })
      const res = await logger.prompt('Do you want to apply the suggestions?', {
        type: 'confirm',
        initial: true,
      })
      if (res) {
        writeFileSync(file, result.new)
        logger.success(`Suggestions applied, check ${bold(file)}...`)
      } else {
        writeFileSync(file, result.old)
        logger.success(`Suggestions not applied, check ${bold(file)}...`)
      }
    }
  } catch (error) {
    logger.error(error)
  }
  // logger.log('Results:', results)
}
