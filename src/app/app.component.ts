import { AfterViewChecked, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  @ViewChild('dataElement') dataElement: ElementRef<HTMLDivElement>;
  @ViewChild('dataContainer') dataContainer: ElementRef<HTMLDivElement>;
  @ViewChild('dataContainerData') dataContainerData: ElementRef<HTMLDivElement>;
  @ViewChild('templateContainer') templateContainer: ElementRef<HTMLDivElement>;
  @ViewChildren('editablePhraseSpanElement') editablePhraseSpanElement: QueryList<ElementRef<HTMLSpanElement>>;

  public workspace: WorkSpace = {
    dropingFile: false,
    fileDropDown: false,
    fileDropDownToggle: this.fileDropDownToggle,
    paperZoom: { value: 1 },
    dataZoom: { value: 1 },
    mode: ViewMode.edit,
    historyIndex: 0,
    lastModifiedEditablePhraseIndex: 0,
  }

  public docxFile: DocxFile = {
    content: "",
    name: "",
    lastModifiedDate: 0,
  }

  public objectData: any;
  public editablePhrases: EditablePhrase[] = [];
  public viewablePhrases: ViewablePhrase[] = [];
  private history: History[] = []

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
        this.setter(editableObjects)
      })
    }
    reader.readAsArrayBuffer(inputFile)
  }

  private setter(editableObjects: EditablePhrase[]) {
    this.editablePhrases = editableObjects.map(a => ({ ...a }));
    this.history = [{ editablePhrases: editableObjects.map(a => ({ ...a })), lastModifiedEditablePhraseIndex: 0 }];
    this.workspace.historyIndex = 0;
    this.updatesPhrasesValues()
  }

  public updateTextOfEditablePhrase(inputEvent: InputEvent, editablePhraseIndex: number) {
    const doesHistoryIndexIsPosibleInHistory = this.workspace.historyIndex < this.history.length - 1
    if (doesHistoryIndexIsPosibleInHistory) {
      // keep the begining of the array to the history index
      this.history = this.history.slice(0, this.workspace.historyIndex + 1)
    }
    const phraseElement = inputEvent.target as HTMLSpanElement;
    const modifiedPhrasesFromHistory = this.history[this.history.length - 1].editablePhrases.map(a => ({ ...a }));
    modifiedPhrasesFromHistory[editablePhraseIndex].value = phraseElement.innerText
    this.workspace.lastModifiedEditablePhraseIndex = editablePhraseIndex
    this.history.push({ editablePhrases: [...modifiedPhrasesFromHistory].map(a => ({ ...a })), lastModifiedEditablePhraseIndex: editablePhraseIndex })
    this.workspace.historyIndex = this.history.length - 1
    this.updateViewablePhrasesValue()
  }

  public save() {
    if (!this.docxFile.content) {
      return
    }
    editableObjectToDocx({ modifiedObjects: this.history[this.history.length - 1].editablePhrases, fileIn: this.docxFile.content }).then((newDocx) => {
      this.setTheDocument(newDocx)
    })
  }

  public saveToComputer() {
    if (!this.docxFile.content) {
      return
    }
    editableObjectToDocx({ modifiedObjects: this.history[this.workspace.historyIndex].editablePhrases, fileIn: this.docxFile.content }).then((newDocx) => {
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
    const startWidth = this.dataElement.nativeElement.clientWidth
    window.onmousemove = (e) => {
      const deltaX = e.clientX - startX
      const newWidth = startWidth + deltaX
      this.dataElement.nativeElement.style.width = `${newWidth}px`
      this.updateDataColumnsAmmount()
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

  private updateDataColumnsAmmount() {
    const newWidth = this.dataElement.nativeElement.clientWidth
    if (newWidth > 1700) {
      this.dataContainerData.nativeElement.classList.add('workspace__data__data-container__data--three-columns')
    } else if (newWidth > 1000) {
      this.dataContainerData.nativeElement.classList.remove('workspace__data__data-container__data--three-columns')
      this.dataContainerData.nativeElement.classList.add('workspace__data__data-container__data--two-columns')
    } else if (newWidth < 1000) {
      this.dataContainerData.nativeElement.classList.remove('workspace__data__data-container__data--three-columns')
      this.dataContainerData.nativeElement.classList.remove('workspace__data__data-container__data--two-columns')
    }
  }

  public makeZoom(e: WheelEvent, zoomRef: { value: number }) {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY
      this.updateDataColumnsAmmount()
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
    window.ondragleave = () => {
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

  public searchInData(searchData: string) {
    this.workspace.searchData = searchData
  }

  public setMode(mode: string) {
    if (mode === ViewMode.edit) {
      this.workspace.mode = ViewMode.edit
      this.updatesPhrasesValues()
    } else if (mode === ViewMode.view) {
      this.workspace.mode = ViewMode.view
      this.updatesPhrasesValues()
    } else if (mode === ViewMode.simulation) {
      this.workspace.mode = ViewMode.simulation
    } else if (mode === ViewMode.editView) {
      this.workspace.mode = ViewMode.editView
      if(this.workspace.paperZoom.value >= 1 ) {
        this.workspace.paperZoom.value = 0.9
      }
    }
  }

  private updatesPhrasesValues() {
    this.updateEditablePhrasesValue()
    this.updateViewablePhrasesValue()
  }

  private updateEditablePhrasesValue() {
    this.workspace.lastModifiedEditablePhraseIndex = this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex
    this.editablePhrases = this.history[this.workspace.historyIndex].editablePhrases.map(a => ({ ...a }));
  }

  private updateViewablePhrasesValue() {
    const updatedViewablePhrases = this.transformEditablePhrasesToViewablePhrases(this.history[this.workspace.historyIndex].editablePhrases)
    if (this.viewablePhrases.length === updatedViewablePhrases.length) {
      updatedViewablePhrases.forEach((updatedViewablePhrase, index) => {
        if (this.viewablePhrases[index].value !== updatedViewablePhrase.value) {
          this.viewablePhrases[index].value = updatedViewablePhrase.value
        }
      })
    } else {
      this.viewablePhrases = this.transformEditablePhrasesToViewablePhrases(this.history[this.workspace.historyIndex].editablePhrases)
    }
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
      const editablePhrasesFromLastestElementInHistory = this.history[this.workspace.historyIndex].editablePhrases.map(a => ({ ...a }));
      this.workspace.lastModifiedEditablePhraseIndex = this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex
      this.workspace.historyIndex--
      editablePhrasesFromLastestElementInHistory.map((editablePhrase, index) => {
        const editablePhraseFromHistory = this.history[this.workspace.historyIndex].editablePhrases[index]
        if (editablePhrase.value !== editablePhraseFromHistory.value) {
          this.editablePhrases[index] = { ...this.history[this.workspace.historyIndex].editablePhrases[index] }
        }
      })
      this.updateViewablePhrasesValue()
    }
  }

  public redo = () => {
    if (this.workspace.historyIndex + 1 <= this.history.length - 1) {
      const editablePhrasesFromLastestElementInHistory = this.history[this.workspace.historyIndex].editablePhrases.map(a => ({ ...a }));
      this.workspace.historyIndex++
      this.workspace.lastModifiedEditablePhraseIndex = this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex
      editablePhrasesFromLastestElementInHistory.map((editablePhrase, index) => {
        const editablePhraseFromHistory = this.history[this.workspace.historyIndex].editablePhrases[index]
        if (editablePhrase.value !== editablePhraseFromHistory.value) {
          this.editablePhrases[index] = { ...editablePhraseFromHistory }
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
  lastModifiedEditablePhraseIndex: number
  searchData?: string
}

enum ViewMode {
  edit = "edit",
  view = "view",
  simulation = "simulation",
  editView = "editView"
}

interface History {
  editablePhrases: EditablePhrase[],
  lastModifiedEditablePhraseIndex: number
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