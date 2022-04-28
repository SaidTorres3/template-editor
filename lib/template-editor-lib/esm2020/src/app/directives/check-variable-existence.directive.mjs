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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stdmFyaWFibGUtZXhpc3RlbmNlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvZGlyZWN0aXZlcy9jaGVjay12YXJpYWJsZS1leGlzdGVuY2UuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQzs7QUFLdkIsTUFBTSxPQUFPLCtCQUErQjtJQUMxQyxZQUF3QyxPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO0lBQUcsQ0FBQztJQUMvRCxlQUFlO1FBQ2IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUE0QixDQUFDO1FBQzFELE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQzNDLHVCQUF1QixFQUN2QixDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ1gsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLDJDQUEyQyxRQUFRLFNBQVMsQ0FBQzthQUNyRTtZQUNELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQzs7NEhBYlUsK0JBQStCLGtCQUN0QixVQUFVO2dIQURuQiwrQkFBK0I7MkZBQS9CLCtCQUErQjtrQkFIM0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2lCQUN2Qzs7MEJBRWMsTUFBTTsyQkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIERpcmVjdGl2ZSxcclxuICBFbGVtZW50UmVmLFxyXG4gIEluamVjdCxcclxuICBJbnB1dCxcclxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6IFwiW2NoZWNrLXZhcmlhYmxlLWV4aXN0ZW5jZV1cIixcclxufSlcclxuZXhwb3J0IGNsYXNzIENoZWNrVmFyaWFibGVFeGlzdGVuY2VEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZikge31cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MLnJlcGxhY2UoXHJcbiAgICAgIC8oW14oe1xcc10rXFwuW159KVxcc10rKS9nLFxyXG4gICAgICAodmFyaWFibGUpID0+IHtcclxuICAgICAgICBpZiAodmFyaWFibGUuaW5kZXhPZihcIi5cIikgPT09IC0xKSB7XHJcbiAgICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidmFyaWFibGUtbm90LWZvdW5kXCI+VEVTVElORyR7dmFyaWFibGV9PC9zcGFuPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YXJpYWJsZTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19