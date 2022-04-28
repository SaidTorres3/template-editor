import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { isObject } from './pipes/isObject.pipe';
import { TreeNodeComponent } from './components/workspace/data/tree-node/tree-node.component';
import { HasThesePropsPipe } from './pipes/has-these-props.pipe';
import { DoesStringRepresentPrimitivePipe } from './pipes/does-string-represent-primitive.pipe';
import { EntersToBrPipe } from './pipes/enters-to-br.pipe';
import { ViewablePhraseComponent } from './components/workspace/viewable-phrase/viewable-phrase.component';
import { IsArrayPipe } from './pipes/is-array.pipe';
import { FocusDirective } from './directives/focus.directive';
import { EditablePhraseComponent } from './components/workspace/editable-phrase/editable-phrase.component';
import { DataComponent } from './components/workspace/data/data.component';
import { HeaderComponent } from './components/header/header.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { FooterComponent } from './components/footer/footer.component';
import { SelectionRangeDirective } from './directives/selection-range.directive';
import { CheckVariableExistenceDirective } from './directives/check-variable-existence.directive';
import { VariableExistPipe } from './pipes/variable-exist.pipe';
import { VariableCheckerComponent } from './components/workspace/viewable-phrase/variable-checker/variable-checker.component';
import * as i0 from "@angular/core";
export class AppModule {
}
AppModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AppModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppModule, bootstrap: [AppComponent], declarations: [AppComponent,
        isObject,
        TreeNodeComponent,
        HasThesePropsPipe,
        DoesStringRepresentPrimitivePipe,
        EntersToBrPipe,
        ViewablePhraseComponent,
        IsArrayPipe,
        FocusDirective,
        EditablePhraseComponent,
        DataComponent,
        HeaderComponent,
        WorkspaceComponent,
        FooterComponent,
        SelectionRangeDirective,
        CheckVariableExistenceDirective,
        VariableExistPipe,
        VariableCheckerComponent], imports: [BrowserModule], exports: [AppComponent] });
AppModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppModule, providers: [], imports: [[
            BrowserModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        AppComponent,
                        isObject,
                        TreeNodeComponent,
                        HasThesePropsPipe,
                        DoesStringRepresentPrimitivePipe,
                        EntersToBrPipe,
                        ViewablePhraseComponent,
                        IsArrayPipe,
                        FocusDirective,
                        EditablePhraseComponent,
                        DataComponent,
                        HeaderComponent,
                        WorkspaceComponent,
                        FooterComponent,
                        SelectionRangeDirective,
                        CheckVariableExistenceDirective,
                        VariableExistPipe,
                        VariableCheckerComponent
                    ],
                    imports: [
                        BrowserModule
                    ],
                    providers: [],
                    exports: [
                        AppComponent
                    ],
                    bootstrap: [AppComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUMzRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzNHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLG9GQUFvRixDQUFDOztBQWdDOUgsTUFBTSxPQUFPLFNBQVM7O3NHQUFULFNBQVM7dUdBQVQsU0FBUyxjQUZSLFlBQVksa0JBMUJ0QixZQUFZO1FBQ1osUUFBUTtRQUNSLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsZ0NBQWdDO1FBQ2hDLGNBQWM7UUFDZCx1QkFBdUI7UUFDdkIsV0FBVztRQUNYLGNBQWM7UUFDZCx1QkFBdUI7UUFDdkIsYUFBYTtRQUNiLGVBQWU7UUFDZixrQkFBa0I7UUFDbEIsZUFBZTtRQUNmLHVCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsaUJBQWlCO1FBQ2pCLHdCQUF3QixhQUd4QixhQUFhLGFBSWIsWUFBWTt1R0FJSCxTQUFTLGFBTlQsRUFBRSxZQUhKO1lBQ1AsYUFBYTtTQUNkOzJGQU9VLFNBQVM7a0JBOUJyQixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWixZQUFZO3dCQUNaLFFBQVE7d0JBQ1IsaUJBQWlCO3dCQUNqQixpQkFBaUI7d0JBQ2pCLGdDQUFnQzt3QkFDaEMsY0FBYzt3QkFDZCx1QkFBdUI7d0JBQ3ZCLFdBQVc7d0JBQ1gsY0FBYzt3QkFDZCx1QkFBdUI7d0JBQ3ZCLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixrQkFBa0I7d0JBQ2xCLGVBQWU7d0JBQ2YsdUJBQXVCO3dCQUN2QiwrQkFBK0I7d0JBQy9CLGlCQUFpQjt3QkFDakIsd0JBQXdCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsYUFBYTtxQkFDZDtvQkFDRCxTQUFTLEVBQUUsRUFBRTtvQkFDYixPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4vcGlwZXMvaXNPYmplY3QucGlwZSc7XHJcbmltcG9ydCB7IFRyZWVOb2RlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3dvcmtzcGFjZS9kYXRhL3RyZWUtbm9kZS90cmVlLW5vZGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSGFzVGhlc2VQcm9wc1BpcGUgfSBmcm9tICcuL3BpcGVzL2hhcy10aGVzZS1wcm9wcy5waXBlJztcclxuaW1wb3J0IHsgRG9lc1N0cmluZ1JlcHJlc2VudFByaW1pdGl2ZVBpcGUgfSBmcm9tICcuL3BpcGVzL2RvZXMtc3RyaW5nLXJlcHJlc2VudC1wcmltaXRpdmUucGlwZSc7XHJcbmltcG9ydCB7IEVudGVyc1RvQnJQaXBlIH0gZnJvbSAnLi9waXBlcy9lbnRlcnMtdG8tYnIucGlwZSc7XHJcbmltcG9ydCB7IFZpZXdhYmxlUGhyYXNlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3dvcmtzcGFjZS92aWV3YWJsZS1waHJhc2Uvdmlld2FibGUtcGhyYXNlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IElzQXJyYXlQaXBlIH0gZnJvbSAnLi9waXBlcy9pcy1hcnJheS5waXBlJztcclxuaW1wb3J0IHsgRm9jdXNEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZm9jdXMuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgRWRpdGFibGVQaHJhc2VDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvd29ya3NwYWNlL2VkaXRhYmxlLXBocmFzZS9lZGl0YWJsZS1waHJhc2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGF0YUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy93b3Jrc3BhY2UvZGF0YS9kYXRhLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFdvcmtzcGFjZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy93b3Jrc3BhY2Uvd29ya3NwYWNlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEZvb3RlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNlbGVjdGlvblJhbmdlRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3NlbGVjdGlvbi1yYW5nZS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBDaGVja1ZhcmlhYmxlRXhpc3RlbmNlRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2NoZWNrLXZhcmlhYmxlLWV4aXN0ZW5jZS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBWYXJpYWJsZUV4aXN0UGlwZSB9IGZyb20gJy4vcGlwZXMvdmFyaWFibGUtZXhpc3QucGlwZSc7XHJcbmltcG9ydCB7IFZhcmlhYmxlQ2hlY2tlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy93b3Jrc3BhY2Uvdmlld2FibGUtcGhyYXNlL3ZhcmlhYmxlLWNoZWNrZXIvdmFyaWFibGUtY2hlY2tlci5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEFwcENvbXBvbmVudCxcclxuICAgIGlzT2JqZWN0LFxyXG4gICAgVHJlZU5vZGVDb21wb25lbnQsXHJcbiAgICBIYXNUaGVzZVByb3BzUGlwZSxcclxuICAgIERvZXNTdHJpbmdSZXByZXNlbnRQcmltaXRpdmVQaXBlLFxyXG4gICAgRW50ZXJzVG9CclBpcGUsXHJcbiAgICBWaWV3YWJsZVBocmFzZUNvbXBvbmVudCxcclxuICAgIElzQXJyYXlQaXBlLFxyXG4gICAgRm9jdXNEaXJlY3RpdmUsXHJcbiAgICBFZGl0YWJsZVBocmFzZUNvbXBvbmVudCxcclxuICAgIERhdGFDb21wb25lbnQsXHJcbiAgICBIZWFkZXJDb21wb25lbnQsXHJcbiAgICBXb3Jrc3BhY2VDb21wb25lbnQsXHJcbiAgICBGb290ZXJDb21wb25lbnQsXHJcbiAgICBTZWxlY3Rpb25SYW5nZURpcmVjdGl2ZSxcclxuICAgIENoZWNrVmFyaWFibGVFeGlzdGVuY2VEaXJlY3RpdmUsXHJcbiAgICBWYXJpYWJsZUV4aXN0UGlwZSxcclxuICAgIFZhcmlhYmxlQ2hlY2tlckNvbXBvbmVudFxyXG4gIF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgQnJvd3Nlck1vZHVsZVxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBBcHBDb21wb25lbnRcclxuICBdLFxyXG4gIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cclxuIl19