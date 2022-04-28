import { Directive, ElementRef, Inject, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class FocusDirective {
    constructor(element) {
        this.element = element;
    }
    ngOnChanges() {
        if (this.focus) {
            const element = this.element.nativeElement;
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}
FocusDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: FocusDirective, deps: [{ token: ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
FocusDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: FocusDirective, selector: "[focus]", inputs: { focus: "focus" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: FocusDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[focus]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef, decorators: [{
                    type: Inject,
                    args: [ElementRef]
                }] }]; }, propDecorators: { focus: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9kaXJlY3RpdmVzL2ZvY3VzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUtyRSxNQUFNLE9BQU8sY0FBYztJQUV6QixZQUF3QyxPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO0lBQUksQ0FBQztJQUN0RCxXQUFXO1FBQ25CLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBNEIsQ0FBQTtZQUN6RCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDaEIsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDakU7SUFDSCxDQUFDOzsyR0FUVSxjQUFjLGtCQUVMLFVBQVU7K0ZBRm5CLGNBQWM7MkZBQWQsY0FBYztrQkFIMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsU0FBUztpQkFDcEI7OzBCQUdjLE1BQU07MkJBQUMsVUFBVTs0Q0FEckIsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tmb2N1c10nXG59KVxuZXhwb3J0IGNsYXNzIEZvY3VzRGlyZWN0aXZlIHtcbiAgQElucHV0KCkgZm9jdXM6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRWxlbWVudFJlZikgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmKSB7IH1cbiAgcHJvdGVjdGVkIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmZvY3VzKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJyB9KTtcbiAgICB9XG4gIH1cbn0iXX0=