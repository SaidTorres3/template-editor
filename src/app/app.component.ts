import { Component, ElementRef, ViewChild } from '@angular/core';
import { docxToEditableObjects } from 'src/utils/docxParsers/docxToEditableObjects';
import { docxToString } from 'src/utils/docxParsers/docxToString';
import { InputFileFormat, Phrase } from 'src/utils/docxParsers/types';
import { editableObjectToDocx } from 'src/utils/docxParsers/editableObjectsToDocx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'template-editor';
  @ViewChild('template') templateInput: ElementRef<HTMLInputElement>;
  @ViewChild('paper') paper: ElementRef<HTMLDivElement>;

  public phrases: Phrase[] = [];
  public modifiedPhrases: Phrase[] = [];
  // check type
  private docxFile: InputFileFormat;

  public onSpanChange(inputEvent: InputEvent, index: number) {
    const target = inputEvent.target as HTMLSpanElement;
    this.modifiedPhrases[index].value = target.innerText;
  }

  public onSave() {
    editableObjectToDocx({ modifiedObjects: this.modifiedPhrases, fileIn: this.docxFile }).then((newDocx) => {
      const url = URL.createObjectURL(newDocx)
      const link = document.createElement('a')
      link.href = url
      link.download = 'newFile.docx'
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      docxToString(newDocx).then((string) => {
        console.log(string);
      });
    })
  }

  ngAfterViewInit() {
    const input = this.templateInput.nativeElement
    input.onchange = (e) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const data = e.target.result
        this.docxFile = data
        docxToEditableObjects(data).then((editableObjects) => {
          this.phrases = editableObjects.map(a => ({ ...a }));
          this.modifiedPhrases = editableObjects.map(a => ({ ...a }));
        })
      }
      reader.readAsArrayBuffer(input.files[0])
    }
  }
}
