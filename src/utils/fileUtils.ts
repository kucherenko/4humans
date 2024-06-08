import * as fs from 'node:fs'

const readFiles = async (filePaths: string[]): Promise<string> => {
  const fileContents = await Promise.all(
    filePaths.map(async (filePath) => {
      return fs.readFileSync(filePath, 'utf-8')
    }),
  )
  return fileContents.join('\n')
}

export { readFiles }
