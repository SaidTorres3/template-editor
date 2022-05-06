import { NgModule } from '@angular/core';
import { AppComponent } from './template-editor.component';
import { isObject } from '../pipes/isObject.pipe';
import { TreeNodeComponent } from '../components/workspace/data/tree-node/tree-node.component';
import { HasThesePropsPipe } from '../pipes/has-these-props.pipe';
import { DoesStringRepresentPrimitivePipe } from '../pipes/does-string-represent-primitive.pipe';
import { EntersToBrPipe } from '../pipes/enters-to-br.pipe';
import { ViewablePhraseComponent } from '../components/workspace/viewable-phrase/viewable-phrase.component';
import { IsArrayPipe } from '../pipes/is-array.pipe';
import { FocusDirective } from '../directives/focus.directive';
import { EditablePhraseComponent } from '../components/workspace/editable-phrase/editable-phrase.component';
import { DataComponent } from '../components/workspace/data/data.component';
import { HeaderComponent } from '../components/header/header.component';
import { WorkspaceComponent } from '../components/workspace/workspace.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SelectionRangeDirective } from '../directives/selection-range.directive';
import { CheckVariableExistenceDirective } from '../directives/check-variable-existence.directive';
import { VariableExistPipe } from '../pipes/variable-exist.pipe';
import { VariableCheckerComponent } from '../components/workspace/viewable-phrase/variable-checker/variable-checker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class TemplateEditorModule {
}
TemplateEditorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TemplateEditorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, bootstrap: [AppComponent], declarations: [AppComponent,
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
        VariableCheckerComponent], imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule], exports: [AppComponent] });
TemplateEditorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, providers: [], imports: [[
            CommonModule,
            ReactiveFormsModule,
            FormsModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, decorators: [{
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
                        CommonModule,
                        ReactiveFormsModule,
                        FormsModule
                    ],
                    providers: [],
                    exports: [
                        AppComponent
                    ],
                    bootstrap: [AppComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUtZWRpdG9yLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvdGVtcGxhdGUtZWRpdG9yL3RlbXBsYXRlLWVkaXRvci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDM0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQy9GLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtRUFBbUUsQ0FBQztBQUM1RyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQy9ELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG1FQUFtRSxDQUFDO0FBQzVHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDakYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ25HLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHFGQUFxRixDQUFDO0FBQy9ILE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBa0MvQyxNQUFNLE9BQU8sb0JBQW9COztpSEFBcEIsb0JBQW9CO2tIQUFwQixvQkFBb0IsY0FGbkIsWUFBWSxrQkE1QnRCLFlBQVk7UUFDWixRQUFRO1FBQ1IsaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQixnQ0FBZ0M7UUFDaEMsY0FBYztRQUNkLHVCQUF1QjtRQUN2QixXQUFXO1FBQ1gsY0FBYztRQUNkLHVCQUF1QjtRQUN2QixhQUFhO1FBQ2IsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQixlQUFlO1FBQ2YsdUJBQXVCO1FBQ3ZCLCtCQUErQjtRQUMvQixpQkFBaUI7UUFDakIsd0JBQXdCLGFBR3hCLFlBQVk7UUFDWixtQkFBbUI7UUFDbkIsV0FBVyxhQUlYLFlBQVk7a0hBSUgsb0JBQW9CLGFBTnBCLEVBQUUsWUFMSjtZQUNQLFlBQVk7WUFDWixtQkFBbUI7WUFDbkIsV0FBVztTQUNaOzJGQU9VLG9CQUFvQjtrQkFoQ2hDLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLFlBQVk7d0JBQ1osUUFBUTt3QkFDUixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIsZ0NBQWdDO3dCQUNoQyxjQUFjO3dCQUNkLHVCQUF1Qjt3QkFDdkIsV0FBVzt3QkFDWCxjQUFjO3dCQUNkLHVCQUF1Qjt3QkFDdkIsYUFBYTt3QkFDYixlQUFlO3dCQUNmLGtCQUFrQjt3QkFDbEIsZUFBZTt3QkFDZix1QkFBdUI7d0JBQ3ZCLCtCQUErQjt3QkFDL0IsaUJBQWlCO3dCQUNqQix3QkFBd0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLG1CQUFtQjt3QkFDbkIsV0FBVztxQkFDWjtvQkFDRCxTQUFTLEVBQUUsRUFBRTtvQkFDYixPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi90ZW1wbGF0ZS1lZGl0b3IuY29tcG9uZW50JztcclxuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuLi9waXBlcy9pc09iamVjdC5waXBlJztcclxuaW1wb3J0IHsgVHJlZU5vZGVDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL3dvcmtzcGFjZS9kYXRhL3RyZWUtbm9kZS90cmVlLW5vZGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSGFzVGhlc2VQcm9wc1BpcGUgfSBmcm9tICcuLi9waXBlcy9oYXMtdGhlc2UtcHJvcHMucGlwZSc7XHJcbmltcG9ydCB7IERvZXNTdHJpbmdSZXByZXNlbnRQcmltaXRpdmVQaXBlIH0gZnJvbSAnLi4vcGlwZXMvZG9lcy1zdHJpbmctcmVwcmVzZW50LXByaW1pdGl2ZS5waXBlJztcclxuaW1wb3J0IHsgRW50ZXJzVG9CclBpcGUgfSBmcm9tICcuLi9waXBlcy9lbnRlcnMtdG8tYnIucGlwZSc7XHJcbmltcG9ydCB7IFZpZXdhYmxlUGhyYXNlQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy93b3Jrc3BhY2Uvdmlld2FibGUtcGhyYXNlL3ZpZXdhYmxlLXBocmFzZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBJc0FycmF5UGlwZSB9IGZyb20gJy4uL3BpcGVzL2lzLWFycmF5LnBpcGUnO1xyXG5pbXBvcnQgeyBGb2N1c0RpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvZm9jdXMuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgRWRpdGFibGVQaHJhc2VDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL3dvcmtzcGFjZS9lZGl0YWJsZS1waHJhc2UvZWRpdGFibGUtcGhyYXNlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERhdGFDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL3dvcmtzcGFjZS9kYXRhL2RhdGEuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFdvcmtzcGFjZUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvd29ya3NwYWNlL3dvcmtzcGFjZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBGb290ZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2VsZWN0aW9uUmFuZ2VEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3NlbGVjdGlvbi1yYW5nZS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBDaGVja1ZhcmlhYmxlRXhpc3RlbmNlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9jaGVjay12YXJpYWJsZS1leGlzdGVuY2UuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgVmFyaWFibGVFeGlzdFBpcGUgfSBmcm9tICcuLi9waXBlcy92YXJpYWJsZS1leGlzdC5waXBlJztcclxuaW1wb3J0IHsgVmFyaWFibGVDaGVja2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy93b3Jrc3BhY2Uvdmlld2FibGUtcGhyYXNlL3ZhcmlhYmxlLWNoZWNrZXIvdmFyaWFibGUtY2hlY2tlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBBcHBDb21wb25lbnQsXHJcbiAgICBpc09iamVjdCxcclxuICAgIFRyZWVOb2RlQ29tcG9uZW50LFxyXG4gICAgSGFzVGhlc2VQcm9wc1BpcGUsXHJcbiAgICBEb2VzU3RyaW5nUmVwcmVzZW50UHJpbWl0aXZlUGlwZSxcclxuICAgIEVudGVyc1RvQnJQaXBlLFxyXG4gICAgVmlld2FibGVQaHJhc2VDb21wb25lbnQsXHJcbiAgICBJc0FycmF5UGlwZSxcclxuICAgIEZvY3VzRGlyZWN0aXZlLFxyXG4gICAgRWRpdGFibGVQaHJhc2VDb21wb25lbnQsXHJcbiAgICBEYXRhQ29tcG9uZW50LFxyXG4gICAgSGVhZGVyQ29tcG9uZW50LFxyXG4gICAgV29ya3NwYWNlQ29tcG9uZW50LFxyXG4gICAgRm9vdGVyQ29tcG9uZW50LFxyXG4gICAgU2VsZWN0aW9uUmFuZ2VEaXJlY3RpdmUsXHJcbiAgICBDaGVja1ZhcmlhYmxlRXhpc3RlbmNlRGlyZWN0aXZlLFxyXG4gICAgVmFyaWFibGVFeGlzdFBpcGUsXHJcbiAgICBWYXJpYWJsZUNoZWNrZXJDb21wb25lbnQsXHJcbiAgXSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGVcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW10sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgQXBwQ29tcG9uZW50XHJcbiAgXSxcclxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUVkaXRvck1vZHVsZSB7IH1cclxuIl19