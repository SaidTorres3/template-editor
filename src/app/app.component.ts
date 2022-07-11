import { Component, OnInit } from "@angular/core";
import { TemplateInformation } from "./interfaces";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor() {}

  public testInfo: TemplateInformation = {
    name: "test",
    description: "desc"
  }

  public consoleLog(any: any) {
    console.log(any);
  }

  ngOnInit(): void {}
}
