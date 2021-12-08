import fs from 'fs';
import JSZip from 'jszip'
import xml2js from 'xml2js'
import { EditableObjectToDocxOpts, InputFileFormat, Phrase, PhraseCoords } from './types';

export const editableObjectToDocx = async (opts: EditableObjectToDocxOpts): Promise<InputFileFormat> => {
  return new Promise((resolve, reject) => {
    const docxFile = fs.readFileSync(opts.fileIn);
    // unzip the file
    const zipHandler = new JSZip();
    zipHandler.loadAsync(docxFile).then(function (zipContent) {
      const file = zipContent.file("word/document.xml")
      if (!file) { reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`); return }

      file.async('text').then(function (XMLContent) {
        xml2js.parseString(XMLContent, function (err, result) {
          const paragraphs = result['w:document']['w:body'][0]['w:p']
          paragraphs.forEach((paragraph: { [x: string]: { [x: string]: any[]; }[]; }, paragraphIndex: number) => {
            const wRLabels = paragraph['w:r']
            if (!wRLabels || !wRLabels.length) { return }
            wRLabels.forEach((wRLabel: { [x: string]: any[]; }, wRLabelIndex) => {
              const modfiedPhrase = getModifiedPhare(opts.modifiedObjects, { paragraphIndex, sentenseIndex: wRLabelIndex })
              if (!modfiedPhrase) { return }
              console.log('entered...')
              // check if WTLabel is an object and has the "_" property
              if (wRLabel['w:t'] && wRLabel['w:t'].length && wRLabel['w:t'][0]['_']) {
                wRLabel['w:t'][0]['_'] = modfiedPhrase.value
              } else {
                if (wRLabel['w:t'] && wRLabel['w:t'].length && typeof wRLabel['w:t'][0] === 'string') {
                  wRLabel['w:t'][0] = modfiedPhrase.value
                } // else if (WTLabel && WTLabel.length && WTLabel[0]['$']) {
                // }
              }
            })
          })
          const modifiedXML = new xml2js.Builder().buildObject(result)
          // replace 'file' variable with modifiedXML
          zipContent.file('word/document.xml', modifiedXML)
          zipContent.generateAsync({ type: 'base64' }).then(function (outputFile) {
            resolve(Buffer.from(outputFile, 'base64'))
          })
        });
      })
    });
  })
}

const getModifiedPhare = (phrases: Phrase[], phaseCoords: PhraseCoords): Phrase | undefined => {
  const phrase = phrases.find((phrase: Phrase) => {
    if (phrase.paragraphIndex === phaseCoords.paragraphIndex && phrase.sentenseIndex === phaseCoords.sentenseIndex) {
      return phrase
    }
  })
  return phrase
}