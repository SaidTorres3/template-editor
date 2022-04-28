import { EventEmitter } from "@angular/core";
import { isVariableAndExist } from "../../../../../utils/phrasesParsers/types";
import * as i0 from "@angular/core";
export declare class VariableCheckerComponent {
    input: isVariableAndExist;
    hightlightExistingVariables: boolean;
    clickExistingVariable: EventEmitter<MouseEvent>;
    clickNonExistingVariable: EventEmitter<MouseEvent>;
    onClickExistingVariable(mouseEvent: MouseEvent): void;
    onClickNonExistingVariable(mouseEvent: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VariableCheckerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VariableCheckerComponent, "variable-checker[input]", never, { "input": "input"; "hightlightExistingVariables": "hightlightExistingVariables"; }, { "clickExistingVariable": "clickExistingVariable"; "clickNonExistingVariable": "clickNonExistingVariable"; }, never, never>;
}
