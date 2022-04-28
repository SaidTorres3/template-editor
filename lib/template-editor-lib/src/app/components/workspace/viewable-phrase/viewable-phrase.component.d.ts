import { AfterViewInit } from "@angular/core";
import { ViewablePhrase } from "../../../../utils/docxParsers/types";
import { ReadableInstruction } from "../../../../utils/handlebarTranslators/types";
import { WorkSpace } from "../../../../app/interfaces";
import * as i0 from "@angular/core";
export declare class ViewablePhraseComponent implements AfterViewInit {
    viewablePhrases: ViewablePhrase[];
    data: any;
    workspace: WorkSpace;
    showModal: ShowModal;
    ngAfterViewInit(): void;
    private createClickoffListener;
    showModalToggle(e: MouseEvent, phraseIndex: number): void;
    handlebarsToReadableIntructions(clasifiedText: ReadableInstruction[]): ReadableInstruction[];
    translateHandlebarToInstructions(viewablePhraseIndex: number): void;
    setSearchData(e: MouseEvent): void;
    stopClickPropagation(e: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewablePhraseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewablePhraseComponent, "viewable-phrases[viewablePhrases][data][workspace]", never, { "viewablePhrases": "viewablePhrases"; "data": "data"; "workspace": "workspace"; }, {}, never, never>;
}
interface ShowModal {
    showModal: boolean;
    phraseIndex: number;
    modalPosition: {
        x: number;
        y: number;
    };
    arrowPosition: {
        x: number;
    };
    data: ReadableInstruction[] | undefined;
}
export {};
