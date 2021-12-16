import { Component, ElementRef, ViewChild } from '@angular/core';
import { docxToEditableObjects } from 'src/utils/docxParsers/docxToEditableObjects';
import { docxToString } from 'src/utils/docxParsers/docxToString';
import { InputFileFormat, Phrase } from 'src/utils/docxParsers/types';
import { editableObjectToDocx } from 'src/utils/docxParsers/editableObjectsToDocx';
import exampleObject from './exampleObject.json';

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
  @ViewChild('templateContainer') templateContainer: ElementRef<HTMLDivElement>;

  public phrases: Phrase[] = [];
  public modifiedPhrases: Phrase[] = [];

  public objectData: any;

  public workspace = {
    fileDropDown: false,
    fileDropDownToggle: this.fileDropDownToggle,

    paperZoom: { value: 1 },
    dataZoom: { value: 1 },
  }

  public docxFile: DocxFile = {
    content: "",
    name: "",
    lastModifiedDate: 0
  }

  public updateTextFromLabel(inputEvent: InputEvent, index: number) {
    const target = inputEvent.target as HTMLSpanElement;
    this.modifiedPhrases[index].value = target.innerText;
  }

  public consolelog(arg: any) {
    console.log(arg)
  }

  public save() {
    editableObjectToDocx({ modifiedObjects: this.modifiedPhrases, fileIn: this.docxFile.content }).then((newDocx) => {
      this.setTheDocument(newDocx)
    })
  }

  public saveToComputer() {
    editableObjectToDocx({ modifiedObjects: this.modifiedPhrases, fileIn: this.docxFile.content }).then((newDocx) => {
      const url = URL.createObjectURL(newDocx)
      const link = document.createElement('a')
      link.href = url
      link.download = this.docxFile.name
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      docxToString(newDocx).then((string) => {
        console.log(string);
      });
    })
  }

  ngOnInit() {
    this.objectData = exampleObject;
  }

  ngAfterViewInit() {
    this.fileInputListener()
    this.clickOnGrabableBarDataListener()
    this.zoomInContainerListener(this.templateContainer, this.workspace.paperZoom)
    this.zoomInContainerListener(this.dataContainer, this.workspace.dataZoom)
  }

  private clickOnGrabableBarDataListener() {
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

  private fileInputListener() {
    // get the file content, parse it to editable objects, and set the phrases variables
    const input = this.uploadFileInput.nativeElement
    input.onchange = (e) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const data = e.target.result
        this.docxFile.name = input.files[0].name
        // set last modification date from the file
        this.docxFile.lastModifiedDate = input.files[0].lastModified
        this.docxFile.content = data
        this.setTheDocument(data)
      }
      reader.readAsArrayBuffer(input.files[0])
    }
  }

  private setTheDocument(data: InputFileFormat) {
    docxToEditableObjects(data).then((editableObjects) => {
      this.phrases = editableObjects.map(a => ({ ...a }));
      this.modifiedPhrases = editableObjects.map(a => ({ ...a }));
    })
  }

  private zoomInContainerListener(divListener: ElementRef<HTMLDivElement>, zoomRef: { value: number }) {
    const container = divListener.nativeElement
    // add event lister when ctrl + scroll up
    container.onwheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY
        if (delta < 0) {
          this.zoomIn(zoomRef)
        } else {
          this.zoomOut(zoomRef)
        }
      }
    }
  }

  public zoomIn(zoomRef: { value: number }) {
    zoomRef.value < 2 ? zoomRef.value += 0.1 : undefined
  }

  public zoomOut(zoomRef: { value: number }) {
    zoomRef.value > 0.11 ? zoomRef.value -= 0.1 : undefined
  }

  public zoomNormal(zoomRef: { value: number }) {
    zoomRef.value = 1
  }

  public fileDropDownToggle() {
    this.workspace.fileDropDown = true
    let clickCount = 0;
    const quitDropDown = (e) => {
      clickCount++
      if (clickCount > 1) {
        this.workspace.fileDropDown = false
        window.onclick = null
      }
    }
    window.onclick = quitDropDown
  }

  public enterListener(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  public onPaste(e: ClipboardEvent) {
    e.preventDefault()
    this.consolelog(e)
    let text = e.clipboardData.getData("text/plain")
    // remove enters of the space
    text = text.replace(/\n/g, " ")
    document.execCommand("insertText", false, text)
  }

  public onDrop(e: DragEvent) {
    // if has html content, prevent default
    if (e.dataTransfer.getData("text/html")) { e.preventDefault() }
    // get plain text
    const text = e.dataTransfer.getData("text/plain")
    // if plain text contains like breaklines, prevent default
    if (text.includes("\n")) { e.preventDefault() }
  }
}

interface DocxFile {
  name: string,
  lastModifiedDate: number,
  content: InputFileFormat,
}