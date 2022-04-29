import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppModule } from "../app.module";
import { RootComponent } from "./root.component";

@NgModule({
  declarations: [RootComponent],
  imports: [AppModule, BrowserModule],
  exports: [RootComponent],
  bootstrap: [RootComponent],
})
export class RootModule {}
