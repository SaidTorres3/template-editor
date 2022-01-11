export interface ReadableInstruction {
  type: 'text' | 'handlebar'
  handlebarType?: 'if' | 'each' | 'variable'
  value: string,
  margin: number
}