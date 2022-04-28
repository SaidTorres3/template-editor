import { Component, EventEmitter, Input, Output } from "@angular/core";
import { WorkSpace } from "../../../../app/interfaces";
import { EditablePhrase } from "../../../../utils/docxParsers/types";
import { addStr } from "../../../../utils/javascript/addString";
import { replaceStr } from "../../../../utils/javascript/replaceString";
import { setCaretPosition } from "../../../../utils/javascript/setCaretPosition";

@Component({
  selector: "editable-phrases[editablePhrases][workspace]",
  templateUrl: "./editable-phrase.component.html",
  styleUrls: ["./editable-phrase.component.less"],
})
export class EditablePhraseComponent {
  constructor() {}

  @Input() editablePhrases: EditablePhrase[];
  @Input() workspace: WorkSpace;
  @Output() editablePhraseChanged = new EventEmitter<{
    inputEvent: Event;
    index: number;
  }>();

  public pasteContentWithoutStylesAndEnters(e: ClipboardEvent, index: number) {
    // todo
    e.preventDefault();
    const element = e.target as HTMLElement;
    let editablePhraseValue = element.innerText;
    let text = e.clipboardData.getData("text/plain")?.replace(/\n/g, " ");
    const selection = window.getSelection();
    const caretFirstPosition = selection.anchorOffset;
    const caretLastPosition = selection.focusOffset;
    let newTxt: string;
    if (caretFirstPosition === caretLastPosition) { // if caret is in the same position
      newTxt = addStr({
        string: editablePhraseValue,
        index: caretFirstPosition,
        stringToAdd: text,
      });
    } else {
      // replace text from caretFirstPosition to caretLastPosition
      newTxt = replaceStr({
        firstPos: caretFirstPosition,
        secondPos: caretLastPosition,
        str: editablePhraseValue,
        stringToAdd: text,
      });
    }
    // create input event
    var event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    // set new value
    element.innerText = newTxt;
    element.dispatchEvent(event);
    setCaretPosition(element, caretFirstPosition);
  }

  public onEdtitablePhraseChanged(e: Event, index: number) {
    this.editablePhraseChanged.emit({ inputEvent: e, index });
  }
}
