import * as JSZipImport from "jszip";
import { parseString } from 'xml2js-preserve-spaces'
import { InputFileFormat, EditablePhrase } from './types';

export const docxToEditableObjects = async (docxFile: InputFileFormat): Promise<EditablePhrase[]> => {
  const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
  return new Promise((resolve, reject) => {
    // unzip the file
    const zip = new JSZip();
    zip.loadAsync(docxFile).then(function (zip) {
      // get the content of the document.xml file
      const wordFolder = zip.folder('word')
      if (!wordFolder) { reject(`An error ocurred attempting to enter to the folder 'word' of the docx file.`); return }
      const file = wordFolder.file("document.xml")
      if (!file) { reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`); return }
      file.async('string').then(function (XMLContent) {
        const phrases: EditablePhrase[] = []
        parseString(XMLContent, function (err, result) {
          const paragraphs = result['w:document']['w:body'][0]['w:p']
          const enter = '\r\n'
          let phrase: EditablePhrase

          paragraphs.forEach((paragraph: { [x: string]: { [x: string]: any[]; }[]; }, paragraphIndex: number) => {

            const wRLabels = paragraph['w:r']
            if (!wRLabels || !wRLabels.length) {
              phrase = { value: enter, paragraphIndex, sentenseIndex: 0 }
              phrases.push(phrase)
            } else {
              wRLabels.forEach((wRLabel: { [x: string]: any[]; }, wRLabelIndex) => {
                let text: string = '';
                const WTLabel = wRLabel['w:t']
                // check if WTLabel is an object and has the "_" property
                if (WTLabel && WTLabel.length && WTLabel[0]['_']) {
                  text = WTLabel[0]['_']
                } else {
                  if (WTLabel && WTLabel.length && typeof WTLabel[0] === 'string') {
                    text = WTLabel[0]
                  } else if (WTLabel && WTLabel.length && WTLabel[0]['$']) {
                    text = " "
                  }
                }
                phrase = { value: text, paragraphIndex, sentenseIndex: wRLabelIndex }
                phrases.push(phrase)
              })
            }

          })

          resolve(phrases)
        });
      })
    });
  })
}