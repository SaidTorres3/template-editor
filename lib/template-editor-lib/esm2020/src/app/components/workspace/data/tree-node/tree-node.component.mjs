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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy93b3Jrc3BhY2UvZGF0YS90cmVlLW5vZGUvdHJlZS1ub2RlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy93b3Jrc3BhY2UvZGF0YS90cmVlLW5vZGUvdHJlZS1ub2RlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd4RSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSwrREFBK0QsQ0FBQzs7Ozs7OztBQVVqSCxNQUFNLE9BQU8saUJBQWlCO0lBUjlCO1FBYVcsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUVwQixxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFDOUIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsZUFBVSxHQUFZLEtBQUssQ0FBQztLQTRHcEM7SUExR0MsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRU0sV0FBVyxDQUFDLFVBQW1CO1FBQ3BDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFRCwyQ0FBMkM7SUFDcEMsUUFBUSxDQUFDLElBQVM7UUFDdkIsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxVQUFVLENBQUMsSUFBUztRQUN6QixJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUks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R0FBakIsaUJBQWlCLDRQQ2I5QixtbkRBcUNBLHErQkR4QmEsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBUjdCLFNBQVM7K0JBQ0Usc0JBQXNCOzhCQVFULFFBQVE7c0JBQTlCLFNBQVM7dUJBQUMsVUFBVTtnQkFDWixJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFBhcmFkb3ggfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vYXBwL3BpcGVzL2lzT2JqZWN0LnBpcGVcIjtcclxuaW1wb3J0IHsgV29ya1NwYWNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2FwcC9pbnRlcmZhY2VzXCI7XHJcbmltcG9ydCB7IERvZXNTdHJpbmdSZXByZXNlbnRQcmltaXRpdmVQaXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2FwcC9waXBlcy9kb2VzLXN0cmluZy1yZXByZXNlbnQtcHJpbWl0aXZlLnBpcGVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcInRyZWUtbm9kZVt3b3Jrc3BhY2VdXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwiLi90cmVlLW5vZGUuY29tcG9uZW50Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcclxuICAgIFwiLi90cmVlLW5vZGUuY29tcG9uZW50Lmxlc3NcIixcclxuICAgIFwiLi4vLi4vLi4vLi4vc2hhcmVkL3N0eWxlcy9jb21tb25TdHlsZXMubGVzc1wiLFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZUNvbXBvbmVudCB7XHJcbiAgQFZpZXdDaGlsZChcInRyZWVSb290XCIpIHRyZWVSb290OiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcclxuICBASW5wdXQoKSBub2RlOiBQYXJhZG94O1xyXG4gIC8vIEBJbnB1dCgpIG5vZGU6ICBhbnk7XHJcbiAgQElucHV0KCkgdGFidWxhdGlvbjogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHBhdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgQElucHV0KCkgd29ya3NwYWNlOiBXb3JrU3BhY2U7XHJcbiAgcHVibGljIHRhYnVsYXRpb25MZW5naHQ6IG51bWJlciA9IDIwO1xyXG4gIHB1YmxpYyBzaG93UmVhbFZhbHVlID0gZmFsc2U7XHJcbiAgcHVibGljIGFjdHVhbEluZGV4OiBudW1iZXI7XHJcbiAgcHVibGljIGlzSG92ZXJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy50YWJ1bGF0aW9uID09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLnRhYnVsYXRpb24gPSAwO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldEhvdmVyaW5nKGlzSG92ZXJpbmc6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuaXNIb3ZlcmluZyA9IGlzSG92ZXJpbmc7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgc2hvd1BhdGgoaXRlbTogUGFyYWRveCk6IHN0cmluZyB7XHJcbiAgcHVibGljIHNob3dQYXRoKGl0ZW06IGFueSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYHt7JHt0aGlzLnBhdGggKyBpdGVtLmtleX19fWA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcGF0aFRvU2VuZChpdGVtOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgaWYgKGl0ZW0ua2V5ID09PSBcIml0ZW1zXCIpIHJldHVybiB0aGlzLnBhdGggKyBcIuKIgC5cIjtcclxuICAgIGlmIChpdGVtLmtleSA9PT0gXCJwcm9wZXJ0aWVzXCIpIHJldHVybiB0aGlzLnBhdGggKyBcIlwiO1xyXG4gICAgcmV0dXJuIHRoaXMucGF0aCArIGl0ZW0ua2V5ICsgXCIuXCI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2hvd1JlYWxQYXRoKGU6IE1vdXNlRXZlbnQsIGluZGV4OiBudW1iZXIpIHtcclxuICAgIHRoaXMuc2hvd1JlYWxWYWx1ZSA9IHRydWU7XHJcbiAgICB0aGlzLmFjdHVhbEluZGV4ID0gaW5kZXg7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZS50YXJnZXQgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICBlbGVtZW50Lm9ubW91c2VsZWF2ZSA9ICgpID0+IHtcclxuICAgICAgdGhpcy5zaG93UmVhbFZhbHVlID0gZmFsc2U7XHJcbiAgICAgIGVsZW1lbnQub25tb3VzZWxlYXZlID0gbnVsbDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNGb3VuZGVkSXRlbShcclxuICAgIHRpdGxlVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCxcclxuICAgIHBhdGhWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkXHJcbiAgKTogYm9vbGVhbiB7XHJcbiAgICB0aXRsZVZhbHVlID0gdGl0bGVWYWx1ZVxyXG4gICAgICA/LnRyaW0oKVxyXG4gICAgICA/LnRvTG93ZXJDYXNlKClcclxuICAgICAgPy5ub3JtYWxpemUoXCJORkRcIilcclxuICAgICAgLnJlcGxhY2UoL1tcXHUwMzAwLVxcdTAzNmZdL2csIFwiXCIpOyAvLyByZXBsYWNlIGFjY2VudCBjaGFyYWN0ZXJzIHRvIG5vbiBhY2NlbnQgY2hhcmFjdGVyc1xyXG4gICAgcGF0aFZhbHVlID0gcGF0aFZhbHVlXHJcbiAgICAgID8udHJpbSgpXHJcbiAgICAgID8udG9Mb3dlckNhc2UoKVxyXG4gICAgICA/Lm5vcm1hbGl6ZShcIk5GRFwiKVxyXG4gICAgICAucmVwbGFjZSgvW1xcdTAzMDAtXFx1MDM2Zl0vZywgXCJcIilcclxuICAgICAgLnJlcGxhY2UoL1xcLi9nLCBcIiBcIik7XHJcbiAgICBjb25zdCBzZWFyY2ggPSB0aGlzLndvcmtzcGFjZS5zZWFyY2hEYXRhXHJcbiAgICAgID8udHJpbSgpXHJcbiAgICAgID8udG9Mb3dlckNhc2UoKVxyXG4gICAgICA/Lm5vcm1hbGl6ZShcIk5GRFwiKVxyXG4gICAgICAucmVwbGFjZSgvW1xcdTAzMDAtXFx1MDM2Zl0vZywgXCJcIilcclxuICAgICAgLnJlcGxhY2UoL1xcLi9nLCBcIiBcIik7XHJcbiAgICBpZiAodGl0bGVWYWx1ZSAmJiBzZWFyY2gpIHtcclxuICAgICAgY29uc3QgaW5jbHVkZXNJblRpdGxlID0gdGl0bGVWYWx1ZS5pbmNsdWRlcyhzZWFyY2gpO1xyXG4gICAgICBpZiAoaW5jbHVkZXNJblRpdGxlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHBhdGhWYWx1ZSAmJiBzZWFyY2gpIHtcclxuICAgICAgICAgIHJldHVybiBwYXRoVmFsdWUuaW5jbHVkZXMoc2VhcmNoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXBsYWNlU2VsZWN0aW9uV2l0aElubmVydGV4dChlOiBNb3VzZUV2ZW50LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHByaW1pdGl2aXplckNoZWNrZXIgPSBuZXcgRG9lc1N0cmluZ1JlcHJlc2VudFByaW1pdGl2ZVBpcGUoKTtcclxuICAgIGNvbnN0IGlzUHJpbWl0aXZlID0gcHJpbWl0aXZpemVyQ2hlY2tlci50cmFuc2Zvcm0odHlwZSk7XHJcbiAgICBpZiAoIWlzUHJpbWl0aXZlKSByZXR1cm47XHJcbiAgICBsZXQgdGV4dCA9IChlLnRhcmdldCBhcyBIVE1MRGl2RWxlbWVudCkuaW5uZXJIVE1MO1xyXG4gICAgdGV4dCA9IHRoaXMucmVwbGFjZUFycmF5U3ltYm9sVG9FYWNoU2VudGVuY2UodGV4dCk7XHJcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZChcImluc2VydFRleHRcIiwgdHJ1ZSwgdGV4dCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlcGxhY2VBcnJheVN5bWJvbFRvRWFjaFNlbnRlbmNlKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBkaXZpZGVkVGV4dCA9IHRleHQucmVwbGFjZSgvW1xce1xcfV0vZywgXCJcIikuc3BsaXQoXCIuXCIpO1xyXG4gICAgbGV0IHBvc2libGVSZXN1bHQgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgW2luZGV4LCBzZW50ZW5jZV0gb2YgZGl2aWRlZFRleHQuZW50cmllcygpKSB7XHJcbiAgICAgIGNvbnN0IHJlZ2V4VG9GaW5kTGFzdENvbnRlbnRWYXJpYWJsZSA9IC99fXt7KFtcXHdcXC5dKyl9fXt7XFwvZWFjaH19L2c7XHJcbiAgICAgIGNvbnN0IG1hdGNoID0gcmVnZXhUb0ZpbmRMYXN0Q29udGVudFZhcmlhYmxlLmV4ZWMocG9zaWJsZVJlc3VsdCk7XHJcbiAgICAgIGNvbnN0IGFycmF5TmFtZSA9IGRpdmlkZWRUZXh0W2luZGV4IC0gMV07XHJcbiAgICAgIGNvbnN0IGFycmF5UHJvcCA9IGRpdmlkZWRUZXh0W2luZGV4ICsgMV07XHJcbiAgICAgIGlmIChcclxuICAgICAgICBzZW50ZW5jZS5pbmNsdWRlcyhcIuKIgFwiKSAmJlxyXG4gICAgICAgICFkaXZpZGVkVGV4dFtpbmRleCAtIDFdPy5pbmNsdWRlcyhcIuKIgFwiKSAmJlxyXG4gICAgICAgICFkaXZpZGVkVGV4dFtpbmRleCArIDFdPy5pbmNsdWRlcyhcIuKIgFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBpZiAoIXBvc2libGVSZXN1bHQpIHtcclxuICAgICAgICAgIHBvc2libGVSZXN1bHQgPSBge3sjZWFjaCAke2FycmF5TmFtZX19fXt7JHthcnJheVByb3B9fX17ey9lYWNofX1gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyByZXBsYWNlIHRleHQgb2YgdGhlIGZpcnN0IGdyb3VwXHJcbiAgICAgICAgICBwb3NpYmxlUmVzdWx0ID0gcG9zaWJsZVJlc3VsdC5yZXBsYWNlKFxyXG4gICAgICAgICAgICBtYXRjaFsxXSxcclxuICAgICAgICAgICAgYCNlYWNoICR7YXJyYXlOYW1lfX19e3ske2FycmF5UHJvcH19fXt7L2VhY2hgXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChtYXRjaCAmJiAhZGl2aWRlZFRleHRbaW5kZXggLSAxXT8uaW5jbHVkZXMoXCLiiIBcIikpIHtcclxuICAgICAgICBwb3NpYmxlUmVzdWx0ID0gcG9zaWJsZVJlc3VsdC5yZXBsYWNlKFxyXG4gICAgICAgICAgbWF0Y2hbMV0sXHJcbiAgICAgICAgICBgJHttYXRjaFsxXX0uJHtzZW50ZW5jZX1gXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHBvc2libGVSZXN1bHQpIHJldHVybiBwb3NpYmxlUmVzdWx0O1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfVxyXG59IiwiPGRpdlxyXG4gICN0cmVlUm9vdFxyXG4gICpuZ0lmPVwibm9kZVwiXHJcbiAgKG1vdXNlZW50ZXIpPVwic2V0SG92ZXJpbmcodHJ1ZSlcIlxyXG4gIChtb3VzZWxlYXZlKT1cInNldEhvdmVyaW5nKGZhbHNlKVwiXHJcbj5cclxuICA8ZGl2XHJcbiAgICAjZWxlbWVudFxyXG4gICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgKG5vZGUgfCBrZXl2YWx1ZSksIGxldCBpID0gaW5kZXhcIlxyXG4gICAgY29tbWVudD1cIm5vZGUgPSB7bmFtZTogJ2FsY2FjaG9mYXMnfSAgLS0+IHxrZXl2YWx1ZSAtLT4gbm9kZSA9IFt7a2V5OiAnbmFtZScsIHZhbHVlOiAnYWxjYWNob2Zhcyd9XSAtLT4gbm9kZVswXSBhcyBpdGVtIC0tPiB7a2V5OiAnbmFtZScsIHZhbHVlOiAnYWxjYWNob2Zhcyd9XCJcclxuICAgIFtuZ1N0eWxlXT1cInsnbWFyZ2luLWxlZnQnOiB0YWJ1bGF0aW9uKydweCd9XCJcclxuICAgIGNsYXNzPVwibm90LWRyYWdnYWJsZVwiXHJcbiAgICAobW91c2VvdmVyKT1cInNob3dSZWFsUGF0aCgkZXZlbnQsIGkpXCJcclxuICA+XHJcbiAgICA8ZGl2XHJcbiAgICAgICpuZ0lmPVwiaXRlbS52YWx1ZS50aXRsZVwiXHJcbiAgICAgIGNvbW1tZW50PVwiaWYgcHJvcCBvZiBub2RlIGlzIGFuIG9iamVjdCBhbmQgdGhpcyBvYmplY3QgaGFzIGEgcHJvcGVydHkgY2FsbGVkICd0aXRsZSdcIlxyXG4gICAgICAoY2xpY2spPVwicmVwbGFjZVNlbGVjdGlvbldpdGhJbm5lcnRleHQoJGV2ZW50LCBpdGVtLnZhbHVlLnR5cGUpXCJcclxuICAgICAgY2xhc3M9XCJkYXRhLW5vZGVcIlxyXG4gICAgICBbY2xhc3NdPVwiKGl0ZW0udmFsdWUudHlwZSB8IGRvZXNTdHJpbmdSZXByZXNlbnRQcmltaXRpdmUpID8gJ3ByaW1pdGl2ZS12YWx1ZScgOiBpdGVtLnZhbHVlLnR5cGUgPT09ICdhcnJheScgPyAnYXJyYXktdmFsdWUnIDogJ25vdC1wcmltaXRpdmUtdmFsdWUnXCJcclxuICAgICAgW2NsYXNzLmZvdW5kZWRdPVwiaXNGb3VuZGVkSXRlbShpdGVtLnZhbHVlLnRpdGxlLCBzaG93UGF0aChpdGVtKSlcIlxyXG4gICAgICBbZm9jdXNdPVwiaXNGb3VuZGVkSXRlbShpdGVtLnZhbHVlLnRpdGxlLCBzaG93UGF0aChpdGVtKSlcIlxyXG4gICAgICBjb250ZW50ZWRpdGFibGU9XCJmYWxzZVwiXHJcbiAgICAgID57eyBzaG93UmVhbFZhbHVlICYmIGk9PWFjdHVhbEluZGV4ICYmIChpdGVtLnZhbHVlLnR5cGUgfFxyXG4gICAgICBkb2VzU3RyaW5nUmVwcmVzZW50UHJpbWl0aXZlKSAmJiBpc0hvdmVyaW5nID8gc2hvd1BhdGgoaXRlbSkgOlxyXG4gICAgICAoaXRlbS52YWx1ZS50aXRsZSkgfX08L2RpdlxyXG4gICAgPlxyXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIml0ZW0udmFsdWUgfCBpc09iamVjdFwiPlxyXG4gICAgICA8dHJlZS1ub2RlXHJcbiAgICAgICAgW25vZGVdPVwiaXRlbS52YWx1ZVwiXHJcbiAgICAgICAgW3RhYnVsYXRpb25dPVwiKChpdGVtLnZhbHVlIHwgaGFzVGhlc2VQcm9wczondGl0bGUnOid0eXBlJykgPyB0YWJ1bGF0aW9uTGVuZ2h0IDogMClcIlxyXG4gICAgICAgIFtwYXRoXT1cInBhdGhUb1NlbmQoaXRlbSlcIlxyXG4gICAgICAgIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCJcclxuICAgICAgPjwvdHJlZS1ub2RlPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG4iXX0=