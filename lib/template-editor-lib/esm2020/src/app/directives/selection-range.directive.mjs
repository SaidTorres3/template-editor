import { Directive, ElementRef, Inject, Input, } from "@angular/core";
import { setCaretPosition } from "../../utils/javascript/setCaretPosition";
import * as i0 from "@angular/core";
export class SelectionRangeDirective {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        if (this.selectionRange) {
            const targetElement = this.element.nativeElement;
            // set caret position at the selection range start
            setCaretPosition(targetElement, this.selectionRange.start);
        }
    }
    ngOnChanges() {
        if (this.selectionRange) {
            const targetElement = this.element.nativeElement;
            // set caret position at the selection range start
            setCaretPosition(targetElement, this.selectionRange.start);
        }
    }
}
SelectionRangeDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: SelectionRangeDirective, deps: [{ token: ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
SelectionRangeDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: SelectionRangeDirective, selector: "[selectionRange]", inputs: { selectionRange: "selectionRange" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: SelectionRangeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[selectionRange]",
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef, decorators: [{
                    type: Inject,
                    args: [ElementRef]
                }] }]; }, propDecorators: { selectionRange: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLXJhbmdlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvZGlyZWN0aXZlcy9zZWxlY3Rpb24tcmFuZ2UuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEdBRU4sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0seUNBQXlDLENBQUM7O0FBTTNFLE1BQU0sT0FBTyx1QkFBdUI7SUFFbEMsWUFBd0MsT0FBbUI7UUFBbkIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtJQUFHLENBQUM7SUFDL0QsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQTRCLENBQUM7WUFDaEUsa0RBQWtEO1lBQ2xELGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUE0QixDQUFDO1lBQ2hFLGtEQUFrRDtZQUNsRCxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7O29IQWpCVSx1QkFBdUIsa0JBRWQsVUFBVTt3R0FGbkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBSG5DLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtpQkFDN0I7OzBCQUdjLE1BQU07MkJBQUMsVUFBVTs0Q0FEckIsY0FBYztzQkFBdEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBEaXJlY3RpdmUsXHJcbiAgRWxlbWVudFJlZixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IHNldENhcmV0UG9zaXRpb24gfSBmcm9tIFwiLi4vLi4vdXRpbHMvamF2YXNjcmlwdC9zZXRDYXJldFBvc2l0aW9uXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvblJhbmdlIH0gZnJvbSBcIi4uL2ludGVyZmFjZXNcIjtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiBcIltzZWxlY3Rpb25SYW5nZV1cIixcclxufSlcclxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvblJhbmdlRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBzZWxlY3Rpb25SYW5nZTogU2VsZWN0aW9uUmFuZ2U7XHJcbiAgY29uc3RydWN0b3IoQEluamVjdChFbGVtZW50UmVmKSBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcclxuICAgICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAvLyBzZXQgY2FyZXQgcG9zaXRpb24gYXQgdGhlIHNlbGVjdGlvbiByYW5nZSBzdGFydFxyXG4gICAgICBzZXRDYXJldFBvc2l0aW9uKHRhcmdldEVsZW1lbnQsIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25SYW5nZSkge1xyXG4gICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgIC8vIHNldCBjYXJldCBwb3NpdGlvbiBhdCB0aGUgc2VsZWN0aW9uIHJhbmdlIHN0YXJ0XHJcbiAgICAgIHNldENhcmV0UG9zaXRpb24odGFyZ2V0RWxlbWVudCwgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==