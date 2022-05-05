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
import { CommonModule } from '@angular/common';

@NgModule({
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
})
export class TemplateEditorModule { }
