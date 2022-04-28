import { PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export declare class EntersToBrPipe implements PipeTransform {
    private sanitizer;
    constructor(sanitizer: DomSanitizer);
    transform(value: string): SafeHtml;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntersToBrPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<EntersToBrPipe, "entersToBr">;
}
