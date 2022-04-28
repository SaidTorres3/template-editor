import { PipeTransform } from '@angular/core';
import { isVariableAndExist } from '../../utils/phrasesParsers/types';
import * as i0 from "@angular/core";
export declare class VariableExistPipe implements PipeTransform {
    transform(text: any, object: any): isVariableAndExist[];
    static ɵfac: i0.ɵɵFactoryDeclaration<VariableExistPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<VariableExistPipe, "variableExist">;
}
