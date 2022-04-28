import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class isObject implements PipeTransform {
    transform<T>(value: T | Paradox): value is Paradox;
    static ɵfac: i0.ɵɵFactoryDeclaration<isObject, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<isObject, "isObject">;
}
export interface Paradox {
    [key: string]: A;
}
export interface A {
    type: string;
    title: string;
    description?: string;
    format?: string;
    required?: string[];
    enum?: string[];
    minLength?: number;
    maxLength?: number;
    minItems?: number;
    maxItems?: number;
    items?: A;
    properties?: Paradox;
}
