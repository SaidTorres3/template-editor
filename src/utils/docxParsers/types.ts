
import JSZip from 'jszip'

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