import { ReadableInstruction } from "./types";

const ifID = '{{#if '

const matchEveryPluck = /^\(every\s?\(pluck ([\S]+) '([\S]+)'\)\s?([\S]+)\)$/g;
const matchEqual = /^\(equal\s?([\S]+) '?([\S]+)'?\)$/g;
const matchOneVariable = /^[\S]+$/g;
const matchNotOneVariable = /^\(?not [\S]+\)?$/g;
const matchGreatherThan = /^\(?gt ([\S]+) (\d+)\)?$/g;
const matchTail = /tail\s?([\S][^\(\)\s]+)/g

export const ifHandler = (handlebar: ReadableInstruction): ReadableInstruction => {
  let insideValue = filterValue(handlebar.value)
  if (insideValue.match(matchEveryPluck)) {
    const match = matchEveryPluck.exec(insideValue)
    const variableName = match[1]
    const selectedProp = match[2]
    const filter = match[3]
    handlebar.value = translateEveryPluck({ variableName, selectedProp, filter })
  } else if (insideValue.match(matchEqual)) {
    const match = matchEqual.exec(insideValue)
    const variableName = match[1]
    const selectedProp = match[2]
    handlebar.value = translateEqual({ variableName, comparedValue: selectedProp })
  } else if (insideValue.match(matchOneVariable)) {
    insideValue = cleanInsideValue(insideValue)
    insideValue = insideValue.concat(' contiene valor y no es falso y no es igual 0')
    handlebar.value = insideValue
  } else if (insideValue.match(matchGreatherThan)) {
    const match = matchGreatherThan.exec(insideValue)
    const variableName = match[1]
    const selectedProp = match[2]
    handlebar.value = `el valor de ${variableName} es mayor a ${selectedProp}`
  } else if (insideValue.match(matchNotOneVariable)) {
    insideValue = cleanInsideValue(insideValue)
    insideValue = insideValue.concat(' no contiene valor o es falso o es igual 0')
    handlebar.value = insideValue
  } else if(insideValue.match(matchTail)) {
    const match = matchTail.exec(insideValue)
    const variableName = match[1]
    handlebar.value = `${variableName} contiene valor y no es falso y no es igual 0`
  }

  handlebar.value = `Si ${handlebar.value}, entonces mostrar:`
  handlebar.handlebarType = 'if'
  handlebar.margin = handlebar.margin - 30
  return handlebar
}

const filterValue = (value: string): string => {
  let content = value.replace(ifID, '')
  content = content.replace('}}', '')
  return content
}

const cleanInsideValue = (insideValue: string) => {
  insideValue = insideValue.replace('@index', 'el numero del elemento que se está operando')
  insideValue = insideValue.replace('@last', 'es el último elemento de la lista y')
  insideValue = insideValue.replace(/[()]/g, '')
  insideValue = insideValue.replace('not ', '')
  return insideValue
}

const translateEveryPluck = (opts: TranslateEveryPluckOpts) => {
  return `la propiedad ${opts.selectedProp} de TODOS los elementos de ${opts.variableName} son equivalentes a ${opts.filter}`
}

const translateEqual = (opts: TranslateEqualOpts) => {
  return `el valor de ${opts.variableName} es igual a ${opts.comparedValue}`
}

interface TranslateEveryPluckOpts {
  variableName: string,
  selectedProp: string,
  filter: string
}

interface TranslateEqualOpts {
  variableName: string,
  comparedValue: string
}

// match if string has only a word, include @
const matchWord = /^[\S]+$/g;