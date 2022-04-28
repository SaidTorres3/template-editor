import { Component, EventEmitter, Input, Output } from "@angular/core";
import { addStr } from "../../../../utils/javascript/addString";
import { replaceStr } from "../../../../utils/javascript/replaceString";
import { setCaretPosition } from "../../../../utils/javascript/setCaretPosition";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../../directives/selection-range.directive";
export class EditablePhraseComponent {
    constructor() {
        this.editablePhraseChanged = new EventEmitter();
    }
    pasteContentWithoutStylesAndEnters(e, index) {
        // todo
        e.preventDefault();
        const element = e.target;
        let editablePhraseValue = element.innerText;
        let text = e.clipboardData.getData("text/plain")?.replace(/\n/g, " ");
        const selection = window.getSelection();
        const caretFirstPosition = selection.anchorOffset;
        const caretLastPosition = selection.focusOffset;
        let newTxt;
        if (caretFirstPosition === caretLastPosition) { // if caret is in the same position
            newTxt = addStr({
                string: editablePhraseValue,
                index: caretFirstPosition,
                stringToAdd: text,
            });
        }
        else {
            // replace text from caretFirstPosition to caretLastPosition
            newTxt = replaceStr({
                firstPos: caretFirstPosition,
                secondPos: caretLastPosition,
                str: editablePhraseValue,
                stringToAdd: text,
            });
        }
        // create input event
        var event = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        // set new value
        element.innerText = newTxt;
        element.dispatchEvent(event);
        setCaretPosition(element, caretFirstPosition);
    }
    onEdtitablePhraseChanged(e, index) {
        this.editablePhraseChanged.emit({ inputEvent: e, index });
    }
}
EditablePhraseComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EditablePhraseComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
EditablePhraseComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: EditablePhraseComponent, selector: "editable-phrases[editablePhrases][workspace]", inputs: { editablePhrases: "editablePhrases", workspace: "workspace" }, outputs: { editablePhraseChanged: "editablePhraseChanged" }, ngImport: i0, template: "<ng-container *ngFor=\"let editablePhrase of editablePhrases; let index = index\">\r\n  <br\r\n    *ngIf=\"editablePhrases[index-1] && editablePhrases[index-1].paragraphIndex < editablePhrase.paragraphIndex\"\r\n  />\r\n  <span\r\n    *ngIf=\"editablePhrase.value !== '\\r\\n'\"\r\n    class=\"editable-phrase\"\r\n    contentEditable=\"true\"\r\n    (input)=\"onEdtitablePhraseChanged($event, index)\"\r\n    (paste)=\"pasteContentWithoutStylesAndEnters($event, index)\"\r\n    (dragover)=\"$event.preventDefault()\"\r\n    [selectionRange]=\"workspace.lastModifiedEditablePhraseIndex === index ? workspace.lastSelection : undefined\"\r\n    [class.workspace__template__paper-container__paper__phrase--selected]=\"workspace.lastModifiedEditablePhraseIndex === index\"\r\n    >{{editablePhrase.value}}</span\r\n  >\r\n</ng-container>\r\n", styles: [".editable-phrase{white-space:pre-wrap;outline-color:#1196d8;font-size:13.4px;font-family:Arial;line-height:23px;display:inline;resize:none}.editable-phrase:focus{outline-style:dashed}\n"], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.SelectionRangeDirective, selector: "[selectionRange]", inputs: ["selectionRange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EditablePhraseComponent, decorators: [{
            type: Component,
            args: [{ selector: "editable-phrases[editablePhrases][workspace]", template: "<ng-container *ngFor=\"let editablePhrase of editablePhrases; let index = index\">\r\n  <br\r\n    *ngIf=\"editablePhrases[index-1] && editablePhrases[index-1].paragraphIndex < editablePhrase.paragraphIndex\"\r\n  />\r\n  <span\r\n    *ngIf=\"editablePhrase.value !== '\\r\\n'\"\r\n    class=\"editable-phrase\"\r\n    contentEditable=\"true\"\r\n    (input)=\"onEdtitablePhraseChanged($event, index)\"\r\n    (paste)=\"pasteContentWithoutStylesAndEnters($event, index)\"\r\n    (dragover)=\"$event.preventDefault()\"\r\n    [selectionRange]=\"workspace.lastModifiedEditablePhraseIndex === index ? workspace.lastSelection : undefined\"\r\n    [class.workspace__template__paper-container__paper__phrase--selected]=\"workspace.lastModifiedEditablePhraseIndex === index\"\r\n    >{{editablePhrase.value}}</span\r\n  >\r\n</ng-container>\r\n", styles: [".editable-phrase{white-space:pre-wrap;outline-color:#1196d8;font-size:13.4px;font-family:Arial;line-height:23px;display:inline;resize:none}.editable-phrase:focus{outline-style:dashed}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { editablePhrases: [{
                type: Input
            }], workspace: [{
                type: Input
            }], editablePhraseChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcGhyYXNlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy93b3Jrc3BhY2UvZWRpdGFibGUtcGhyYXNlL2VkaXRhYmxlLXBocmFzZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvd29ya3NwYWNlL2VkaXRhYmxlLXBocmFzZS9lZGl0YWJsZS1waHJhc2UuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd2RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDaEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDOzs7O0FBT2pGLE1BQU0sT0FBTyx1QkFBdUI7SUFDbEM7UUFJVSwwQkFBcUIsR0FBRyxJQUFJLFlBQVksRUFHOUMsQ0FBQztJQVBVLENBQUM7SUFTVCxrQ0FBa0MsQ0FBQyxDQUFpQixFQUFFLEtBQWE7UUFDeEUsT0FBTztRQUNQLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQixNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBcUIsQ0FBQztRQUN4QyxJQUFJLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0RSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDO1FBQ2xELE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxJQUFJLE1BQWMsQ0FBQztRQUNuQixJQUFJLGtCQUFrQixLQUFLLGlCQUFpQixFQUFFLEVBQUUsbUNBQW1DO1lBQ2pGLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ2QsTUFBTSxFQUFFLG1CQUFtQjtnQkFDM0IsS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsV0FBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLDREQUE0RDtZQUM1RCxNQUFNLEdBQUcsVUFBVSxDQUFDO2dCQUNsQixRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixTQUFTLEVBQUUsaUJBQWlCO2dCQUM1QixHQUFHLEVBQUUsbUJBQW1CO2dCQUN4QixXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUM7U0FDSjtRQUNELHFCQUFxQjtRQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDN0IsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7UUFDSCxnQkFBZ0I7UUFDaEIsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDM0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sd0JBQXdCLENBQUMsQ0FBUSxFQUFFLEtBQWE7UUFDckQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDOztvSEFoRFUsdUJBQXVCO3dHQUF2Qix1QkFBdUIseU5DWnBDLHUwQkFnQkE7MkZESmEsdUJBQXVCO2tCQUxuQyxTQUFTOytCQUNFLDhDQUE4QzswRUFPL0MsZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNJLHFCQUFxQjtzQkFBOUIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgV29ya1NwYWNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2FwcC9pbnRlcmZhY2VzXCI7XHJcbmltcG9ydCB7IEVkaXRhYmxlUGhyYXNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3V0aWxzL2RvY3hQYXJzZXJzL3R5cGVzXCI7XHJcbmltcG9ydCB7IGFkZFN0ciB9IGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9qYXZhc2NyaXB0L2FkZFN0cmluZ1wiO1xyXG5pbXBvcnQgeyByZXBsYWNlU3RyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3V0aWxzL2phdmFzY3JpcHQvcmVwbGFjZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBzZXRDYXJldFBvc2l0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3V0aWxzL2phdmFzY3JpcHQvc2V0Q2FyZXRQb3NpdGlvblwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiZWRpdGFibGUtcGhyYXNlc1tlZGl0YWJsZVBocmFzZXNdW3dvcmtzcGFjZV1cIixcclxuICB0ZW1wbGF0ZVVybDogXCIuL2VkaXRhYmxlLXBocmFzZS5jb21wb25lbnQuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wiLi9lZGl0YWJsZS1waHJhc2UuY29tcG9uZW50Lmxlc3NcIl0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVBocmFzZUNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBASW5wdXQoKSBlZGl0YWJsZVBocmFzZXM6IEVkaXRhYmxlUGhyYXNlW107XHJcbiAgQElucHV0KCkgd29ya3NwYWNlOiBXb3JrU3BhY2U7XHJcbiAgQE91dHB1dCgpIGVkaXRhYmxlUGhyYXNlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e1xyXG4gICAgaW5wdXRFdmVudDogRXZlbnQ7XHJcbiAgICBpbmRleDogbnVtYmVyO1xyXG4gIH0+KCk7XHJcblxyXG4gIHB1YmxpYyBwYXN0ZUNvbnRlbnRXaXRob3V0U3R5bGVzQW5kRW50ZXJzKGU6IENsaXBib2FyZEV2ZW50LCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAvLyB0b2RvXHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICBsZXQgZWRpdGFibGVQaHJhc2VWYWx1ZSA9IGVsZW1lbnQuaW5uZXJUZXh0O1xyXG4gICAgbGV0IHRleHQgPSBlLmNsaXBib2FyZERhdGEuZ2V0RGF0YShcInRleHQvcGxhaW5cIik/LnJlcGxhY2UoL1xcbi9nLCBcIiBcIik7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICBjb25zdCBjYXJldEZpcnN0UG9zaXRpb24gPSBzZWxlY3Rpb24uYW5jaG9yT2Zmc2V0O1xyXG4gICAgY29uc3QgY2FyZXRMYXN0UG9zaXRpb24gPSBzZWxlY3Rpb24uZm9jdXNPZmZzZXQ7XHJcbiAgICBsZXQgbmV3VHh0OiBzdHJpbmc7XHJcbiAgICBpZiAoY2FyZXRGaXJzdFBvc2l0aW9uID09PSBjYXJldExhc3RQb3NpdGlvbikgeyAvLyBpZiBjYXJldCBpcyBpbiB0aGUgc2FtZSBwb3NpdGlvblxyXG4gICAgICBuZXdUeHQgPSBhZGRTdHIoe1xyXG4gICAgICAgIHN0cmluZzogZWRpdGFibGVQaHJhc2VWYWx1ZSxcclxuICAgICAgICBpbmRleDogY2FyZXRGaXJzdFBvc2l0aW9uLFxyXG4gICAgICAgIHN0cmluZ1RvQWRkOiB0ZXh0LFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHJlcGxhY2UgdGV4dCBmcm9tIGNhcmV0Rmlyc3RQb3NpdGlvbiB0byBjYXJldExhc3RQb3NpdGlvblxyXG4gICAgICBuZXdUeHQgPSByZXBsYWNlU3RyKHtcclxuICAgICAgICBmaXJzdFBvczogY2FyZXRGaXJzdFBvc2l0aW9uLFxyXG4gICAgICAgIHNlY29uZFBvczogY2FyZXRMYXN0UG9zaXRpb24sXHJcbiAgICAgICAgc3RyOiBlZGl0YWJsZVBocmFzZVZhbHVlLFxyXG4gICAgICAgIHN0cmluZ1RvQWRkOiB0ZXh0LFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGNyZWF0ZSBpbnB1dCBldmVudFxyXG4gICAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KFwiaW5wdXRcIiwge1xyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICAvLyBzZXQgbmV3IHZhbHVlXHJcbiAgICBlbGVtZW50LmlubmVyVGV4dCA9IG5ld1R4dDtcclxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICBzZXRDYXJldFBvc2l0aW9uKGVsZW1lbnQsIGNhcmV0Rmlyc3RQb3NpdGlvbik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25FZHRpdGFibGVQaHJhc2VDaGFuZ2VkKGU6IEV2ZW50LCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmVkaXRhYmxlUGhyYXNlQ2hhbmdlZC5lbWl0KHsgaW5wdXRFdmVudDogZSwgaW5kZXggfSk7XHJcbiAgfVxyXG59XHJcbiIsIjxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGVkaXRhYmxlUGhyYXNlIG9mIGVkaXRhYmxlUGhyYXNlczsgbGV0IGluZGV4ID0gaW5kZXhcIj5cclxuICA8YnJcclxuICAgICpuZ0lmPVwiZWRpdGFibGVQaHJhc2VzW2luZGV4LTFdICYmIGVkaXRhYmxlUGhyYXNlc1tpbmRleC0xXS5wYXJhZ3JhcGhJbmRleCA8IGVkaXRhYmxlUGhyYXNlLnBhcmFncmFwaEluZGV4XCJcclxuICAvPlxyXG4gIDxzcGFuXHJcbiAgICAqbmdJZj1cImVkaXRhYmxlUGhyYXNlLnZhbHVlICE9PSAnXFxyXFxuJ1wiXHJcbiAgICBjbGFzcz1cImVkaXRhYmxlLXBocmFzZVwiXHJcbiAgICBjb250ZW50RWRpdGFibGU9XCJ0cnVlXCJcclxuICAgIChpbnB1dCk9XCJvbkVkdGl0YWJsZVBocmFzZUNoYW5nZWQoJGV2ZW50LCBpbmRleClcIlxyXG4gICAgKHBhc3RlKT1cInBhc3RlQ29udGVudFdpdGhvdXRTdHlsZXNBbmRFbnRlcnMoJGV2ZW50LCBpbmRleClcIlxyXG4gICAgKGRyYWdvdmVyKT1cIiRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcclxuICAgIFtzZWxlY3Rpb25SYW5nZV09XCJ3b3Jrc3BhY2UubGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleCA9PT0gaW5kZXggPyB3b3Jrc3BhY2UubGFzdFNlbGVjdGlvbiA6IHVuZGVmaW5lZFwiXHJcbiAgICBbY2xhc3Mud29ya3NwYWNlX190ZW1wbGF0ZV9fcGFwZXItY29udGFpbmVyX19wYXBlcl9fcGhyYXNlLS1zZWxlY3RlZF09XCJ3b3Jrc3BhY2UubGFzdE1vZGlmaWVkRWRpdGFibGVQaHJhc2VJbmRleCA9PT0gaW5kZXhcIlxyXG4gICAgPnt7ZWRpdGFibGVQaHJhc2UudmFsdWV9fTwvc3BhblxyXG4gID5cclxuPC9uZy1jb250YWluZXI+XHJcbiJdfQ==