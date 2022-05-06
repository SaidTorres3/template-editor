import { ElementRef, EventEmitter } from "@angular/core";
import { EditablePhrase, InputFileFormat, ViewablePhrase } from "../../utils/docxParsers/types";
import { DocxFile, WorkSpace, History, TemplateInformation } from "../interfaces";
import { Zoom } from "../shared/zoom-class/Zoom";
import { FormGroup } from "@angular/forms";
import * as i0 from "@angular/core";
export declare class AppComponent {
    title: string;
    uploadFileInput: ElementRef<HTMLInputElement>;
    workspaceContainer: ElementRef<HTMLDivElement>;
    data: any;
    template: InputFileFormat;
    templateInformation: TemplateInformation;
    save: EventEmitter<DocxFile>;
    updatedTemplateInformation: EventEmitter<TemplateInformation>;
    saveHandler(docxFile: DocxFile): void;
    editablePhrases: EditablePhrase[];
    viewablePhrases: ViewablePhrase[];
    history: History[];
    zoom: Zoom;
    workspace: WorkSpace;
    docxFile: DocxFile;
    templateInformationForm: FormGroup;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    setTemplateFromInputEvent(inputEvent: Event): void;
    private setTemplateFromFile;
    private setPhrases;
    updateEditablePhrase(inputEvent: InputEvent, editablePhraseIndex: number): void;
    fileBackdropHandlerListener: () => void;
    setMode(mode: string): void;
    hideModals(): void;
    updateTemplateInformation(): void;
    private updatesPhrasesValues;
    private updateEditablePhrasesValue;
    private updateViewablePhrasesValue;
    private changeModeWithHotkeysListener;
    undo: () => void;
    redo: () => void;
    private historyHandlerListener;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppComponent, "template-editor", never, { "data": "data"; "template": "template"; "templateInformation": "templateInformation"; }, { "save": "save"; "updatedTemplateInformation": "updatedTemplateInformation"; }, never, never>;
}
