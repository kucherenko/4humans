import { TestSuites, TestSuite } from 'junit2json'

export interface InputItem {
  path: string
  code: string
  tests: Record<string, string>
  coverage: object
  report: TestSuites | TestSuite | '' | null | undefined
  error?: string
}
