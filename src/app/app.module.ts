import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { isObject } from './pipes/isObject.pipe';
import { TreeNodeComponent } from './shared/tree-node/tree-node.component';
import { HasThesePropsPipe } from './pipes/has-these-props.pipe';
import { DoesStringRepresentPrimitivePipe } from './pipes/does-string-represent-primitive.pipe';
import { EntersToBrPipe } from './pipes/enters-to-br.pipe';
import { ViewablePhraseComponent } from './shared/viewable-phrase/viewable-phrase.component';
import { IsArrayPipe } from './pipes/is-array.pipe';
import { FocusDirective } from './directives/focus.directive';

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
    FocusDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
