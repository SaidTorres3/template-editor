import { ReadableInstruction } from "./types";

export const variableHandler = (handlebar: ReadableInstruction): ReadableInstruction => {
  let insideValue = filterValue(handlebar.value)
  const variableName = getTheVariableName(insideValue)

  

  handlebar.handlebarType = 'variable'
  return handlebar
}

const filterValue = (value: string): string => {
  const regexQuitBraket = /[{}]/g
  let result = value.replace(regexQuitBraket, '').trim()
  return result
}

const getTheVariableName = (value: string): string => {
  const regexClasifier = /[A-Za-z\.@]+/g
  let result = value.match(regexClasifier)
  return result[result.length - 1]
}	