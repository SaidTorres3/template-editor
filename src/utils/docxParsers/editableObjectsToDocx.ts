import * as JSZipImport from "jszip";
import xml2js from 'xml2js-preserve-spaces'
import { EditableObjectToDocxOpts, EditablePhrase, PhraseCoords } from './types';

export const editableObjectToDocx = async (opts: EditableObjectToDocxOpts): Promise<File> => {
  const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
  return new Promise((resolve, reject) => {
    // unzip the file
    const zipHandler = new JSZip();
    zipHandler.loadAsync(opts.fileIn).then(function (zipContent) {
      const file = zipContent.file("word/document.xml")
      if (!file) { reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`); return }

      file.async('text').then(function (XMLContent) {
        xml2js.parseString(XMLContent, function (err, result) {
          const paragraphs = result['w:document']['w:body'][0]['w:p']
          paragraphs.forEach((paragraph: { [x: string]: { [x: string]: any[]; }[]; }, paragraphIndex: number) => {
            const wRLabels = paragraph['w:r']
            if (!wRLabels || !wRLabels.length) { return paragraph }
            wRLabels.forEach((wRLabel: { [x: string]: any[]; }, wRLabelIndex) => {
              const modfiedPhrase = getModifiedPhrase(opts.modifiedObjects, { paragraphIndex, sentenseIndex: wRLabelIndex })
              if (!modfiedPhrase) { return paragraph }
              // check if WTLabel is an object and has the "_" property
              if (wRLabel['w:t'] && wRLabel['w:t'].length && wRLabel['w:t'][0]['_']) {
                wRLabel['w:t'][0]['_'] = modfiedPhrase.value
              } else {
                if (wRLabel['w:t'] && wRLabel['w:t'].length && typeof wRLabel['w:t'][0] === 'string') {
                  wRLabel['w:t'][0] = modfiedPhrase.value
                }
              }
            })
          })
          const modifiedXML = new xml2js.Builder().buildObject(result)
          // replace 'file' variable with modifiedXML
          zipContent.file('word/document.xml', modifiedXML)
          zipContent.generateAsync({ type: 'blob' }).then(function (outputFile) {
            resolve(outputFile as File)
          })
        });
      })
    });
  })
}

const getModifiedPhrase = (phrases: EditablePhrase[], phaseCoords: PhraseCoords): EditablePhrase | undefined => {
  const phrase = phrases.find((phrase: EditablePhrase) => {
    if (phrase.paragraphIndex === phaseCoords.paragraphIndex && phrase.sentenseIndex === phaseCoords.sentenseIndex) {
      return phrase
    }
  })
  return phrase
}