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
    modalPostion: {x: 0, y: 0}
  };

  public showModalToggle(e: MouseEvent, phraseIndex: number): void {
    this.showModal.phraseIndex = phraseIndex;
    this.showModal.showModal = !this.showModal.showModal;
    this.showModal.modalPostion.x = e.clientX;
    this.showModal.modalPostion.y = e.clientY;
  }

  constructor() { }

  ngOnInit(): void { }
}

interface ShowModal {
  showModal: boolean,
  phraseIndex: number,
  modalPostion: {x: number, y: number}
}
