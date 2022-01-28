import { EditablePhrase, ViewablePhrase, ViewablePhraseType } from "../docxParsers/types"
import { transformEditablePhrasesToString } from "./transformEditablePhrasesToString"
import { transformStringToViewablePhrases } from "./transformStringToViewablePhrases"
import { Tag } from "./types"

export const transformEditablePhrasesToViewablePhrases = (phrases: EditablePhrase[]): ViewablePhrase[] => {
  let priority = 0
  const phrasesStringtified = transformEditablePhrasesToString(phrases)
  const findEach: Tag = { startTag: '{{#each', closeTag: '{{/each}}', type: ViewablePhraseType.each, priority: priority++ }
  const findIf: Tag = { startTag: "{{#if", closeTag: "{{/if}}", type: ViewablePhraseType.if, priority: priority++ }
  const findHandlebars: Tag = { startTag: "{{", closeTag: "}}", type: ViewablePhraseType.handlebar, priority: priority++ }
  return transformStringToViewablePhrases({ text: phrasesStringtified, tags: [findIf, findEach, findHandlebars] })
}