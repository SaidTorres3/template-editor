import { Component, Input, OnInit } from '@angular/core';
import { ViewablePhrase } from 'src/utils/docxParsers/types';

@Component({
  selector: 'viewable-phrase',
  templateUrl: './viewable-phrase.component.html',
  styleUrls: ['./viewable-phrase.component.less']
})
export class ViewablePhraseComponent implements OnInit {

  @Input() phraseOrPhrases: ViewablePhrase | ViewablePhrase[];

  constructor() { }

  consoleLog(arg: any) {
    console.log(arg);
  }

  ngOnInit(): void { }

}
