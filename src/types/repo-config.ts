export interface RepoConfig {
  build?: {
    base: string
    command: string
  }
  test: {
    command: string
    coverage: string
  }
  mutation?: {
    command: string
    report: string
  }
  lint?: {
    command: string
  }
}
