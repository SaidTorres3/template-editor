export interface ReadableInstruction {
  type: 'text' | 'handlebar'
  value: string,
  margin: number
}