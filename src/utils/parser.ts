import { AgentResult } from '../Agent/types'

type TestBlock = {
  path: string
  code: string
}

export function extractTestBlocks(input: string): TestBlock[] {
  const blocks: TestBlock[] = []
  const blockStartRegex = /---(.+?)---/
  const blockEndRegex = /---end---/

  const lines = input.split('\n')
  let isInsideBlock = false
  let currentPath = ''
  let currentCode = ''

  for (const line of lines) {
    if (!isInsideBlock) {
      // Check if the line contains path
      const match = line.match(blockStartRegex)
      if (match && match[1]) {
        isInsideBlock = true
        currentPath = match[1].trim()
        currentCode = ''
      }
    } else {
      // Check for the end of the block
      if (blockEndRegex.test(line)) {
        blocks.push({ path: currentPath, code: currentCode.trim() })
        isInsideBlock = false
      } else {
        currentCode += line + '\n'
      }
    }
  }

  return blocks
}

export const extractAgentResult = (input: string): AgentResult => {
  const blocks = extractTestBlocks(input)

  const suggestions: [string, string][] = []
  const files: [string, string][] = []

  for (const block of blocks) {
    if (block.path.toLowerCase().indexOf('suggestion:') !== -1) {
      const { path = '', code } = block
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'path' implicitly has an 'any' type.
      const file = path.split(':')[1].trim()
      suggestions.push([file, code])
    } else {
      files.push([block.path, block.code])
    }
  }
  return { suggestions, files }
}
