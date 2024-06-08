export interface RepoConfig {
  install: string
  build?: {
    base: string
    command: string
  }
  test: {
    command: string
    coverage: string
    report: string
  }
  mutation?: {
    command: string
    report: string
  }
  lint?: {
    command: string
  }
}
