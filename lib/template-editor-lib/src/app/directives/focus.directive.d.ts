import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FocusDirective {
    private element;
    focus: boolean;
    constructor(element: ElementRef);
    protected ngOnChanges(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FocusDirective, "[focus]", never, { "focus": "focus"; }, {}, never>;
}
