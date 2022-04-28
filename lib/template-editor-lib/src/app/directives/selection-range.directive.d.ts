import { AfterViewInit, ElementRef, OnChanges } from "@angular/core";
import { SelectionRange } from "../interfaces";
import * as i0 from "@angular/core";
export declare class SelectionRangeDirective implements AfterViewInit, OnChanges {
    private element;
    selectionRange: SelectionRange;
    constructor(element: ElementRef);
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectionRangeDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SelectionRangeDirective, "[selectionRange]", never, { "selectionRange": "selectionRange"; }, {}, never>;
}
