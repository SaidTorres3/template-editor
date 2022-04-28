import { PipeTransform } from "@angular/core";
import * as i0 from "@angular/core";
export declare class IsArrayPipe implements PipeTransform {
    transform<T>(value: T | T[]): value is T[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IsArrayPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IsArrayPipe, "isArray">;
}
