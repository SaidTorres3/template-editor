import { Component, ElementRef, ViewChild } from '@angular/core';
import { docxToEditableObjects } from 'src/utils/docxParsers/docxToEditableObjects';
import { docxToString } from 'src/utils/docxParsers/docxToString';
import { InputFileFormat, EditablePhrase, ViewablePhrase, ViewablePhraseType } from 'src/utils/docxParsers/types';
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
  @ViewChild('dataContainer') dataContainer: ElementRef<HTMLDivElement>;
  @ViewChild('dataContainerData') dataContainerData: ElementRef<HTMLDivElement>;
  @ViewChild('templateContainer') templateContainer: ElementRef<HTMLDivElement>;

  public workspace: WorkSpace = {
    dropingFile: false,
    fileDropDown: false,
    fileDropDownToggle: this.fileDropDownToggle,
    paperZoom: { value: 1 },
    dataZoom: { value: 1 },
    mode: ViewMode.edit,
    historyIndex: 0,
    currentEditablePhrase: 0,
  }

  public docxFile: DocxFile = {
    content: "",
    name: "",
    lastModifiedDate: 0,
  }

  public objectData: any;
  public editablePhrases: EditablePhrase[] = [];
  public viewablePhrases: ViewablePhrase[] = [];
  public modifiedPhrasesHistory: EditablePhrase[][] = [];

  ngOnInit() {
    this.objectData = exampleObject;
  }

  ngAfterViewInit() {
    this.fileBackdropHandlerListener()
    this.historyHandlerListener()
    this.changeModeWithHotkeysListener()
  }

  public setTheDocument(inputFile: File) {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const data = e.target.result
      this.docxFile.name = inputFile.name
      // set last modification date from the file
      this.docxFile.lastModifiedDate = inputFile.lastModified
      this.docxFile.content = data
      docxToEditableObjects(inputFile).then((editableObjects) => {
        this.editablePhrases = editableObjects.map(a => ({ ...a }));
        this.modifiedPhrasesHistory = [editableObjects.map(a => ({ ...a }))];
        this.workspace.historyIndex = 0;
        this.updatesPhrasesValues()
      })
    }
    reader.readAsArrayBuffer(inputFile)
  }

  public updateTextOfEditablePhrase(inputEvent: InputEvent, index: number) {
    if (this.modifiedPhrasesHistory.length - 1 > this.workspace.historyIndex) {
      // keep the begining of the array to the history index
      this.modifiedPhrasesHistory = this.modifiedPhrasesHistory.slice(0, this.workspace.historyIndex + 1)
    }
    const phraseElement = inputEvent.target as HTMLSpanElement;
    const modifiedPhrases = this.modifiedPhrasesHistory[this.modifiedPhrasesHistory.length - 1].map(a => ({ ...a }));
    modifiedPhrases[index].value = phraseElement.innerText
    this.workspace.historyIndex = this.modifiedPhrasesHistory.push([...modifiedPhrases].map(a => ({ ...a }))) - 1
    this.workspace.currentEditablePhrase = index
  }

  public trackByEditablePhrase(index: number, item: EditablePhrase): number {
    return this.editablePhrases[index].sentenseIndex
  }

  public save() {
    if (!this.docxFile.content) {
      return
    }
    editableObjectToDocx({ modifiedObjects: this.modifiedPhrasesHistory[this.modifiedPhrasesHistory.length - 1], fileIn: this.docxFile.content }).then((newDocx) => {
      this.setTheDocument(newDocx)
    })
  }

  public saveToComputer() {
    if (!this.docxFile.content) {
      return
    }
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

  public resizeDataContainerToCursorPosition(e: MouseEvent) {
    const startX = e.clientX
    const startWidth = this.dataContainer.nativeElement.clientWidth
    window.onmousemove = (e) => {
      const deltaX = e.clientX - startX
      const newWidth = startWidth + deltaX
      this.dataContainer.nativeElement.style.width = `${newWidth}px`
      if (newWidth > 1600) {
        this.dataContainerData.nativeElement.classList.add('workspace__data__data-container__data--three-columns')
      } else if (newWidth > 1000) {
        this.dataContainerData.nativeElement.classList.remove('workspace__data__data-container__data--three-columns')
        this.dataContainerData.nativeElement.classList.add('workspace__data__data-container__data--two-columns')
      } else {
        this.dataContainerData.nativeElement.classList.remove('workspace__data__data-container__data--two-columns')
      }
      const onMouseUp = () => {
        window.onmousemove = null
        window.onmouseup = null
      }
      window.onmouseup = onMouseUp
    }
    window.onmouseup = () => {
      window.onmousemove = null
      window.onmouseup = null
    }
  }

  public makeZoom(e: WheelEvent, zoomRef: { value: number }) {
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

  public fileBackdropHandlerListener = () => {
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

  setSearchData(searchData: string) {
    this.workspace.searchData = searchData
  }

  public setMode(mode: string) {
    if (mode === "edit") {
      this.workspace.mode = ViewMode.edit
      this.updatesPhrasesValues()
    } else if (mode === "view") {
      this.workspace.mode = ViewMode.view
      this.updatesPhrasesValues()
    } else if (mode === 'simulation') {
      this.workspace.mode = ViewMode.simulation
    }
  }

  private updatesPhrasesValues() {
    this.editablePhrases = this.modifiedPhrasesHistory[this.workspace.historyIndex].map(a => ({ ...a }));
    this.updateViewablePhrasesValue()
  }

  private updateViewablePhrasesValue() {
    this.viewablePhrases = this.transformEditablePhrasesToViewablePhrases(this.modifiedPhrasesHistory[this.workspace.historyIndex])
  }

  private changeModeWithHotkeysListener() {
    document.addEventListener('keydown', (e) => {
      // detect when shift + v or shift + V and detect when stop pressing
      if ((e.key === "z" || e.key === "Z") && e.shiftKey && e.altKey) {
        e.preventDefault()
        if (this.workspace.mode !== ViewMode.edit) { this.setMode('edit') }
      } else if ((e.key === "x" || e.key === "X") && e.shiftKey && e.altKey) {
        e.preventDefault()
        if (this.workspace.mode !== ViewMode.view) { this.setMode('view') }
      } else if ((e.key === "c" || e.key === "C") && e.shiftKey && e.altKey) {
        e.preventDefault()
        if (this.workspace.mode !== ViewMode.simulation) { this.setMode('simulation') }
      }
    })
  }

  private transformEditablePhrasesToString = (phrases: EditablePhrase[]): string => {
    phrases = phrases.map(a => ({ ...a }));
    let phrasesStringtified = ""
    phrases.forEach((phrase, index) => {
      const phraseWihoutEnter = phrase.value.concat().replace('\n', '')
      if (phrases[index - 1] && phrases[index - 1].paragraphIndex < phrase.paragraphIndex) {
        phrasesStringtified += '\r\n'
      }
      phrasesStringtified += phraseWihoutEnter
    })
    return phrasesStringtified
  }

  private transformStringToViewablePhrases = (opts: FindTagsOpts): ViewablePhrase[] => {
    const startsAndEnds: FoundedTagsPosition[] = []
    let requirementsToCloseTag: { amountOfClosingTags: number, type: ViewablePhraseType | undefined } = { amountOfClosingTags: 0, type: undefined };
    let startingTagPosition = 0;
    let closingTagPosition = -1;
    // sort tags by priority, lower priority first
    opts.tags.sort((a, b) => { return a.priority - b.priority })
    for (let i = 0; i < opts.text.length; i++) {
      for (let j = 0; j < opts.tags.length; j++) {
        const { startTag, closeTag, type: tagType } = opts.tags[j]
        const isStartingATag = opts.text.substring(i, i + startTag.length) === startTag
        const isEndingAnTag = opts.text.substring(i, i + closeTag.length) === closeTag
        const isTheLastCharacter = i === opts.text.length - 1

        if ((isTheLastCharacter) && (i != closingTagPosition)) {
          const isThereText = (i - closingTagPosition) > 0
          isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null
          break;
        }

        if (isStartingATag && ((!requirementsToCloseTag.amountOfClosingTags) || (requirementsToCloseTag.type === tagType))) {
          if (!requirementsToCloseTag.amountOfClosingTags) {
            const isThereText = (i - closingTagPosition) > 0
            isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null
            startingTagPosition = i
          }
          requirementsToCloseTag = { amountOfClosingTags: requirementsToCloseTag.amountOfClosingTags + 1, type: opts.tags[j].type }
          break;
        } else if ((isEndingAnTag) && (tagType == requirementsToCloseTag.type)) {
          requirementsToCloseTag.amountOfClosingTags--
          if (requirementsToCloseTag.amountOfClosingTags == 0) {
            closingTagPosition = i + closeTag.length
            startsAndEnds.push({ start: startingTagPosition, end: closingTagPosition, type: opts.tags[j].type })
          }
          break;
        }
      }
    }
    startsAndEnds.sort((a, b) => a.start - b.start)

    let viewablePhrases: ViewablePhrase[] = []
    startsAndEnds.forEach(a => {
      viewablePhrases.push({
        value: opts.text.substring(a.start, a.end),
        type: a.type
      })
    })

    return viewablePhrases
  }

  private transformEditablePhrasesToViewablePhrases(phrases: EditablePhrase[]): ViewablePhrase[] {
    let priority = 0
    const phrasesStringtified = this.transformEditablePhrasesToString(phrases)
    const findEach: Tag = { startTag: '{{#each', closeTag: '{{/each}}', type: ViewablePhraseType.each, priority: priority++ }
    const findIf: Tag = { startTag: "{{#if", closeTag: "{{/if}}", type: ViewablePhraseType.if, priority: priority++ }
    const findHandlebars: Tag = { startTag: "{{", closeTag: "}}", type: ViewablePhraseType.handlebar, priority: priority++ }
    return this.transformStringToViewablePhrases({ text: phrasesStringtified, tags: [findIf, findEach, findHandlebars] })
  }

  public undo = () => {
    if (this.workspace.historyIndex > 0) {
      const test = this.modifiedPhrasesHistory[this.workspace.historyIndex].map(a => ({ ...a }));
      this.workspace.historyIndex--
      test.map((phrase, index) => {
        if (phrase.value !== this.modifiedPhrasesHistory[this.workspace.historyIndex][index].value) {
          this.editablePhrases[index] = { ...this.modifiedPhrasesHistory[this.workspace.historyIndex][index] }
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
          this.editablePhrases[index] = { ...this.modifiedPhrasesHistory[this.workspace.historyIndex][index] }
        }
      })
      this.updateViewablePhrasesValue()
    }
  }

  private historyHandlerListener() {
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
  currentEditablePhrase: number,
  searchData?: string
}

enum ViewMode {
  edit = "edit",
  view = "view",
  simulation = "simulation"
}

interface FindTagsOpts {
  text: string,
  tags: Tag[]
}

interface Tag {
  startTag: string,
  closeTag: string,
  type: ViewablePhraseType,
  priority: number
}

interface FoundedTagsPosition {
  start: number,
  end: number,
  type: ViewablePhraseType
}