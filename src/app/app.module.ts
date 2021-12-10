import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TreeViewPipe } from './pipes/tree-view.pipe';
import { TreeNodeComponent } from './shared/tree-node/tree-node.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeViewPipe,
    TreeNodeComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
