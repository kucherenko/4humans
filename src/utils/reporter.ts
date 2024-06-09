// import { marked } from 'marked'
// import MarkedTerminal from 'marked-terminal'

import { logger } from '../logger'

// const renderer = MarkedTerminal()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// marked.setOptions({ renderer })

export const writeResultsReport = (results: string[]) => {
  // results.forEach((result) => logger.log(marked(result)))
  results.forEach((result) => logger.log(result))
}
