import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
export class EntersToBrPipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(value) {
        // regex \n or \r\n
        const entersRegex = /(\r\n|\n)/gm;
        let result = value.replace(entersRegex, (match) => {
            return `<br/>`;
        });
        return this.sanitizer.bypassSecurityTrustHtml(result);
    }
}
EntersToBrPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EntersToBrPipe, deps: [{ token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Pipe });
EntersToBrPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EntersToBrPipe, name: "entersToBr" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EntersToBrPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'entersToBr'
                }]
        }], ctorParameters: function () { return [{ type: i1.DomSanitizer }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50ZXJzLXRvLWJyLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3BpcGVzL2VudGVycy10by1ici5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOzs7QUFNcEQsTUFBTSxPQUFPLGNBQWM7SUFFekIsWUFBb0IsU0FBdUI7UUFBdkIsY0FBUyxHQUFULFNBQVMsQ0FBYztJQUFFLENBQUM7SUFFOUMsU0FBUyxDQUFDLEtBQWE7UUFFckIsbUJBQW1CO1FBQ25CLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQztRQUVsQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ2hELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELENBQUM7OzJHQWRVLGNBQWM7eUdBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQUgxQixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxZQUFZO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICdlbnRlcnNUb0JyJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRW50ZXJzVG9CclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcil7fVxyXG5cclxuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZyk6IFNhZmVIdG1sIHtcclxuXHJcbiAgICAvLyByZWdleCBcXG4gb3IgXFxyXFxuXHJcbiAgICBjb25zdCBlbnRlcnNSZWdleCA9IC8oXFxyXFxufFxcbikvZ207XHJcbiAgICBcclxuICAgIGxldCByZXN1bHQgPSB2YWx1ZS5yZXBsYWNlKGVudGVyc1JlZ2V4LCAobWF0Y2gpID0+IHtcclxuICAgICAgcmV0dXJuIGA8YnIvPmA7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwocmVzdWx0KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==