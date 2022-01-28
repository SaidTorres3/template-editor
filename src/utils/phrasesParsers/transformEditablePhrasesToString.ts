import { EditablePhrase } from "../docxParsers/types";

export const transformEditablePhrasesToString = (phrases: EditablePhrase[]): string => {
  phrases = phrases.map(a => ({ ...a }));
  let phrasesStringtified = ""
  phrases.forEach((phrase, index) => {
    const phraseWihoutEnter = phrase.value.concat().replace('\n', '')
    if (phrases[index - 1] && phrases[index - 1].paragraphIndex < phrase.paragraphIndex) {
      phrasesStringtified += '\r\n'
    }
    phrasesStringtified += phraseWihoutEnter
  })
  return phrasesStringtified
}