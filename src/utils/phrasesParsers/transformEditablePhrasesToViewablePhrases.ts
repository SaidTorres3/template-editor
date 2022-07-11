import {
  EditablePhrase,
  ViewablePhrase,
  ViewablePhraseType,
} from '../docxParsers/types';
import { transformEditablePhrasesToString } from './transformEditablePhrasesToString';
import { transformStringToViewablePhrases } from './transformStringToViewablePhrases';
import { Tag } from './types';

export const transformEditablePhrasesToViewablePhrases = (
  phrases: EditablePhrase[]
): ViewablePhrase[] => {
  let priority = 0;
  const phrasesStringtified = transformEditablePhrasesToString(phrases);

  const findIf: Tag = {
    startTag: new RegExp('{#'),
    closeTag: new RegExp('{\/}'),
    type: ViewablePhraseType.if,
    priority: priority++,
  };
  const findIfNot: Tag = {
    startTag: new RegExp('{\^'),
    closeTag: new RegExp('{\/}'),
    type: ViewablePhraseType.ifNot,
    priority: priority++,
  };
  const findEach: Tag = {
    startTag: new RegExp('{#'),
    closeTag: new RegExp('{\/.+}'),
    type: ViewablePhraseType.each,
    priority: priority++,
  };
  const findHandlebars: Tag = {
    startTag: new RegExp('{[^\^/#!]'),
    closeTag: new RegExp('}'),
    type: ViewablePhraseType.handlebar,
    priority: priority++,
  };

  return transformStringToViewablePhrases({
    text: phrasesStringtified,
    tags: [findIfNot, findIf, findEach, findHandlebars],
  });
};
