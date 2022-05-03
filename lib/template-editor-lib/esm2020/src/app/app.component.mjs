import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBTW5GLE9BQU8sRUFBRSx5Q0FBeUMsRUFBRSxNQUFNLG1FQUFtRSxDQUFDO0FBQzlILE9BQU8sRUFBWSxRQUFRLEVBQXNDLE1BQU0sY0FBYyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7QUFPaEQsTUFBTSxPQUFPLFlBQVk7SUFMekI7UUFNRSxVQUFLLEdBQUcsaUJBQWlCLENBQUM7UUFNaEIsU0FBSSxHQUEyQixJQUFJLFlBQVksRUFBWSxDQUFDO1FBTS9ELG9CQUFlLEdBQXFCLEVBQUUsQ0FBQztRQUN2QyxvQkFBZSxHQUFxQixFQUFFLENBQUM7UUFDdkMsWUFBTyxHQUFjLEVBQUUsQ0FBQztRQUN4QixTQUFJLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUV4QixjQUFTLEdBQWM7WUFDNUIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtZQUN2QixRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO1lBQ3RCLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtZQUNuQixZQUFZLEVBQUUsQ0FBQztZQUNmLCtCQUErQixFQUFFLENBQUM7WUFDbEMsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxH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QUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFVBQVUsRUFBRTtvQkFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDNUI7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQThETyxzQkFBc0I7UUFDNUIsOENBQThDO1FBQzlDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtvQkFDakIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNuQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2I7cUJBQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtvQkFDeEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNuQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2I7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7eUdBcFRVLFlBQVk7NkZBQVosWUFBWSwrVkNoQnpCLHErQ0ErQ087MkZEL0JNLFlBQVk7a0JBTHhCLFNBQVM7K0JBQ0UsaUJBQWlCOzhCQU1HLGVBQWU7c0JBQTVDLFNBQVM7dUJBQUMsaUJBQWlCO2dCQUNJLGlCQUFpQjtzQkFBaEQsU0FBUzt1QkFBQyxtQkFBbUI7Z0JBRXJCLElBQUk7c0JBQVosS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNJLElBQUk7c0JBQWIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBkb2N4VG9FZGl0YWJsZU9iamVjdHMgfSBmcm9tIFwiLi4vdXRpbHMvZG9jeFBhcnNlcnMvZG9jeFRvRWRpdGFibGVPYmplY3RzXCI7XHJcbmltcG9ydCB7XHJcbiAgRWRpdGFibGVQaHJhc2UsXHJcbiAgSW5wdXRGaWxlRm9ybWF0LFxyXG4gIFZpZXdhYmxlUGhyYXNlLFxyXG59IGZyb20gXCIuLi91dGlscy9kb2N4UGFyc2Vycy90eXBlc1wiO1xyXG5pbXBvcnQgeyB0cmFuc2Zvcm1FZGl0YWJsZVBocmFzZXNUb1ZpZXdhYmxlUGhyYXNlcyB9IGZyb20gXCIuLi91dGlscy9waHJhc2VzUGFyc2Vycy90cmFuc2Zvcm1FZGl0YWJsZVBocmFzZXNUb1ZpZXdhYmxlUGhyYXNlc1wiO1xyXG5pbXBvcnQgeyBEb2N4RmlsZSwgVmlld01vZGUsIFdvcmtTcGFjZSwgSGlzdG9yeSwgU2VsZWN0aW9uUmFuZ2UgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XHJcbmltcG9ydCB7IFpvb20gfSBmcm9tIFwiLi9zaGFyZWQvem9vbS1jbGFzcy9ab29tXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJ0ZW1wbGF0ZS1lZGl0b3JcIixcclxuICB0ZW1wbGF0ZVVybDogXCIuL2FwcC5jb21wb25lbnQuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wiLi9hcHAuY29tcG9uZW50Lmxlc3NcIiwgXCJzaGFyZWQvc3R5bGVzL2NvbW1vblN0eWxlcy5sZXNzXCJdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICB0aXRsZSA9IFwidGVtcGxhdGUtZWRpdG9yXCI7XHJcbiAgQFZpZXdDaGlsZChcInVwbG9hZEZpbGVJbnB1dFwiKSB1cGxvYWRGaWxlSW5wdXQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XHJcbiAgQFZpZXdDaGlsZChcInRlbXBsYXRlQ29udGFpbmVyXCIpIHRlbXBsYXRlQ29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcclxuICBcclxuICBASW5wdXQoKSBkYXRhOiBhbnk7XHJcbiAgQElucHV0KCkgdGVtcGxhdGU6IElucHV0RmlsZUZvcm1hdFxyXG4gIEBPdXRwdXQoKSBzYXZlOiBFdmVudEVtaXR0ZXI8RG9jeEZpbGU+ID0gbmV3IEV2ZW50RW1pdHRlcjxEb2N4RmlsZT4oKTtcclxuXHJcbiAgcHVibGljIHNhdmVIYW5kbGVyKGRvY3hGaWxlOiBEb2N4RmlsZSkge1xyXG4gICAgdGhpcy5zYXZlLmVtaXQoZG9jeEZpbGUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGVkaXRhYmxlUGhyYXNlczogRWRpdGFibGVQaHJhc2VbXSA9IFtdO1xyXG4gIHB1YmxpYyB2aWV3YWJsZVBocmFzZXM6IFZpZXdhYmxlUGhyYXNlW10gPSBbXTtcclxuICBwdWJsaWMgaGlzdG9yeTogSGlzdG9yeVtdID0gW107XHJcbiAgcHVibGljIHpvb206IFpvb20gPSBuZXcgWm9vbSgpO1xyXG5cclxuICBwdWJsaWMgd29ya3NwYWNlOiBXb3JrU3BhY2UgPSB7XHJcbiAgICBkcm9waW5nRmlsZTogZmFsc2UsXHJcbiAgICBmaWxlRHJvcERvd246IGZhbHNlLFxyXG4gICAgcGFwZXJab29tOiB7IHZhbHVlOiAxIH0sXHJcbiAgICBkYXRhWm9vbTogeyB2YWx1ZTogMSB9LFxyXG4gICAgbW9kZTogVmlld01vZGUuZWRpdCxcclxuICAgIGhpc3RvcnlJbmRleDogMCxcclxuICAgIGxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXg6IDAsXHJcbiAgICBsYXN0U2VsZWN0aW9uOiB7IHN0YXJ0OiAwLCBlbmQ6IDAgfSxcclxuICAgIG5lZWRUb0ZvY3VzOiBmYWxzZSxcclxuICB9O1xyXG5cclxuICBwdWJsaWMgZG9jeEZpbGU6IERvY3hGaWxlID0ge1xyXG4gICAgY29udGVudDogXCJcIixcclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBsYXN0TW9kaWZpZWREYXRlOiAwLFxyXG4gIH07XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYodGhpcy50ZW1wbGF0ZSkge1xyXG4gICAgICB0aGlzLnNldFRlbXBsYXRlRnJvbUZpbGUodGhpcy50ZW1wbGF0ZSBhcyBGaWxlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuZmlsZUJhY2tkcm9wSGFuZGxlckxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLmhpc3RvcnlIYW5kbGVyTGlzdGVuZXIoKTtcclxuICAgIHRoaXMuY2hhbmdlTW9kZVdpdGhIb3RrZXlzTGlzdGVuZXIoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRUZW1wbGF0ZUZyb21JbnB1dEV2ZW50KGlucHV0RXZlbnQ6IEV2ZW50KSB7XHJcbiAgICBjb25zdCBpbnB1dEZpbGUgPSBpbnB1dEV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy5zZXRUZW1wbGF0ZUZyb21GaWxlKGlucHV0RmlsZS5maWxlc1swXSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFRlbXBsYXRlRnJvbUZpbGUoaW5wdXRGaWxlOiBGaWxlKSB7XHJcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgcmVhZGVyLm9ubG9hZGVuZCA9IChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgIHRoaXMuZG9jeEZpbGUgPSB7XHJcbiAgICAgICAgLy8gdGVtcGxhdGUgc3RvcmFnZVxyXG4gICAgICAgIC4uLnRoaXMuZG9jeEZpbGUsXHJcbiAgICAgICAgbmFtZTogaW5wdXRGaWxlLm5hbWUsXHJcbiAgICAgICAgbGFzdE1vZGlmaWVkRGF0ZTogaW5wdXRGaWxlLmxhc3RNb2RpZmllZCxcclxuICAgICAgICBjb250ZW50OiBkYXRhLFxyXG4gICAgICB9O1xyXG4gICAgICBkb2N4VG9FZGl0YWJsZU9iamVjdHMoaW5wdXRGaWxlKS50aGVuKChlZGl0YWJsZU9iamVjdHMpID0+IHtcclxuICAgICAgICB0aGlzLnNldFBocmFzZXMoZWRpdGFibGVPYmplY3RzKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGlucHV0RmlsZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFBocmFzZXMoZWRpdGFibGVPYmplY3RzOiBFZGl0YWJsZVBocmFzZVtdKSB7XHJcbiAgICB0aGlzLmVkaXRhYmxlUGhyYXNlcyA9IGVkaXRhYmxlT2JqZWN0cy5tYXAoKGEpID0+ICh7IC4uLmEgfSkpO1xyXG4gICAgdGhpcy5oaXN0b3J5ID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgZWRpdGFibGVQaHJhc2VzOiBlZGl0YWJsZU9iamVjdHMubWFwKChhKSA9PiAoeyAuLi5hIH0pKSxcclxuICAgICAgICBsYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4OiAwLFxyXG4gICAgICAgIHNlbGVjdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCA9IDA7XHJcbiAgICB0aGlzLnVwZGF0ZXNQaHJhc2VzVmFsdWVzKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdXBkYXRlRWRpdGFibGVQaHJhc2UoXHJcbiAgICBpbnB1dEV2ZW50OiBJbnB1dEV2ZW50LFxyXG4gICAgZWRpdGFibGVQaHJhc2VJbmRleDogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICBjb25zdCBkb2VzSGlzdG9yeUluZGV4SXNQb3NpYmxlSW5IaXN0b3J5ID1cclxuICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4IDwgdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDE7XHJcbiAgICBpZiAoZG9lc0hpc3RvcnlJbmRleElzUG9zaWJsZUluSGlzdG9yeSkge1xyXG4gICAgICBjb25zdCBoaXN0b3J5Q3V0dGVkQWZ0ZXJDdXJyZW50SW5kZXggPSB0aGlzLmhpc3Rvcnkuc2xpY2UoXHJcbiAgICAgICAgMCxcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXggKyAxXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuaGlzdG9yeSA9IGhpc3RvcnlDdXR0ZWRBZnRlckN1cnJlbnRJbmRleDtcclxuICAgIH1cclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICAgIGNvbnN0IHNlbGVjdGlvblJhbmdlOiBTZWxlY3Rpb25SYW5nZSA9IHtcclxuICAgICAgc3RhcnQ6IHNlbGVjdGlvbi5hbmNob3JPZmZzZXQsXHJcbiAgICAgIGVuZDogc2VsZWN0aW9uLmZvY3VzT2Zmc2V0LFxyXG4gICAgfTtcclxuICAgIGNvbnN0IHBocmFzZUVsZW1lbnQgPSBpbnB1dEV2ZW50LnRhcmdldCBhcyBIVE1MU3BhbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBtb2RpZmllZFBocmFzZXNGcm9tSGlzdG9yeSA9IHRoaXMuaGlzdG9yeVtcclxuICAgICAgdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFcclxuICAgIF0uZWRpdGFibGVQaHJhc2VzLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSk7XHJcbiAgICBtb2RpZmllZFBocmFzZXNGcm9tSGlzdG9yeVtlZGl0YWJsZVBocmFzZUluZGV4XS52YWx1ZSA9XHJcbiAgICAgIHBocmFzZUVsZW1lbnQuaW5uZXJUZXh0O1xyXG4gICAgdGhpcy5oaXN0b3J5LnB1c2goe1xyXG4gICAgICBlZGl0YWJsZVBocmFzZXM6IFsuLi5tb2RpZmllZFBocmFzZXNGcm9tSGlzdG9yeV0ubWFwKChhKSA9PiAoeyAuLi5hIH0pKSxcclxuICAgICAgbGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleDogZWRpdGFibGVQaHJhc2VJbmRleCxcclxuICAgICAgc2VsZWN0aW9uOiBzZWxlY3Rpb25SYW5nZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy53b3Jrc3BhY2UgPSB7XHJcbiAgICAgIC4uLnRoaXMud29ya3NwYWNlLFxyXG4gICAgICBsYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4OiBlZGl0YWJsZVBocmFzZUluZGV4LFxyXG4gICAgICBsYXN0U2VsZWN0aW9uOiBzZWxlY3Rpb25SYW5nZSxcclxuICAgICAgaGlzdG9yeUluZGV4OiB0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMSxcclxuICAgIH07XHJcbiAgICB0aGlzLnVwZGF0ZVZpZXdhYmxlUGhyYXNlc1ZhbHVlKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcHVibGljIGZpbGVCYWNrZHJvcEhhbmRsZXJMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGNvbnN0IGluaXRDb3VudCA9IC0xO1xyXG4gICAgbGV0IGNvdW50ID0gaW5pdENvdW50O1xyXG4gICAgd2luZG93Lm9uZHJhZ292ZXIgPSAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgZG9jeEZpbGVUeXBlID1cclxuICAgICAgXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudFwiO1xyXG4gICAgd2luZG93Lm9uZHJhZ2VudGVyID0gKGUpID0+IHtcclxuICAgICAgLy8gaWYgZXZlbnQgY29udGFpbnMgYSBmaWxlIHdpdGggLmRvY3ggZXh0ZW5zaW9uXHJcbiAgICAgIGlmIChcclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5pdGVtc1swXS5raW5kID09PSBcImZpbGVcIiAmJlxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLml0ZW1zWzBdLnR5cGUgPT09IGRvY3hGaWxlVHlwZVxyXG4gICAgICApIHtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5kcm9waW5nRmlsZSA9IHRydWU7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHdpbmRvdy5vbmRyYWdsZWF2ZSA9ICgpID0+IHtcclxuICAgICAgY291bnQtLTtcclxuICAgICAgaWYgKGNvdW50IDwgMCkge1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmRyb3BpbmdGaWxlID0gZmFsc2U7XHJcbiAgICAgICAgY291bnQgPSBpbml0Q291bnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB3aW5kb3cub25kcm9wID0gKGU6IERyYWdFdmVudCkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvdW50ID0gaW5pdENvdW50O1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5kcm9waW5nRmlsZSA9IGZhbHNlO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuaXRlbXNbMF0ua2luZCA9PT0gXCJmaWxlXCIgJiZcclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5pdGVtc1swXS50eXBlID09PSBkb2N4RmlsZVR5cGVcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5zZXRUZW1wbGF0ZUZyb21GaWxlKGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgc2V0TW9kZShtb2RlOiBzdHJpbmcpIHtcclxuICAgIGlmIChtb2RlID09PSBWaWV3TW9kZS5lZGl0KSB7XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLm1vZGUgPSBWaWV3TW9kZS5lZGl0O1xyXG4gICAgICB0aGlzLnVwZGF0ZXNQaHJhc2VzVmFsdWVzKCk7XHJcbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFZpZXdNb2RlLnZpZXcpIHtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UubW9kZSA9IFZpZXdNb2RlLnZpZXc7XHJcbiAgICAgIHRoaXMudXBkYXRlc1BocmFzZXNWYWx1ZXMoKTtcclxuICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gVmlld01vZGUuc2ltdWxhdGlvbikge1xyXG4gICAgICB0aGlzLndvcmtzcGFjZS5tb2RlID0gVmlld01vZGUuc2ltdWxhdGlvbjtcclxuICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gVmlld01vZGUuZWRpdFZpZXcpIHtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UubW9kZSA9IFZpZXdNb2RlLmVkaXRWaWV3O1xyXG4gICAgICBpZiAodGhpcy53b3Jrc3BhY2UucGFwZXJab29tLnZhbHVlID49IDEpIHtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5wYXBlclpvb20udmFsdWUgPSAwLjk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlc1BocmFzZXNWYWx1ZXMoKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUVkaXRhYmxlUGhyYXNlc1ZhbHVlKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVZpZXdhYmxlUGhyYXNlc1ZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUVkaXRhYmxlUGhyYXNlc1ZhbHVlKCkge1xyXG4gICAgdGhpcy53b3Jrc3BhY2UubGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleCA9IHRoaXMuaGlzdG9yeVtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICBdLmxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXg7XHJcbiAgICB0aGlzLmVkaXRhYmxlUGhyYXNlcyA9IHRoaXMuaGlzdG9yeVtcclxuICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICBdLmVkaXRhYmxlUGhyYXNlcy5tYXAoKGEpID0+ICh7XHJcbiAgICAgIC4uLmEsXHJcbiAgICB9KSk7XHJcbiAgICB0aGlzLndvcmtzcGFjZS5uZWVkVG9Gb2N1cyA9IHRydWU7XHJcbiAgICB0aGlzLndvcmtzcGFjZS5uZWVkVG9Gb2N1cyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpIHtcclxuICAgIGNvbnN0IHVwZGF0ZWRWaWV3YWJsZVBocmFzZXMgPSB0cmFuc2Zvcm1FZGl0YWJsZVBocmFzZXNUb1ZpZXdhYmxlUGhyYXNlcyhcclxuICAgICAgdGhpcy5oaXN0b3J5W3RoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleF0uZWRpdGFibGVQaHJhc2VzXHJcbiAgICApO1xyXG4gICAgaWYgKHRoaXMudmlld2FibGVQaHJhc2VzLmxlbmd0aCA9PT0gdXBkYXRlZFZpZXdhYmxlUGhyYXNlcy5sZW5ndGgpIHtcclxuICAgICAgdXBkYXRlZFZpZXdhYmxlUGhyYXNlcy5mb3JFYWNoKCh1cGRhdGVkVmlld2FibGVQaHJhc2UsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld2FibGVQaHJhc2VzW2luZGV4XS52YWx1ZSAhPT0gdXBkYXRlZFZpZXdhYmxlUGhyYXNlLnZhbHVlKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZXdhYmxlUGhyYXNlc1tpbmRleF0udmFsdWUgPSB1cGRhdGVkVmlld2FibGVQaHJhc2UudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld2FibGVQaHJhc2VzID0gdHJhbnNmb3JtRWRpdGFibGVQaHJhc2VzVG9WaWV3YWJsZVBocmFzZXMoXHJcbiAgICAgICAgdGhpcy5oaXN0b3J5W3RoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleF0uZWRpdGFibGVQaHJhc2VzXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoYW5nZU1vZGVXaXRoSG90a2V5c0xpc3RlbmVyKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcclxuICAgICAgLy8gZGV0ZWN0IHdoZW4gc2hpZnQgKyB2IG9yIHNoaWZ0ICsgViBhbmQgZGV0ZWN0IHdoZW4gc3RvcCBwcmVzc2luZ1xyXG4gICAgICBpZiAoKGUua2V5ID09PSBcInpcIiB8fCBlLmtleSA9PT0gXCJaXCIpICYmIGUuc2hpZnRLZXkgJiYgZS5hbHRLZXkpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMud29ya3NwYWNlLm1vZGUgIT09IFZpZXdNb2RlLmVkaXQpIHtcclxuICAgICAgICAgIHRoaXMuc2V0TW9kZShcImVkaXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChlLmtleSA9PT0gXCJ4XCIgfHwgZS5rZXkgPT09IFwiWFwiKSAmJiBlLnNoaWZ0S2V5ICYmIGUuYWx0S2V5KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmICh0aGlzLndvcmtzcGFjZS5tb2RlICE9PSBWaWV3TW9kZS52aWV3KSB7XHJcbiAgICAgICAgICB0aGlzLnNldE1vZGUoXCJ2aWV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICgoZS5rZXkgPT09IFwiY1wiIHx8IGUua2V5ID09PSBcIkNcIikgJiYgZS5zaGlmdEtleSAmJiBlLmFsdEtleSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAodGhpcy53b3Jrc3BhY2UubW9kZSAhPT0gVmlld01vZGUuc2ltdWxhdGlvbikge1xyXG4gICAgICAgICAgdGhpcy5zZXRNb2RlKFwic2ltdWxhdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVuZG8gPSAoKSA9PiB7XHJcbiAgICBpZiAodGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4ID4gMCkge1xyXG4gICAgICBjb25zdCBlZGl0YWJsZVBocmFzZXNGcm9tTGFzdGVzdEVsZW1lbnRJbkhpc3RvcnkgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICAgIF0uZWRpdGFibGVQaHJhc2VzLm1hcCgoYSkgPT4gKHsgLi4uYSB9KSk7XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleC0tO1xyXG4gICAgICB0aGlzLndvcmtzcGFjZSA9IHtcclxuICAgICAgICAuLi50aGlzLndvcmtzcGFjZSxcclxuICAgICAgICBsYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4OiB0aGlzLmhpc3RvcnlbXHJcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhcclxuICAgICAgICBdLmxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXgsXHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbjogdGhpcy5oaXN0b3J5W3RoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleF0uc2VsZWN0aW9uLFxyXG4gICAgICB9O1xyXG4gICAgICBlZGl0YWJsZVBocmFzZXNGcm9tTGFzdGVzdEVsZW1lbnRJbkhpc3RvcnkubWFwKFxyXG4gICAgICAgIChlZGl0YWJsZVBocmFzZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGVkaXRhYmxlUGhyYXNlRnJvbUhpc3RvcnkgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgICAgICAgXS5lZGl0YWJsZVBocmFzZXNbaW5kZXhdO1xyXG4gICAgICAgICAgaWYgKGVkaXRhYmxlUGhyYXNlLnZhbHVlICE9PSBlZGl0YWJsZVBocmFzZUZyb21IaXN0b3J5LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdGFibGVQaHJhc2VzW2luZGV4XSA9IHtcclxuICAgICAgICAgICAgICAuLi50aGlzLmhpc3RvcnlbdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XS5lZGl0YWJsZVBocmFzZXNbXHJcbiAgICAgICAgICAgICAgICBpbmRleFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLnVwZGF0ZVZpZXdhYmxlUGhyYXNlc1ZhbHVlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHJlZG8gPSAoKSA9PiB7XHJcbiAgICBpZiAodGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4ICsgMSA8PSB0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMSkge1xyXG4gICAgICBjb25zdCBlZGl0YWJsZVBocmFzZXNGcm9tTGFzdGVzdEVsZW1lbnRJbkhpc3RvcnkgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XHJcbiAgICAgIF0uZWRpdGFibGVQaHJhc2VzLm1hcCgoYSkgPT4gKHtcclxuICAgICAgICAuLi5hLFxyXG4gICAgICB9KSk7XHJcbiAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleCsrO1xyXG4gICAgICB0aGlzLndvcmtzcGFjZSA9IHtcclxuICAgICAgICAuLi50aGlzLndvcmtzcGFjZSxcclxuICAgICAgICBsYXN0TW9kaWZpZWRFZGl0YWJsZVBocmFzZUluZGV4OiB0aGlzLmhpc3RvcnlbXHJcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5oaXN0b3J5SW5kZXhcclxuICAgICAgICBdLmxhc3RNb2RpZmllZEVkaXRhYmxlUGhyYXNlSW5kZXgsXHJcbiAgICAgICAgbGFzdFNlbGVjdGlvbjogdGhpcy5oaXN0b3J5W3RoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleF0uc2VsZWN0aW9uLFxyXG4gICAgICB9O1xyXG4gICAgICBlZGl0YWJsZVBocmFzZXNGcm9tTGFzdGVzdEVsZW1lbnRJbkhpc3RvcnkubWFwKFxyXG4gICAgICAgIChlZGl0YWJsZVBocmFzZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGVkaXRhYmxlUGhyYXNlRnJvbUhpc3RvcnkgPSB0aGlzLmhpc3RvcnlbXHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleFxyXG4gICAgICAgICAgXS5lZGl0YWJsZVBocmFzZXNbaW5kZXhdO1xyXG4gICAgICAgICAgaWYgKGVkaXRhYmxlUGhyYXNlLnZhbHVlICE9PSBlZGl0YWJsZVBocmFzZUZyb21IaXN0b3J5LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdGFibGVQaHJhc2VzW2luZGV4XSA9IHsgLi4uZWRpdGFibGVQaHJhc2VGcm9tSGlzdG9yeSB9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgdGhpcy51cGRhdGVWaWV3YWJsZVBocmFzZXNWYWx1ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgaGlzdG9yeUhhbmRsZXJMaXN0ZW5lcigpIHtcclxuICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lciB0byBjdHJsICsgeiBhbmQgY3RybCArIHlcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XHJcbiAgICAgIGlmIChlLmN0cmxLZXkpIHtcclxuICAgICAgICBpZiAoZS5rZXkgPT09IFwielwiKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB0aGlzLnVuZG8oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcInlcIikge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy5yZWRvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn0iLCI8Ym9keT5cclxuICA8aW5wdXRcclxuICAgICN1cGxvYWRGaWxlSW5wdXRcclxuICAgIChjaGFuZ2UpPVwic2V0VGVtcGxhdGVGcm9tSW5wdXRFdmVudCgkZXZlbnQpXCJcclxuICAgIGNsYXNzPVwiaW52aXNpYmxlXCJcclxuICAgIHR5cGU9XCJmaWxlXCJcclxuICAgIGlkPVwidGVtcGxhdGVcIlxyXG4gICAgbmFtZT1cInRlbXBsYXRlXCJcclxuICAgIGFjY2VwdD1cIi5kb2N4XCJcclxuICAgIC8+XHJcblxyXG4gIDxkaXZcclxuICAgIGNsYXNzPVwiYmFja2Ryb3BcIlxyXG4gICAgW2NsYXNzLmJhY2tkcm9wLS1ob3Zlcl09XCJ3b3Jrc3BhY2UuZHJvcGluZ0ZpbGVcIlxyXG4gICAgKHdoZWVsKT1cIiRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcclxuICA+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYmFja2Ryb3BfX2Ryb3AtZmlsZS1tc2dcIj5cclxuICAgICAgQWJyaXIgdGVtcGxhdGVcclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG5cclxuICA8YXBwLWhlYWRlclxyXG4gICAgW3dvcmtzcGFjZV09XCJ3b3Jrc3BhY2VcIlxyXG4gICAgW2RvY3hGaWxlXT1cImRvY3hGaWxlXCJcclxuICAgIFtoaXN0b3J5XT1cImhpc3RvcnlcIlxyXG4gICAgW2VkaXRhYmxlUGhyYXNlc109XCJlZGl0YWJsZVBocmFzZXNcIlxyXG4gICAgW3VwbG9hZEZpbGVJbnB1dF09XCJ1cGxvYWRGaWxlSW5wdXRcIlxyXG4gICAgKGZpbGVDaGFuZ2UpPVwic2V0VGVtcGxhdGVGcm9tSW5wdXRFdmVudCgkZXZlbnQpXCJcclxuICAgIChkb2N4RmlsZUNoYW5nZWQpPVwic2F2ZUhhbmRsZXIoJGV2ZW50KVwiXHJcbiAgPjwvYXBwLWhlYWRlcj5cclxuXHJcbiAgPGFwcC13b3Jrc3BhY2VcclxuICAgIFtkYXRhXT1cImRhdGFcIlxyXG4gICAgW3dvcmtzcGFjZV09XCJ3b3Jrc3BhY2VcIlxyXG4gICAgW2VkaXRhYmxlUGhyYXNlc109XCJlZGl0YWJsZVBocmFzZXNcIlxyXG4gICAgW2ZpbGVJbnB1dF09XCJ1cGxvYWRGaWxlSW5wdXRcIlxyXG4gICAgW3ZpZXdhYmxlUGhyYXNlc109XCJ2aWV3YWJsZVBocmFzZXNcIlxyXG4gICAgc3R5bGU9XCJmbGV4LWdyb3c6IDE7IGhlaWdodDogMTAwJTsgb3ZlcmZsb3c6IGF1dG87XCJcclxuICAgIChlZGl0YWJsZVBocmFzZUNoYW5nZWQpPVwidXBkYXRlRWRpdGFibGVQaHJhc2UoJGV2ZW50LmlucHV0RXZlbnQsICRldmVudC5pbmRleE9mRWRpdGFibGVQaHJhc2UpXCJcclxuICA+PC9hcHAtd29ya3NwYWNlPlxyXG5cclxuICA8YXBwLWZvb3RlclxyXG4gICAgW3dvcmtzcGFjZV09XCJ3b3Jrc3BhY2VcIlxyXG4gICAgKGNsaWNrRWRpdE1vZGUpPVwiISRldmVudC5zaGlmdEtleSA/IHNldE1vZGUoJ2VkaXQnKSA6IHNldE1vZGUoJ2VkaXRWaWV3JylcIlxyXG4gICAgKGNsaWNrVmlld01vZGUpPVwiISRldmVudC5zaGlmdEtleSA/IHNldE1vZGUoJ3ZpZXcnKSA6IHNldE1vZGUoJ2VkaXRWaWV3JylcIlxyXG4gICAgKGNsaWNrU2ltdWxhdGlvbk1vZGUpPVwic2V0TW9kZSgnc2ltdWxhdGlvbicpXCJcclxuICA+PC9hcHAtZm9vdGVyPlxyXG48L2JvZHk+Il19