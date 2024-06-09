declare module 'marked-terminal' {
  declare function Renderer(options, highlightOptions)
  function markedTerminal(text?: string, options?: unknow): string
  export function markedTerminal(options, highlightOptions): string

  export default Renderer
}
