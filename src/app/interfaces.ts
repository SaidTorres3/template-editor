import { EditablePhrase, InputFileFormat } from "../utils/docxParsers/types";

export interface DocxFile {
  name: string;
  lastModifiedDate: number;
  content: InputFileFormat;
}

export interface WorkSpace {
  dropingFile: boolean;
  fileDropDown: boolean;
  detailsModal: boolean;
  paperZoom: { value: number };
  dataZoom: { value: number };
  mode: ViewMode;
  historyIndex: number;
  lastModifiedEditablePhraseIndex: number;
  lastSelection: SelectionRange;
  searchData?: string;
  needToFocus: boolean;
}

export interface TemplateInformation {
  name: string;
  description: string;
}

export interface SelectionRange {
  start: number;
  end: number;
}

export enum ViewMode {
  edit = "edit",
  view = "view",
  simulation = "simulation",
  editView = "editView",
}

export interface History {
  editablePhrases: EditablePhrase[];
  lastModifiedEditablePhraseIndex: number;
  selection: SelectionRange;
}
