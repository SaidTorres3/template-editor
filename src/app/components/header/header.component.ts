import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DocxFile, History, WorkSpace } from "src/app/app.component";
import { docxToString } from "src/utils/docxParsers/docxToString";
import { editableObjectToDocx } from "src/utils/docxParsers/editableObjectsToDocx";
import { EditablePhrase } from "src/utils/docxParsers/types";

@Component({
  selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.less", "../../shared/styles/commonStyles.less"],
})
export class HeaderComponent {
  @Input() workspace: WorkSpace;
  @Input() docxFile: DocxFile;
  @Input() history: History[];
  @Input() uploadFileInput: HTMLInputElement;
  @Input() editablePhrases: EditablePhrase[];
  @Output() fileChange: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  onFileChangeHandler(event: InputEvent) {
    this.fileChange.emit(event);
  }

  public save() {
    if (!this.docxFile.content) {
      return;
    }
    editableObjectToDocx({
      modifiedObjects: this.history[this.workspace.historyIndex].editablePhrases,
      fileIn: this.docxFile.content,
    }).then((newDocx) => {
      // this.setTemplateFromFile(newDocx); TODO
    });
  }

  public saveToComputer() {
    if (!this.docxFile.content) {
      return;
    }
    editableObjectToDocx({
      modifiedObjects: this.history[this.workspace.historyIndex].editablePhrases,
      fileIn: this.docxFile.content,
    }).then((newDocx) => {
      const url = URL.createObjectURL(newDocx);
      const link = document.createElement("a");
      link.href = url;
      link.download = this.docxFile.name;
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      docxToString(newDocx).then((string) => {
        console.log(string);
      });
    });
  }

  public fileDropDownToggle() {
    this.workspace.fileDropDown = true;
    let clickCount = 0;
    const quitDropDown = (e) => {
      clickCount++;
      if (clickCount > 1) {
        this.workspace.fileDropDown = false;
        window.onclick = null;
      }
    };
    window.onclick = quitDropDown;
  }
}
