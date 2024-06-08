import { readFiles } from '../../utils/fileUtils'
import { logger } from '../../logger'
import { CoverageAgentInput } from '../types'

async function prepareCoverageAgentInput(uncovered: Record<string, string[]>): Promise<CoverageAgentInput> {
  const codeFilePaths: Set<string> = new Set()
  const testFilePaths: Set<string> = new Set()

  for (const [key, paths] of Object.entries(uncovered)) {
    codeFilePaths.add(key)
    paths.forEach((path) => testFilePaths.add(path))
  }

  const uniqueCodeFilePaths = Array.from(codeFilePaths)
  const uniqueTestFilePaths = Array.from(testFilePaths)

  try {
    const [code, tests] = await Promise.all([readFiles(uniqueCodeFilePaths), readFiles(uniqueTestFilePaths)])

    return { code, tests }
  } catch (error) {
    logger.error('Error reading files:', error)

    return { code: '', tests: '' }
  }
}

export { prepareCoverageAgentInput }
