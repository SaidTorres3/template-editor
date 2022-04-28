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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtZXhpc3QucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvcGlwZXMvdmFyaWFibGUtZXhpc3QucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx1REFBdUQsQ0FBQzs7QUFNbkcsTUFBTSxPQUFPLGlCQUFpQjtJQUU1QixxRUFBcUU7SUFDckUsU0FBUyxDQUFDLElBQVMsRUFBRSxNQUFXO1FBQzlCLE9BQU8sMEJBQTBCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7OzhHQUxVLGlCQUFpQjs0R0FBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBSDdCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGVBQWU7aUJBQ3RCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgc3RyaW5nVG9Jc1ZhcmlhYmxlQW5kRXhpc3QgfSBmcm9tICcuLi8uLi91dGlscy9waHJhc2VzUGFyc2Vycy9zdHJpbmdUb0lzVmFyaWFibGVBbmRFeGlzdCc7XG5pbXBvcnQgeyBpc1ZhcmlhYmxlQW5kRXhpc3QgfSBmcm9tICcuLi8uLi91dGlscy9waHJhc2VzUGFyc2Vycy90eXBlcyc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ3ZhcmlhYmxlRXhpc3QnXG59KVxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlRXhpc3RQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgLy8gdGV4dCB3YXMgdHlwZWQgYXMgc3RyaW5nLCBidXQgcGFja2FnciBjb21waWxlciBjYW4ndCB1bmRlcnN0YW5kIGl0XG4gIHRyYW5zZm9ybSh0ZXh0OiBhbnksIG9iamVjdDogYW55KTogaXNWYXJpYWJsZUFuZEV4aXN0W10ge1xuICAgIHJldHVybiBzdHJpbmdUb0lzVmFyaWFibGVBbmRFeGlzdCh0ZXh0LCBvYmplY3QpO1xuICB9XG5cbn1cbiJdfQ==