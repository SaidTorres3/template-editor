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
import { CommonModule } from '@angular/common';
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
        VariableCheckerComponent], imports: [CommonModule], exports: [AppComponent] });
AppModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppModule, providers: [], imports: [[
            CommonModule
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
                        VariableCheckerComponent,
                    ],
                    imports: [
                        CommonModule
                    ],
                    providers: [],
                    exports: [
                        AppComponent
                    ],
                    bootstrap: [AppComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDakQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDOUYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDakUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDaEcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzNHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDM0csT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNoRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDakYsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDbEcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDaEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFDOUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQWdDL0MsTUFBTSxPQUFPLFNBQVM7O3NHQUFULFNBQVM7dUdBQVQsU0FBUyxjQUZSLFlBQVksa0JBMUJ0QixZQUFZO1FBQ1osUUFBUTtRQUNSLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsZ0NBQWdDO1FBQ2hDLGNBQWM7UUFDZCx1QkFBdUI7UUFDdkIsV0FBVztRQUNYLGNBQWM7UUFDZCx1QkFBdUI7UUFDdkIsYUFBYTtRQUNiLGVBQWU7UUFDZixrQkFBa0I7UUFDbEIsZUFBZTtRQUNmLHVCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsaUJBQWlCO1FBQ2pCLHdCQUF3QixhQUd4QixZQUFZLGFBSVosWUFBWTt1R0FJSCxTQUFTLGFBTlQsRUFBRSxZQUhKO1lBQ1AsWUFBWTtTQUNiOzJGQU9VLFNBQVM7a0JBOUJyQixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWixZQUFZO3dCQUNaLFFBQVE7d0JBQ1IsaUJBQWlCO3dCQUNqQixpQkFBaUI7d0JBQ2pCLGdDQUFnQzt3QkFDaEMsY0FBYzt3QkFDZCx1QkFBdUI7d0JBQ3ZCLFdBQVc7d0JBQ1gsY0FBYzt3QkFDZCx1QkFBdUI7d0JBQ3ZCLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixrQkFBa0I7d0JBQ2xCLGVBQWU7d0JBQ2YsdUJBQXVCO3dCQUN2QiwrQkFBK0I7d0JBQy9CLGlCQUFpQjt3QkFDakIsd0JBQXdCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxTQUFTLEVBQUUsRUFBRTtvQkFDYixPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL3BpcGVzL2lzT2JqZWN0LnBpcGUnO1xyXG5pbXBvcnQgeyBUcmVlTm9kZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy93b3Jrc3BhY2UvZGF0YS90cmVlLW5vZGUvdHJlZS1ub2RlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEhhc1RoZXNlUHJvcHNQaXBlIH0gZnJvbSAnLi9waXBlcy9oYXMtdGhlc2UtcHJvcHMucGlwZSc7XHJcbmltcG9ydCB7IERvZXNTdHJpbmdSZXByZXNlbnRQcmltaXRpdmVQaXBlIH0gZnJvbSAnLi9waXBlcy9kb2VzLXN0cmluZy1yZXByZXNlbnQtcHJpbWl0aXZlLnBpcGUnO1xyXG5pbXBvcnQgeyBFbnRlcnNUb0JyUGlwZSB9IGZyb20gJy4vcGlwZXMvZW50ZXJzLXRvLWJyLnBpcGUnO1xyXG5pbXBvcnQgeyBWaWV3YWJsZVBocmFzZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy93b3Jrc3BhY2Uvdmlld2FibGUtcGhyYXNlL3ZpZXdhYmxlLXBocmFzZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBJc0FycmF5UGlwZSB9IGZyb20gJy4vcGlwZXMvaXMtYXJyYXkucGlwZSc7XHJcbmltcG9ydCB7IEZvY3VzRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2ZvY3VzLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEVkaXRhYmxlUGhyYXNlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3dvcmtzcGFjZS9lZGl0YWJsZS1waHJhc2UvZWRpdGFibGUtcGhyYXNlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERhdGFDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvd29ya3NwYWNlL2RhdGEvZGF0YS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBXb3Jrc3BhY2VDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvd29ya3NwYWNlL3dvcmtzcGFjZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBGb290ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25SYW5nZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3Rpb24tcmFuZ2UuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgQ2hlY2tWYXJpYWJsZUV4aXN0ZW5jZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9jaGVjay12YXJpYWJsZS1leGlzdGVuY2UuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgVmFyaWFibGVFeGlzdFBpcGUgfSBmcm9tICcuL3BpcGVzL3ZhcmlhYmxlLWV4aXN0LnBpcGUnO1xyXG5pbXBvcnQgeyBWYXJpYWJsZUNoZWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvd29ya3NwYWNlL3ZpZXdhYmxlLXBocmFzZS92YXJpYWJsZS1jaGVja2VyL3ZhcmlhYmxlLWNoZWNrZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBBcHBDb21wb25lbnQsXHJcbiAgICBpc09iamVjdCxcclxuICAgIFRyZWVOb2RlQ29tcG9uZW50LFxyXG4gICAgSGFzVGhlc2VQcm9wc1BpcGUsXHJcbiAgICBEb2VzU3RyaW5nUmVwcmVzZW50UHJpbWl0aXZlUGlwZSxcclxuICAgIEVudGVyc1RvQnJQaXBlLFxyXG4gICAgVmlld2FibGVQaHJhc2VDb21wb25lbnQsXHJcbiAgICBJc0FycmF5UGlwZSxcclxuICAgIEZvY3VzRGlyZWN0aXZlLFxyXG4gICAgRWRpdGFibGVQaHJhc2VDb21wb25lbnQsXHJcbiAgICBEYXRhQ29tcG9uZW50LFxyXG4gICAgSGVhZGVyQ29tcG9uZW50LFxyXG4gICAgV29ya3NwYWNlQ29tcG9uZW50LFxyXG4gICAgRm9vdGVyQ29tcG9uZW50LFxyXG4gICAgU2VsZWN0aW9uUmFuZ2VEaXJlY3RpdmUsXHJcbiAgICBDaGVja1ZhcmlhYmxlRXhpc3RlbmNlRGlyZWN0aXZlLFxyXG4gICAgVmFyaWFibGVFeGlzdFBpcGUsXHJcbiAgICBWYXJpYWJsZUNoZWNrZXJDb21wb25lbnQsXHJcbiAgXSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGVcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW10sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgQXBwQ29tcG9uZW50XHJcbiAgXSxcclxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUgeyB9XHJcbiJdfQ==