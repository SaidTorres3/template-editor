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

  public workspace: WorkSpace = {
    dropingFile: false,
    
    fileDropDown: false,
    fileDropDownToggle: this.fileDropDownToggle,

    paperZoom: { value: 1 },
    dataZoom: { value: 1 },

    mode: ViewMode.edit,
  }

  public docxFile: DocxFile = {
    content: "",
    name: "",
    lastModifiedDate: 0
  }

  ngOnInit() {
    this.objectData = exampleObject;
  }

  ngAfterViewInit() {
    this.fileInputListener()
    this.clickOnGrabableBarDataListener()
    this.zoomInContainerListener(this.templateContainer, this.workspace.paperZoom)
    this.zoomInContainerListener(this.dataContainer, this.workspace.dataZoom)
    this.fileBackdropHandler()
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
      this.setTheDocument(input.files[0])
    }
  }

  public updateTextOfPhrase(inputEvent: InputEvent, index: number) {
    const phraseElement = inputEvent.target as HTMLSpanElement;
    this.modifiedPhrases[index].value = phraseElement.innerText;
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

  private setTheDocument(inputFile: File) {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const data = e.target.result
      this.docxFile.name = inputFile.name
      // set last modification date from the file
      this.docxFile.lastModifiedDate = inputFile.lastModified
      this.docxFile.content = data
      docxToEditableObjects(inputFile).then((editableObjects) => {
        this.phrases = editableObjects.map(a => ({ ...a }));
        this.modifiedPhrases = editableObjects.map(a => ({ ...a }));
      })
    }
    reader.readAsArrayBuffer(inputFile)
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

  public pasteContentWithoutStylesAndEnters(e: ClipboardEvent) {
    e.preventDefault()
    let text = e.clipboardData.getData("text/plain")
    // remove enters of the space
    text = text.replace(/\n/g, " ")
    document.execCommand("insertText", false, text)
  }

  public fileBackdropHandler = () => {
    const initCount = -1
    let count = initCount

    window.ondragover = (e) => { e.preventDefault(); }

    window.ondragenter = (e) => {
      // if event contains a file with .docx extension
      if (e.dataTransfer.items[0].kind === "file" && e.dataTransfer.items[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        this.workspace.dropingFile = true
        count++
      }
    }
    
    window.ondragleave = (e) => {
      count--
      if (count < 0) {
        this.workspace.dropingFile = false
        count = initCount
      }
    }

    window.ondrop = (e: DragEvent) => {
      e.preventDefault()
      count = initCount
      this.workspace.dropingFile = false
      if (e.dataTransfer.items[0].kind === "file" && e.dataTransfer.items[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        console.log(e.dataTransfer.files)
        this.setTheDocument(e.dataTransfer.files[0])
      }
    }
  }
}
interface DocxFile {
  name: string,
  lastModifiedDate: number,
  content: InputFileFormat,
}

interface WorkSpace {
  dropingFile: boolean,

  fileDropDown: boolean,
  fileDropDownToggle: ()=>void,

  paperZoom: { value: number },
  dataZoom: { value: number },

  mode: ViewMode
}

enum ViewMode {
  edit = "edit",
  view = "view",
  simulation = "simulation"
}