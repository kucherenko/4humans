interface Location {
  start: Position
  end: Position
}

interface Func {
  name: string
  decl: Location
  loc: Location
  line: number
}

interface Position {
  line: number
  column: number
}

export interface Coverage {
  path: string
  all: boolean
  s: Record<string, number>
  statementMap: Record<string, Location>
  b: Record<string, number[]>
  branchMap: Record<string, { line: number; type: string; loc: Location; locations: Location[] }>
  f: Record<string, number>
  fnMap: Record<string, Func>
}
