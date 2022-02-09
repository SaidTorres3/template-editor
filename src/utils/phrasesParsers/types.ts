import { ViewablePhraseType } from "../docxParsers/types";

export interface FindTagsOpts {
  text: string;
  tags: Tag[];
}

export interface Tag {
  startTag: string;
  closeTag: string;
  type: ViewablePhraseType;
  priority: number;
}

export interface FoundedTagsPosition {
  start: number;
  end: number;
  type: ViewablePhraseType;
}

export interface isVariableAndExist {
  value: string;
  isVariable: boolean;
  exist?: boolean;
}
