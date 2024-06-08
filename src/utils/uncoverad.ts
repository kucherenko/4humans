import { glob } from 'glob'
import { Coverage } from '../types/coverage'
import dependencyTree from 'dependency-tree'

export function getUncoveredFiles(coverage: Record<string, Coverage>): Coverage[] {
  return Object.values(coverage).filter((fileCoverage: Coverage) => {
    return (
      Object.values(fileCoverage.s).some((statement: number) => statement === 0) ||
      Object.values(fileCoverage.b).some((branches: number[]) => branches.some((branch: number) => branch === 0)) ||
      Object.values(fileCoverage.f).some((functionCoverage: number) => functionCoverage === 0)
    )
  })
}

interface TestOptions {
  path?: string
  include?: string[]
  ignore?: string[]
  uncoveredOnly?: boolean
}
export async function getTestsFiles(
  coverage: Record<string, Coverage>,
  options: TestOptions = {},
): Promise<Record<string, string[]>> {
  const {
    path = process.cwd(),
    include = ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    uncoveredOnly = false,
    ignore = [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
  } = options
  const files = uncoveredOnly ? getUncoveredFiles(coverage) : Object.values(coverage)
  const listFiles = files.map((e) => {
    return e.path
  })
  const tests = await glob(include, {
    cwd: path,
    absolute: true,
    ignore,
  })

  const result: Record<string, string[]> = {}
  for (const file of tests) {
    const dependencies = dependencyTree.toList({
      filename: file,
      directory: path,
      filter: (p) => p.indexOf('node_modules') === -1,
    })
    for (const fileItem of listFiles) {
      if (dependencies.includes(fileItem)) {
        result[fileItem] = (result[fileItem] as string[]) || []
        if (!(result[fileItem] as string[]).includes(file)) {
          ;(result[fileItem] as string[]).push(file)
        }
      }
    }
  }
  return result
}

export function describeCoverageReport(coverage: Coverage): unknown {
  const uncoveredStatements = Object.entries(coverage.s)
    .filter(([, statement]) => statement === 0)
    .map(([statement]) => statement)

  const uncoveredBranches = Object.entries(coverage.b)
    .filter(([, branches]) => branches.some((branch: number) => branch === 0))
    .map(([branch]) => {
      const cov = coverage.branchMap[branch]
      return cov
        ? {
            line: cov.line,
            locations: cov.locations,
          }
        : {}
    })

  const uncoveredFunctions = Object.entries(coverage.f)
    .filter(([, functionCoverage]) => functionCoverage === 0)
    .map(([funct]) => {
      const cov = coverage.fnMap[funct]
      return cov
        ? {
            name: cov.name,
            location: cov.loc,
          }
        : {}
    })
  return {
    lines: uncoveredStatements,
    branches: uncoveredBranches,
    functions: uncoveredFunctions,
  }
}
