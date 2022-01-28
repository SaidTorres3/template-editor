import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { WorkSpace } from "src/app/app.component";
import { Zoom } from "src/app/shared/zoom-class/Zoom";
import { EditablePhrase, ViewablePhrase } from "src/utils/docxParsers/types";

@Component({
  selector: "app-workspace[objectData][workspace][editablePhrases][fileInput][viewablePhrases]",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.less", "../../shared/styles/commonStyles.less"],
})
export class WorkspaceComponent {
  @Input() objectData: any;
  @Input() workspace: WorkSpace;
  @Input() editablePhrases: EditablePhrase[];
  @Input() fileInput: HTMLButtonElement;
  @Input() viewablePhrases: ViewablePhrase[];
  @Output() editablePhraseChanged: EventEmitter<{
    inputEvent: InputEvent;
    indexOfEditablePhrase: number;
  }> = new EventEmitter();

  public zoom: Zoom = new Zoom();

  public onEditablePhraseChanged(e: InputEvent, index: number) {
    this.editablePhraseChanged.emit({ inputEvent: e, indexOfEditablePhrase: index });
  }

  public disableEnter(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }
}
