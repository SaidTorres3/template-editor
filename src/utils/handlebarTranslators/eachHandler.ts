import { ReadableInstruction } from "./types";

const eachID = '{{#each '

const matchOneVariable = /^[\S]+$/g;
const matchTail = /tail\s?([\S][^\(\)\s]+)/g

export const eachHandler = (handlebar: ReadableInstruction) => {
  let insideValue = filterValue(handlebar.value)

  if (insideValue.match(matchOneVariable)) {
    handlebar.value = insideValue
  } else if (insideValue.match(matchTail)) {
    const match = matchTail.exec(insideValue)
    const variableName = match[1]
    handlebar.value = `${variableName}, exceptuando el primer elemento`
  }

  handlebar.value = `Por cada elemento en ${handlebar.value}, mostrar:`
  handlebar.handlebarType = 'each'
  handlebar.margin = handlebar.margin - 30
  return handlebar
}

const filterValue = (value: string): string => {
  let content = value.replace(eachID, '')
  content = content.replace('}}', '')
  return content
}