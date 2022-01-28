import { Component, ElementRef, ViewChild } from "@angular/core";
import { docxToEditableObjects } from "src/utils/docxParsers/docxToEditableObjects";
import {
  InputFileFormat,
  EditablePhrase,
  ViewablePhrase,
} from "src/utils/docxParsers/types";
import exampleObject from "./exampleObject.json";
import { transformEditablePhrasesToViewablePhrases } from "src/utils/phrasesParsers/transformEditablePhrasesToViewablePhrases";
import { Zoom } from "./shared/zoom-class/Zoom";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less", "shared/styles/commonStyles.less"],
})
export class AppComponent {
  title = "template-editor";
  @ViewChild("uploadFileInput") uploadFileInput: ElementRef<HTMLInputElement>;
  @ViewChild("templateContainer") templateContainer: ElementRef<HTMLDivElement>;

  public objectData: any;
  public editablePhrases: EditablePhrase[] = [];
  public viewablePhrases: ViewablePhrase[] = [];
  public history: History[] = [];
  public zoom: Zoom = new Zoom();

  public workspace: WorkSpace = {
    dropingFile: false,
    fileDropDown: false,
    paperZoom: { value: 1 },
    dataZoom: { value: 1 },
    mode: ViewMode.edit,
    historyIndex: 0,
    lastModifiedEditablePhraseIndex: 0,
    lastSelection: undefined,
    needToFocus: false,
  };

  public docxFile: DocxFile = {
    content: "",
    name: "",
    lastModifiedDate: 0,
  };

  ngOnInit() {
    this.objectData = exampleObject;
  }

  ngAfterViewInit() {
    this.fileBackdropHandlerListener();
    this.historyHandlerListener();
    this.changeModeWithHotkeysListener();
  }

  public setTemplateFromFile(inputFile: File) {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const data = e.target.result;
      this.docxFile = {
        // template storage
        ...this.docxFile,
        name: inputFile.name,
        lastModifiedDate: inputFile.lastModified,
        content: data,
      };
      docxToEditableObjects(inputFile).then((editableObjects) => {
        this.setPhrases(editableObjects);
      });
    };
    reader.readAsArrayBuffer(inputFile);
  }

  private setPhrases(editableObjects: EditablePhrase[]) {
    this.editablePhrases = editableObjects.map((a) => ({ ...a }));
    this.history = [
      {
        editablePhrases: editableObjects.map((a) => ({ ...a })),
        lastModifiedEditablePhraseIndex: 0,
        selection: undefined,
      },
    ];
    this.workspace.historyIndex = 0;
    this.updatesPhrasesValues();
  }

  public updateEditablePhrase(
    inputEvent: InputEvent,
    editablePhraseIndex: number
  ) {
    const doesHistoryIndexIsPosibleInHistory =
      this.workspace.historyIndex < this.history.length - 1;
    if (doesHistoryIndexIsPosibleInHistory) {
      const historyCuttedAfterCurrentIndex = this.history.slice(
        0,
        this.workspace.historyIndex + 1
      );
      this.history = historyCuttedAfterCurrentIndex;
    }
    const selection = window.getSelection();
    const phraseElement = inputEvent.target as HTMLSpanElement;
    const modifiedPhrasesFromHistory = this.history[
      this.history.length - 1
    ].editablePhrases.map((a) => ({ ...a }));
    modifiedPhrasesFromHistory[editablePhraseIndex].value =
      phraseElement.innerText;
    this.history.push({
      editablePhrases: [...modifiedPhrasesFromHistory].map((a) => ({ ...a })),
      lastModifiedEditablePhraseIndex: editablePhraseIndex,
      selection,
    });
    this.workspace = {
      ...this.workspace,
      lastModifiedEditablePhraseIndex: editablePhraseIndex,
      lastSelection: selection,
      historyIndex: this.history.length - 1,
    };
    console.log(selection);
    this.updateViewablePhrasesValue();
  }

  public pasteContentWithoutStylesAndEnters(e: ClipboardEvent) {
    //delete this
    e.preventDefault();
    let text = e.clipboardData.getData("text/plain");
    text = text.replace(/\n/g, " ");
    // todo
    document.execCommand("insertText", false, text);
  }

  public fileBackdropHandlerListener = () => {
    const initCount = -1;
    let count = initCount;
    window.ondragover = (e) => {
      e.preventDefault();
    };
    const docxFileType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    window.ondragenter = (e) => {
      // if event contains a file with .docx extension
      if (
        e.dataTransfer.items[0].kind === "file" &&
        e.dataTransfer.items[0].type === docxFileType
      ) {
        this.workspace.dropingFile = true;
        count++;
      }
    };
    window.ondragleave = () => {
      count--;
      if (count < 0) {
        this.workspace.dropingFile = false;
        count = initCount;
      }
    };
    window.ondrop = (e: DragEvent) => {
      e.preventDefault();
      count = initCount;
      this.workspace.dropingFile = false;
      if (
        e.dataTransfer.items[0].kind === "file" &&
        e.dataTransfer.items[0].type === docxFileType
      ) {
        this.setTemplateFromFile(e.dataTransfer.files[0]);
      }
    };
  };

  public setMode(mode: string) {
    if (mode === ViewMode.edit) {
      this.workspace.mode = ViewMode.edit;
      this.updatesPhrasesValues();
    } else if (mode === ViewMode.view) {
      this.workspace.mode = ViewMode.view;
      this.updatesPhrasesValues();
    } else if (mode === ViewMode.simulation) {
      this.workspace.mode = ViewMode.simulation;
    } else if (mode === ViewMode.editView) {
      this.workspace.mode = ViewMode.editView;
      if (this.workspace.paperZoom.value >= 1) {
        this.workspace.paperZoom.value = 0.9;
      }
    }
  }

  private updatesPhrasesValues() {
    this.updateEditablePhrasesValue();
    this.updateViewablePhrasesValue();
  }

  private updateEditablePhrasesValue() {
    this.workspace.lastModifiedEditablePhraseIndex = this.history[
      this.workspace.historyIndex
    ].lastModifiedEditablePhraseIndex;
    this.editablePhrases = this.history[
      this.workspace.historyIndex
    ].editablePhrases.map((a) => ({
      ...a,
    }));
    this.workspace.needToFocus = true;
    this.workspace.needToFocus = false;
  }

  private updateViewablePhrasesValue() {
    const updatedViewablePhrases = transformEditablePhrasesToViewablePhrases(
      this.history[this.workspace.historyIndex].editablePhrases
    );
    if (this.viewablePhrases.length === updatedViewablePhrases.length) {
      updatedViewablePhrases.forEach((updatedViewablePhrase, index) => {
        if (this.viewablePhrases[index].value !== updatedViewablePhrase.value) {
          this.viewablePhrases[index].value = updatedViewablePhrase.value;
        }
      });
    } else {
      this.viewablePhrases = transformEditablePhrasesToViewablePhrases(
        this.history[this.workspace.historyIndex].editablePhrases
      );
    }
  }

  private changeModeWithHotkeysListener() {
    document.addEventListener("keydown", (e) => {
      // detect when shift + v or shift + V and detect when stop pressing
      if ((e.key === "z" || e.key === "Z") && e.shiftKey && e.altKey) {
        e.preventDefault();
        if (this.workspace.mode !== ViewMode.edit) {
          this.setMode("edit");
        }
      } else if ((e.key === "x" || e.key === "X") && e.shiftKey && e.altKey) {
        e.preventDefault();
        if (this.workspace.mode !== ViewMode.view) {
          this.setMode("view");
        }
      } else if ((e.key === "c" || e.key === "C") && e.shiftKey && e.altKey) {
        e.preventDefault();
        if (this.workspace.mode !== ViewMode.simulation) {
          this.setMode("simulation");
        }
      }
    });
  }

  public undo = () => {
    if (this.workspace.historyIndex > 0) {
      const editablePhrasesFromLastestElementInHistory = this.history[
        this.workspace.historyIndex
      ].editablePhrases.map((a) => ({
        ...a,
      }));
      this.workspace.lastModifiedEditablePhraseIndex = this.history[
        this.workspace.historyIndex
      ].lastModifiedEditablePhraseIndex;
      this.workspace.historyIndex--;
      editablePhrasesFromLastestElementInHistory.map(
        (editablePhrase, index) => {
          const editablePhraseFromHistory = this.history[
            this.workspace.historyIndex
          ].editablePhrases[index];
          if (editablePhrase.value !== editablePhraseFromHistory.value) {
            this.editablePhrases[index] = {
              ...this.history[this.workspace.historyIndex].editablePhrases[
                index
              ],
            };
          }
        }
      );
      this.updateViewablePhrasesValue();
    }
  };

  public redo = () => {
    if (this.workspace.historyIndex + 1 <= this.history.length - 1) {
      const editablePhrasesFromLastestElementInHistory = this.history[
        this.workspace.historyIndex
      ].editablePhrases.map((a) => ({
        ...a,
      }));
      this.workspace.historyIndex++;
      this.workspace.lastModifiedEditablePhraseIndex = this.history[
        this.workspace.historyIndex
      ].lastModifiedEditablePhraseIndex;
      editablePhrasesFromLastestElementInHistory.map(
        (editablePhrase, index) => {
          const editablePhraseFromHistory = this.history[
            this.workspace.historyIndex
          ].editablePhrases[index];
          if (editablePhrase.value !== editablePhraseFromHistory.value) {
            this.editablePhrases[index] = { ...editablePhraseFromHistory };
          }
        }
      );
      this.updateViewablePhrasesValue();
    }
  };

  private historyHandlerListener() {
    // add event listener to ctrl + z and ctrl + y
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        if (e.key === "z") {
          e.preventDefault();
          this.undo();
        } else if (e.key === "y") {
          e.preventDefault();
          this.redo();
        }
      }
    });
  }
}
export interface DocxFile {
  name: string;
  lastModifiedDate: number;
  content: InputFileFormat;
}

export interface WorkSpace {
  dropingFile: boolean;
  fileDropDown: boolean;
  paperZoom: { value: number };
  dataZoom: { value: number };
  mode: ViewMode;
  historyIndex: number;
  lastModifiedEditablePhraseIndex: number;
  lastSelection: Selection | undefined;
  searchData?: string;
  needToFocus: boolean;
}

export enum ViewMode {
  edit = "edit",
  view = "view",
  simulation = "simulation",
  editView = "editView",
}

export interface History {
  editablePhrases: EditablePhrase[];
  lastModifiedEditablePhraseIndex: number;
  selection?: Selection;
}
