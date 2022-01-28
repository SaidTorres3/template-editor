import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkSpace } from 'src/app/app.component';
import { EditablePhrase } from 'src/utils/docxParsers/types';

@Component({
  selector: 'editable-phrases[editablePhrases][workspace]',
  templateUrl: './editable-phrase.component.html',
  styleUrls: ['./editable-phrase.component.less']
})
export class EditablePhraseComponent {

  constructor() { }

  @Input() editablePhrases: EditablePhrase[];
  @Input() workspace: WorkSpace;
  @Output() editablePhraseChanged = new EventEmitter<{inputEvent: InputEvent, index: number}>();

  public pasteContentWithoutStylesAndEnters(e: ClipboardEvent) {
    e.preventDefault()
    let text = e.clipboardData.getData("text/plain")
    text = text.replace(/\n/g, " ")
    // todo: 
    document.execCommand("insertText", false, text)
  }

  public onEdtitablePhraseChanged(e: InputEvent, index: number) {
    this.editablePhraseChanged.emit({inputEvent: e, index});
  }

}