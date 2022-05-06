import { EventEmitter } from "@angular/core";
import { DocxFile, History, WorkSpace } from "../../../app/interfaces";
import { EditablePhrase } from "../../../utils/docxParsers/types";
import * as i0 from "@angular/core";
export declare class HeaderComponent {
    workspace: WorkSpace;
    docxFile: DocxFile;
    history: History[];
    uploadFileInput: HTMLInputElement;
    editablePhrases: EditablePhrase[];
    fileChange: EventEmitter<InputEvent>;
    docxFileChanged: EventEmitter<DocxFile>;
    onFileChangeHandler(e: Event): void;
    save(): void;
    saveToComputer(): void;
    openDetailsModal(): void;
    fileDropDownToggle(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HeaderComponent, "app-header[history][docxFile][uploadFileInput][editablePhrases]", never, { "workspace": "workspace"; "docxFile": "docxFile"; "history": "history"; "uploadFileInput": "uploadFileInput"; "editablePhrases": "editablePhrases"; }, { "fileChange": "fileChange"; "docxFileChanged": "docxFileChanged"; }, never, never>;
}
