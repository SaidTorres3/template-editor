import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { docxToEditableObjects } from "../../utils/docxParsers/docxToEditableObjects";
import { transformEditablePhrasesToViewablePhrases } from "../../utils/phrasesParsers/transformEditablePhrasesToViewablePhrases";
import { ViewMode } from "../interfaces";
import { Zoom } from "../shared/zoom-class/Zoom";
import * as i0 from "@angular/core";
import * as i1 from "../components/header/header.component";
import * as i2 from "../components/workspace/workspace.component";
import * as i3 from "../components/footer/footer.component";
export class AppComponent {
    constructor() {
        this.title = "template-editor";
        this.save = new EventEmitter();
        this.editablePhrases = [];
        this.viewablePhrases = [];
        this.history = [];
        this.zoom = new Zoom();
        this.workspace = {
            dropingFile: false,
            fileDropDown: false,
            paperZoom: { value: 1 },
            dataZoom: { value: 1 },
            mode: ViewMode.edit,
            historyIndex: 0,
            lastModifiedEditablePhraseIndex: 0,
            lastSelection: { start: 0, end: 0 },
            needToFocus: false,
        };
        this.docxFile = {
            content: "",
            name: "",
            lastModifiedDate: 0,
        };
        this.fileBackdropHandlerListener = () => {
            const initCount = -1;
            let count = initCount;
            window.ondragover = (e) => {
                e.preventDefault();
            };
            const docxFileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            window.ondragenter = (e) => {
                // if event contains a file with .docx extension
                if (e.dataTransfer.items[0].kind === "file" &&
                    e.dataTransfer.items[0].type === docxFileType) {
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
            window.ondrop = (e) => {
                e.preventDefault();
                count = initCount;
                this.workspace.dropingFile = false;
                if (e.dataTransfer.items[0].kind === "file" &&
                    e.dataTransfer.items[0].type === docxFileType) {
                    this.setTemplateFromFile(e.dataTransfer.files[0]);
                }
            };
        };
        this.undo = () => {
            if (this.workspace.historyIndex > 0) {
                const editablePhrasesFromLastestElementInHistory = this.history[this.workspace.historyIndex].editablePhrases.map((a) => ({ ...a }));
                this.workspace.historyIndex--;
                this.workspace = {
                    ...this.workspace,
                    lastModifiedEditablePhraseIndex: this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex,
                    lastSelection: this.history[this.workspace.historyIndex].selection,
                };
                editablePhrasesFromLastestElementInHistory.map((editablePhrase, index) => {
                    const editablePhraseFromHistory = this.history[this.workspace.historyIndex].editablePhrases[index];
                    if (editablePhrase.value !== editablePhraseFromHistory.value) {
                        this.editablePhrases[index] = {
                            ...this.history[this.workspace.historyIndex].editablePhrases[index],
                        };
                    }
                });
                this.updateViewablePhrasesValue();
            }
        };
        this.redo = () => {
            if (this.workspace.historyIndex + 1 <= this.history.length - 1) {
                const editablePhrasesFromLastestElementInHistory = this.history[this.workspace.historyIndex].editablePhrases.map((a) => ({
                    ...a,
                }));
                this.workspace.historyIndex++;
                this.workspace = {
                    ...this.workspace,
                    lastModifiedEditablePhraseIndex: this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex,
                    lastSelection: this.history[this.workspace.historyIndex].selection,
                };
                editablePhrasesFromLastestElementInHistory.map((editablePhrase, index) => {
                    const editablePhraseFromHistory = this.history[this.workspace.historyIndex].editablePhrases[index];
                    if (editablePhrase.value !== editablePhraseFromHistory.value) {
                        this.editablePhrases[index] = { ...editablePhraseFromHistory };
                    }
                });
                this.updateViewablePhrasesValue();
            }
        };
    }
    saveHandler(docxFile) {
        this.save.emit(docxFile);
    }
    ngOnInit() {
        if (this.template) {
            this.setTemplateFromFile(this.template);
        }
    }
    ngAfterViewInit() {
        this.fileBackdropHandlerListener();
        this.historyHandlerListener();
        this.changeModeWithHotkeysListener();
    }
    setTemplateFromInputEvent(inputEvent) {
        const inputFile = inputEvent.target;
        this.setTemplateFromFile(inputFile.files[0]);
    }
    setTemplateFromFile(inputFile) {
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
    setPhrases(editableObjects) {
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
    updateEditablePhrase(inputEvent, editablePhraseIndex) {
        const doesHistoryIndexIsPosibleInHistory = this.workspace.historyIndex < this.history.length - 1;
        if (doesHistoryIndexIsPosibleInHistory) {
            const historyCuttedAfterCurrentIndex = this.history.slice(0, this.workspace.historyIndex + 1);
            this.history = historyCuttedAfterCurrentIndex;
        }
        const selection = window.getSelection();
        const selectionRange = {
            start: selection.anchorOffset,
            end: selection.focusOffset,
        };
        const phraseElement = inputEvent.target;
        const modifiedPhrasesFromHistory = this.history[this.history.length - 1].editablePhrases.map((a) => ({ ...a }));
        modifiedPhrasesFromHistory[editablePhraseIndex].value =
            phraseElement.innerText;
        this.history.push({
            editablePhrases: [...modifiedPhrasesFromHistory].map((a) => ({ ...a })),
            lastModifiedEditablePhraseIndex: editablePhraseIndex,
            selection: selectionRange,
        });
        this.workspace = {
            ...this.workspace,
            lastModifiedEditablePhraseIndex: editablePhraseIndex,
            lastSelection: selectionRange,
            historyIndex: this.history.length - 1,
        };
        this.updateViewablePhrasesValue();
    }
    setMode(mode) {
        if (mode === ViewMode.edit) {
            this.workspace.mode = ViewMode.edit;
            this.updatesPhrasesValues();
        }
        else if (mode === ViewMode.view) {
            this.workspace.mode = ViewMode.view;
            this.updatesPhrasesValues();
        }
        else if (mode === ViewMode.simulation) {
            this.workspace.mode = ViewMode.simulation;
        }
        else if (mode === ViewMode.editView) {
            this.workspace.mode = ViewMode.editView;
            if (this.workspace.paperZoom.value >= 1) {
                this.workspace.paperZoom.value = 0.9;
            }
        }
    }
    updatesPhrasesValues() {
        this.updateEditablePhrasesValue();
        this.updateViewablePhrasesValue();
    }
    updateEditablePhrasesValue() {
        this.workspace.lastModifiedEditablePhraseIndex = this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex;
        this.editablePhrases = this.history[this.workspace.historyIndex].editablePhrases.map((a) => ({
            ...a,
        }));
        this.workspace.needToFocus = true;
        this.workspace.needToFocus = false;
    }
    updateViewablePhrasesValue() {
        const updatedViewablePhrases = transformEditablePhrasesToViewablePhrases(this.history[this.workspace.historyIndex].editablePhrases);
        if (this.viewablePhrases.length === updatedViewablePhrases.length) {
            updatedViewablePhrases.forEach((updatedViewablePhrase, index) => {
                if (this.viewablePhrases[index].value !== updatedViewablePhrase.value) {
                    this.viewablePhrases[index].value = updatedViewablePhrase.value;
                }
            });
        }
        else {
            this.viewablePhrases = transformEditablePhrasesToViewablePhrases(this.history[this.workspace.historyIndex].editablePhrases);
        }
    }
    changeModeWithHotkeysListener() {
        document.addEventListener("keydown", (e) => {
            // detect when shift + v or shift + V and detect when stop pressing
            if ((e.key === "z" || e.key === "Z") && e.shiftKey && e.altKey) {
                e.preventDefault();
                if (this.workspace.mode !== ViewMode.edit) {
                    this.setMode("edit");
                }
            }
            else if ((e.key === "x" || e.key === "X") && e.shiftKey && e.altKey) {
                e.preventDefault();
                if (this.workspace.mode !== ViewMode.view) {
                    this.setMode("view");
                }
            }
            else if ((e.key === "c" || e.key === "C") && e.shiftKey && e.altKey) {
                e.preventDefault();
                if (this.workspace.mode !== ViewMode.simulation) {
                    this.setMode("simulation");
                }
            }
        });
    }
    historyHandlerListener() {
        // add event listener to ctrl + z and ctrl + y
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                if (e.key === "z") {
                    e.preventDefault();
                    this.undo();
                }
                else if (e.key === "y") {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }
}
AppComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
AppComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: AppComponent, selector: "template-editor", inputs: { data: "data", template: "template" }, outputs: { save: "save" }, viewQueries: [{ propertyName: "uploadFileInput", first: true, predicate: ["uploadFileInput"], descendants: true }, { propertyName: "templateContainer", first: true, predicate: ["templateContainer"], descendants: true }], ngImport: i0, template: "<body>\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"setTemplateFromInputEvent($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n    />\r\n\r\n  <div\r\n    class=\"backdrop\"\r\n    [class.backdrop--hover]=\"workspace.dropingFile\"\r\n    (wheel)=\"$event.preventDefault()\"\r\n  >\r\n    <div class=\"backdrop__drop-file-msg\">\r\n      Abrir template\r\n    </div>\r\n  </div>\r\n\r\n  <app-header\r\n    [workspace]=\"workspace\"\r\n    [docxFile]=\"docxFile\"\r\n    [history]=\"history\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [uploadFileInput]=\"uploadFileInput\"\r\n    (fileChange)=\"setTemplateFromInputEvent($event)\"\r\n    (docxFileChanged)=\"saveHandler($event)\"\r\n  ></app-header>\r\n\r\n  <app-workspace\r\n    [data]=\"data\"\r\n    [workspace]=\"workspace\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [fileInput]=\"uploadFileInput\"\r\n    [viewablePhrases]=\"viewablePhrases\"\r\n    style=\"flex-grow: 1; height: 100%; overflow: auto;\"\r\n    (editablePhraseChanged)=\"updateEditablePhrase($event.inputEvent, $event.indexOfEditablePhrase)\"\r\n  ></app-workspace>\r\n\r\n  <app-footer\r\n    [workspace]=\"workspace\"\r\n    (clickEditMode)=\"!$event.shiftKey ? setMode('edit') : setMode('editView')\"\r\n    (clickViewMode)=\"!$event.shiftKey ? setMode('view') : setMode('editView')\"\r\n    (clickSimulationMode)=\"setMode('simulation')\"\r\n  ></app-footer>\r\n</body>", styles: ["@font-face{font-family:Readex Pro;font-style:normal;font-weight:200;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQzfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQwBm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxtm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQyBnLw3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQy4nLw3.ttf) format(\"truetype\")}body{margin:0;position:relative;display:flex;flex-direction:column;font-family:Readex Pro,sans-serif;background-color:#f4f6f7;font-weight:300;box-sizing:border-box;height:100%;width:100%;--elements-color: #fff;--legalSizeSheet-width: 816px;--legalSizeSheet-height: 1344px;--header-height: 50px;--footer-height: 20px;--data-searchbar-height: 20px}.backdrop{display:flex;background:radial-gradient(circle,#000D 0%,#0009 70%,#0005 100%);position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop--hover{visibility:initial;opacity:1}.backdrop__drop-file-msg{font-size:5vw;color:#fff;font-weight:300;border-style:dashed;border-radius:.8vw;border-color:#fff;border-width:1vw;padding:1.5vw}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: i1.HeaderComponent, selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]", inputs: ["workspace", "docxFile", "history", "uploadFileInput", "editablePhrases"], outputs: ["fileChange", "docxFileChanged"] }, { type: i2.WorkspaceComponent, selector: "app-workspace[data][workspace][editablePhrases][fileInput][viewablePhrases]", inputs: ["data", "workspace", "editablePhrases", "fileInput", "viewablePhrases"], outputs: ["editablePhraseChanged"] }, { type: i3.FooterComponent, selector: "app-footer[workspace]", inputs: ["workspace"], outputs: ["clickEditMode", "clickViewMode", "clickSimulationMode"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppComponent, decorators: [{
            type: Component,
            args: [{ selector: "template-editor", template: "<body>\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"setTemplateFromInputEvent($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n    />\r\n\r\n  <div\r\n    class=\"backdrop\"\r\n    [class.backdrop--hover]=\"workspace.dropingFile\"\r\n    (wheel)=\"$event.preventDefault()\"\r\n  >\r\n    <div class=\"backdrop__drop-file-msg\">\r\n      Abrir template\r\n    </div>\r\n  </div>\r\n\r\n  <app-header\r\n    [workspace]=\"workspace\"\r\n    [docxFile]=\"docxFile\"\r\n    [history]=\"history\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [uploadFileInput]=\"uploadFileInput\"\r\n    (fileChange)=\"setTemplateFromInputEvent($event)\"\r\n    (docxFileChanged)=\"saveHandler($event)\"\r\n  ></app-header>\r\n\r\n  <app-workspace\r\n    [data]=\"data\"\r\n    [workspace]=\"workspace\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [fileInput]=\"uploadFileInput\"\r\n    [viewablePhrases]=\"viewablePhrases\"\r\n    style=\"flex-grow: 1; height: 100%; overflow: auto;\"\r\n    (editablePhraseChanged)=\"updateEditablePhrase($event.inputEvent, $event.indexOfEditablePhrase)\"\r\n  ></app-workspace>\r\n\r\n  <app-footer\r\n    [workspace]=\"workspace\"\r\n    (clickEditMode)=\"!$event.shiftKey ? setMode('edit') : setMode('editView')\"\r\n    (clickViewMode)=\"!$event.shiftKey ? setMode('view') : setMode('editView')\"\r\n    (clickSimulationMode)=\"setMode('simulation')\"\r\n  ></app-footer>\r\n</body>", styles: ["@font-face{font-family:Readex Pro;font-style:normal;font-weight:200;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQzfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQwBm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxtm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQyBnLw3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQy4nLw3.ttf) format(\"truetype\")}body{margin:0;position:relative;display:flex;flex-direction:column;font-family:Readex Pro,sans-serif;background-color:#f4f6f7;font-weight:300;box-sizing:border-box;height:100%;width:100%;--elements-color: #fff;--legalSizeSheet-width: 816px;--legalSizeSheet-height: 1344px;--header-height: 50px;--footer-height: 20px;--data-searchbar-height: 20px}.backdrop{display:flex;background:radial-gradient(circle,#000D 0%,#0009 70%,#0005 100%);position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop--hover{visibility:initial;opacity:1}.backdrop__drop-file-msg{font-size:5vw;color:#fff;font-weight:300;border-style:dashed;border-radius:.8vw;border-color:#fff;border-width:1vw;padding:1.5vw}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { uploadFileInput: [{
                type: ViewChild,
                args: ["uploadFileInput"]
            }], templateContainer: [{
                type: ViewChild,
                args: ["templateContainer"]
            }], data: [{
                type: Input
            }], template: [{
                type: Input
            }], save: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvdGVtcGxhdGUtZWRpdG9yL3RlbXBsYXRlLWVkaXRvci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3RlbXBsYXRlLWVkaXRvci90ZW1wbGF0ZS1lZGl0b3IuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFNdEYsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLE1BQU0sc0VBQXNFLENBQUM7QUFDakksT0FBTyxFQUFZLFFBQVEsRUFBc0MsTUFBTSxlQUFlLENBQUM7QUFDdkYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7OztBQU9qRCxNQUFNLE9BQU8sWUFBWTtJQUx6QjtRQU1FLFVBQUssR0FBRyxpQkFBaUIsQ0FBQztRQU1oQixTQUFJLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7UUFNL0Qsb0JBQWUsR0FBcUIsRUFBRSxDQUFDO1FBQ3ZDLG9CQUFlLEdBQXFCLEVBQUUsQ0FBQztRQUN2QyxZQUFPLEdBQWMsRUFBRSxDQUFDO1FBQ3hCLFNBQUksR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRXhCLGNBQVMsR0FBYztZQUM1QixXQUFXLEVBQUUsS0FBSztZQUNsQixZQUFZLEVBQUUsS0FBSztZQUNuQixTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7WUFDdEIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1lBQ25CLFlBQVks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QUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsVUFBVSxFQUFFO29CQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUM1QjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBOERPLHNCQUFzQjtRQUM1Qiw4Q0FBOEM7UUFDOUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQkFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFO29CQUNqQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ25CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDYjtxQkFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFO29CQUN4QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ25CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDYjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzt5R0FwVFUsWUFBWTs2RkFBWixZQUFZLCtWQ2hCekIscStDQStDTzsyRkQvQk0sWUFBWTtrQkFMeEIsU0FBUzsrQkFDRSxpQkFBaUI7OEJBTUcsZUFBZTtzQkFBNUMsU0FBUzt1QkFBQyxpQkFBaUI7Z0JBQ0ksaUJBQWlCO3NCQUFoRCxTQUFTO3VCQUFDLG1CQUFtQjtnQkFFckIsSUFBSTtzQkFBWixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0ksSUFBSTtzQkFBYixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IGRvY3hUb0VkaXRhYmxlT2JqZWN0cyB9IGZyb20gXCIuLi8uLi91dGlscy9kb2N4UGFyc2Vycy9kb2N4VG9FZGl0YWJsZU9iamVjdHNcIjtcclxuaW1wb3J0IHtcclxuICBFZGl0YWJsZVBocmFzZSxcclxuICBJbnB1dEZpbGVGb3JtYXQsXHJcbiAgVmlld2FibGVQaHJhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL3V0aWxzL2RvY3hQYXJzZXJzL3R5cGVzXCI7XHJcbmltcG9ydCB7IHRyYW5zZm9ybUVkaXRhYmxlUGhyYXNlc1RvVmlld2FibGVQaHJhc2VzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3BocmFzZXNQYXJzZXJzL3RyYW5zZm9ybUVkaXRhYmxlUGhyYXNlc1RvVmlld2FibGVQaHJhc2VzXCI7XHJcbmltcG9ydCB7IERvY3hGaWxlLCBWaWV3TW9kZSwgV29ya1NwYWNlLCBIaXN0b3J5LCBTZWxlY3Rpb25SYW5nZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzXCI7XHJcbmltcG9ydCB7IFpvb20gfSBmcm9tIFwiLi4vc2hhcmVkL3pvb20tY2xhc3MvWm9vbVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwidGVtcGxhdGUtZWRpdG9yXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwiLi90ZW1wbGF0ZS1lZGl0b3IuY29tcG9uZW50Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcIi4vdGVtcGxhdGUtZWRpdG9yLmNvbXBvbmVudC5sZXNzXCIsIFwiLi4vc2hhcmVkL3N0eWxlcy9jb21tb25TdHlsZXMubGVzc1wiXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XHJcbiAgdGl0bGUgPSBcInRlbXBsYXRlLWVkaXRvclwiO1xyXG4gIEBWaWV3Q2hpbGQoXCJ1cGxvYWRGaWxlSW5wdXRcIikgdXBsb2FkRmlsZUlucHV0OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xyXG4gIEBWaWV3Q2hpbGQoXCJ0ZW1wbGF0ZUNvbnRhaW5lclwiKSB0ZW1wbGF0ZUNvbnRhaW5lcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XHJcbiAgXHJcbiAgQElucHV0KCkgZGF0YTogYW55O1xyXG4gIEBJbnB1dCgpIHRlbXBsYXRlOiBJbnB1dEZpbGVGb3JtYXRcclxuICBAT3V0cHV0KCkgc2F2ZTogRXZlbnRFbWl0dGVyPERvY3hGaWxlPiA9IG5ldyBFdmVudEVtaXR0ZXI8RG9jeEZpbGU+KCk7XHJcblxyXG4gIHB1YmxpYyBzYXZlSGFuZGxlcihkb2N4RmlsZTogRG9jeEZpbGUpIHtcclxuICAgIHRoaXMuc2F2ZS5lbWl0KGRvY3hGaWxlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlZGl0YWJsZVBocmFzZXM6IEVkaXRhYmxlUGhyYXNlW10gPSBbXTtcclxuICBwdWJsaWMgdmlld2FibGVQaHJhc2VzOiBWaWV3YWJsZVBocmFzZVtdID0gW107XHJcbiAgcHVibGljIGhpc3Rvcnk6IEhpc3RvcnlbXSA9IFtdO1xyXG4gIHB1YmxpYyB6b29tOiBab29tID0gbmV3IFpvb20oKTtcclxuXHJcbiAgcHVibGljIHdvcmtzcGFjZTogV29ya1NwYWNlID0ge1xyXG4gICAgZHJvcGluZ0ZpbGU6IGZhbHNlLFxyXG4gICAgZmlsZURyb3BEb3duOiBmYWxzZSxcclxuICAgIHBhcGVyWm9vbTogeyB2YWx1ZTogMSB9LFxyXG4gICAgZGF0YVpvb206IHsgdmFsdWU6IDEgfSxcclxuICAgIG1vZGU6IFZpZXdNb2RlLmVkaXQsXHJcbiAgICBoaXN0b3J5SW5kZXg6IDAsXHJcbiAgICBsYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4OiAwLFxyXG4gICAgbGFzdFNlbGVjdGlvbjogeyBzdGFydDogMCwgZW5kOiAwIH0sXHJcbiAgICBuZWVkVG9Gb2N1czogZmFsc2UsXHJcbiAgfTtcclxuXHJcbiAgcHVibGljIGRvY3hGaWxlOiBEb2N4RmlsZSA9IHtcclxuICAgIGNvbnRlbnQ6IFwiXCIsXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgbGFzdE1vZGlmaWVkRGF0ZTogMCxcclxuICB9O1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmKHRoaXMudGVtcGxhdGUpIHtcclxuICAgICAgdGhpcy5zZXRUZW1wbGF0ZUZyb21GaWxlKHRoaXMudGVtcGxhdGUgYXMgRmlsZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLmZpbGVCYWNrZHJvcEhhbmRsZXJMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5oaXN0b3J5SGFuZGxlckxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLmNoYW5nZU1vZGVXaXRoSG90a2V5c0xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0VGVtcGxhdGVGcm9tSW5wdXRFdmVudChpbnB1dEV2ZW50OiBFdmVudCkge1xyXG4gICAgY29uc3QgaW5wdXRGaWxlID0gaW5wdXRFdmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHRoaXMuc2V0VGVtcGxhdGVGcm9tRmlsZShpbnB1dEZpbGUuZmlsZXNbMF0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRUZW1wbGF0ZUZyb21GaWxlKGlucHV0RmlsZTogRmlsZSkge1xyXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBkYXRhID0gZS50YXJnZXQucmVzdWx0O1xyXG4gICAgICB0aGlzLmRvY3hGaWxlID0ge1xyXG4gICAgICAgIC8vIHRlbXBsYXRlIHN0b3JhZ2VcclxuICAgICAgICAuLi50aGlzLmRvY3hGaWxlLFxyXG4gICAgICAgIG5hbWU6IGlucHV0RmlsZS5uYW1lLFxyXG4gICAgICAgIGxhc3RNb2RpZmllZERhdGU6IGlucHV0RmlsZS5sYXN0TW9kaWZpZWQsXHJcbiAgICAgICAgY29udGVudDogZGF0YSxcclxuICAgICAgfTtcclxuICAgICAgZG9jeFRvRWRpdGFibGVPYmplY3RzKGlucHV0RmlsZSkudGhlbigoZWRpdGFibGVPYmplY3RzKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRQaHJhc2VzKGVkaXRhYmxlT2JqZWN0cyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihpbnB1dEZpbGUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRQaHJhc2VzKGVkaXRhYmxlT2JqZWN0czogRWRpdGFibGVQaHJhc2VbXSkge1xyXG4gICAgdGhpcy5lZGl0YWJsZVBocmFzZXMgPSBlZGl0YWJsZU9iamVjdHMubWFwKChhKSA9PiAoeyAuLi5hIH0pKTtcclxuICAgIHRoaXMuaGlzdG9yeSA9IFtcclxuICAgICAge1xyXG4gICAgICAgIGVkaXRhYmxlUGhyYXNlczogZWRpdGFibGVPYmplY3RzLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSksXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogMCxcclxuICAgICAgICBzZWxlY3Rpb246IHVuZGVmaW5lZCxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXggPSAwO1xyXG4gICAgdGhpcy51cGRhdGVzUGhyYXNlc1ZhbHVlcygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZUVkaXRhYmxlUGhyYXNlKFxyXG4gICAgaW5wdXRFdmVudDogSW5wdXRFdmVudCxcclxuICAgIGVkaXRhYmxlUGhyYXNlSW5kZXg6IG51bWJlclxyXG4gICkge1xyXG4gICAgY29uc3QgZG9lc0hpc3RvcnlJbmRleElzUG9zaWJsZUluSGlzdG9yeSA9XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCA8IHRoaXMuaGlzdG9yeS5sZW5ndGggLSAxO1xyXG4gICAgaWYgKGRvZXNIaXN0b3J5SW5kZXhJc1Bvc2libGVJbkhpc3RvcnkpIHtcclxuICAgICAgY29uc3QgaGlzdG9yeUN1dHRlZEFmdGVyQ3VycmVudEluZGV4ID0gdGhpcy5oaXN0b3J5LnNsaWNlKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4ICsgMVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmhpc3RvcnkgPSBoaXN0b3J5Q3V0dGVkQWZ0ZXJDdXJyZW50SW5kZXg7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICBjb25zdCBzZWxlY3Rpb25SYW5nZTogU2VsZWN0aW9uUmFuZ2UgPSB7XHJcbiAgICAgIHN0YXJ0OiBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0LFxyXG4gICAgICBlbmQ6IHNlbGVjdGlvbi5mb2N1c09mZnNldCxcclxuICAgIH07XHJcbiAgICBjb25zdCBwaHJhc2VFbGVtZW50ID0gaW5wdXRFdmVudC50YXJnZXQgYXMgSFRNTFNwYW5FbGVtZW50O1xyXG4gICAgY29uc3QgbW9kaWZpZWRQaHJhc2VzRnJvbUhpc3RvcnkgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgIHRoaXMuaGlzdG9yeS5sZW5ndGggLSAxXHJcbiAgICBdLmVkaXRhYmxlUGhyYXNlcy5tYXAoKGEpID0+ICh7IC4uLmEgfSkpO1xyXG4gICAgbW9kaWZpZWRQaHJhc2VzRnJvbUhpc3RvcnlbZWRpdGFibGVQaHJhc2VJbmRleF0udmFsdWUgPVxyXG4gICAgICBwaHJhc2VFbGVtZW50LmlubmVyVGV4dDtcclxuICAgIHRoaXMuaGlzdG9yeS5wdXNoKHtcclxuICAgICAgZWRpdGFibGVQaHJhc2VzOiBbLi4ubW9kaWZpZWRQaHJhc2VzRnJvbUhpc3RvcnldLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSksXHJcbiAgICAgIGxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXg6IGVkaXRhYmxlUGhyYXNlSW5kZXgsXHJcbiAgICAgIHNlbGVjdGlvbjogc2VsZWN0aW9uUmFuZ2UsXHJcbiAgICB9KTtcclxuICAgIHRoaXMud29ya3NwYWNlID0ge1xyXG4gICAgICAuLi50aGlzLndvcmtzcGFjZSxcclxuICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogZWRpdGFibGVQaHJhc2VJbmRleCxcclxuICAgICAgbGFzdFNlbGVjdGlvbjogc2VsZWN0aW9uUmFuZ2UsXHJcbiAgICAgIGhpc3RvcnlJbmRleDogdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDEsXHJcbiAgICB9O1xyXG4gICAgdGhpcy51cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gIH1cclxuXHJcblxyXG4gIHB1YmxpYyBmaWxlQmFja2Ryb3BIYW5kbGVyTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpbml0Q291bnQgPSAtMTtcclxuICAgIGxldCBjb3VudCA9IGluaXRDb3VudDtcclxuICAgIHdpbmRvdy5vbmRyYWdvdmVyID0gKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGRvY3hGaWxlVHlwZSA9XHJcbiAgICAgIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnRcIjtcclxuICAgIHdpbmRvdy5vbmRyYWdlbnRlciA9IChlKSA9PiB7XHJcbiAgICAgIC8vIGlmIGV2ZW50IGNvbnRhaW5zIGEgZmlsZSB3aXRoIC5kb2N4IGV4dGVuc2lvblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuaXRlbXNbMF0ua2luZCA9PT0gXCJmaWxlXCIgJiZcclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5pdGVtc1swXS50eXBlID09PSBkb2N4RmlsZVR5cGVcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZHJvcGluZ0ZpbGUgPSB0cnVlO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB3aW5kb3cub25kcmFnbGVhdmUgPSAoKSA9PiB7XHJcbiAgICAgIGNvdW50LS07XHJcbiAgICAgIGlmIChjb3VudCA8IDApIHtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5kcm9waW5nRmlsZSA9IGZhbHNlO1xyXG4gICAgICAgIGNvdW50ID0gaW5pdENvdW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgd2luZG93Lm9uZHJvcCA9IChlOiBEcmFnRXZlbnQpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb3VudCA9IGluaXRDb3VudDtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UuZHJvcGluZ0ZpbGUgPSBmYWxzZTtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLml0ZW1zWzBdLmtpbmQgPT09IFwiZmlsZVwiICYmXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuaXRlbXNbMF0udHlwZSA9PT0gZG9jeEZpbGVUeXBlXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMuc2V0VGVtcGxhdGVGcm9tRmlsZShlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHNldE1vZGUobW9kZTogc3RyaW5nKSB7XHJcbiAgICBpZiAobW9kZSA9PT0gVmlld01vZGUuZWRpdCkge1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5tb2RlID0gVmlld01vZGUuZWRpdDtcclxuICAgICAgdGhpcy51cGRhdGVzUGhyYXNlc1ZhbHVlcygpO1xyXG4gICAgfSBlbHNlIGlmIChtb2RlID09PSBWaWV3TW9kZS52aWV3KSB7XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLm1vZGUgPSBWaWV3TW9kZS52aWV3O1xyXG4gICAgICB0aGlzLnVwZGF0ZXNQaHJhc2VzVmFsdWVzKCk7XHJcbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFZpZXdNb2RlLnNpbXVsYXRpb24pIHtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UubW9kZSA9IFZpZXdNb2RlLnNpbXVsYXRpb247XHJcbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFZpZXdNb2RlLmVkaXRWaWV3KSB7XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLm1vZGUgPSBWaWV3TW9kZS5lZGl0VmlldztcclxuICAgICAgaWYgKHRoaXMud29ya3NwYWNlLnBhcGVyWm9vbS52YWx1ZSA+PSAxKSB7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UucGFwZXJab29tLnZhbHVlID0gMC45O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZXNQaHJhc2VzVmFsdWVzKCkge1xyXG4gICAgdGhpcy51cGRhdGVFZGl0YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gICAgdGhpcy51cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVFZGl0YWJsZVBocmFzZXNWYWx1ZSgpIHtcclxuICAgIHRoaXMud29ya3NwYWNlLmxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXggPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgXS5sYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4O1xyXG4gICAgdGhpcy5lZGl0YWJsZVBocmFzZXMgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgXS5lZGl0YWJsZVBocmFzZXMubWFwKChhKSA9PiAoe1xyXG4gICAgICAuLi5hLFxyXG4gICAgfSkpO1xyXG4gICAgdGhpcy53b3Jrc3BhY2UubmVlZFRvRm9jdXMgPSB0cnVlO1xyXG4gICAgdGhpcy53b3Jrc3BhY2UubmVlZFRvRm9jdXMgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlVmlld2FibGVQaHJhc2VzVmFsdWUoKSB7XHJcbiAgICBjb25zdCB1cGRhdGVkVmlld2FibGVQaHJhc2VzID0gdHJhbnNmb3JtRWRpdGFibGVQaHJhc2VzVG9WaWV3YWJsZVBocmFzZXMoXHJcbiAgICAgIHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLmVkaXRhYmxlUGhyYXNlc1xyXG4gICAgKTtcclxuICAgIGlmICh0aGlzLnZpZXdhYmxlUGhyYXNlcy5sZW5ndGggPT09IHVwZGF0ZWRWaWV3YWJsZVBocmFzZXMubGVuZ3RoKSB7XHJcbiAgICAgIHVwZGF0ZWRWaWV3YWJsZVBocmFzZXMuZm9yRWFjaCgodXBkYXRlZFZpZXdhYmxlUGhyYXNlLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnZpZXdhYmxlUGhyYXNlc1tpbmRleF0udmFsdWUgIT09IHVwZGF0ZWRWaWV3YWJsZVBocmFzZS52YWx1ZSkge1xyXG4gICAgICAgICAgdGhpcy52aWV3YWJsZVBocmFzZXNbaW5kZXhdLnZhbHVlID0gdXBkYXRlZFZpZXdhYmxlUGhyYXNlLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpZXdhYmxlUGhyYXNlcyA9IHRyYW5zZm9ybUVkaXRhYmxlUGhyYXNlc1RvVmlld2FibGVQaHJhc2VzKFxyXG4gICAgICAgIHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLmVkaXRhYmxlUGhyYXNlc1xyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGFuZ2VNb2RlV2l0aEhvdGtleXNMaXN0ZW5lcigpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XHJcbiAgICAgIC8vIGRldGVjdCB3aGVuIHNoaWZ0ICsgdiBvciBzaGlmdCArIFYgYW5kIGRldGVjdCB3aGVuIHN0b3AgcHJlc3NpbmdcclxuICAgICAgaWYgKChlLmtleSA9PT0gXCJ6XCIgfHwgZS5rZXkgPT09IFwiWlwiKSAmJiBlLnNoaWZ0S2V5ICYmIGUuYWx0S2V5KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmICh0aGlzLndvcmtzcGFjZS5tb2RlICE9PSBWaWV3TW9kZS5lZGl0KSB7XHJcbiAgICAgICAgICB0aGlzLnNldE1vZGUoXCJlZGl0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICgoZS5rZXkgPT09IFwieFwiIHx8IGUua2V5ID09PSBcIlhcIikgJiYgZS5zaGlmdEtleSAmJiBlLmFsdEtleSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAodGhpcy53b3Jrc3BhY2UubW9kZSAhPT0gVmlld01vZGUudmlldykge1xyXG4gICAgICAgICAgdGhpcy5zZXRNb2RlKFwidmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoKGUua2V5ID09PSBcImNcIiB8fCBlLmtleSA9PT0gXCJDXCIpICYmIGUuc2hpZnRLZXkgJiYgZS5hbHRLZXkpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMud29ya3NwYWNlLm1vZGUgIT09IFZpZXdNb2RlLnNpbXVsYXRpb24pIHtcclxuICAgICAgICAgIHRoaXMuc2V0TW9kZShcInNpbXVsYXRpb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1bmRvID0gKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCA+IDApIHtcclxuICAgICAgY29uc3QgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgICBdLmVkaXRhYmxlUGhyYXNlcy5tYXAoKGEpID0+ICh7IC4uLmEgfSkpO1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXgtLTtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UgPSB7XHJcbiAgICAgICAgLi4udGhpcy53b3Jrc3BhY2UsXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICAgICAgXS5sYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4LFxyXG4gICAgICAgIGxhc3RTZWxlY3Rpb246IHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLnNlbGVjdGlvbixcclxuICAgICAgfTtcclxuICAgICAgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5Lm1hcChcclxuICAgICAgICAoZWRpdGFibGVQaHJhc2UsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBlZGl0YWJsZVBocmFzZUZyb21IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhcclxuICAgICAgICAgIF0uZWRpdGFibGVQaHJhc2VzW2luZGV4XTtcclxuICAgICAgICAgIGlmIChlZGl0YWJsZVBocmFzZS52YWx1ZSAhPT0gZWRpdGFibGVQaHJhc2VGcm9tSGlzdG9yeS52YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRhYmxlUGhyYXNlc1tpbmRleF0gPSB7XHJcbiAgICAgICAgICAgICAgLi4udGhpcy5oaXN0b3J5W3RoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleF0uZWRpdGFibGVQaHJhc2VzW1xyXG4gICAgICAgICAgICAgICAgaW5kZXhcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgdGhpcy51cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyByZWRvID0gKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCArIDEgPD0gdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDEpIHtcclxuICAgICAgY29uc3QgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgICBdLmVkaXRhYmxlUGhyYXNlcy5tYXAoKGEpID0+ICh7XHJcbiAgICAgICAgLi4uYSxcclxuICAgICAgfSkpO1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXgrKztcclxuICAgICAgdGhpcy53b3Jrc3BhY2UgPSB7XHJcbiAgICAgICAgLi4udGhpcy53b3Jrc3BhY2UsXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICAgICAgXS5sYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4LFxyXG4gICAgICAgIGxhc3RTZWxlY3Rpb246IHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLnNlbGVjdGlvbixcclxuICAgICAgfTtcclxuICAgICAgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5Lm1hcChcclxuICAgICAgICAoZWRpdGFibGVQaHJhc2UsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBlZGl0YWJsZVBocmFzZUZyb21IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhcclxuICAgICAgICAgIF0uZWRpdGFibGVQaHJhc2VzW2luZGV4XTtcclxuICAgICAgICAgIGlmIChlZGl0YWJsZVBocmFzZS52YWx1ZSAhPT0gZWRpdGFibGVQaHJhc2VGcm9tSGlzdG9yeS52YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRhYmxlUGhyYXNlc1tpbmRleF0gPSB7IC4uLmVkaXRhYmxlUGhyYXNlRnJvbUhpc3RvcnkgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMudXBkYXRlVmlld2FibGVQaHJhc2VzVmFsdWUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIGhpc3RvcnlIYW5kbGVyTGlzdGVuZXIoKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgbGlzdGVuZXIgdG8gY3RybCArIHogYW5kIGN0cmwgKyB5XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5jdHJsS2V5KSB7XHJcbiAgICAgICAgaWYgKGUua2V5ID09PSBcInpcIikge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy51bmRvKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJ5XCIpIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHRoaXMucmVkbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59IiwiPGJvZHk+XHJcbiAgPGlucHV0XHJcbiAgICAjdXBsb2FkRmlsZUlucHV0XHJcbiAgICAoY2hhbmdlKT1cInNldFRlbXBsYXRlRnJvbUlucHV0RXZlbnQoJGV2ZW50KVwiXHJcbiAgICBjbGFzcz1cImludmlzaWJsZVwiXHJcbiAgICB0eXBlPVwiZmlsZVwiXHJcbiAgICBpZD1cInRlbXBsYXRlXCJcclxuICAgIG5hbWU9XCJ0ZW1wbGF0ZVwiXHJcbiAgICBhY2NlcHQ9XCIuZG9jeFwiXHJcbiAgICAvPlxyXG5cclxuICA8ZGl2XHJcbiAgICBjbGFzcz1cImJhY2tkcm9wXCJcclxuICAgIFtjbGFzcy5iYWNrZHJvcC0taG92ZXJdPVwid29ya3NwYWNlLmRyb3BpbmdGaWxlXCJcclxuICAgICh3aGVlbCk9XCIkZXZlbnQucHJldmVudERlZmF1bHQoKVwiXHJcbiAgPlxyXG4gICAgPGRpdiBjbGFzcz1cImJhY2tkcm9wX19kcm9wLWZpbGUtbXNnXCI+XHJcbiAgICAgIEFicmlyIHRlbXBsYXRlXHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGFwcC1oZWFkZXJcclxuICAgIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCJcclxuICAgIFtkb2N4RmlsZV09XCJkb2N4RmlsZVwiXHJcbiAgICBbaGlzdG9yeV09XCJoaXN0b3J5XCJcclxuICAgIFtlZGl0YWJsZVBocmFzZXNdPVwiZWRpdGFibGVQaHJhc2VzXCJcclxuICAgIFt1cGxvYWRGaWxlSW5wdXRdPVwidXBsb2FkRmlsZUlucHV0XCJcclxuICAgIChmaWxlQ2hhbmdlKT1cInNldFRlbXBsYXRlRnJvbUlucHV0RXZlbnQoJGV2ZW50KVwiXHJcbiAgICAoZG9jeEZpbGVDaGFuZ2VkKT1cInNhdmVIYW5kbGVyKCRldmVudClcIlxyXG4gID48L2FwcC1oZWFkZXI+XHJcblxyXG4gIDxhcHAtd29ya3NwYWNlXHJcbiAgICBbZGF0YV09XCJkYXRhXCJcclxuICAgIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCJcclxuICAgIFtlZGl0YWJsZVBocmFzZXNdPVwiZWRpdGFibGVQaHJhc2VzXCJcclxuICAgIFtmaWxlSW5wdXRdPVwidXBsb2FkRmlsZUlucHV0XCJcclxuICAgIFt2aWV3YWJsZVBocmFzZXNdPVwidmlld2FibGVQaHJhc2VzXCJcclxuICAgIHN0eWxlPVwiZmxleC1ncm93OiAxOyBoZWlnaHQ6IDEwMCU7IG92ZXJmbG93OiBhdXRvO1wiXHJcbiAgICAoZWRpdGFibGVQaHJhc2VDaGFuZ2VkKT1cInVwZGF0ZUVkaXRhYmxlUGhyYXNlKCRldmVudC5pbnB1dEV2ZW50LCAkZXZlbnQuaW5kZXhPZkVkaXRhYmxlUGhyYXNlKVwiXHJcbiAgPjwvYXBwLXdvcmtzcGFjZT5cclxuXHJcbiAgPGFwcC1mb290ZXJcclxuICAgIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCJcclxuICAgIChjbGlja0VkaXRNb2RlKT1cIiEkZXZlbnQuc2hpZnRLZXkgPyBzZXRNb2RlKCdlZGl0JykgOiBzZXRNb2RlKCdlZGl0VmlldycpXCJcclxuICAgIChjbGlja1ZpZXdNb2RlKT1cIiEkZXZlbnQuc2hpZnRLZXkgPyBzZXRNb2RlKCd2aWV3JykgOiBzZXRNb2RlKCdlZGl0VmlldycpXCJcclxuICAgIChjbGlja1NpbXVsYXRpb25Nb2RlKT1cInNldE1vZGUoJ3NpbXVsYXRpb24nKVwiXHJcbiAgPjwvYXBwLWZvb3Rlcj5cclxuPC9ib2R5PiJdfQ==