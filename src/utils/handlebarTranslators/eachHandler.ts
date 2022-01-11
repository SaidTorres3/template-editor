import { ReadableInstruction } from "./types";

const eachID = '{{#each '

const matchOneVariable = /^[\S]+$/g;

export const eachHandler = (handlebar: ReadableInstruction) => {
  let insideValue = filterValue(handlebar.value)

  if (insideValue.match(matchOneVariable)) {
    handlebar.value = insideValue
  }

  handlebar.value = `Por cada elemento en ${handlebar.value}, imprimir:`
  handlebar.handlebarType = 'each'
  return handlebar
}

const filterValue = (value: string): string => {
  let content = value.replace(eachID, '')
  content = content.replace('}}', '')
  return content
}