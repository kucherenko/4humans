import { TestSuite, TestSuites } from 'junit2json'

export interface FinalInputData {
  execution: TestSuites | TestSuite | "" | null | undefined
  coverage: object
  uncovered: Record<string, string[]>
  files: Record<string, string[]>
  errors: string
}
