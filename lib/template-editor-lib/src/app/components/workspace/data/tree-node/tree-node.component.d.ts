import { ElementRef } from "@angular/core";
import { Paradox } from "../../../../../app/pipes/isObject.pipe";
import { WorkSpace } from "../../../../../app/interfaces";
import * as i0 from "@angular/core";
export declare class TreeNodeComponent {
    treeRoot: ElementRef<HTMLDivElement>;
    node: Paradox;
    tabulation: number;
    path: string;
    workspace: WorkSpace;
    tabulationLenght: number;
    showRealValue: boolean;
    actualIndex: number;
    isHovering: boolean;
    ngOnInit(): void;
    setHovering(isHovering: boolean): void;
    showPath(item: any): string;
    pathToSend(item: any): string;
    showRealPath(e: MouseEvent, index: number): void;
    isFoundedItem(titleValue: string | undefined, pathValue: string | undefined): boolean;
    replaceSelectionWithInnertext(e: MouseEvent, type: string): void;
    private replaceArraySymbolToEachSentence;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeNodeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TreeNodeComponent, "tree-node[workspace]", never, { "node": "node"; "tabulation": "tabulation"; "path": "path"; "workspace": "workspace"; }, {}, never, never>;
}
