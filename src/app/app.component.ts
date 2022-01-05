import { Component, ElementRef, ViewChild } from '@angular/core';
import { docxToEditableObjects } from 'src/utils/docxParsers/docxToEditableObjects';
import { docxToString } from 'src/utils/docxParsers/docxToString';
import { InputFileFormat, Phrase, ViewablePhrase, ViewablePhraseType } from 'src/utils/docxParsers/types';
import { editableObjectToDocx } from 'src/utils/docxParsers/editableObjectsToDocx';
import exampleObject from './exampleObject.json';
import { forEach } from 'jszip';

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
  
  public workspace: WorkSpace = {
    dropingFile: false,
    fileDropDown: false,
    fileDropDownToggle: this.fileDropDownToggle,
    paperZoom: { value: 1 },
    dataZoom: { value: 1 },
    mode: ViewMode.edit,
    historyIndex: 0
  }
  
  public docxFile: DocxFile = {
    content: "",
    name: "",
    lastModifiedDate: 0,
  }

  public objectData: any;
  public phrases: Phrase[] = [];
  public viewablePhrases: ViewablePhrase[] = [];
  public modifiedPhrasesHistory: Phrase[][] = [];

  ngOnInit() {
    this.objectData = exampleObject;
  }

  ngAfterViewInit() {
    this.fileInputListener()
    this.clickOnGrabableBarDataListener()
    this.zoomInContainerListener(this.templateContainer, this.workspace.paperZoom)
    this.zoomInContainerListener(this.dataContainer, this.workspace.dataZoom)
    this.fileBackdropHandler()
    this.historyHandler()
    this.shiftVListener()
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

  public save() {
    editableObjectToDocx({ modifiedObjects: this.modifiedPhrasesHistory[this.modifiedPhrasesHistory.length - 1], fileIn: this.docxFile.content }).then((newDocx) => {
      this.setTheDocument(newDocx)
    })
  }

  public saveToComputer() {
    editableObjectToDocx({ modifiedObjects: this.modifiedPhrasesHistory[this.modifiedPhrasesHistory.length - 1], fileIn: this.docxFile.content }).then((newDocx) => {
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
        this.modifiedPhrasesHistory = [editableObjects.map(a => ({ ...a }))];
        this.updatesViewValues()
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
        this.setTheDocument(e.dataTransfer.files[0])
      }
    }
  }

  public setMode(mode: string) {
    if (mode === "edit") {
      this.workspace.mode = ViewMode.edit
      this.updatesViewValues()
    } else if (mode === "view") {
      this.workspace.mode = ViewMode.view
      this.updatesViewValues()
    } else if (mode === 'simulation') {
      this.workspace.mode = ViewMode.simulation
    }
  }

  private updatesViewValues() {
    this.phrases = this.modifiedPhrasesHistory[this.workspace.historyIndex].map(a => ({ ...a }));
    this.updateViewablePhrasesValue()
  }

  private updateViewablePhrasesValue() {
    this.viewablePhrases = this.transformPhrasesToViewablePhrases(this.modifiedPhrasesHistory[this.workspace.historyIndex])
  }

  private shiftVListener() {
    document.addEventListener('keypress', (e) => {
      // detect when shift + v or shift + V and detect when stop pressing
      if ((e.key === "z" || e.key === "Z") && e.shiftKey) {
        e.preventDefault()
        this.setMode('edit')
      } else if ((e.key === "x" || e.key === "X") && e.shiftKey) {
        e.preventDefault()
        this.setMode('view')
      } else if ((e.key === "c" || e.key === "C") && e.shiftKey) {
        e.preventDefault()
        this.setMode('simulation')
        // if ctrl + shift
      }
    })
  }

  private transformPhrasesToString = (phrases: Phrase[]): string => {
    phrases = phrases.map(a => ({ ...a }));
    let phrasesStringtified = ""
    phrases.forEach(a => {
      phrasesStringtified += a.value
    })
    return phrasesStringtified
  }

  private getTextAndTagsAsViewablePhrases = (opts: FindTagsOpts): ViewablePhrase[] => {
    const startsAndEnds: FoundedTagsPosition[] = []
    let amountOfEndingTagsNeededToClose = 0;
    let begginingOfTagPosition = 0;
    let endingOfTagPosition = -1;
    for (let i = 0; i < opts.text.length; i++) {
      const isStartingATag = opts.text.substring(i, i + opts.tag.beginTag.length) === opts.tag.beginTag
      const isEndingAnTag = opts.text.substring(i, i + opts.tag.closeTag.length) === opts.tag.closeTag
      const isTheLastCharacter = i === opts.text.length - 1
      if (isTheLastCharacter && i != endingOfTagPosition) {
        startsAndEnds.push({ start: endingOfTagPosition, end: i + 1, isTag: false })
      }
      if (isStartingATag) {
        if (!amountOfEndingTagsNeededToClose) {
          const isThereText = (i - endingOfTagPosition) > 0
          isThereText ? startsAndEnds.push({ start: endingOfTagPosition, end: i, isTag: false }) : null
        }
        amountOfEndingTagsNeededToClose++;
        !begginingOfTagPosition ? begginingOfTagPosition = i : null;
      } else if (isEndingAnTag && amountOfEndingTagsNeededToClose) {
        amountOfEndingTagsNeededToClose--;
        if (!amountOfEndingTagsNeededToClose) {
          endingOfTagPosition = i + opts.tag.closeTag.length;
          startsAndEnds.push({ start: begginingOfTagPosition, end: endingOfTagPosition, isTag: true })
          begginingOfTagPosition = 0;
        };
      }
    }
    startsAndEnds.sort((a, b) => a.start - b.start)

    let viewablePhrases: ViewablePhrase[] = []
    startsAndEnds.forEach(a => {
      viewablePhrases.push({
        value: opts.text.substring(a.start, a.end),
        type: a.isTag ? opts.tag.type : ViewablePhraseType.text
      })
    })

    return viewablePhrases
  }

  private transformPhrasesToViewablePhrases(phrases: Phrase[]): ViewablePhrase[] {
    const createViewablePhrases = (text: string, tagsToClasificate: BeginAndCloseTags[]): ViewablePhrase[] => {
      let initialText: ViewablePhrase = { type: ViewablePhraseType.text, value: text }
      let maxTimesOfRecursion = tagsToClasificate.length;

      const getResult = (viewablePhrase: ViewablePhrase, numberOfRecursion?: number): ViewablePhrase[] | string => {
        numberOfRecursion ? null : numberOfRecursion = 0;
        if (numberOfRecursion >= maxTimesOfRecursion) {
          return viewablePhrase.value
        } else {
          if (typeof viewablePhrase.value === 'object' && viewablePhrase.value instanceof Array) {
            viewablePhrase.value.forEach(a => {
              (a.type === ViewablePhraseType.text) ? a.value = getResult(a, numberOfRecursion + 1) : a
            })
            return viewablePhrase.value
          } else {
            const theString = viewablePhrase.value.toString()
            const temporalResult = this.getTextAndTagsAsViewablePhrases({ text: theString, tag: tagsToClasificate[numberOfRecursion] })
            temporalResult.forEach(a => {
              return (a.type === ViewablePhraseType.text) ? a.value = getResult(a, numberOfRecursion + 1) : a
            })
            return temporalResult
          }
        }
      }

      const result = getResult(initialText)
      if (result instanceof Array) {
        return result
      } else {
        return []
      }
    }

    const phrasesStringtified = this.transformPhrasesToString(phrases)
    const findEach: BeginAndCloseTags = { beginTag: '{{#each', closeTag: '{{/each}}', type: ViewablePhraseType.each}
    const findIf: BeginAndCloseTags = { beginTag: "{{#if", closeTag: "{{/if}}", type: ViewablePhraseType.if }
    const findHandlebars: BeginAndCloseTags = { beginTag: "{{", closeTag: "}}", type: ViewablePhraseType.handlebar }
    return createViewablePhrases(phrasesStringtified, [findIf, findEach, findHandlebars])
  }

  public updateTextOfPhrase(inputEvent: InputEvent, index: number) {
    if (this.modifiedPhrasesHistory.length - 1 > this.workspace.historyIndex) {
      // keep the begining of the array to the history index
      this.modifiedPhrasesHistory = this.modifiedPhrasesHistory.slice(0, this.workspace.historyIndex + 1)
    }
    const phraseElement = inputEvent.target as HTMLSpanElement;
    const modifiedPhrases = this.modifiedPhrasesHistory[this.modifiedPhrasesHistory.length - 1].map(a => ({ ...a }));
    modifiedPhrases[index].value = phraseElement.innerText
    console.log("update")
    this.workspace.historyIndex = this.modifiedPhrasesHistory.push([...modifiedPhrases].map(a => ({ ...a }))) - 1
  }

  public undo = () => {
    if (this.workspace.historyIndex > 0) {
      const test = this.modifiedPhrasesHistory[this.workspace.historyIndex].map(a => ({ ...a }));
      this.workspace.historyIndex--
      test.map((phrase, index) => {
        if (phrase.value !== this.modifiedPhrasesHistory[this.workspace.historyIndex][index].value) {
          this.phrases[index] = { ...this.modifiedPhrasesHistory[this.workspace.historyIndex][index] }
        }
      })
      this.updateViewablePhrasesValue()
    }
  }

  public redo = () => {
    if (this.workspace.historyIndex + 1 <= this.modifiedPhrasesHistory.length - 1) {
      const test = this.modifiedPhrasesHistory[this.workspace.historyIndex].map(a => ({ ...a }));
      this.workspace.historyIndex++
      test.map((phrase, index) => {
        if (phrase.value !== this.modifiedPhrasesHistory[this.workspace.historyIndex][index].value) {
          this.phrases[index] = { ...this.modifiedPhrasesHistory[this.workspace.historyIndex][index] }
        }
      })
      this.updateViewablePhrasesValue()
    }
  }

  private historyHandler() {
    // add event listener to ctrl + z and ctrl + y
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        if (e.key === "z") {
          e.preventDefault()
          this.undo()
        } else if (e.key === "y") {
          e.preventDefault()
          this.redo()
        }
      }
    })
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
  fileDropDownToggle: () => void,

  paperZoom: { value: number },
  dataZoom: { value: number },

  mode: ViewMode
  historyIndex: number,
}

enum ViewMode {
  edit = "edit",
  view = "view",
  simulation = "simulation"
}

interface FindTagsOpts {
  text: string,
  tag: BeginAndCloseTags
}

interface BeginAndCloseTags {
  beginTag: string,
  closeTag: string,
  type: ViewablePhraseType
}

interface FoundedTagsPosition {
  start: number,
  end: number,
  isTag: boolean
}