import { EventEmitter } from "@angular/core";
import { WorkSpace } from "../../../../app/interfaces";
import { EditablePhrase } from "../../../../utils/docxParsers/types";
import * as i0 from "@angular/core";
export declare class EditablePhraseComponent {
    constructor();
    editablePhrases: EditablePhrase[];
    workspace: WorkSpace;
    editablePhraseChanged: EventEmitter<{
        inputEvent: Event;
        index: number;
    }>;
    pasteContentWithoutStylesAndEnters(e: ClipboardEvent, index: number): void;
    onEdtitablePhraseChanged(e: Event, index: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditablePhraseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EditablePhraseComponent, "editable-phrases[editablePhrases][workspace]", never, { "editablePhrases": "editablePhrases"; "workspace": "workspace"; }, { "editablePhraseChanged": "editablePhraseChanged"; }, never, never>;
}
