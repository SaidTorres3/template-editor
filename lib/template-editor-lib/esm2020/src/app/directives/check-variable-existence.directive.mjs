import { Directive, ElementRef, Inject, } from "@angular/core";
import * as i0 from "@angular/core";
export class CheckVariableExistenceDirective {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        const element = this.element.nativeElement;
        element.innerHTML = element.innerHTML.replace(/([^({\s]+\.[^})\s]+)/g, (variable) => {
            if (variable.indexOf(".") === -1) {
                return `<span class="variable-not-found">TESTING${variable}</span>`;
            }
            return variable;
        });
    }
}
CheckVariableExistenceDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: CheckVariableExistenceDirective, deps: [{ token: ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
CheckVariableExistenceDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: CheckVariableExistenceDirective, selector: "[check-variable-existence]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: CheckVariableExistenceDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[check-variable-existence]",
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef, decorators: [{
                    type: Inject,
                    args: [ElementRef]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stdmFyaWFibGUtZXhpc3RlbmNlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvZGlyZWN0aXZlcy9jaGVjay12YXJpYWJsZS1leGlzdGVuY2UuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQzs7QUFLdkIsTUFBTSxPQUFPLCtCQUErQjtJQUMxQyxZQUF3QyxPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO0lBQUcsQ0FBQztJQUMvRCxlQUFlO1FBQ2IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUE0QixDQUFDO1FBQzFELE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQzNDLHVCQUF1QixFQUN2QixDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ1gsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLDJDQUEyQyxRQUFRLFNBQVMsQ0FBQzthQUNyRTtZQUNELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQzs7NEhBYlUsK0JBQStCLGtCQUN0QixVQUFVO2dIQURuQiwrQkFBK0I7MkZBQS9CLCtCQUErQjtrQkFIM0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2lCQUN2Qzs7MEJBRWMsTUFBTTsyQkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IFwiW2NoZWNrLXZhcmlhYmxlLWV4aXN0ZW5jZV1cIixcbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tWYXJpYWJsZUV4aXN0ZW5jZURpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZikge31cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MLnJlcGxhY2UoXG4gICAgICAvKFteKHtcXHNdK1xcLltefSlcXHNdKykvZyxcbiAgICAgICh2YXJpYWJsZSkgPT4ge1xuICAgICAgICBpZiAodmFyaWFibGUuaW5kZXhPZihcIi5cIikgPT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInZhcmlhYmxlLW5vdC1mb3VuZFwiPlRFU1RJTkcke3ZhcmlhYmxlfTwvc3Bhbj5gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YXJpYWJsZTtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=