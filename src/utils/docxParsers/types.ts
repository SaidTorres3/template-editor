
import JSZip from 'jszip'

export interface ViewablePhrase {
  type: ViewablePhraseType
  value: string|ViewablePhrase[]
}

export enum ViewablePhraseType {
  text = 'text',
  handlebar = 'handlebar',
  if = 'if',
  forEach = 'forEach',
}

export interface Phrase {
  value: string,
  paragraphIndex: number,
  sentenseIndex: number
}

export interface EditableObjectToDocxOpts {
  modifiedObjects: Phrase[]
  fileIn: InputFileFormat,
}

export interface PhraseCoords {
  paragraphIndex: number,
  sentenseIndex: number
}

export interface CreateTemplateOutputDiffVisualizerOpts {
  template: InputFileFormat,
  output: InputFileFormat,
  data: JSON | undefined,
}

export type InputFileFormat = Parameters<JSZip['loadAsync']>[0];