import { EventEmitter } from "@angular/core";
import { WorkSpace } from "../../../app/interfaces";
import { Zoom } from "../../../app/shared/zoom-class/Zoom";
import { EditablePhrase, ViewablePhrase } from "../../../utils/docxParsers/types";
import * as i0 from "@angular/core";
export declare class WorkspaceComponent {
    objectData: any;
    workspace: WorkSpace;
    editablePhrases: EditablePhrase[];
    fileInput: HTMLButtonElement;
    viewablePhrases: ViewablePhrase[];
    editablePhraseChanged: EventEmitter<{
        inputEvent: InputEvent;
        indexOfEditablePhrase: number;
    }>;
    zoom: Zoom;
    onEditablePhraseChanged(e: Event, index: number): void;
    disableEnter(e: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkspaceComponent, "app-workspace[objectData][workspace][editablePhrases][fileInput][viewablePhrases]", never, { "objectData": "objectData"; "workspace": "workspace"; "editablePhrases": "editablePhrases"; "fileInput": "fileInput"; "viewablePhrases": "viewablePhrases"; }, { "editablePhraseChanged": "editablePhraseChanged"; }, never, never>;
}
