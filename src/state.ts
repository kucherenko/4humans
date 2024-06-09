import { existsSync, readFileSync } from 'fs-extra'

export class State {
  private _files: Record<string, string[]> = {}
  private _suggestions: Record<string, string[]> = {}

  init(files: string[]) {
    for (const file of files) {
      if (!existsSync) {
        throw new Error(`File ${file} not found`)
      }
      this._files[file] = [readFileSync(file).toString()]
    }
  }

  setFile(file: string, content: string) {
    if (!(file in this._files)) {
      throw new Error(`File ${file} not found`)
    }
    this._files[file]?.push(content)
  }

  getInitialFile(name: string) {
    if (!(name in this._files)) {
      throw new Error(`File ${name} not found`)
    }
    const versions = this._files[name] || []
    return versions[0] as string
  }

  getFinalFile(name: string) {
    if (!(name in this._files)) {
      throw new Error(`File ${name} not found`)
    }
    const last = Number(this._files[name]?.length) - 1
    const versions = this._files[name] || []
    return versions[last] as string
  }

  addSuggestions(name: string, suggestions: string) {
    this._suggestions[name] = this._suggestions[name] || []
    this._suggestions[name]?.push(suggestions)
  }

  getReport() {
    return Object.entries(this._files)
      .filter(([file, versions]) => file && versions.length > 0 && versions[0] !== versions[versions.length - 1])
      .reduce(
        (acc, item) => {
          const [file, versions] = item
          acc[file] = {
            old: versions[0] as string,
            new: versions[versions.length - 1] as string,
            suggestions: this._suggestions[file] || [],
          }
          return acc
        },
        {} as Record<string, { old: string; new: string; suggestions: string[] }>,
      )
  }
}
