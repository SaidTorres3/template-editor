import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TemplateEditorModule } from "./template-editor/template-editor.module";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [TemplateEditorModule, BrowserModule],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
