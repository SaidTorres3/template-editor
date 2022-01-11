import { eachHandler } from "./eachHandler";
import { ifHandler } from "./ifHandler";
import { ReadableInstruction } from "./types";

const ifID = '{{#if'
const elseID = '{{else'
const eachID = '{{#each'
const closeBlock = '{{/'

export const handlebarToInstruction = (handlebar: ReadableInstruction): ReadableInstruction => {
  let result: ReadableInstruction = handlebar;
  handlebar.value = handlebar.value.trim()
  if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: ifID })) {
    result = ifHandler(handlebar)
  } else if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: elseID })) {
    result.value = "De lo contrario, imprimir:"
    result.handlebarType = "if"
  } else if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: eachID })) {
    result = eachHandler(handlebar)
  } else if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: closeBlock })) {
    result.value = ''
  } else {
    result.handlebarType = 'variable'
  }
  return result;
}

const doesHadlebarMatchID = (opts: DoesHadlebarMatchIDOpts): boolean => {
  let start = 0
  opts.start ? start = opts.start : null
  const txtSegment = opts.txt.substring(start, opts.handlebarID.length)
  return txtSegment === opts.handlebarID
}

interface DoesHadlebarMatchIDOpts {
  txt: string,
  handlebarID: string
  start?: number
}