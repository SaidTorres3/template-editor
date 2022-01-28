import { ViewablePhrase, ViewablePhraseType } from "../docxParsers/types";
import { FindTagsOpts, FoundedTagsPosition } from "./types";

export const transformStringToViewablePhrases = (opts: FindTagsOpts): ViewablePhrase[] => {
  const startsAndEnds: FoundedTagsPosition[] = []
  let requirementsToCloseTag: { amountOfClosingTags: number, type: ViewablePhraseType | undefined } = { amountOfClosingTags: 0, type: undefined };
  let startingTagPosition = 0;
  let closingTagPosition = -1;
  // sort tags by priority, lower priority first
  opts.tags.sort((a, b) => { return a.priority - b.priority })
  for (let i = 0; i < opts.text.length; i++) {
    for (let j = 0; j < opts.tags.length; j++) {
      const { startTag, closeTag, type: tagType } = opts.tags[j]
      const isStartingATag = opts.text.substring(i, i + startTag.length) === startTag
      const isEndingAnTag = opts.text.substring(i, i + closeTag.length) === closeTag
      const isTheLastCharacter = i === opts.text.length - 1

      if ((isTheLastCharacter) && (i != closingTagPosition)) {
        const isThereText = (i - closingTagPosition) > 0
        isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null
        break;
      }

      if (isStartingATag && ((!requirementsToCloseTag.amountOfClosingTags) || (requirementsToCloseTag.type === tagType))) {
        if (!requirementsToCloseTag.amountOfClosingTags) {
          const isThereText = (i - closingTagPosition) > 0
          isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null
          startingTagPosition = i
        }
        requirementsToCloseTag = { amountOfClosingTags: requirementsToCloseTag.amountOfClosingTags + 1, type: opts.tags[j].type }
        break;
      } else if ((isEndingAnTag) && (tagType == requirementsToCloseTag.type)) {
        requirementsToCloseTag.amountOfClosingTags--
        if (requirementsToCloseTag.amountOfClosingTags == 0) {
          closingTagPosition = i + closeTag.length
          startsAndEnds.push({ start: startingTagPosition, end: closingTagPosition, type: opts.tags[j].type })
        }
        break;
      }
    }
  }
  startsAndEnds.sort((a, b) => a.start - b.start)

  let viewablePhrases: ViewablePhrase[] = []
  startsAndEnds.forEach(a => {
    viewablePhrases.push({
      value: opts.text.substring(a.start, a.end),
      type: a.type
    })
  })

  return viewablePhrases
}