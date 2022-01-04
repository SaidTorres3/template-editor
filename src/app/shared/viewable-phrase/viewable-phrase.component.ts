import { Component, Input, OnInit } from '@angular/core';
import { ViewablePhrase } from 'src/utils/docxParsers/types';

@Component({
  selector: 'viewable-phrase',
  templateUrl: './viewable-phrase.component.html',
  styleUrls: ['./viewable-phrase.component.less']
})
export class ViewablePhraseComponent implements OnInit {

  @Input() phraseOrPhrases: ViewablePhrase|ViewablePhrase[];
  public phrase?: ViewablePhrase;

  constructor() { }

  public isASingleViewablePhrase(phrase: ViewablePhrase|ViewablePhrase[]): boolean {
   return !Array.isArray(phrase)
  }

  ngOnInit(): void {
    if (this.isASingleViewablePhrase(this.phraseOrPhrases)) {
      this.phrase = this.phraseOrPhrases as ViewablePhrase;
    }

    console.log('d')
    console.log(this.phrase)
  }

}
