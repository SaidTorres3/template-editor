import { Pipe } from '@angular/core';
import { stringToIsVariableAndExist } from '../../utils/phrasesParsers/stringToIsVariableAndExist';
import * as i0 from "@angular/core";
export class VariableExistPipe {
    // text was typed as string, but packagr compiler can't understand it
    transform(text, object) {
        return stringToIsVariableAndExist(text, object);
    }
}
VariableExistPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableExistPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
VariableExistPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableExistPipe, name: "variableExist" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableExistPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'variableExist'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtZXhpc3QucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvcGlwZXMvdmFyaWFibGUtZXhpc3QucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx1REFBdUQsQ0FBQzs7QUFNbkcsTUFBTSxPQUFPLGlCQUFpQjtJQUU1QixxRUFBcUU7SUFDckUsU0FBUyxDQUFDLElBQVMsRUFBRSxNQUFXO1FBQzlCLE9BQU8sMEJBQTBCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7OzhHQUxVLGlCQUFpQjs0R0FBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBSDdCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGVBQWU7aUJBQ3RCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBzdHJpbmdUb0lzVmFyaWFibGVBbmRFeGlzdCB9IGZyb20gJy4uLy4uL3V0aWxzL3BocmFzZXNQYXJzZXJzL3N0cmluZ1RvSXNWYXJpYWJsZUFuZEV4aXN0JztcclxuaW1wb3J0IHsgaXNWYXJpYWJsZUFuZEV4aXN0IH0gZnJvbSAnLi4vLi4vdXRpbHMvcGhyYXNlc1BhcnNlcnMvdHlwZXMnO1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICd2YXJpYWJsZUV4aXN0J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVmFyaWFibGVFeGlzdFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuXHJcbiAgLy8gdGV4dCB3YXMgdHlwZWQgYXMgc3RyaW5nLCBidXQgcGFja2FnciBjb21waWxlciBjYW4ndCB1bmRlcnN0YW5kIGl0XHJcbiAgdHJhbnNmb3JtKHRleHQ6IGFueSwgb2JqZWN0OiBhbnkpOiBpc1ZhcmlhYmxlQW5kRXhpc3RbXSB7XHJcbiAgICByZXR1cm4gc3RyaW5nVG9Jc1ZhcmlhYmxlQW5kRXhpc3QodGV4dCwgb2JqZWN0KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==