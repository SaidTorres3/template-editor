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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9kaXJlY3RpdmVzL2ZvY3VzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUtyRSxNQUFNLE9BQU8sY0FBYztJQUV6QixZQUF3QyxPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO0lBQUksQ0FBQztJQUN0RCxXQUFXO1FBQ25CLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBNEIsQ0FBQTtZQUN6RCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDaEIsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDakU7SUFDSCxDQUFDOzsyR0FUVSxjQUFjLGtCQUVMLFVBQVU7K0ZBRm5CLGNBQWM7MkZBQWQsY0FBYztrQkFIMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsU0FBUztpQkFDcEI7OzBCQUdjLE1BQU07MkJBQUMsVUFBVTs0Q0FEckIsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tmb2N1c10nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGb2N1c0RpcmVjdGl2ZSB7XHJcbiAgQElucHV0KCkgZm9jdXM6IGJvb2xlYW47XHJcbiAgY29uc3RydWN0b3IoQEluamVjdChFbGVtZW50UmVmKSBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHsgfVxyXG4gIHByb3RlY3RlZCBuZ09uQ2hhbmdlcygpIHtcclxuICAgIGlmICh0aGlzLmZvY3VzKSB7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudFxyXG4gICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJyB9KTtcclxuICAgIH1cclxuICB9XHJcbn0iXX0=