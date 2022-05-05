import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DocxFile, History, WorkSpace } from "../../../app/interfaces";
import { docxToString } from "../../../utils/docxParsers/docxToString";
import { editableObjectToDocx } from "../../../utils/docxParsers/editableObjectsToDocx";
import { EditablePhrase } from "../../../utils/docxParsers/types";

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
  @Output() docxFileChanged: EventEmitter<DocxFile> = new EventEmitter<DocxFile>();

  public onFileChangeHandler(e: Event) {
    const event = e as InputEvent;
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
      this.docxFileChanged.emit({
        name: this.docxFile.name,
        content: newDocx,
        lastModifiedDate: new Date().getTime(),
      })
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
      // docxToString(newDocx).then((string) => {
      //   console.log(string);
      // });
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
