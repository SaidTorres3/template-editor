import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class HasThesePropsPipe {
    transform(value, ...args) {
        if (typeof value !== 'object')
            return false;
        const props = Object.keys(value);
        const answersStorage = {};
        for (const prop of args) {
            if (props.includes(prop)) {
                answersStorage[prop] = value[prop];
            }
        }
        const isTrue = Object.keys(answersStorage).length === args.length;
        // debugger;
        return isTrue;
    }
}
HasThesePropsPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HasThesePropsPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
HasThesePropsPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HasThesePropsPipe, name: "hasTheseProps" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HasThesePropsPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'hasTheseProps'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzLXRoZXNlLXByb3BzLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3BpcGVzL2hhcy10aGVzZS1wcm9wcy5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQUtwRCxNQUFNLE9BQU8saUJBQWlCO0lBRTVCLFNBQVMsQ0FBQyxLQUFVLEVBQUUsR0FBRyxJQUFjO1FBQ3JDLElBQUcsT0FBTyxLQUFLLEtBQUssUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzNDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBRTFCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ3ZCLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEIsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUNuQztTQUNGO1FBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUNqRSxZQUFZO1FBQ1osT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7OEdBZlUsaUJBQWlCOzRHQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFIN0IsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsZUFBZTtpQkFDdEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ2hhc1RoZXNlUHJvcHMnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIYXNUaGVzZVByb3BzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgLi4uYXJnczogc3RyaW5nW10pOiBib29sZWFuIHtcclxuICAgIGlmKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXModmFsdWUpXHJcbiAgICBjb25zdCBhbnN3ZXJzU3RvcmFnZSA9IHt9O1xyXG4gICAgXHJcbiAgICBmb3IgKGNvbnN0IHByb3Agb2YgYXJncykge1xyXG4gICAgICBpZiAocHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcclxuICAgICAgICBhbnN3ZXJzU3RvcmFnZVtwcm9wXSA9IHZhbHVlW3Byb3BdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGlzVHJ1ZSA9IE9iamVjdC5rZXlzKGFuc3dlcnNTdG9yYWdlKS5sZW5ndGggPT09IGFyZ3MubGVuZ3RoXHJcbiAgICAvLyBkZWJ1Z2dlcjtcclxuICAgIHJldHVybiBpc1RydWU7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=