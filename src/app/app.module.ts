import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { isObject } from './pipes/isObject.pipe';
import { TreeNodeComponent } from './shared/tree-node/tree-node.component';
import { HasThesePropsPipe } from './pipes/has-these-props.pipe';
import { DoesStringRepresentPrimitivePipe } from './pipes/does-string-represent-primitive.pipe';
import { HTMLCasterPipe } from './pipes/htmlcaster.pipe';
import { ViewablePhraseComponent } from './shared/viewable-phrase/viewable-phrase.component';
import { IsArrayPipe } from './pipes/is-array.pipe';

@NgModule({
  declarations: [
    AppComponent,
    isObject,
    TreeNodeComponent,
    HasThesePropsPipe,
    DoesStringRepresentPrimitivePipe,
    HTMLCasterPipe,
    ViewablePhraseComponent,
    IsArrayPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
