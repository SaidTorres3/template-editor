import { Component, Input, OnInit } from '@angular/core';
import { ViewablePhrase } from 'src/utils/docxParsers/types';

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
    modalPostion: { x: 0, y: 0 }
  };

  constructor() { }

  ngOnInit(): void { }

  public showModalToggle(e: MouseEvent, phraseIndex: number): void {
    this.showModal.phraseIndex = phraseIndex;
    this.showModal.showModal = !this.showModal.showModal;
    this.showModal.modalPostion.x = e.clientX;
    this.showModal.modalPostion.y = e.clientY;
  }

  public clasificateStringBeetweenTextAndHandlebars(text: string): ClafisifiedTextOrHandlebar[] {
    let result: ClafisifiedTextOrHandlebar[] = [];
    const startHandlebar = '{{';
    const endHandlebar = '}}';
    const marginAmount = 10;
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
    console.log(result)
    return result
  }

  public handlebarsToReadableIntructions(clasifiedText: ClafisifiedTextOrHandlebar[]): ClafisifiedTextOrHandlebar[] {
    let result: ClafisifiedTextOrHandlebar[] = []
    result = clasifiedText.map(clasifiedTextOrHandlebar => {
      if (clasifiedTextOrHandlebar.type === 'handlebar') {
        
      }

      return clasifiedTextOrHandlebar
    })
    return result
  }
}

interface ShowModal {
  showModal: boolean,
  phraseIndex: number,
  modalPostion: { x: number, y: number }
}

interface ClafisifiedTextOrHandlebar {
  type: 'text' | 'handlebar'
  value: string,
  margin: number
}