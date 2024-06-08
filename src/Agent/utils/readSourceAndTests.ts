import { readFiles } from '../../utils/fileUtils'
import { logger } from '../../logger'
import { RepoSource } from '../types'

type SourceCodeFile = string
type TestFile = string

async function readSourceAndTests(files: Record<SourceCodeFile, TestFile[]>): Promise<RepoSource> {
  const codeFilePaths: Set<string> = new Set()
  const testFilePaths: Set<string> = new Set()

  for (const [key, paths] of Object.entries(files)) {
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

export { readSourceAndTests }
