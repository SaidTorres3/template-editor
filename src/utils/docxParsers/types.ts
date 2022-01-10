
import JSZip from 'jszip'

export interface ViewablePhrase {
  type: ViewablePhraseType
  value: string|ViewablePhrase[]
}

export enum ViewablePhraseType {
  text = 'text',
  handlebar = 'handlebar',
  if = 'if',
  each = 'each',
}

export interface EditablePhrase {
  value: string,
  paragraphIndex: number,
  sentenseIndex: number
}

export interface EditableObjectToDocxOpts {
  modifiedObjects: EditablePhrase[]
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