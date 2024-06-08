export interface InputItem {
  path: string
  code: string
  tests: Record<string, string>
  coverage: object
}
