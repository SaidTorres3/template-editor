import { Component, ElementRef, ViewChild } from '@angular/core';
import { docxToEditableObjects } from 'src/utils/docxParsers/docxToEditableObjects';
import { docxToString } from 'src/utils/docxParsers/docxToString';
import { InputFileFormat, Phrase } from 'src/utils/docxParsers/types';
import { editableObjectToDocx } from 'src/utils/docxParsers/editableObjectsToDocx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'template-editor';
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef<HTMLInputElement>;
  @ViewChild('grabableBarData') grabableBarData: ElementRef<HTMLDivElement>;
  @ViewChild('dataContainer') dataContainer: ElementRef<HTMLDivElement>;

  public phrases: Phrase[] = [];
  public modifiedPhrases: Phrase[] = [];
  // check type
  private docxFile: InputFileFormat;

  public updateTextFromLabel(inputEvent: InputEvent, index: number) {
    const target = inputEvent.target as HTMLSpanElement;
    this.modifiedPhrases[index].value = target.innerText;
  }

  public save() {
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
    this.onChangeFileInput()
    this.onClickGrabableBarData()
  }

  private onClickGrabableBarData() {
    const grabableBarData = this.grabableBarData.nativeElement

    grabableBarData.onmousedown = (e) => {
      const startX = e.clientX
      const startWidth = this.dataContainer.nativeElement.clientWidth
      window.onmousemove = (e) => {
        const deltaX = e.clientX - startX
        const newWidth = startWidth + deltaX
        this.dataContainer.nativeElement.style.width = `${newWidth}px`

        const onMouseUp = (e) => {
          window.onmousemove = null
          window.onmouseup = null
        }

        window.onmouseup = onMouseUp
      }

      window.onmouseup = (e) => {
        window.onmousemove = null
        window.onmouseup = null
      }
    }
  }

  private onChangeFileInput() {
    // get the file content, parse it to editable objects, and set the phrases variables
    const input = this.uploadFileInput.nativeElement
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
