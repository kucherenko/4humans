import { readFiles } from '../../utils/fileUtils'
import { logger } from '../../logger'
import { CoverageAgentInput, CoverageAgentModelInput } from '../types'

async function prepareCoverageAgentInput(input: CoverageAgentInput): Promise<CoverageAgentModelInput> {
  const { codePath, testsPaths } = input

  try {
    const [code, tests] = await Promise.all([readFiles([codePath]), readFiles(testsPaths)])

    return { code, tests }
  } catch (error) {
    logger.error('Error reading files:', error)

    return { code: '', tests: '' }
  }
}

export { prepareCoverageAgentInput }
