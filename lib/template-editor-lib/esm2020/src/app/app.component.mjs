import { Component, Input, ViewChild } from "@angular/core";
import { docxToEditableObjects } from "../utils/docxParsers/docxToEditableObjects";
import { transformEditablePhrasesToViewablePhrases } from "../utils/phrasesParsers/transformEditablePhrasesToViewablePhrases";
import { ViewMode } from "./interfaces";
import { Zoom } from "./shared/zoom-class/Zoom";
import * as i0 from "@angular/core";
import * as i1 from "./components/header/header.component";
import * as i2 from "./components/workspace/workspace.component";
import * as i3 from "./components/footer/footer.component";
export class AppComponent {
    constructor() {
        this.title = "template-editor";
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
    ngOnInit() {
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
AppComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: AppComponent, selector: "template-editor", inputs: { objectData: "objectData" }, viewQueries: [{ propertyName: "uploadFileInput", first: true, predicate: ["uploadFileInput"], descendants: true }, { propertyName: "templateContainer", first: true, predicate: ["templateContainer"], descendants: true }], ngImport: i0, template: "<!DOCTYPE html>\r\n<html lang=\"es\" style=\"box-sizing: border-box;\">\r\n  <body>\r\n    <input\r\n      #uploadFileInput\r\n      (change)=\"setTemplateFromInputEvent($event)\"\r\n      class=\"invisible\"\r\n      type=\"file\"\r\n      id=\"template\"\r\n      name=\"template\"\r\n      accept=\".docx\"\r\n      />\r\n\r\n    <div\r\n      class=\"backdrop\"\r\n      [class.backdrop--hover]=\"workspace.dropingFile\"\r\n      (wheel)=\"$event.preventDefault()\"\r\n    >\r\n      <div class=\"backdrop__drop-file-msg\">\r\n        Abrir template\r\n      </div>\r\n    </div>\r\n\r\n    <app-header\r\n      [workspace]=\"workspace\"\r\n      [docxFile]=\"docxFile\"\r\n      [history]=\"history\"\r\n      [editablePhrases]=\"editablePhrases\"\r\n      [uploadFileInput]=\"uploadFileInput\"\r\n      (fileChange)=\"setTemplateFromInputEvent($event)\"\r\n    ></app-header>\r\n\r\n    <app-workspace\r\n      [objectData]=\"objectData\"\r\n      [workspace]=\"workspace\"\r\n      [editablePhrases]=\"editablePhrases\"\r\n      [fileInput]=\"uploadFileInput\"\r\n      [viewablePhrases]=\"viewablePhrases\"\r\n      (editablePhraseChanged)=\"updateEditablePhrase($event.inputEvent, $event.indexOfEditablePhrase)\"\r\n    ></app-workspace>\r\n\r\n    <app-footer\r\n      [workspace]=\"workspace\"\r\n      (clickEditMode)=\"!$event.shiftKey ? setMode('edit') : setMode('editView')\"\r\n      (clickViewMode)=\"!$event.shiftKey ? setMode('view') : setMode('editView')\"\r\n      (clickSimulationMode)=\"setMode('simulation')\"\r\n    ></app-footer>\r\n  </body>\r\n</html>\r\n", styles: ["@font-face{font-family:Readex Pro;font-style:normal;font-weight:200;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQzfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQwBm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxtm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQyBnLw3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQy4nLw3.ttf) format(\"truetype\")}body{margin:0;font-family:Readex Pro,sans-serif;background-color:#f4f6f7;font-weight:300;--elements-color: #fff;--legalSizeSheet-width: 816px;--legalSizeSheet-height: 1344px;--header-height: 50px;--footer-height: 20px;--data-searchbar-height: 20px}.backdrop{display:flex;background:radial-gradient(circle,#000D 0%,#0009 70%,#0005 100%);position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop--hover{visibility:initial;opacity:1}.backdrop__drop-file-msg{font-size:5vw;color:#fff;font-weight:300;border-style:dashed;border-radius:.8vw;border-color:#fff;border-width:1vw;padding:1.5vw}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: i1.HeaderComponent, selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]", inputs: ["workspace", "docxFile", "history", "uploadFileInput", "editablePhrases"], outputs: ["fileChange"] }, { type: i2.WorkspaceComponent, selector: "app-workspace[objectData][workspace][editablePhrases][fileInput][viewablePhrases]", inputs: ["objectData", "workspace", "editablePhrases", "fileInput", "viewablePhrases"], outputs: ["editablePhraseChanged"] }, { type: i3.FooterComponent, selector: "app-footer[workspace]", inputs: ["workspace"], outputs: ["clickEditMode", "clickViewMode", "clickSimulationMode"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppComponent, decorators: [{
            type: Component,
            args: [{ selector: "template-editor", template: "<!DOCTYPE html>\r\n<html lang=\"es\" style=\"box-sizing: border-box;\">\r\n  <body>\r\n    <input\r\n      #uploadFileInput\r\n      (change)=\"setTemplateFromInputEvent($event)\"\r\n      class=\"invisible\"\r\n      type=\"file\"\r\n      id=\"template\"\r\n      name=\"template\"\r\n      accept=\".docx\"\r\n      />\r\n\r\n    <div\r\n      class=\"backdrop\"\r\n      [class.backdrop--hover]=\"workspace.dropingFile\"\r\n      (wheel)=\"$event.preventDefault()\"\r\n    >\r\n      <div class=\"backdrop__drop-file-msg\">\r\n        Abrir template\r\n      </div>\r\n    </div>\r\n\r\n    <app-header\r\n      [workspace]=\"workspace\"\r\n      [docxFile]=\"docxFile\"\r\n      [history]=\"history\"\r\n      [editablePhrases]=\"editablePhrases\"\r\n      [uploadFileInput]=\"uploadFileInput\"\r\n      (fileChange)=\"setTemplateFromInputEvent($event)\"\r\n    ></app-header>\r\n\r\n    <app-workspace\r\n      [objectData]=\"objectData\"\r\n      [workspace]=\"workspace\"\r\n      [editablePhrases]=\"editablePhrases\"\r\n      [fileInput]=\"uploadFileInput\"\r\n      [viewablePhrases]=\"viewablePhrases\"\r\n      (editablePhraseChanged)=\"updateEditablePhrase($event.inputEvent, $event.indexOfEditablePhrase)\"\r\n    ></app-workspace>\r\n\r\n    <app-footer\r\n      [workspace]=\"workspace\"\r\n      (clickEditMode)=\"!$event.shiftKey ? setMode('edit') : setMode('editView')\"\r\n      (clickViewMode)=\"!$event.shiftKey ? setMode('view') : setMode('editView')\"\r\n      (clickSimulationMode)=\"setMode('simulation')\"\r\n    ></app-footer>\r\n  </body>\r\n</html>\r\n", styles: ["@font-face{font-family:Readex Pro;font-style:normal;font-weight:200;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQzfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQwBm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxtm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQyBnLw3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQy4nLw3.ttf) format(\"truetype\")}body{margin:0;font-family:Readex Pro,sans-serif;background-color:#f4f6f7;font-weight:300;--elements-color: #fff;--legalSizeSheet-width: 816px;--legalSizeSheet-height: 1344px;--header-height: 50px;--footer-height: 20px;--data-searchbar-height: 20px}.backdrop{display:flex;background:radial-gradient(circle,#000D 0%,#0009 70%,#0005 100%);position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop--hover{visibility:initial;opacity:1}.backdrop__drop-file-msg{font-size:5vw;color:#fff;font-weight:300;border-style:dashed;border-radius:.8vw;border-color:#fff;border-width:1vw;padding:1.5vw}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { uploadFileInput: [{
                type: ViewChild,
                args: ["uploadFileInput"]
            }], templateContainer: [{
                type: ViewChild,
                args: ["templateContainer"]
            }], objectData: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUtuRixPQUFPLEVBQUUseUNBQXlDLEVBQUUsTUFBTSxtRUFBbUUsQ0FBQztBQUM5SCxPQUFPLEVBQVksUUFBUSxFQUFzQyxNQUFNLGNBQWMsQ0FBQztBQUN0RixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7O0FBT2hELE1BQU0sT0FBTyxZQUFZO0lBTHpCO1FBTUUsVUFBSyxHQUFHLGlCQUFpQixDQUFDO1FBTW5CLG9CQUFlLEdBQXFCLEVBQUUsQ0FBQztRQUN2QyxvQkFBZSxHQUFxQixFQUFFLENBQUM7UUFDdkMsWUFBTyxHQUFjLEVBQUUsQ0FBQztRQUN4QixTQUFJLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUV4QixjQUFTLEdBQWM7WUFDNUIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtZQUN2QixRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO1lBQ3RCLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtZQUNuQixZQUFZLEVBQUUsQ0FBQztZQUNmLCtCQUErQixFQUFFLENBQUM7WUFDbEMsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLFdBQVcsRUFBRSxLQUFLO1NBQ25CLENBQUM7UUFFSyxh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LENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtvQkFDakIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNuQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2I7cUJBQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtvQkFDeEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNuQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2I7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7eUdBM1NVLFlBQVk7NkZBQVosWUFBWSwwVENmekIsaWpEQWlEQTsyRkRsQ2EsWUFBWTtrQkFMeEIsU0FBUzsrQkFDRSxpQkFBaUI7OEJBTUcsZUFBZTtzQkFBNUMsU0FBUzt1QkFBQyxpQkFBaUI7Z0JBQ0ksaUJBQWlCO3NCQUFoRCxTQUFTO3VCQUFDLG1CQUFtQjtnQkFFckIsVUFBVTtzQkFBbEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IGRvY3hUb0VkaXRhYmxlT2JqZWN0cyB9IGZyb20gXCIuLi91dGlscy9kb2N4UGFyc2Vycy9kb2N4VG9FZGl0YWJsZU9iamVjdHNcIjtcclxuaW1wb3J0IHtcclxuICBFZGl0YWJsZVBocmFzZSxcclxuICBWaWV3YWJsZVBocmFzZSxcclxufSBmcm9tIFwiLi4vdXRpbHMvZG9jeFBhcnNlcnMvdHlwZXNcIjtcclxuaW1wb3J0IHsgdHJhbnNmb3JtRWRpdGFibGVQaHJhc2VzVG9WaWV3YWJsZVBocmFzZXMgfSBmcm9tIFwiLi4vdXRpbHMvcGhyYXNlc1BhcnNlcnMvdHJhbnNmb3JtRWRpdGFibGVQaHJhc2VzVG9WaWV3YWJsZVBocmFzZXNcIjtcclxuaW1wb3J0IHsgRG9jeEZpbGUsIFZpZXdNb2RlLCBXb3JrU3BhY2UsIEhpc3RvcnksIFNlbGVjdGlvblJhbmdlIH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xyXG5pbXBvcnQgeyBab29tIH0gZnJvbSBcIi4vc2hhcmVkL3pvb20tY2xhc3MvWm9vbVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwidGVtcGxhdGUtZWRpdG9yXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwiLi9hcHAuY29tcG9uZW50Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcIi4vYXBwLmNvbXBvbmVudC5sZXNzXCIsIFwic2hhcmVkL3N0eWxlcy9jb21tb25TdHlsZXMubGVzc1wiXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XHJcbiAgdGl0bGUgPSBcInRlbXBsYXRlLWVkaXRvclwiO1xyXG4gIEBWaWV3Q2hpbGQoXCJ1cGxvYWRGaWxlSW5wdXRcIikgdXBsb2FkRmlsZUlucHV0OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xyXG4gIEBWaWV3Q2hpbGQoXCJ0ZW1wbGF0ZUNvbnRhaW5lclwiKSB0ZW1wbGF0ZUNvbnRhaW5lcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XHJcbiAgXHJcbiAgQElucHV0KCkgb2JqZWN0RGF0YTogYW55O1xyXG5cclxuICBwdWJsaWMgZWRpdGFibGVQaHJhc2VzOiBFZGl0YWJsZVBocmFzZVtdID0gW107XHJcbiAgcHVibGljIHZpZXdhYmxlUGhyYXNlczogVmlld2FibGVQaHJhc2VbXSA9IFtdO1xyXG4gIHB1YmxpYyBoaXN0b3J5OiBIaXN0b3J5W10gPSBbXTtcclxuICBwdWJsaWMgem9vbTogWm9vbSA9IG5ldyBab29tKCk7XHJcblxyXG4gIHB1YmxpYyB3b3Jrc3BhY2U6IFdvcmtTcGFjZSA9IHtcclxuICAgIGRyb3BpbmdGaWxlOiBmYWxzZSxcclxuICAgIGZpbGVEcm9wRG93bjogZmFsc2UsXHJcbiAgICBwYXBlclpvb206IHsgdmFsdWU6IDEgfSxcclxuICAgIGRhdGFab29tOiB7IHZhbHVlOiAxIH0sXHJcbiAgICBtb2RlOiBWaWV3TW9kZS5lZGl0LFxyXG4gICAgaGlzdG9yeUluZGV4OiAwLFxyXG4gICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogMCxcclxuICAgIGxhc3RTZWxlY3Rpb246IHsgc3RhcnQ6IDAsIGVuZDogMCB9LFxyXG4gICAgbmVlZFRvRm9jdXM6IGZhbHNlLFxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBkb2N4RmlsZTogRG9jeEZpbGUgPSB7XHJcbiAgICBjb250ZW50OiBcIlwiLFxyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGxhc3RNb2RpZmllZERhdGU6IDAsXHJcbiAgfTtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLmZpbGVCYWNrZHJvcEhhbmRsZXJMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5oaXN0b3J5SGFuZGxlckxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLmNoYW5nZU1vZGVXaXRoSG90a2V5c0xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0VGVtcGxhdGVGcm9tSW5wdXRFdmVudChpbnB1dEV2ZW50OiBFdmVudCkge1xyXG4gICAgY29uc3QgaW5wdXRGaWxlID0gaW5wdXRFdmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHRoaXMuc2V0VGVtcGxhdGVGcm9tRmlsZShpbnB1dEZpbGUuZmlsZXNbMF0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRUZW1wbGF0ZUZyb21GaWxlKGlucHV0RmlsZTogRmlsZSkge1xyXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBkYXRhID0gZS50YXJnZXQucmVzdWx0O1xyXG4gICAgICB0aGlzLmRvY3hGaWxlID0ge1xyXG4gICAgICAgIC8vIHRlbXBsYXRlIHN0b3JhZ2VcclxuICAgICAgICAuLi50aGlzLmRvY3hGaWxlLFxyXG4gICAgICAgIG5hbWU6IGlucHV0RmlsZS5uYW1lLFxyXG4gICAgICAgIGxhc3RNb2RpZmllZERhdGU6IGlucHV0RmlsZS5sYXN0TW9kaWZpZWQsXHJcbiAgICAgICAgY29udGVudDogZGF0YSxcclxuICAgICAgfTtcclxuICAgICAgZG9jeFRvRWRpdGFibGVPYmplY3RzKGlucHV0RmlsZSkudGhlbigoZWRpdGFibGVPYmplY3RzKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRQaHJhc2VzKGVkaXRhYmxlT2JqZWN0cyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihpbnB1dEZpbGUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRQaHJhc2VzKGVkaXRhYmxlT2JqZWN0czogRWRpdGFibGVQaHJhc2VbXSkge1xyXG4gICAgdGhpcy5lZGl0YWJsZVBocmFzZXMgPSBlZGl0YWJsZU9iamVjdHMubWFwKChhKSA9PiAoeyAuLi5hIH0pKTtcclxuICAgIHRoaXMuaGlzdG9yeSA9IFtcclxuICAgICAge1xyXG4gICAgICAgIGVkaXRhYmxlUGhyYXNlczogZWRpdGFibGVPYmplY3RzLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSksXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogMCxcclxuICAgICAgICBzZWxlY3Rpb246IHVuZGVmaW5lZCxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXggPSAwO1xyXG4gICAgdGhpcy51cGRhdGVzUGhyYXNlc1ZhbHVlcygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZUVkaXRhYmxlUGhyYXNlKFxyXG4gICAgaW5wdXRFdmVudDogSW5wdXRFdmVudCxcclxuICAgIGVkaXRhYmxlUGhyYXNlSW5kZXg6IG51bWJlclxyXG4gICkge1xyXG4gICAgY29uc3QgZG9lc0hpc3RvcnlJbmRleElzUG9zaWJsZUluSGlzdG9yeSA9XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCA8IHRoaXMuaGlzdG9yeS5sZW5ndGggLSAxO1xyXG4gICAgaWYgKGRvZXNIaXN0b3J5SW5kZXhJc1Bvc2libGVJbkhpc3RvcnkpIHtcclxuICAgICAgY29uc3QgaGlzdG9yeUN1dHRlZEFmdGVyQ3VycmVudEluZGV4ID0gdGhpcy5oaXN0b3J5LnNsaWNlKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4ICsgMVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmhpc3RvcnkgPSBoaXN0b3J5Q3V0dGVkQWZ0ZXJDdXJyZW50SW5kZXg7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICBjb25zdCBzZWxlY3Rpb25SYW5nZTogU2VsZWN0aW9uUmFuZ2UgPSB7XHJcbiAgICAgIHN0YXJ0OiBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0LFxyXG4gICAgICBlbmQ6IHNlbGVjdGlvbi5mb2N1c09mZnNldCxcclxuICAgIH07XHJcbiAgICBjb25zdCBwaHJhc2VFbGVtZW50ID0gaW5wdXRFdmVudC50YXJnZXQgYXMgSFRNTFNwYW5FbGVtZW50O1xyXG4gICAgY29uc3QgbW9kaWZpZWRQaHJhc2VzRnJvbUhpc3RvcnkgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgIHRoaXMuaGlzdG9yeS5sZW5ndGggLSAxXHJcbiAgICBdLmVkaXRhYmxlUGhyYXNlcy5tYXAoKGEpID0+ICh7IC4uLmEgfSkpO1xyXG4gICAgbW9kaWZpZWRQaHJhc2VzRnJvbUhpc3RvcnlbZWRpdGFibGVQaHJhc2VJbmRleF0udmFsdWUgPVxyXG4gICAgICBwaHJhc2VFbGVtZW50LmlubmVyVGV4dDtcclxuICAgIHRoaXMuaGlzdG9yeS5wdXNoKHtcclxuICAgICAgZWRpdGFibGVQaHJhc2VzOiBbLi4ubW9kaWZpZWRQaHJhc2VzRnJvbUhpc3RvcnldLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSksXHJcbiAgICAgIGxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXg6IGVkaXRhYmxlUGhyYXNlSW5kZXgsXHJcbiAgICAgIHNlbGVjdGlvbjogc2VsZWN0aW9uUmFuZ2UsXHJcbiAgICB9KTtcclxuICAgIHRoaXMud29ya3NwYWNlID0ge1xyXG4gICAgICAuLi50aGlzLndvcmtzcGFjZSxcclxuICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogZWRpdGFibGVQaHJhc2VJbmRleCxcclxuICAgICAgbGFzdFNlbGVjdGlvbjogc2VsZWN0aW9uUmFuZ2UsXHJcbiAgICAgIGhpc3RvcnlJbmRleDogdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDEsXHJcbiAgICB9O1xyXG4gICAgdGhpcy51cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gIH1cclxuXHJcblxyXG4gIHB1YmxpYyBmaWxlQmFja2Ryb3BIYW5kbGVyTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpbml0Q291bnQgPSAtMTtcclxuICAgIGxldCBjb3VudCA9IGluaXRDb3VudDtcclxuICAgIHdpbmRvdy5vbmRyYWdvdmVyID0gKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGRvY3hGaWxlVHlwZSA9XHJcbiAgICAgIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnRcIjtcclxuICAgIHdpbmRvdy5vbmRyYWdlbnRlciA9IChlKSA9PiB7XHJcbiAgICAgIC8vIGlmIGV2ZW50IGNvbnRhaW5zIGEgZmlsZSB3aXRoIC5kb2N4IGV4dGVuc2lvblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuaXRlbXNbMF0ua2luZCA9PT0gXCJmaWxlXCIgJiZcclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5pdGVtc1swXS50eXBlID09PSBkb2N4RmlsZVR5cGVcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZHJvcGluZ0ZpbGUgPSB0cnVlO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB3aW5kb3cub25kcmFnbGVhdmUgPSAoKSA9PiB7XHJcbiAgICAgIGNvdW50LS07XHJcbiAgICAgIGlmIChjb3VudCA8IDApIHtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5kcm9waW5nRmlsZSA9IGZhbHNlO1xyXG4gICAgICAgIGNvdW50ID0gaW5pdENvdW50O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgd2luZG93Lm9uZHJvcCA9IChlOiBEcmFnRXZlbnQpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb3VudCA9IGluaXRDb3VudDtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UuZHJvcGluZ0ZpbGUgPSBmYWxzZTtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLml0ZW1zWzBdLmtpbmQgPT09IFwiZmlsZVwiICYmXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuaXRlbXNbMF0udHlwZSA9PT0gZG9jeEZpbGVUeXBlXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMuc2V0VGVtcGxhdGVGcm9tRmlsZShlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHNldE1vZGUobW9kZTogc3RyaW5nKSB7XHJcbiAgICBpZiAobW9kZSA9PT0gVmlld01vZGUuZWRpdCkge1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5tb2RlID0gVmlld01vZGUuZWRpdDtcclxuICAgICAgdGhpcy51cGRhdGVzUGhyYXNlc1ZhbHVlcygpO1xyXG4gICAgfSBlbHNlIGlmIChtb2RlID09PSBWaWV3TW9kZS52aWV3KSB7XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLm1vZGUgPSBWaWV3TW9kZS52aWV3O1xyXG4gICAgICB0aGlzLnVwZGF0ZXNQaHJhc2VzVmFsdWVzKCk7XHJcbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFZpZXdNb2RlLnNpbXVsYXRpb24pIHtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UubW9kZSA9IFZpZXdNb2RlLnNpbXVsYXRpb247XHJcbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFZpZXdNb2RlLmVkaXRWaWV3KSB7XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLm1vZGUgPSBWaWV3TW9kZS5lZGl0VmlldztcclxuICAgICAgaWYgKHRoaXMud29ya3NwYWNlLnBhcGVyWm9vbS52YWx1ZSA+PSAxKSB7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UucGFwZXJab29tLnZhbHVlID0gMC45O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZXNQaHJhc2VzVmFsdWVzKCkge1xyXG4gICAgdGhpcy51cGRhdGVFZGl0YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gICAgdGhpcy51cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVFZGl0YWJsZVBocmFzZXNWYWx1ZSgpIHtcclxuICAgIHRoaXMud29ya3NwYWNlLmxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXggPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgXS5sYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4O1xyXG4gICAgdGhpcy5lZGl0YWJsZVBocmFzZXMgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgXS5lZGl0YWJsZVBocmFzZXMubWFwKChhKSA9PiAoe1xyXG4gICAgICAuLi5hLFxyXG4gICAgfSkpO1xyXG4gICAgdGhpcy53b3Jrc3BhY2UubmVlZFRvRm9jdXMgPSB0cnVlO1xyXG4gICAgdGhpcy53b3Jrc3BhY2UubmVlZFRvRm9jdXMgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlVmlld2FibGVQaHJhc2VzVmFsdWUoKSB7XHJcbiAgICBjb25zdCB1cGRhdGVkVmlld2FibGVQaHJhc2VzID0gdHJhbnNmb3JtRWRpdGFibGVQaHJhc2VzVG9WaWV3YWJsZVBocmFzZXMoXHJcbiAgICAgIHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLmVkaXRhYmxlUGhyYXNlc1xyXG4gICAgKTtcclxuICAgIGlmICh0aGlzLnZpZXdhYmxlUGhyYXNlcy5sZW5ndGggPT09IHVwZGF0ZWRWaWV3YWJsZVBocmFzZXMubGVuZ3RoKSB7XHJcbiAgICAgIHVwZGF0ZWRWaWV3YWJsZVBocmFzZXMuZm9yRWFjaCgodXBkYXRlZFZpZXdhYmxlUGhyYXNlLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnZpZXdhYmxlUGhyYXNlc1tpbmRleF0udmFsdWUgIT09IHVwZGF0ZWRWaWV3YWJsZVBocmFzZS52YWx1ZSkge1xyXG4gICAgICAgICAgdGhpcy52aWV3YWJsZVBocmFzZXNbaW5kZXhdLnZhbHVlID0gdXBkYXRlZFZpZXdhYmxlUGhyYXNlLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpZXdhYmxlUGhyYXNlcyA9IHRyYW5zZm9ybUVkaXRhYmxlUGhyYXNlc1RvVmlld2FibGVQaHJhc2VzKFxyXG4gICAgICAgIHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLmVkaXRhYmxlUGhyYXNlc1xyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGFuZ2VNb2RlV2l0aEhvdGtleXNMaXN0ZW5lcigpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XHJcbiAgICAgIC8vIGRldGVjdCB3aGVuIHNoaWZ0ICsgdiBvciBzaGlmdCArIFYgYW5kIGRldGVjdCB3aGVuIHN0b3AgcHJlc3NpbmdcclxuICAgICAgaWYgKChlLmtleSA9PT0gXCJ6XCIgfHwgZS5rZXkgPT09IFwiWlwiKSAmJiBlLnNoaWZ0S2V5ICYmIGUuYWx0S2V5KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmICh0aGlzLndvcmtzcGFjZS5tb2RlICE9PSBWaWV3TW9kZS5lZGl0KSB7XHJcbiAgICAgICAgICB0aGlzLnNldE1vZGUoXCJlZGl0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICgoZS5rZXkgPT09IFwieFwiIHx8IGUua2V5ID09PSBcIlhcIikgJiYgZS5zaGlmdEtleSAmJiBlLmFsdEtleSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAodGhpcy53b3Jrc3BhY2UubW9kZSAhPT0gVmlld01vZGUudmlldykge1xyXG4gICAgICAgICAgdGhpcy5zZXRNb2RlKFwidmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoKGUua2V5ID09PSBcImNcIiB8fCBlLmtleSA9PT0gXCJDXCIpICYmIGUuc2hpZnRLZXkgJiYgZS5hbHRLZXkpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMud29ya3NwYWNlLm1vZGUgIT09IFZpZXdNb2RlLnNpbXVsYXRpb24pIHtcclxuICAgICAgICAgIHRoaXMuc2V0TW9kZShcInNpbXVsYXRpb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1bmRvID0gKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCA+IDApIHtcclxuICAgICAgY29uc3QgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgICBdLmVkaXRhYmxlUGhyYXNlcy5tYXAoKGEpID0+ICh7IC4uLmEgfSkpO1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXgtLTtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UgPSB7XHJcbiAgICAgICAgLi4udGhpcy53b3Jrc3BhY2UsXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICAgICAgXS5sYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4LFxyXG4gICAgICAgIGxhc3RTZWxlY3Rpb246IHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLnNlbGVjdGlvbixcclxuICAgICAgfTtcclxuICAgICAgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5Lm1hcChcclxuICAgICAgICAoZWRpdGFibGVQaHJhc2UsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBlZGl0YWJsZVBocmFzZUZyb21IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhcclxuICAgICAgICAgIF0uZWRpdGFibGVQaHJhc2VzW2luZGV4XTtcclxuICAgICAgICAgIGlmIChlZGl0YWJsZVBocmFzZS52YWx1ZSAhPT0gZWRpdGFibGVQaHJhc2VGcm9tSGlzdG9yeS52YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRhYmxlUGhyYXNlc1tpbmRleF0gPSB7XHJcbiAgICAgICAgICAgICAgLi4udGhpcy5oaXN0b3J5W3RoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleF0uZWRpdGFibGVQaHJhc2VzW1xyXG4gICAgICAgICAgICAgICAgaW5kZXhcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgdGhpcy51cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyByZWRvID0gKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCArIDEgPD0gdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDEpIHtcclxuICAgICAgY29uc3QgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgICBdLmVkaXRhYmxlUGhyYXNlcy5tYXAoKGEpID0+ICh7XHJcbiAgICAgICAgLi4uYSxcclxuICAgICAgfSkpO1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXgrKztcclxuICAgICAgdGhpcy53b3Jrc3BhY2UgPSB7XHJcbiAgICAgICAgLi4udGhpcy53b3Jrc3BhY2UsXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICAgICAgXS5sYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4LFxyXG4gICAgICAgIGxhc3RTZWxlY3Rpb246IHRoaXMuaGlzdG9yeVt0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhdLnNlbGVjdGlvbixcclxuICAgICAgfTtcclxuICAgICAgZWRpdGFibGVQaHJhc2VzRnJvbUxhc3Rlc3RFbGVtZW50SW5IaXN0b3J5Lm1hcChcclxuICAgICAgICAoZWRpdGFibGVQaHJhc2UsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBlZGl0YWJsZVBocmFzZUZyb21IaXN0b3J5ID0gdGhpcy5oaXN0b3J5W1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhcclxuICAgICAgICAgIF0uZWRpdGFibGVQaHJhc2VzW2luZGV4XTtcclxuICAgICAgICAgIGlmIChlZGl0YWJsZVBocmFzZS52YWx1ZSAhPT0gZWRpdGFibGVQaHJhc2VGcm9tSGlzdG9yeS52YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRhYmxlUGhyYXNlc1tpbmRleF0gPSB7IC4uLmVkaXRhYmxlUGhyYXNlRnJvbUhpc3RvcnkgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMudXBkYXRlVmlld2FibGVQaHJhc2VzVmFsdWUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIGhpc3RvcnlIYW5kbGVyTGlzdGVuZXIoKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgbGlzdGVuZXIgdG8gY3RybCArIHogYW5kIGN0cmwgKyB5XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5jdHJsS2V5KSB7XHJcbiAgICAgICAgaWYgKGUua2V5ID09PSBcInpcIikge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy51bmRvKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJ5XCIpIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHRoaXMucmVkbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59IiwiPCFET0NUWVBFIGh0bWw+XHJcbjxodG1sIGxhbmc9XCJlc1wiIHN0eWxlPVwiYm94LXNpemluZzogYm9yZGVyLWJveDtcIj5cclxuICA8Ym9keT5cclxuICAgIDxpbnB1dFxyXG4gICAgICAjdXBsb2FkRmlsZUlucHV0XHJcbiAgICAgIChjaGFuZ2UpPVwic2V0VGVtcGxhdGVGcm9tSW5wdXRFdmVudCgkZXZlbnQpXCJcclxuICAgICAgY2xhc3M9XCJpbnZpc2libGVcIlxyXG4gICAgICB0eXBlPVwiZmlsZVwiXHJcbiAgICAgIGlkPVwidGVtcGxhdGVcIlxyXG4gICAgICBuYW1lPVwidGVtcGxhdGVcIlxyXG4gICAgICBhY2NlcHQ9XCIuZG9jeFwiXHJcbiAgICAgIC8+XHJcblxyXG4gICAgPGRpdlxyXG4gICAgICBjbGFzcz1cImJhY2tkcm9wXCJcclxuICAgICAgW2NsYXNzLmJhY2tkcm9wLS1ob3Zlcl09XCJ3b3Jrc3BhY2UuZHJvcGluZ0ZpbGVcIlxyXG4gICAgICAod2hlZWwpPVwiJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIlxyXG4gICAgPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYmFja2Ryb3BfX2Ryb3AtZmlsZS1tc2dcIj5cclxuICAgICAgICBBYnJpciB0ZW1wbGF0ZVxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxhcHAtaGVhZGVyXHJcbiAgICAgIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCJcclxuICAgICAgW2RvY3hGaWxlXT1cImRvY3hGaWxlXCJcclxuICAgICAgW2hpc3RvcnldPVwiaGlzdG9yeVwiXHJcbiAgICAgIFtlZGl0YWJsZVBocmFzZXNdPVwiZWRpdGFibGVQaHJhc2VzXCJcclxuICAgICAgW3VwbG9hZEZpbGVJbnB1dF09XCJ1cGxvYWRGaWxlSW5wdXRcIlxyXG4gICAgICAoZmlsZUNoYW5nZSk9XCJzZXRUZW1wbGF0ZUZyb21JbnB1dEV2ZW50KCRldmVudClcIlxyXG4gICAgPjwvYXBwLWhlYWRlcj5cclxuXHJcbiAgICA8YXBwLXdvcmtzcGFjZVxyXG4gICAgICBbb2JqZWN0RGF0YV09XCJvYmplY3REYXRhXCJcclxuICAgICAgW3dvcmtzcGFjZV09XCJ3b3Jrc3BhY2VcIlxyXG4gICAgICBbZWRpdGFibGVQaHJhc2VzXT1cImVkaXRhYmxlUGhyYXNlc1wiXHJcbiAgICAgIFtmaWxlSW5wdXRdPVwidXBsb2FkRmlsZUlucHV0XCJcclxuICAgICAgW3ZpZXdhYmxlUGhyYXNlc109XCJ2aWV3YWJsZVBocmFzZXNcIlxyXG4gICAgICAoZWRpdGFibGVQaHJhc2VDaGFuZ2VkKT1cInVwZGF0ZUVkaXRhYmxlUGhyYXNlKCRldmVudC5pbnB1dEV2ZW50LCAkZXZlbnQuaW5kZXhPZkVkaXRhYmxlUGhyYXNlKVwiXHJcbiAgICA+PC9hcHAtd29ya3NwYWNlPlxyXG5cclxuICAgIDxhcHAtZm9vdGVyXHJcbiAgICAgIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCJcclxuICAgICAgKGNsaWNrRWRpdE1vZGUpPVwiISRldmVudC5zaGlmdEtleSA/IHNldE1vZGUoJ2VkaXQnKSA6IHNldE1vZGUoJ2VkaXRWaWV3JylcIlxyXG4gICAgICAoY2xpY2tWaWV3TW9kZSk9XCIhJGV2ZW50LnNoaWZ0S2V5ID8gc2V0TW9kZSgndmlldycpIDogc2V0TW9kZSgnZWRpdFZpZXcnKVwiXHJcbiAgICAgIChjbGlja1NpbXVsYXRpb25Nb2RlKT1cInNldE1vZGUoJ3NpbXVsYXRpb24nKVwiXHJcbiAgICA+PC9hcHAtZm9vdGVyPlxyXG4gIDwvYm9keT5cclxuPC9odG1sPlxyXG4iXX0=