import { Component, Input, OnInit } from '@angular/core';
import { ViewablePhrase } from 'src/utils/docxParsers/types';
import { handlebarToInstruction } from 'src/utils/handlebarTranslators/handlebarToReadableInstruction';
import { ReadableInstruction } from 'src/utils/handlebarTranslators/types';

@Component({
  selector: 'viewable-phrase',
  templateUrl: './viewable-phrase.component.html',
  styleUrls: ['./viewable-phrase.component.less']
})
export class ViewablePhraseComponent implements OnInit {
  @Input() viewablePhrases: ViewablePhrase[];
  public showModal: ShowModal = {
    phraseIndex: 0,
    showModal: false,
    modalPostion: { x: 0, y: 0 },
    data: undefined
  };

  constructor() { }

  ngOnInit(): void { }

  public showModalToggle(e: MouseEvent, phraseIndex: number): void {
    this.showModal.phraseIndex = phraseIndex;
    this.showModal.showModal = !this.showModal.showModal;
    this.showModal.modalPostion.x = e.clientX;
    this.showModal.modalPostion.y = e.clientY;
    this.translateHandlebarToInstructions(phraseIndex)
  }

  public clasificateStringBeetweenTextAndHandlebars(text: string): ReadableInstruction[] {
    let result: ReadableInstruction[] = [];
    const startHandlebar = '{{';
    const endHandlebar = '}}';
    const marginAmount = 30;
    let margin = 0;
    let stringStorage = ''
    for (let i = 0; i < text.length; i++) {
      const textFragment = text.substr(i, startHandlebar.length);
      if (textFragment === startHandlebar) {
        if (stringStorage) {
          result.push({
            type: 'text',
            value: stringStorage,
            margin: margin
          });
        }
        stringStorage = text[i];
        if (text.substr(i + 2, 1) === '/') {
          margin -= marginAmount;
        } else if (text.substr(i + 2, 1) === '#') {
          margin += marginAmount;
        }
      } else if (textFragment === endHandlebar) {
        stringStorage += text.substr(i, endHandlebar.length);
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

  public handlebarsToReadableIntructions(clasifiedText: ReadableInstruction[]): ReadableInstruction[] {
    let result: ReadableInstruction[] = []
    result = clasifiedText.map(clasifiedTextOrHandlebar => {
      if (clasifiedTextOrHandlebar.type === 'handlebar') {
        clasifiedTextOrHandlebar = handlebarToInstruction(clasifiedTextOrHandlebar)
      }
      return clasifiedTextOrHandlebar
    })
    return result
  }

  public translateHandlebarToInstructions(viewablePhraseIndex: number): void {
    const handlebar = this.viewablePhrases[viewablePhraseIndex].value as string;
    const clasifiedText = this.clasificateStringBeetweenTextAndHandlebars(handlebar)
    const readableInstructions = this.handlebarsToReadableIntructions(clasifiedText)
    console.log(readableInstructions)
    this.showModal.data = readableInstructions
  }
}

interface ShowModal {
  showModal: boolean,
  phraseIndex: number,
  modalPostion: { x: number, y: number },
  data: ReadableInstruction[]|undefined
}
