import { ReadableInstruction } from "./types";

export const clasificateStringBetweenTextAndHandlebars = (text: string): ReadableInstruction[] => {
  let result: ReadableInstruction[] = [];
  const startHandlebar = '{{';
  const endHandlebar = '}}';
  const marginAmount = 30;
  let margin = 0;
  let stringStorage = ''
  for (let i = 0; i < text.length; i++) {
    const textFragment = text.substring(i, i + startHandlebar.length);
    if (textFragment === startHandlebar) {
      if (stringStorage) {
        result.push({
          type: 'text',
          value: stringStorage,
          margin: margin
        });
      }
      stringStorage = text[i];
      if (text.substring(i + 2, i + 3) === '/') {
        margin -= marginAmount;
      } else if (text.substring(i + 2, i + 3) === '#') {
        margin += marginAmount;
      }
    } else if (textFragment === endHandlebar) {
      stringStorage += text.substring(i, i + endHandlebar.length);
      i = i + endHandlebar.length - 1
      result.push({
        type: 'handlebar',
        value: stringStorage,
        margin: margin
      });
      stringStorage = "";
    } else {
      stringStorage += text[i]
    }
  }
  return result
}