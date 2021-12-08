import { Component, ElementRef, ViewChild } from '@angular/core';
import { docxToString } from 'src/utils/docxParsers/docxToString';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'template-editor';
  @ViewChild('template') templateInput: ElementRef<HTMLInputElement>;
  @ViewChild('paper') paper: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    const input = this.templateInput.nativeElement
    const paper = this.paper.nativeElement


    input.onchange = (e) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const data = e.target.result
        docxToString(data).then(text => {
          console.log(text)
          paper.innerHTML = text
        })
      }
      reader.readAsArrayBuffer(input.files[0])
    }
  }
}
