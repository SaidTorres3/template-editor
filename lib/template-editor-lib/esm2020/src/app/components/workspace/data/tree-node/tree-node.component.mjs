import { Component, Input, ViewChild } from "@angular/core";
import { DoesStringRepresentPrimitivePipe } from "../../../../../app/pipes/does-string-represent-primitive.pipe";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../../../directives/focus.directive";
import * as i3 from "../../../../pipes/does-string-represent-primitive.pipe";
import * as i4 from "../../../../pipes/isObject.pipe";
import * as i5 from "../../../../pipes/has-these-props.pipe";
export class TreeNodeComponent {
    constructor() {
        this.path = "";
        this.tabulationLenght = 20;
        this.showRealValue = false;
        this.isHovering = false;
    }
    ngOnInit() {
        if (this.tabulation == undefined) {
            this.tabulation = 0;
        }
    }
    setHovering(isHovering) {
        this.isHovering = isHovering;
    }
    // public showPath(item: Paradox): string {
    showPath(item) {
        return `{{${this.path + item.key}}}`;
    }
    pathToSend(item) {
        if (item.key === "items")
            return this.path + "∀.";
        if (item.key === "properties")
            return this.path + "";
        return this.path + item.key + ".";
    }
    showRealPath(e, index) {
        this.showRealValue = true;
        this.actualIndex = index;
        const element = e.target;
        element.onmouseleave = () => {
            this.showRealValue = false;
            element.onmouseleave = null;
        };
    }
    isFoundedItem(titleValue, pathValue) {
        titleValue = titleValue
            ?.trim()
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // replace accent characters to non accent characters
        pathValue = pathValue
            ?.trim()
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\./g, " ");
        const search = this.workspace.searchData
            ?.trim()
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\./g, " ");
        if (titleValue && search) {
            const includesInTitle = titleValue.includes(search);
            if (includesInTitle) {
                return true;
            }
            else {
                if (pathValue && search) {
                    return pathValue.includes(search);
                }
            }
        }
        return false;
    }
    replaceSelectionWithInnertext(e, type) {
        const primitivizerChecker = new DoesStringRepresentPrimitivePipe();
        const isPrimitive = primitivizerChecker.transform(type);
        if (!isPrimitive)
            return;
        let text = e.target.innerHTML;
        text = this.replaceArraySymbolToEachSentence(text);
        document.execCommand("insertText", true, text);
    }
    replaceArraySymbolToEachSentence(text) {
        const dividedText = text.replace(/[\{\}]/g, "").split(".");
        console.log(dividedText);
        let posibleResult = "";
        for (let [index, sentence] of dividedText.entries()) {
            const regexToFindLastContentVariable = /}}{{([\w\.]+)}}{{\/each}}/g;
            const match = regexToFindLastContentVariable.exec(posibleResult);
            const arrayName = dividedText[index - 1];
            const arrayProp = dividedText[index + 1];
            if (sentence.includes("∀") &&
                !dividedText[index - 1]?.includes("∀") &&
                !dividedText[index + 1]?.includes("∀")) {
                if (!posibleResult) {
                    posibleResult = `{{#each ${arrayName}}}{{${arrayProp}}}{{/each}}`;
                }
                else {
                    // replace text of the first group
                    posibleResult = posibleResult.replace(match[1], `#each ${arrayName}}}{{${arrayProp}}}{{/each`);
                }
            }
            else if (match && !dividedText[index - 1]?.includes("∀")) {
                console.log(match[1]);
                posibleResult = posibleResult.replace(match[1], `${match[1]}.${sentence}`);
            }
        }
        if (posibleResult)
            return posibleResult;
        return text;
    }
}
TreeNodeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TreeNodeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TreeNodeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: TreeNodeComponent, selector: "tree-node[workspace]", inputs: { node: "node", tabulation: "tabulation", path: "path", workspace: "workspace" }, viewQueries: [{ propertyName: "treeRoot", first: true, predicate: ["treeRoot"], descendants: true }], ngImport: i0, template: "<div\r\n  #treeRoot\r\n  *ngIf=\"node\"\r\n  (mouseenter)=\"setHovering(true)\"\r\n  (mouseleave)=\"setHovering(false)\"\r\n>\r\n  <div\r\n    #element\r\n    *ngFor=\"let item of (node | keyvalue), let i = index\"\r\n    comment=\"node = {name: 'alcachofas'}  --> |keyvalue --> node = [{key: 'name', value: 'alcachofas'}] --> node[0] as item --> {key: 'name', value: 'alcachofas'}\"\r\n    [ngStyle]=\"{'margin-left': tabulation+'px'}\"\r\n    class=\"not-draggable\"\r\n    (mouseover)=\"showRealPath($event, i)\"\r\n  >\r\n    <div\r\n      *ngIf=\"item.value.title\"\r\n      commment=\"if prop of node is an object and this object has a property called 'title'\"\r\n      (click)=\"replaceSelectionWithInnertext($event, item.value.type)\"\r\n      class=\"data-node\"\r\n      [class]=\"(item.value.type | doesStringRepresentPrimitive) ? 'primitive-value' : item.value.type === 'array' ? 'array-value' : 'not-primitive-value'\"\r\n      [class.founded]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      [focus]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      contenteditable=\"false\"\r\n      >{{ showRealValue && i==actualIndex && (item.value.type |\r\n      doesStringRepresentPrimitive) && isHovering ? showPath(item) :\r\n      (item.value.title) }}</div\r\n    >\r\n    <ng-container *ngIf=\"item.value | isObject\">\r\n      <tree-node\r\n        [node]=\"item.value\"\r\n        [tabulation]=\"((item.value | hasTheseProps:'title':'type') ? tabulationLenght : 0)\"\r\n        [path]=\"pathToSend(item)\"\r\n        [workspace]=\"workspace\"\r\n      ></tree-node>\r\n    </ng-container>\r\n  </div>\r\n</div>\r\n", styles: [".data-node{display:flex;white-space:nowrap}.data-node:hover{overflow:auto}.primitive-value{color:#0397e1;-webkit-text-decoration:dotted;text-decoration:dotted;cursor:pointer}.array-value{content:\"\\2b24  \";color:#b700ff;white-space:pre}.not-draggable{-webkit-user-select:none;user-select:none}.not-primitive-value:before{content:\"\\2b2a  \";color:#cf8787;white-space:pre}.array-value:before{content:\"[] \";color:#ca6161;white-space:pre}.primitive-value:before{content:\"- \";color:#003cff;white-space:pre}.founded{color:#6e0000;background-color:#ff8b56}.data-node::-webkit-scrollbar{height:5px;background-color:#f0f0f0}.data-node::-webkit-scrollbar-thumb{background-color:#888;border-radius:5px}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: TreeNodeComponent, selector: "tree-node[workspace]", inputs: ["node", "tabulation", "path", "workspace"] }], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i2.FocusDirective, selector: "[focus]", inputs: ["focus"] }], pipes: { "keyvalue": i1.KeyValuePipe, "doesStringRepresentPrimitive": i3.DoesStringRepresentPrimitivePipe, "isObject": i4.isObject, "hasTheseProps": i5.HasThesePropsPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TreeNodeComponent, decorators: [{
            type: Component,
            args: [{ selector: "tree-node[workspace]", template: "<div\r\n  #treeRoot\r\n  *ngIf=\"node\"\r\n  (mouseenter)=\"setHovering(true)\"\r\n  (mouseleave)=\"setHovering(false)\"\r\n>\r\n  <div\r\n    #element\r\n    *ngFor=\"let item of (node | keyvalue), let i = index\"\r\n    comment=\"node = {name: 'alcachofas'}  --> |keyvalue --> node = [{key: 'name', value: 'alcachofas'}] --> node[0] as item --> {key: 'name', value: 'alcachofas'}\"\r\n    [ngStyle]=\"{'margin-left': tabulation+'px'}\"\r\n    class=\"not-draggable\"\r\n    (mouseover)=\"showRealPath($event, i)\"\r\n  >\r\n    <div\r\n      *ngIf=\"item.value.title\"\r\n      commment=\"if prop of node is an object and this object has a property called 'title'\"\r\n      (click)=\"replaceSelectionWithInnertext($event, item.value.type)\"\r\n      class=\"data-node\"\r\n      [class]=\"(item.value.type | doesStringRepresentPrimitive) ? 'primitive-value' : item.value.type === 'array' ? 'array-value' : 'not-primitive-value'\"\r\n      [class.founded]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      [focus]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      contenteditable=\"false\"\r\n      >{{ showRealValue && i==actualIndex && (item.value.type |\r\n      doesStringRepresentPrimitive) && isHovering ? showPath(item) :\r\n      (item.value.title) }}</div\r\n    >\r\n    <ng-container *ngIf=\"item.value | isObject\">\r\n      <tree-node\r\n        [node]=\"item.value\"\r\n        [tabulation]=\"((item.value | hasTheseProps:'title':'type') ? tabulationLenght : 0)\"\r\n        [path]=\"pathToSend(item)\"\r\n        [workspace]=\"workspace\"\r\n      ></tree-node>\r\n    </ng-container>\r\n  </div>\r\n</div>\r\n", styles: [".data-node{display:flex;white-space:nowrap}.data-node:hover{overflow:auto}.primitive-value{color:#0397e1;-webkit-text-decoration:dotted;text-decoration:dotted;cursor:pointer}.array-value{content:\"\\2b24  \";color:#b700ff;white-space:pre}.not-draggable{-webkit-user-select:none;user-select:none}.not-primitive-value:before{content:\"\\2b2a  \";color:#cf8787;white-space:pre}.array-value:before{content:\"[] \";color:#ca6161;white-space:pre}.primitive-value:before{content:\"- \";color:#003cff;white-space:pre}.founded{color:#6e0000;background-color:#ff8b56}.data-node::-webkit-scrollbar{height:5px;background-color:#f0f0f0}.data-node::-webkit-scrollbar-thumb{background-color:#888;border-radius:5px}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { treeRoot: [{
                type: ViewChild,
                args: ["treeRoot"]
            }], node: [{
                type: Input
            }], tabulation: [{
                type: Input
            }], path: [{
                type: Input
            }], workspace: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy93b3Jrc3BhY2UvZGF0YS90cmVlLW5vZGUvdHJlZS1ub2RlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy93b3Jrc3BhY2UvZGF0YS90cmVlLW5vZGUvdHJlZS1ub2RlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd4RSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSwrREFBK0QsQ0FBQzs7Ozs7OztBQVVqSCxNQUFNLE9BQU8saUJBQWlCO0lBUjlCO1FBYVcsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUVwQixxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFDOUIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsZUFBVSxHQUFZLEtBQUssQ0FBQztLQThHcEM7SUE1R0MsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRU0sV0FBVyxDQUFDLFVBQW1CO1FBQ3BDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFRCwyQ0FBMkM7SUFDcEMsUUFBUSxDQUFDLElBQVM7UUFDdkIsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxVQUFVLENBQUMsSUFBUztRQUN6QixJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUks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LENBQUM7YUFDSDtTQUNGO1FBQ0QsSUFBSSxhQUFhO1lBQUUsT0FBTyxhQUFhLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzs4R0F2SFUsaUJBQWlCO2tHQUFqQixpQkFBaUIsNFBDYjlCLG1uREFxQ0EscStCRHhCYSxpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFSN0IsU0FBUzsrQkFDRSxzQkFBc0I7OEJBUVQsUUFBUTtzQkFBOUIsU0FBUzt1QkFBQyxVQUFVO2dCQUNaLElBQUk7c0JBQVosS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgUGFyYWRveCB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9hcHAvcGlwZXMvaXNPYmplY3QucGlwZVwiO1xyXG5pbXBvcnQgeyBXb3JrU3BhY2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vYXBwL2ludGVyZmFjZXNcIjtcclxuaW1wb3J0IHsgRG9lc1N0cmluZ1JlcHJlc2VudFByaW1pdGl2ZVBpcGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vYXBwL3BpcGVzL2RvZXMtc3RyaW5nLXJlcHJlc2VudC1wcmltaXRpdmUucGlwZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwidHJlZS1ub2RlW3dvcmtzcGFjZV1cIixcclxuICB0ZW1wbGF0ZVVybDogXCIuL3RyZWUtbm9kZS5jb21wb25lbnQuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1xyXG4gICAgXCIuL3RyZWUtbm9kZS5jb21wb25lbnQubGVzc1wiLFxyXG4gICAgXCIuLi8uLi8uLi8uLi9zaGFyZWQvc3R5bGVzL2NvbW1vblN0eWxlcy5sZXNzXCIsXHJcbiAgXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlQ29tcG9uZW50IHtcclxuICBAVmlld0NoaWxkKFwidHJlZVJvb3RcIikgdHJlZVJvb3Q6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xyXG4gIEBJbnB1dCgpIG5vZGU6IFBhcmFkb3g7XHJcbiAgLy8gQElucHV0KCkgbm9kZTogIGFueTtcclxuICBASW5wdXQoKSB0YWJ1bGF0aW9uOiBudW1iZXI7XHJcbiAgQElucHV0KCkgcGF0aDogc3RyaW5nID0gXCJcIjtcclxuICBASW5wdXQoKSB3b3Jrc3BhY2U6IFdvcmtTcGFjZTtcclxuICBwdWJsaWMgdGFidWxhdGlvbkxlbmdodDogbnVtYmVyID0gMjA7XHJcbiAgcHVibGljIHNob3dSZWFsVmFsdWUgPSBmYWxzZTtcclxuICBwdWJsaWMgYWN0dWFsSW5kZXg6IG51bWJlcjtcclxuICBwdWJsaWMgaXNIb3ZlcmluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLnRhYnVsYXRpb24gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMudGFidWxhdGlvbiA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0SG92ZXJpbmcoaXNIb3ZlcmluZzogYm9vbGVhbikge1xyXG4gICAgdGhpcy5pc0hvdmVyaW5nID0gaXNIb3ZlcmluZztcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBzaG93UGF0aChpdGVtOiBQYXJhZG94KTogc3RyaW5nIHtcclxuICBwdWJsaWMgc2hvd1BhdGgoaXRlbTogYW55KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBge3ske3RoaXMucGF0aCArIGl0ZW0ua2V5fX19YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwYXRoVG9TZW5kKGl0ZW06IGFueSk6IHN0cmluZyB7XHJcbiAgICBpZiAoaXRlbS5rZXkgPT09IFwiaXRlbXNcIikgcmV0dXJuIHRoaXMucGF0aCArIFwi4oiALlwiO1xyXG4gICAgaWYgKGl0ZW0ua2V5ID09PSBcInByb3BlcnRpZXNcIikgcmV0dXJuIHRoaXMucGF0aCArIFwiXCI7XHJcbiAgICByZXR1cm4gdGhpcy5wYXRoICsgaXRlbS5rZXkgKyBcIi5cIjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzaG93UmVhbFBhdGgoZTogTW91c2VFdmVudCwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgdGhpcy5zaG93UmVhbFZhbHVlID0gdHJ1ZTtcclxuICAgIHRoaXMuYWN0dWFsSW5kZXggPSBpbmRleDtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBlLnRhcmdldCBhcyBIVE1MQW5jaG9yRWxlbWVudDtcclxuICAgIGVsZW1lbnQub25tb3VzZWxlYXZlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnNob3dSZWFsVmFsdWUgPSBmYWxzZTtcclxuICAgICAgZWxlbWVudC5vbm1vdXNlbGVhdmUgPSBudWxsO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpc0ZvdW5kZWRJdGVtKFxyXG4gICAgdGl0bGVWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkLFxyXG4gICAgcGF0aFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWRcclxuICApOiBib29sZWFuIHtcclxuICAgIHRpdGxlVmFsdWUgPSB0aXRsZVZhbHVlXHJcbiAgICAgID8udHJpbSgpXHJcbiAgICAgID8udG9Mb3dlckNhc2UoKVxyXG4gICAgICA/Lm5vcm1hbGl6ZShcIk5GRFwiKVxyXG4gICAgICAucmVwbGFjZSgvW1xcdTAzMDAtXFx1MDM2Zl0vZywgXCJcIik7IC8vIHJlcGxhY2UgYWNjZW50IGNoYXJhY3RlcnMgdG8gbm9uIGFjY2VudCBjaGFyYWN0ZXJzXHJcbiAgICBwYXRoVmFsdWUgPSBwYXRoVmFsdWVcclxuICAgICAgPy50cmltKClcclxuICAgICAgPy50b0xvd2VyQ2FzZSgpXHJcbiAgICAgID8ubm9ybWFsaXplKFwiTkZEXCIpXHJcbiAgICAgIC5yZXBsYWNlKC9bXFx1MDMwMC1cXHUwMzZmXS9nLCBcIlwiKVxyXG4gICAgICAucmVwbGFjZSgvXFwuL2csIFwiIFwiKTtcclxuICAgIGNvbnN0IHNlYXJjaCA9IHRoaXMud29ya3NwYWNlLnNlYXJjaERhdGFcclxuICAgICAgPy50cmltKClcclxuICAgICAgPy50b0xvd2VyQ2FzZSgpXHJcbiAgICAgID8ubm9ybWFsaXplKFwiTkZEXCIpXHJcbiAgICAgIC5yZXBsYWNlKC9bXFx1MDMwMC1cXHUwMzZmXS9nLCBcIlwiKVxyXG4gICAgICAucmVwbGFjZSgvXFwuL2csIFwiIFwiKTtcclxuICAgIGlmICh0aXRsZVZhbHVlICYmIHNlYXJjaCkge1xyXG4gICAgICBjb25zdCBpbmNsdWRlc0luVGl0bGUgPSB0aXRsZVZhbHVlLmluY2x1ZGVzKHNlYXJjaCk7XHJcbiAgICAgIGlmIChpbmNsdWRlc0luVGl0bGUpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocGF0aFZhbHVlICYmIHNlYXJjaCkge1xyXG4gICAgICAgICAgcmV0dXJuIHBhdGhWYWx1ZS5pbmNsdWRlcyhzZWFyY2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlcGxhY2VTZWxlY3Rpb25XaXRoSW5uZXJ0ZXh0KGU6IE1vdXNlRXZlbnQsIHR5cGU6IHN0cmluZykge1xyXG4gICAgY29uc3QgcHJpbWl0aXZpemVyQ2hlY2tlciA9IG5ldyBEb2VzU3RyaW5nUmVwcmVzZW50UHJpbWl0aXZlUGlwZSgpO1xyXG4gICAgY29uc3QgaXNQcmltaXRpdmUgPSBwcmltaXRpdml6ZXJDaGVja2VyLnRyYW5zZm9ybSh0eXBlKTtcclxuICAgIGlmICghaXNQcmltaXRpdmUpIHJldHVybjtcclxuICAgIGxldCB0ZXh0ID0gKGUudGFyZ2V0IGFzIEhUTUxEaXZFbGVtZW50KS5pbm5lckhUTUw7XHJcbiAgICB0ZXh0ID0gdGhpcy5yZXBsYWNlQXJyYXlTeW1ib2xUb0VhY2hTZW50ZW5jZSh0ZXh0KTtcclxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiaW5zZXJ0VGV4dFwiLCB0cnVlLCB0ZXh0KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVwbGFjZUFycmF5U3ltYm9sVG9FYWNoU2VudGVuY2UodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGRpdmlkZWRUZXh0ID0gdGV4dC5yZXBsYWNlKC9bXFx7XFx9XS9nLCBcIlwiKS5zcGxpdChcIi5cIik7XHJcbiAgICBjb25zb2xlLmxvZyhkaXZpZGVkVGV4dCk7XHJcbiAgICBsZXQgcG9zaWJsZVJlc3VsdCA9IFwiXCI7XHJcbiAgICBmb3IgKGxldCBbaW5kZXgsIHNlbnRlbmNlXSBvZiBkaXZpZGVkVGV4dC5lbnRyaWVzKCkpIHtcclxuICAgICAgY29uc3QgcmVnZXhUb0ZpbmRMYXN0Q29udGVudFZhcmlhYmxlID0gL319e3soW1xcd1xcLl0rKX19e3tcXC9lYWNofX0vZztcclxuICAgICAgY29uc3QgbWF0Y2ggPSByZWdleFRvRmluZExhc3RDb250ZW50VmFyaWFibGUuZXhlYyhwb3NpYmxlUmVzdWx0KTtcclxuICAgICAgY29uc3QgYXJyYXlOYW1lID0gZGl2aWRlZFRleHRbaW5kZXggLSAxXTtcclxuICAgICAgY29uc3QgYXJyYXlQcm9wID0gZGl2aWRlZFRleHRbaW5kZXggKyAxXTtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHNlbnRlbmNlLmluY2x1ZGVzKFwi4oiAXCIpICYmXHJcbiAgICAgICAgIWRpdmlkZWRUZXh0W2luZGV4IC0gMV0/LmluY2x1ZGVzKFwi4oiAXCIpICYmXHJcbiAgICAgICAgIWRpdmlkZWRUZXh0W2luZGV4ICsgMV0/LmluY2x1ZGVzKFwi4oiAXCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlmICghcG9zaWJsZVJlc3VsdCkge1xyXG4gICAgICAgICAgcG9zaWJsZVJlc3VsdCA9IGB7eyNlYWNoICR7YXJyYXlOYW1lfX19e3ske2FycmF5UHJvcH19fXt7L2VhY2h9fWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIHJlcGxhY2UgdGV4dCBvZiB0aGUgZmlyc3QgZ3JvdXBcclxuICAgICAgICAgIHBvc2libGVSZXN1bHQgPSBwb3NpYmxlUmVzdWx0LnJlcGxhY2UoXHJcbiAgICAgICAgICAgIG1hdGNoWzFdLFxyXG4gICAgICAgICAgICBgI2VhY2ggJHthcnJheU5hbWV9fX17eyR7YXJyYXlQcm9wfX19e3svZWFjaGBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKG1hdGNoICYmICFkaXZpZGVkVGV4dFtpbmRleCAtIDFdPy5pbmNsdWRlcyhcIuKIgFwiKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1hdGNoWzFdKTtcclxuICAgICAgICBwb3NpYmxlUmVzdWx0ID0gcG9zaWJsZVJlc3VsdC5yZXBsYWNlKFxyXG4gICAgICAgICAgbWF0Y2hbMV0sXHJcbiAgICAgICAgICBgJHttYXRjaFsxXX0uJHtzZW50ZW5jZX1gXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHBvc2libGVSZXN1bHQpIHJldHVybiBwb3NpYmxlUmVzdWx0O1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfVxyXG59IiwiPGRpdlxyXG4gICN0cmVlUm9vdFxyXG4gICpuZ0lmPVwibm9kZVwiXHJcbiAgKG1vdXNlZW50ZXIpPVwic2V0SG92ZXJpbmcodHJ1ZSlcIlxyXG4gIChtb3VzZWxlYXZlKT1cInNldEhvdmVyaW5nKGZhbHNlKVwiXHJcbj5cclxuICA8ZGl2XHJcbiAgICAjZWxlbWVudFxyXG4gICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgKG5vZGUgfCBrZXl2YWx1ZSksIGxldCBpID0gaW5kZXhcIlxyXG4gICAgY29tbWVudD1cIm5vZGUgPSB7bmFtZTogJ2FsY2FjaG9mYXMnfSAgLS0+IHxrZXl2YWx1ZSAtLT4gbm9kZSA9IFt7a2V5OiAnbmFtZScsIHZhbHVlOiAnYWxjYWNob2Zhcyd9XSAtLT4gbm9kZVswXSBhcyBpdGVtIC0tPiB7a2V5OiAnbmFtZScsIHZhbHVlOiAnYWxjYWNob2Zhcyd9XCJcclxuICAgIFtuZ1N0eWxlXT1cInsnbWFyZ2luLWxlZnQnOiB0YWJ1bGF0aW9uKydweCd9XCJcclxuICAgIGNsYXNzPVwibm90LWRyYWdnYWJsZVwiXHJcbiAgICAobW91c2VvdmVyKT1cInNob3dSZWFsUGF0aCgkZXZlbnQsIGkpXCJcclxuICA+XHJcbiAgICA8ZGl2XHJcbiAgICAgICpuZ0lmPVwiaXRlbS52YWx1ZS50aXRsZVwiXHJcbiAgICAgIGNvbW1tZW50PVwiaWYgcHJvcCBvZiBub2RlIGlzIGFuIG9iamVjdCBhbmQgdGhpcyBvYmplY3QgaGFzIGEgcHJvcGVydHkgY2FsbGVkICd0aXRsZSdcIlxyXG4gICAgICAoY2xpY2spPVwicmVwbGFjZVNlbGVjdGlvbldpdGhJbm5lcnRleHQoJGV2ZW50LCBpdGVtLnZhbHVlLnR5cGUpXCJcclxuICAgICAgY2xhc3M9XCJkYXRhLW5vZGVcIlxyXG4gICAgICBbY2xhc3NdPVwiKGl0ZW0udmFsdWUudHlwZSB8IGRvZXNTdHJpbmdSZXByZXNlbnRQcmltaXRpdmUpID8gJ3ByaW1pdGl2ZS12YWx1ZScgOiBpdGVtLnZhbHVlLnR5cGUgPT09ICdhcnJheScgPyAnYXJyYXktdmFsdWUnIDogJ25vdC1wcmltaXRpdmUtdmFsdWUnXCJcclxuICAgICAgW2NsYXNzLmZvdW5kZWRdPVwiaXNGb3VuZGVkSXRlbShpdGVtLnZhbHVlLnRpdGxlLCBzaG93UGF0aChpdGVtKSlcIlxyXG4gICAgICBbZm9jdXNdPVwiaXNGb3VuZGVkSXRlbShpdGVtLnZhbHVlLnRpdGxlLCBzaG93UGF0aChpdGVtKSlcIlxyXG4gICAgICBjb250ZW50ZWRpdGFibGU9XCJmYWxzZVwiXHJcbiAgICAgID57eyBzaG93UmVhbFZhbHVlICYmIGk9PWFjdHVhbEluZGV4ICYmIChpdGVtLnZhbHVlLnR5cGUgfFxyXG4gICAgICBkb2VzU3RyaW5nUmVwcmVzZW50UHJpbWl0aXZlKSAmJiBpc0hvdmVyaW5nID8gc2hvd1BhdGgoaXRlbSkgOlxyXG4gICAgICAoaXRlbS52YWx1ZS50aXRsZSkgfX08L2RpdlxyXG4gICAgPlxyXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIml0ZW0udmFsdWUgfCBpc09iamVjdFwiPlxyXG4gICAgICA8dHJlZS1ub2RlXHJcbiAgICAgICAgW25vZGVdPVwiaXRlbS52YWx1ZVwiXHJcbiAgICAgICAgW3RhYnVsYXRpb25dPVwiKChpdGVtLnZhbHVlIHwgaGFzVGhlc2VQcm9wczondGl0bGUnOid0eXBlJykgPyB0YWJ1bGF0aW9uTGVuZ2h0IDogMClcIlxyXG4gICAgICAgIFtwYXRoXT1cInBhdGhUb1NlbmQoaXRlbSlcIlxyXG4gICAgICAgIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCJcclxuICAgICAgPjwvdHJlZS1ub2RlPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG4iXX0=