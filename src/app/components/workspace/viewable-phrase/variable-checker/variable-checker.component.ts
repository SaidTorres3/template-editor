import { Component, EventEmitter, Input, Output } from "@angular/core";
import { isVariableAndExist } from "../../../../../utils/phrasesParsers/types";

@Component({
  selector: "variable-checker[input]",
  templateUrl: "./variable-checker.component.html",
  styleUrls: ["./variable-checker.component.less"],
})
export class VariableCheckerComponent {
  @Input() input: isVariableAndExist;
  @Input() hightlightExistingVariables: boolean = false;

  @Output() clickExistingVariable: EventEmitter<MouseEvent> = new EventEmitter<
    MouseEvent
  >();
  @Output() clickNonExistingVariable: EventEmitter<
    MouseEvent
  > = new EventEmitter<MouseEvent>();

  onClickExistingVariable(mouseEvent: MouseEvent) {
    this.clickExistingVariable.emit(mouseEvent);
  }

  onClickNonExistingVariable(mouseEvent: MouseEvent) {
    this.clickNonExistingVariable.emit(mouseEvent);
  }
}
