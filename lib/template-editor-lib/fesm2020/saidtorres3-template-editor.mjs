import * as i0 from '@angular/core';
import { EventEmitter, Component, Input, Output, Pipe, ElementRef, Directive, Inject, ViewChild, NgModule } from '@angular/core';
import * as JSZipImport from 'jszip';
import xml2js, { parseString } from 'xml2js-preserve-spaces';
import { Subject } from 'rxjs';
import * as i4 from '@angular/forms';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1$1 from '@angular/platform-browser';

const docxToEditableObjects = async (docxFile) => {
    const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
    return new Promise((resolve, reject) => {
        // unzip the file
        const zip = new JSZip();
        zip.loadAsync(docxFile).then(function (zip) {
            // get the content of the document.xml file
            const wordFolder = zip.folder('word');
            if (!wordFolder) {
                reject(`An error ocurred attempting to enter to the folder 'word' of the docx file.`);
                return;
            }
            const file = wordFolder.file("document.xml");
            if (!file) {
                reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`);
                return;
            }
            file.async('string').then(function (XMLContent) {
                const phrases = [];
                parseString(XMLContent, function (err, result) {
                    const paragraphs = result['w:document']['w:body'][0]['w:p'];
                    const enter = '\r\n';
                    let phrase;
                    paragraphs.forEach((paragraph, paragraphIndex) => {
                        const wRLabels = paragraph['w:r'];
                        if (!wRLabels || !wRLabels.length) {
                            phrase = { value: enter, paragraphIndex, sentenseIndex: 0 };
                            phrases.push(phrase);
                        }
                        else {
                            wRLabels.forEach((wRLabel, wRLabelIndex) => {
                                let text = '';
                                const WTLabel = wRLabel['w:t'];
                                // check if WTLabel is an object and has the "_" property
                                if (WTLabel && WTLabel.length && WTLabel[0]['_']) {
                                    text = WTLabel[0]['_'];
                                }
                                else {
                                    if (WTLabel && WTLabel.length && typeof WTLabel[0] === 'string') {
                                        text = WTLabel[0];
                                    }
                                    else if (WTLabel && WTLabel.length && WTLabel[0]['$']) {
                                        text = " ";
                                    }
                                }
                                phrase = { value: text, paragraphIndex, sentenseIndex: wRLabelIndex };
                                phrases.push(phrase);
                            });
                        }
                    });
                    resolve(phrases);
                });
            });
        });
    });
};

var ViewablePhraseType;
(function (ViewablePhraseType) {
    ViewablePhraseType["text"] = "text";
    ViewablePhraseType["handlebar"] = "handlebar";
    ViewablePhraseType["if"] = "if";
    ViewablePhraseType["each"] = "each";
})(ViewablePhraseType || (ViewablePhraseType = {}));

const transformEditablePhrasesToString = (phrases) => {
    phrases = phrases.map(a => ({ ...a }));
    let phrasesStringtified = "";
    phrases.forEach((phrase, index) => {
        const phraseWihoutEnter = phrase.value.concat().replace('\n', '');
        if (phrases[index - 1] && phrases[index - 1].paragraphIndex < phrase.paragraphIndex) {
            phrasesStringtified += '\r\n';
        }
        phrasesStringtified += phraseWihoutEnter;
    });
    return phrasesStringtified;
};

const transformStringToViewablePhrases = (opts) => {
    const startsAndEnds = [];
    let requirementsToCloseTag = { amountOfClosingTags: 0, type: undefined };
    let startingTagPosition = 0;
    let closingTagPosition = -1;
    // sort tags by priority, lower priority first
    opts.tags.sort((a, b) => { return a.priority - b.priority; });
    for (let i = 0; i < opts.text.length; i++) {
        for (let j = 0; j < opts.tags.length; j++) {
            const { startTag, closeTag, type: tagType } = opts.tags[j];
            const isStartingATag = opts.text.substring(i, i + startTag.length) === startTag;
            const isEndingAnTag = opts.text.substring(i, i + closeTag.length) === closeTag;
            const isTheLastCharacter = i === opts.text.length - 1;
            if ((isTheLastCharacter) && (i != closingTagPosition)) {
                const isThereText = (i - closingTagPosition) > 0;
                isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null;
                break;
            }
            if (isStartingATag && ((!requirementsToCloseTag.amountOfClosingTags) || (requirementsToCloseTag.type === tagType))) {
                if (!requirementsToCloseTag.amountOfClosingTags) {
                    const isThereText = (i - closingTagPosition) > 0;
                    isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null;
                    startingTagPosition = i;
                }
                requirementsToCloseTag = { amountOfClosingTags: requirementsToCloseTag.amountOfClosingTags + 1, type: opts.tags[j].type };
                break;
            }
            else if ((isEndingAnTag) && (tagType == requirementsToCloseTag.type)) {
                requirementsToCloseTag.amountOfClosingTags--;
                if (requirementsToCloseTag.amountOfClosingTags == 0) {
                    closingTagPosition = i + closeTag.length;
                    startsAndEnds.push({ start: startingTagPosition, end: closingTagPosition, type: opts.tags[j].type });
                }
                break;
            }
        }
    }
    startsAndEnds.sort((a, b) => a.start - b.start);
    let viewablePhrases = [];
    startsAndEnds.forEach(a => {
        viewablePhrases.push({
            value: opts.text.substring(a.start, a.end),
            type: a.type
        });
    });
    return viewablePhrases;
};

const transformEditablePhrasesToViewablePhrases = (phrases) => {
    let priority = 0;
    const phrasesStringtified = transformEditablePhrasesToString(phrases);
    const findEach = { startTag: '{{#each', closeTag: '{{/each}}', type: ViewablePhraseType.each, priority: priority++ };
    const findIf = { startTag: "{{#if", closeTag: "{{/if}}", type: ViewablePhraseType.if, priority: priority++ };
    const findHandlebars = { startTag: "{{", closeTag: "}}", type: ViewablePhraseType.handlebar, priority: priority++ };
    return transformStringToViewablePhrases({ text: phrasesStringtified, tags: [findIf, findEach, findHandlebars] });
};

var ViewMode;
(function (ViewMode) {
    ViewMode["edit"] = "edit";
    ViewMode["view"] = "view";
    ViewMode["simulation"] = "simulation";
    ViewMode["editView"] = "editView";
})(ViewMode || (ViewMode = {}));

class Zoom {
    constructor() {
        this.zoomSubject = new Subject();
        this.zoomObserver = this.zoomSubject.asObservable();
    }
    makeZoom(e, zoomRef) {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY;
            this.zoomSubject.next(undefined);
            if (delta < 0) {
                this.zoomIn(zoomRef);
            }
            else {
                this.zoomOut(zoomRef);
            }
        }
    }
    zoomIn(zoomRef) {
        zoomRef.value < 2 ? (zoomRef.value += 0.1) : undefined;
    }
    zoomOut(zoomRef) {
        zoomRef.value > 0.11 ? (zoomRef.value -= 0.1) : undefined;
    }
    zoomNormal(zoomRef) {
        zoomRef.value = 1;
    }
}

const editableObjectToDocx = async (opts) => {
    const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
    return new Promise((resolve, reject) => {
        // unzip the file
        const zipHandler = new JSZip();
        zipHandler.loadAsync(opts.fileIn).then(function (zipContent) {
            const file = zipContent.file("word/document.xml");
            if (!file) {
                reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`);
                return;
            }
            file.async('text').then(function (XMLContent) {
                xml2js.parseString(XMLContent, function (err, result) {
                    const paragraphs = result['w:document']['w:body'][0]['w:p'];
                    paragraphs.forEach((paragraph, paragraphIndex) => {
                        const wRLabels = paragraph['w:r'];
                        if (!wRLabels || !wRLabels.length) {
                            return paragraph;
                        }
                        wRLabels.forEach((wRLabel, wRLabelIndex) => {
                            const modfiedPhrase = getModifiedPhrase(opts.modifiedObjects, { paragraphIndex, sentenseIndex: wRLabelIndex });
                            if (!modfiedPhrase) {
                                return paragraph;
                            }
                            // check if WTLabel is an object and has the "_" property
                            if (wRLabel['w:t'] && wRLabel['w:t'].length && wRLabel['w:t'][0]['_']) {
                                wRLabel['w:t'][0]['_'] = modfiedPhrase.value;
                            }
                            else {
                                if (wRLabel['w:t'] && wRLabel['w:t'].length && typeof wRLabel['w:t'][0] === 'string') {
                                    wRLabel['w:t'][0] = modfiedPhrase.value;
                                }
                            }
                        });
                    });
                    const modifiedXML = new xml2js.Builder().buildObject(result);
                    // replace 'file' variable with modifiedXML
                    zipContent.file('word/document.xml', modifiedXML);
                    zipContent.generateAsync({ type: 'blob' }).then(function (outputFile) {
                        resolve(outputFile);
                    });
                });
            });
        });
    });
};
const getModifiedPhrase = (phrases, phaseCoords) => {
    const phrase = phrases.find((phrase) => {
        if (phrase.paragraphIndex === phaseCoords.paragraphIndex && phrase.sentenseIndex === phaseCoords.sentenseIndex) {
            return phrase;
        }
    });
    return phrase;
};

class HeaderComponent {
    constructor() {
        this.fileChange = new EventEmitter();
        this.docxFileChanged = new EventEmitter();
    }
    onFileChangeHandler(e) {
        const event = e;
        this.fileChange.emit(event);
    }
    save() {
        if (!this.docxFile.content) {
            return;
        }
        editableObjectToDocx({
            modifiedObjects: this.history[this.workspace.historyIndex].editablePhrases,
            fileIn: this.docxFile.content,
        }).then((newDocx) => {
            this.docxFileChanged.emit({
                name: this.docxFile.name,
                content: newDocx,
                lastModifiedDate: new Date().getTime(),
            });
        });
    }
    saveToComputer() {
        if (!this.docxFile.content) {
            return;
        }
        editableObjectToDocx({
            modifiedObjects: this.history[this.workspace.historyIndex].editablePhrases,
            fileIn: this.docxFile.content,
        }).then((newDocx) => {
            const url = URL.createObjectURL(newDocx);
            const link = document.createElement("a");
            link.href = url;
            link.download = this.docxFile.name;
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            // docxToString(newDocx).then((string) => {
            //   console.log(string);
            // });
        });
    }
    openDetailsModal() {
        this.workspace.detailsModal = true;
    }
    fileDropDownToggle() {
        this.workspace.fileDropDown = true;
        let clickCount = 0;
        const quitDropDown = (e) => {
            clickCount++;
            if (clickCount > 1) {
                this.workspace.fileDropDown = false;
                window.onclick = null;
            }
        };
        window.onclick = quitDropDown;
    }
}
HeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
HeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: HeaderComponent, selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]", inputs: { workspace: "workspace", docxFile: "docxFile", history: "history", uploadFileInput: "uploadFileInput", editablePhrases: "editablePhrases" }, outputs: { fileChange: "fileChange", docxFileChanged: "docxFileChanged" }, ngImport: i0, template: "<div class=\"header\">\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"onFileChangeHandler($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n  />\r\n  <div *ngIf=\"workspace.fileDropDown\" class=\"header__element__dropdown\">\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"save()\"\r\n    >\r\n      Guardar\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"saveToComputer()\"\r\n    >\r\n      Guardar a computadora\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      (click)=\"openDetailsModal()\"\r\n    >\r\n      Detalles\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      (click)=\"uploadFileInput.click()\"\r\n    >\r\n      Abrir template\r\n    </p>\r\n  </div>\r\n  <div\r\n    class=\"header__element header__element--file\"\r\n    (click)=\"fileDropDownToggle()\"\r\n  >\r\n    <label>Archivo</label>\r\n  </div>\r\n  <div class=\"header__element header__element--title\">\r\n    {{docxFile.name}}\r\n  </div>\r\n  <div class=\"header__element\" *ngIf=\"docxFile.lastModifiedDate\">\r\n    <!-- date with hour -->\r\n    \u00DAltima modificaci\u00F3n: {{docxFile.lastModifiedDate | date: 'dd/MM/yyyy HH:mm'}}\r\n  </div>\r\n</div>\r\n", styles: [".invisible{visibility:hidden;display:none}.header{top:0px!important;height:var(--header-height);width:100%;box-shadow:0 2px 4px #0003;z-index:10000;background-color:var(--elements-color);display:flex;flex-direction:row;position:relative}.header__element{border-right:1px solid #888;border-top:1px solid #888;padding:10px;display:flex;justify-content:center;align-items:center}.header__element:hover{background-color:#f0f0f0}.header__element--file{-webkit-user-select:none;user-select:none;width:150px}.header__element--title{flex-grow:1}.header__element__dropdown{position:absolute;display:flex;flex-direction:column;width:200px;background-color:#fff;margin-top:var(--header-height);z-index:10001;border:1px solid #888}.header__element__dropdown__item{margin:0;padding:10px;text-align:center;-webkit-user-select:none;user-select:none;cursor:pointer}.header__element__dropdown__item:hover{background-color:#f0f0f0}.header__element__dropdown__item--inactive{color:#0005}.header__element__dropdown__item--inactive{background-color:#fff!important;cursor:default}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "date": i1.DatePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]", template: "<div class=\"header\">\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"onFileChangeHandler($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n  />\r\n  <div *ngIf=\"workspace.fileDropDown\" class=\"header__element__dropdown\">\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"save()\"\r\n    >\r\n      Guardar\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"saveToComputer()\"\r\n    >\r\n      Guardar a computadora\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      (click)=\"openDetailsModal()\"\r\n    >\r\n      Detalles\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      (click)=\"uploadFileInput.click()\"\r\n    >\r\n      Abrir template\r\n    </p>\r\n  </div>\r\n  <div\r\n    class=\"header__element header__element--file\"\r\n    (click)=\"fileDropDownToggle()\"\r\n  >\r\n    <label>Archivo</label>\r\n  </div>\r\n  <div class=\"header__element header__element--title\">\r\n    {{docxFile.name}}\r\n  </div>\r\n  <div class=\"header__element\" *ngIf=\"docxFile.lastModifiedDate\">\r\n    <!-- date with hour -->\r\n    \u00DAltima modificaci\u00F3n: {{docxFile.lastModifiedDate | date: 'dd/MM/yyyy HH:mm'}}\r\n  </div>\r\n</div>\r\n", styles: [".invisible{visibility:hidden;display:none}.header{top:0px!important;height:var(--header-height);width:100%;box-shadow:0 2px 4px #0003;z-index:10000;background-color:var(--elements-color);display:flex;flex-direction:row;position:relative}.header__element{border-right:1px solid #888;border-top:1px solid #888;padding:10px;display:flex;justify-content:center;align-items:center}.header__element:hover{background-color:#f0f0f0}.header__element--file{-webkit-user-select:none;user-select:none;width:150px}.header__element--title{flex-grow:1}.header__element__dropdown{position:absolute;display:flex;flex-direction:column;width:200px;background-color:#fff;margin-top:var(--header-height);z-index:10001;border:1px solid #888}.header__element__dropdown__item{margin:0;padding:10px;text-align:center;-webkit-user-select:none;user-select:none;cursor:pointer}.header__element__dropdown__item:hover{background-color:#f0f0f0}.header__element__dropdown__item--inactive{color:#0005}.header__element__dropdown__item--inactive{background-color:#fff!important;cursor:default}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { workspace: [{
                type: Input
            }], docxFile: [{
                type: Input
            }], history: [{
                type: Input
            }], uploadFileInput: [{
                type: Input
            }], editablePhrases: [{
                type: Input
            }], fileChange: [{
                type: Output
            }], docxFileChanged: [{
                type: Output
            }] } });

class DoesStringRepresentPrimitivePipe {
    transform(value) {
        return (value === "number" ||
            value === "string" ||
            value === "boolean" ||
            value === "integer" ||
            value === "float");
    }
}
DoesStringRepresentPrimitivePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DoesStringRepresentPrimitivePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
DoesStringRepresentPrimitivePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DoesStringRepresentPrimitivePipe, name: "doesStringRepresentPrimitive" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DoesStringRepresentPrimitivePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "doesStringRepresentPrimitive",
                }]
        }] });

class FocusDirective {
    constructor(element) {
        this.element = element;
    }
    ngOnChanges() {
        if (this.focus) {
            const element = this.element.nativeElement;
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}
FocusDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: FocusDirective, deps: [{ token: ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
FocusDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: FocusDirective, selector: "[focus]", inputs: { focus: "focus" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: FocusDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[focus]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef, decorators: [{
                    type: Inject,
                    args: [ElementRef]
                }] }]; }, propDecorators: { focus: [{
                type: Input
            }] } });

class isObject {
    transform(value) {
        return typeof value === 'object';
    }
}
isObject.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: isObject, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
isObject.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: isObject, name: "isObject" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: isObject, decorators: [{
            type: Pipe,
            args: [{
                    name: 'isObject'
                }]
        }] });

class HasThesePropsPipe {
    transform(value, ...args) {
        if (typeof value !== 'object')
            return false;
        const props = Object.keys(value);
        const answersStorage = {};
        for (const prop of args) {
            if (props.includes(prop)) {
                answersStorage[prop] = value[prop];
            }
        }
        const isTrue = Object.keys(answersStorage).length === args.length;
        // debugger;
        return isTrue;
    }
}
HasThesePropsPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HasThesePropsPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
HasThesePropsPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HasThesePropsPipe, name: "hasTheseProps" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HasThesePropsPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'hasTheseProps'
                }]
        }] });

class TreeNodeComponent {
    constructor() {
        this.path = "";
        this.tabulationLenght = 20;
        this.showRealValue = false;
        this.isHovering = false;
    }
    ngOnInit() {
        if (this.tabulation == undefined) {
            this.tabulation = 0;
        }
    }
    setHovering(isHovering) {
        this.isHovering = isHovering;
    }
    // public showPath(item: Paradox): string {
    showPath(item) {
        return `{{${this.path + item.key}}}`;
    }
    pathToSend(item) {
        if (item.key === "items")
            return this.path + "∀.";
        if (item.key === "properties")
            return this.path + "";
        return this.path + item.key + ".";
    }
    showRealPath(e, index) {
        this.showRealValue = true;
        this.actualIndex = index;
        const element = e.target;
        element.onmouseleave = () => {
            this.showRealValue = false;
            element.onmouseleave = null;
        };
    }
    isFoundedItem(titleValue, pathValue) {
        titleValue = titleValue
            ?.trim()
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // replace accent characters to non accent characters
        pathValue = pathValue
            ?.trim()
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\./g, " ");
        const search = this.workspace.searchData
            ?.trim()
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\./g, " ");
        if (titleValue && search) {
            const includesInTitle = titleValue.includes(search);
            if (includesInTitle) {
                return true;
            }
            else {
                if (pathValue && search) {
                    return pathValue.includes(search);
                }
            }
        }
        return false;
    }
    replaceSelectionWithInnertext(e, type) {
        const primitivizerChecker = new DoesStringRepresentPrimitivePipe();
        const isPrimitive = primitivizerChecker.transform(type);
        if (!isPrimitive)
            return;
        let text = e.target.innerHTML;
        text = this.replaceArraySymbolToEachSentence(text);
        document.execCommand("insertText", true, text);
    }
    replaceArraySymbolToEachSentence(text) {
        const dividedText = text.replace(/[\{\}]/g, "").split(".");
        let posibleResult = "";
        for (let [index, sentence] of dividedText.entries()) {
            const regexToFindLastContentVariable = /}}{{([\w\.]+)}}{{\/each}}/g;
            const match = regexToFindLastContentVariable.exec(posibleResult);
            const arrayName = dividedText[index - 1];
            const arrayProp = dividedText[index + 1];
            if (sentence.includes("∀") &&
                !dividedText[index - 1]?.includes("∀") &&
                !dividedText[index + 1]?.includes("∀")) {
                if (!posibleResult) {
                    posibleResult = `{{#each ${arrayName}}}{{${arrayProp}}}{{/each}}`;
                }
                else {
                    // replace text of the first group
                    posibleResult = posibleResult.replace(match[1], `#each ${arrayName}}}{{${arrayProp}}}{{/each`);
                }
            }
            else if (match && !dividedText[index - 1]?.includes("∀")) {
                posibleResult = posibleResult.replace(match[1], `${match[1]}.${sentence}`);
            }
        }
        if (posibleResult)
            return posibleResult;
        return text;
    }
}
TreeNodeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TreeNodeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TreeNodeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: TreeNodeComponent, selector: "tree-node[workspace]", inputs: { node: "node", tabulation: "tabulation", path: "path", workspace: "workspace" }, viewQueries: [{ propertyName: "treeRoot", first: true, predicate: ["treeRoot"], descendants: true }], ngImport: i0, template: "<div\r\n  #treeRoot\r\n  *ngIf=\"node\"\r\n  (mouseenter)=\"setHovering(true)\"\r\n  (mouseleave)=\"setHovering(false)\"\r\n>\r\n  <div\r\n    #element\r\n    *ngFor=\"let item of (node | keyvalue), let i = index\"\r\n    comment=\"node = {name: 'alcachofas'}  --> |keyvalue --> node = [{key: 'name', value: 'alcachofas'}] --> node[0] as item --> {key: 'name', value: 'alcachofas'}\"\r\n    [ngStyle]=\"{'margin-left': tabulation+'px'}\"\r\n    class=\"not-draggable\"\r\n    (mouseover)=\"showRealPath($event, i)\"\r\n  >\r\n    <div\r\n      *ngIf=\"item.value.title\"\r\n      commment=\"if prop of node is an object and this object has a property called 'title'\"\r\n      (click)=\"replaceSelectionWithInnertext($event, item.value.type)\"\r\n      class=\"data-node\"\r\n      [class]=\"(item.value.type | doesStringRepresentPrimitive) ? 'primitive-value' : item.value.type === 'array' ? 'array-value' : 'not-primitive-value'\"\r\n      [class.founded]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      [focus]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      contenteditable=\"false\"\r\n      >{{ showRealValue && i==actualIndex && (item.value.type |\r\n      doesStringRepresentPrimitive) && isHovering ? showPath(item) :\r\n      (item.value.title) }}</div\r\n    >\r\n    <ng-container *ngIf=\"item.value | isObject\">\r\n      <tree-node\r\n        [node]=\"item.value\"\r\n        [tabulation]=\"((item.value | hasTheseProps:'title':'type') ? tabulationLenght : 0)\"\r\n        [path]=\"pathToSend(item)\"\r\n        [workspace]=\"workspace\"\r\n      ></tree-node>\r\n    </ng-container>\r\n  </div>\r\n</div>\r\n", styles: [".data-node{display:flex;white-space:nowrap}.data-node:hover{overflow:auto}.primitive-value{color:#0397e1;-webkit-text-decoration:dotted;text-decoration:dotted;cursor:pointer}.array-value{content:\"\\2b24  \";color:#b700ff;white-space:pre}.not-draggable{-webkit-user-select:none;user-select:none}.not-primitive-value:before{content:\"\\2b2a  \";color:#cf8787;white-space:pre}.array-value:before{content:\"[] \";color:#ca6161;white-space:pre}.primitive-value:before{content:\"- \";color:#003cff;white-space:pre}.founded{color:#6e0000;background-color:#ff8b56}.data-node::-webkit-scrollbar{height:5px;background-color:#f0f0f0}.data-node::-webkit-scrollbar-thumb{background-color:#888;border-radius:5px}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: TreeNodeComponent, selector: "tree-node[workspace]", inputs: ["node", "tabulation", "path", "workspace"] }], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: FocusDirective, selector: "[focus]", inputs: ["focus"] }], pipes: { "keyvalue": i1.KeyValuePipe, "doesStringRepresentPrimitive": DoesStringRepresentPrimitivePipe, "isObject": isObject, "hasTheseProps": HasThesePropsPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TreeNodeComponent, decorators: [{
            type: Component,
            args: [{ selector: "tree-node[workspace]", template: "<div\r\n  #treeRoot\r\n  *ngIf=\"node\"\r\n  (mouseenter)=\"setHovering(true)\"\r\n  (mouseleave)=\"setHovering(false)\"\r\n>\r\n  <div\r\n    #element\r\n    *ngFor=\"let item of (node | keyvalue), let i = index\"\r\n    comment=\"node = {name: 'alcachofas'}  --> |keyvalue --> node = [{key: 'name', value: 'alcachofas'}] --> node[0] as item --> {key: 'name', value: 'alcachofas'}\"\r\n    [ngStyle]=\"{'margin-left': tabulation+'px'}\"\r\n    class=\"not-draggable\"\r\n    (mouseover)=\"showRealPath($event, i)\"\r\n  >\r\n    <div\r\n      *ngIf=\"item.value.title\"\r\n      commment=\"if prop of node is an object and this object has a property called 'title'\"\r\n      (click)=\"replaceSelectionWithInnertext($event, item.value.type)\"\r\n      class=\"data-node\"\r\n      [class]=\"(item.value.type | doesStringRepresentPrimitive) ? 'primitive-value' : item.value.type === 'array' ? 'array-value' : 'not-primitive-value'\"\r\n      [class.founded]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      [focus]=\"isFoundedItem(item.value.title, showPath(item))\"\r\n      contenteditable=\"false\"\r\n      >{{ showRealValue && i==actualIndex && (item.value.type |\r\n      doesStringRepresentPrimitive) && isHovering ? showPath(item) :\r\n      (item.value.title) }}</div\r\n    >\r\n    <ng-container *ngIf=\"item.value | isObject\">\r\n      <tree-node\r\n        [node]=\"item.value\"\r\n        [tabulation]=\"((item.value | hasTheseProps:'title':'type') ? tabulationLenght : 0)\"\r\n        [path]=\"pathToSend(item)\"\r\n        [workspace]=\"workspace\"\r\n      ></tree-node>\r\n    </ng-container>\r\n  </div>\r\n</div>\r\n", styles: [".data-node{display:flex;white-space:nowrap}.data-node:hover{overflow:auto}.primitive-value{color:#0397e1;-webkit-text-decoration:dotted;text-decoration:dotted;cursor:pointer}.array-value{content:\"\\2b24  \";color:#b700ff;white-space:pre}.not-draggable{-webkit-user-select:none;user-select:none}.not-primitive-value:before{content:\"\\2b2a  \";color:#cf8787;white-space:pre}.array-value:before{content:\"[] \";color:#ca6161;white-space:pre}.primitive-value:before{content:\"- \";color:#003cff;white-space:pre}.founded{color:#6e0000;background-color:#ff8b56}.data-node::-webkit-scrollbar{height:5px;background-color:#f0f0f0}.data-node::-webkit-scrollbar-thumb{background-color:#888;border-radius:5px}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { treeRoot: [{
                type: ViewChild,
                args: ["treeRoot"]
            }], node: [{
                type: Input
            }], tabulation: [{
                type: Input
            }], path: [{
                type: Input
            }], workspace: [{
                type: Input
            }] } });

class DataComponent {
    constructor() {
        this.zoom = new Zoom();
    }
    ngAfterViewInit() {
        this.zoomSuscription = this.zoom.zoomObserver.subscribe(() => {
            this.updateDataColumnsAmmount();
        });
    }
    ngOnDestroy() {
        this.zoomSuscription.unsubscribe();
    }
    resizeDataContainerToCursorPosition(e) {
        const startX = e.clientX;
        const startWidth = this.dataElement.nativeElement.clientWidth;
        window.onmousemove = (e) => {
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            this.dataElement.nativeElement.style.width = `${newWidth}px`;
            this.updateDataColumnsAmmount();
            const onMouseUp = () => {
                window.onmousemove = null;
                window.onmouseup = null;
            };
            window.onmouseup = onMouseUp;
        };
        window.onmouseup = () => {
            window.onmousemove = null;
            window.onmouseup = null;
        };
    }
    searchInData(e) {
        const inputEvent = e;
        const searchData = inputEvent.target.value;
        this.workspace.searchData = searchData;
    }
    updateDataColumnsAmmount() {
        const newWidth = this.dataElement.nativeElement.clientWidth;
        if (this.dataContainerData) {
            if (newWidth > 1700) {
                this.dataContainerData.nativeElement.classList.add("workspace__data__data-container__data--three-columns");
            }
            else if (newWidth > 1000) {
                this.dataContainerData.nativeElement.classList.remove("workspace__data__data-container__data--three-columns");
                this.dataContainerData.nativeElement.classList.add("workspace__data__data-container__data--two-columns");
            }
            else if (newWidth < 1000) {
                this.dataContainerData.nativeElement.classList.remove("workspace__data__data-container__data--three-columns");
                this.dataContainerData.nativeElement.classList.remove("workspace__data__data-container__data--two-columns");
            }
        }
    }
}
DataComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DataComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
DataComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: DataComponent, selector: "workspace-data", inputs: { data: "data", workspace: "workspace" }, viewQueries: [{ propertyName: "dataElement", first: true, predicate: ["dataElement"], descendants: true }, { propertyName: "dataContainer", first: true, predicate: ["dataContainer"], descendants: true }, { propertyName: "dataContainerData", first: true, predicate: ["dataContainerData"], descendants: true }], ngImport: i0, template: "<div\r\n  #dataElement\r\n  class=\"workspace__data\"\r\n  (wheel)=\"zoom.makeZoom($event, workspace.dataZoom)\"\r\n>\r\n  <div class=\"workspace__data__content\">\r\n    <div\r\n      [ngStyle]=\"{'zoom': workspace.dataZoom.value}\"\r\n      #dataContainer\r\n      class=\"workspace__data__content__data-container\"\r\n    >\r\n      <input\r\n        class=\"workspace__data__content__search-bar\"\r\n        (input)=\"searchInData($event)\"\r\n      />\r\n      <div\r\n        #dataContainerData\r\n        class=\"workspace__data__content__data-container__data\"\r\n        *ngIf=\"data\"\r\n      >\r\n        <tree-node [node]=\"data\" [workspace]=\"workspace\"></tree-node>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div\r\n    #grabableBarData\r\n    class=\"workspace__data__content__grabable-bar\"\r\n    (mousedown)=\"resizeDataContainerToCursorPosition($event)\"\r\n  ></div>\r\n</div>\r\n", styles: [".workspace__data{height:100%;width:300px;min-width:60px;position:relative;display:flex;z-index:1000;flex-direction:row;overflow-y:hidden;background-color:var(--elements-color)}.workspace__data__content{overflow-y:scroll;width:100%}.workspace__data__content__data-container{width:100%;padding:15px;box-sizing:border-box;line-height:21px}.workspace__data__content__search-bar{position:absolute;height:var(--data-searchbar-height);z-index:1000;width:calc(100% - 40px);opacity:.8}.workspace__data__content__grabable-bar{position:absolute;-webkit-user-select:none;user-select:none;right:0;width:6px;height:100%;cursor:ew-resize}.workspace__data__content__data-container__grabable-bar:focus{cursor:col-resize}.workspace__data__content__data-container--zoom{overflow:hidden}.workspace__data__content__data-container__data{padding-top:calc(var(--data-searchbar-height) + 15px)}.workspace__data__content__data-container__data--two-columns{column-count:2}.workspace__data__content__data-container__data--three-columns{column-count:3}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: TreeNodeComponent, selector: "tree-node[workspace]", inputs: ["node", "tabulation", "path", "workspace"] }], directives: [{ type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DataComponent, decorators: [{
            type: Component,
            args: [{ selector: "workspace-data", template: "<div\r\n  #dataElement\r\n  class=\"workspace__data\"\r\n  (wheel)=\"zoom.makeZoom($event, workspace.dataZoom)\"\r\n>\r\n  <div class=\"workspace__data__content\">\r\n    <div\r\n      [ngStyle]=\"{'zoom': workspace.dataZoom.value}\"\r\n      #dataContainer\r\n      class=\"workspace__data__content__data-container\"\r\n    >\r\n      <input\r\n        class=\"workspace__data__content__search-bar\"\r\n        (input)=\"searchInData($event)\"\r\n      />\r\n      <div\r\n        #dataContainerData\r\n        class=\"workspace__data__content__data-container__data\"\r\n        *ngIf=\"data\"\r\n      >\r\n        <tree-node [node]=\"data\" [workspace]=\"workspace\"></tree-node>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div\r\n    #grabableBarData\r\n    class=\"workspace__data__content__grabable-bar\"\r\n    (mousedown)=\"resizeDataContainerToCursorPosition($event)\"\r\n  ></div>\r\n</div>\r\n", styles: [".workspace__data{height:100%;width:300px;min-width:60px;position:relative;display:flex;z-index:1000;flex-direction:row;overflow-y:hidden;background-color:var(--elements-color)}.workspace__data__content{overflow-y:scroll;width:100%}.workspace__data__content__data-container{width:100%;padding:15px;box-sizing:border-box;line-height:21px}.workspace__data__content__search-bar{position:absolute;height:var(--data-searchbar-height);z-index:1000;width:calc(100% - 40px);opacity:.8}.workspace__data__content__grabable-bar{position:absolute;-webkit-user-select:none;user-select:none;right:0;width:6px;height:100%;cursor:ew-resize}.workspace__data__content__data-container__grabable-bar:focus{cursor:col-resize}.workspace__data__content__data-container--zoom{overflow:hidden}.workspace__data__content__data-container__data{padding-top:calc(var(--data-searchbar-height) + 15px)}.workspace__data__content__data-container__data--two-columns{column-count:2}.workspace__data__content__data-container__data--three-columns{column-count:3}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { data: [{
                type: Input
            }], workspace: [{
                type: Input
            }], dataElement: [{
                type: ViewChild,
                args: ["dataElement"]
            }], dataContainer: [{
                type: ViewChild,
                args: ["dataContainer"]
            }], dataContainerData: [{
                type: ViewChild,
                args: ["dataContainerData"]
            }] } });

function addStr(opts) {
    return (opts.string.substring(0, opts.index) + opts.stringToAdd + opts.string.substring(opts.index, opts.string.length));
}

function replaceStr(opts) {
    return (opts.str.substring(0, opts.firstPos) +
        opts.stringToAdd +
        opts.str.substring(opts.secondPos));
}

const setCaretPosition = (el, pos) => {
    // Loop through all child nodes
    for (var node of el.childNodes) {
        if (node.nodeType == 3) {
            // we have a text node
            if (node.length >= pos) {
                // finally add our range
                var range = document.createRange(), sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done
            }
            else {
                pos -= node.length;
            }
        }
        else {
            pos = setCaretPosition(node, pos);
            if (pos == -1) {
                return -1; // no need to finish the for loop
            }
        }
    }
    return pos; // needed because of recursion stuff
};

class SelectionRangeDirective {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        if (this.selectionRange) {
            const targetElement = this.element.nativeElement;
            // set caret position at the selection range start
            setCaretPosition(targetElement, this.selectionRange.start);
        }
    }
    ngOnChanges() {
        if (this.selectionRange) {
            const targetElement = this.element.nativeElement;
            // set caret position at the selection range start
            setCaretPosition(targetElement, this.selectionRange.start);
        }
    }
}
SelectionRangeDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: SelectionRangeDirective, deps: [{ token: ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
SelectionRangeDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: SelectionRangeDirective, selector: "[selectionRange]", inputs: { selectionRange: "selectionRange" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: SelectionRangeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[selectionRange]",
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef, decorators: [{
                    type: Inject,
                    args: [ElementRef]
                }] }]; }, propDecorators: { selectionRange: [{
                type: Input
            }] } });

class EditablePhraseComponent {
    constructor() {
        this.editablePhraseChanged = new EventEmitter();
    }
    pasteContentWithoutStylesAndEnters(e, index) {
        // todo
        e.preventDefault();
        const element = e.target;
        let editablePhraseValue = element.innerText;
        let text = e.clipboardData.getData("text/plain")?.replace(/\n/g, " ");
        const selection = window.getSelection();
        const caretFirstPosition = selection.anchorOffset;
        const caretLastPosition = selection.focusOffset;
        let newTxt;
        if (caretFirstPosition === caretLastPosition) { // if caret is in the same position
            newTxt = addStr({
                string: editablePhraseValue,
                index: caretFirstPosition,
                stringToAdd: text,
            });
        }
        else {
            // replace text from caretFirstPosition to caretLastPosition
            newTxt = replaceStr({
                firstPos: caretFirstPosition,
                secondPos: caretLastPosition,
                str: editablePhraseValue,
                stringToAdd: text,
            });
        }
        // create input event
        var event = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        // set new value
        element.innerText = newTxt;
        element.dispatchEvent(event);
        setCaretPosition(element, caretFirstPosition);
    }
    onEdtitablePhraseChanged(e, index) {
        this.editablePhraseChanged.emit({ inputEvent: e, index });
    }
}
EditablePhraseComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EditablePhraseComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
EditablePhraseComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: EditablePhraseComponent, selector: "editable-phrases[editablePhrases][workspace]", inputs: { editablePhrases: "editablePhrases", workspace: "workspace" }, outputs: { editablePhraseChanged: "editablePhraseChanged" }, ngImport: i0, template: "<ng-container *ngFor=\"let editablePhrase of editablePhrases; let index = index\">\r\n  <br\r\n    *ngIf=\"editablePhrases[index-1] && editablePhrases[index-1].paragraphIndex < editablePhrase.paragraphIndex\"\r\n  />\r\n  <span\r\n    *ngIf=\"editablePhrase.value !== '\\r\\n'\"\r\n    class=\"editable-phrase\"\r\n    contentEditable=\"true\"\r\n    (input)=\"onEdtitablePhraseChanged($event, index)\"\r\n    (paste)=\"pasteContentWithoutStylesAndEnters($event, index)\"\r\n    (dragover)=\"$event.preventDefault()\"\r\n    [selectionRange]=\"workspace.lastModifiedEditablePhraseIndex === index ? workspace.lastSelection : undefined\"\r\n    [class.workspace__template__paper-container__paper__phrase--selected]=\"workspace.lastModifiedEditablePhraseIndex === index\"\r\n    >{{editablePhrase.value}}</span\r\n  >\r\n</ng-container>\r\n", styles: [".editable-phrase{white-space:pre-wrap;outline-color:#1196d8;font-size:13.4px;font-family:Arial;line-height:23px;display:inline;resize:none}.editable-phrase:focus{outline-style:dashed}\n"], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: SelectionRangeDirective, selector: "[selectionRange]", inputs: ["selectionRange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EditablePhraseComponent, decorators: [{
            type: Component,
            args: [{ selector: "editable-phrases[editablePhrases][workspace]", template: "<ng-container *ngFor=\"let editablePhrase of editablePhrases; let index = index\">\r\n  <br\r\n    *ngIf=\"editablePhrases[index-1] && editablePhrases[index-1].paragraphIndex < editablePhrase.paragraphIndex\"\r\n  />\r\n  <span\r\n    *ngIf=\"editablePhrase.value !== '\\r\\n'\"\r\n    class=\"editable-phrase\"\r\n    contentEditable=\"true\"\r\n    (input)=\"onEdtitablePhraseChanged($event, index)\"\r\n    (paste)=\"pasteContentWithoutStylesAndEnters($event, index)\"\r\n    (dragover)=\"$event.preventDefault()\"\r\n    [selectionRange]=\"workspace.lastModifiedEditablePhraseIndex === index ? workspace.lastSelection : undefined\"\r\n    [class.workspace__template__paper-container__paper__phrase--selected]=\"workspace.lastModifiedEditablePhraseIndex === index\"\r\n    >{{editablePhrase.value}}</span\r\n  >\r\n</ng-container>\r\n", styles: [".editable-phrase{white-space:pre-wrap;outline-color:#1196d8;font-size:13.4px;font-family:Arial;line-height:23px;display:inline;resize:none}.editable-phrase:focus{outline-style:dashed}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { editablePhrases: [{
                type: Input
            }], workspace: [{
                type: Input
            }], editablePhraseChanged: [{
                type: Output
            }] } });

const eachID$1 = '{{#each ';
const matchOneVariable$1 = /^[\S]+$/g;
const matchTail$1 = /tail\s?([\S][^\(\)\s]+)/g;
const eachHandler = (handlebar) => {
    let insideValue = filterValue$2(handlebar.value);
    if (insideValue.match(matchOneVariable$1)) {
        handlebar.value = insideValue;
    }
    else if (insideValue.match(matchTail$1)) {
        const match = matchTail$1.exec(insideValue);
        const variableName = match[1];
        handlebar.value = `${variableName}, exceptuando el primer elemento`;
    }
    handlebar.value = `Por cada elemento en ${handlebar.value}, mostrar:`;
    handlebar.handlebarType = 'each';
    handlebar.margin = handlebar.margin - 30;
    return handlebar;
};
const filterValue$2 = (value) => {
    let content = value.replace(eachID$1, '');
    content = content.replace('}}', '');
    return content;
};

const ifID$1 = '{{#if ';
const matchEveryPluck = /^\(every\s?\(pluck ([\S]+) '([\S]+)'\)\s?([\S]+)\)$/g;
const matchEqual = /^\(equal\s?([\S]+) '?([\S]+)'?\)$/g;
const matchOneVariable = /^[\S]+$/g;
const matchNotOneVariable = /^\(?not [\S]+\)?$/g;
const matchGreatherThan = /^\(?gt ([\S]+) (\d+)\)?$/g;
const matchTail = /tail\s?([\S][^\(\)\s]+)/g;
const ifHandler = (handlebar) => {
    let insideValue = filterValue$1(handlebar.value);
    if (insideValue.match(matchEveryPluck)) {
        const match = matchEveryPluck.exec(insideValue);
        const variableName = match[1];
        const selectedProp = match[2];
        const filter = match[3];
        handlebar.value = translateEveryPluck({ variableName, selectedProp, filter });
    }
    else if (insideValue.match(matchEqual)) {
        const match = matchEqual.exec(insideValue);
        const variableName = match[1];
        const selectedProp = match[2];
        handlebar.value = translateEqual({ variableName, comparedValue: selectedProp });
    }
    else if (insideValue.match(matchOneVariable)) {
        insideValue = cleanInsideValue(insideValue);
        insideValue = insideValue.concat(' contiene valor y no es falso y no es igual 0');
        handlebar.value = insideValue;
    }
    else if (insideValue.match(matchGreatherThan)) {
        const match = matchGreatherThan.exec(insideValue);
        const variableName = match[1];
        const selectedProp = match[2];
        handlebar.value = `el valor de ${variableName} es mayor a ${selectedProp}`;
    }
    else if (insideValue.match(matchNotOneVariable)) {
        insideValue = cleanInsideValue(insideValue);
        insideValue = insideValue.concat(' no contiene valor o es falso o es igual 0');
        handlebar.value = insideValue;
    }
    else if (insideValue.match(matchTail)) {
        const match = matchTail.exec(insideValue);
        const variableName = match[1];
        handlebar.value = `${variableName} contiene valor y no es falso y no es igual 0`;
    }
    handlebar.value = `Si ${handlebar.value}, entonces mostrar:`;
    handlebar.handlebarType = 'if';
    handlebar.margin = handlebar.margin - 30;
    return handlebar;
};
const filterValue$1 = (value) => {
    let content = value.replace(ifID$1, '');
    content = content.replace('}}', '');
    return content;
};
const cleanInsideValue = (insideValue) => {
    insideValue = insideValue.replace('@index', 'el numero del elemento que se está operando');
    insideValue = insideValue.replace('@last', 'es el último elemento de la lista y');
    insideValue = insideValue.replace(/[()]/g, '');
    insideValue = insideValue.replace('not ', '');
    return insideValue;
};
const translateEveryPluck = (opts) => {
    return `la propiedad ${opts.selectedProp} de TODOS los elementos de ${opts.variableName} son equivalentes a ${opts.filter}`;
};
const translateEqual = (opts) => {
    return `el valor de ${opts.variableName} es igual a ${opts.comparedValue}`;
};
// match if string has only a word, include @
const matchWord = /^[\S]+$/g;

const variableHandler = (handlebar) => {
    let insideValue = filterValue(handlebar.value);
    const variableName = getTheVariableName(insideValue);
    handlebar.handlebarType = 'variable';
    return handlebar;
};
const filterValue = (value) => {
    const regexQuitBraket = /[{}]/g;
    let result = value.replace(regexQuitBraket, '').trim();
    return result;
};
const getTheVariableName = (value) => {
    const regexClasifier = /[A-Za-z\.@]+/g;
    let result = value.match(regexClasifier);
    return result[result.length - 1];
};

const ifID = '{{#if';
const elseID = '{{else';
const eachID = '{{#each';
const closeBlock = '{{/';
const handlebarToInstruction = (handlebar) => {
    let result = handlebar;
    handlebar.value = handlebar.value.trim();
    if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: ifID })) {
        result = ifHandler(handlebar);
    }
    else if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: elseID })) {
        result.value = "De lo contrario, mostrar:";
        result.handlebarType = "if";
        result.margin = handlebar.margin;
    }
    else if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: eachID })) {
        result = eachHandler(handlebar);
    }
    else if (doesHadlebarMatchID({ txt: handlebar.value, handlebarID: closeBlock })) {
        result.value = '';
    }
    else {
        result = variableHandler(handlebar);
    }
    return result;
};
const doesHadlebarMatchID = (opts) => {
    let start = 0;
    opts.start ? start = opts.start : null;
    const txtSegment = opts.txt.substring(start, opts.handlebarID.length);
    return txtSegment === opts.handlebarID;
};

const clasificateStringBetweenTextAndHandlebars = (text) => {
    let result = [];
    const startHandlebar = '{{';
    const endHandlebar = '}}';
    const marginAmount = 30;
    let margin = 0;
    let stringStorage = '';
    for (let i = 0; i < text.length; i++) {
        const textFragment = text.substring(i, i + startHandlebar.length);
        if (textFragment === startHandlebar) {
            if (stringStorage) {
                result.push({
                    type: 'text',
                    value: stringStorage,
                    margin: margin
                });
            }
            stringStorage = text[i];
            if (text.substring(i + 2, i + 3) === '/') {
                margin -= marginAmount;
            }
            else if (text.substring(i + 2, i + 3) === '#') {
                margin += marginAmount;
            }
        }
        else if (textFragment === endHandlebar) {
            stringStorage += text.substring(i, i + endHandlebar.length);
            i = i + endHandlebar.length - 1;
            result.push({
                type: 'handlebar',
                value: stringStorage,
                margin: margin
            });
            stringStorage = "";
        }
        else {
            stringStorage += text[i];
        }
    }
    return result;
};

class VariableCheckerComponent {
    constructor() {
        this.hightlightExistingVariables = false;
        this.clickExistingVariable = new EventEmitter();
        this.clickNonExistingVariable = new EventEmitter();
    }
    onClickExistingVariable(mouseEvent) {
        this.clickExistingVariable.emit(mouseEvent);
    }
    onClickNonExistingVariable(mouseEvent) {
        this.clickNonExistingVariable.emit(mouseEvent);
    }
}
VariableCheckerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableCheckerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
VariableCheckerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: VariableCheckerComponent, selector: "variable-checker[input]", inputs: { input: "input", hightlightExistingVariables: "hightlightExistingVariables" }, outputs: { clickExistingVariable: "clickExistingVariable", clickNonExistingVariable: "clickNonExistingVariable" }, ngImport: i0, template: "<span *ngIf=\"!input.isVariable\">{{input.value}}</span>\r\n<span\r\n  *ngIf=\"input.isVariable && input.exist\"\r\n  (click)=\"onClickExistingVariable($event)\"\r\n  [class]=\"hightlightExistingVariables ? 'variable-checker__isVariableAndExist' : undefined\"\r\n  >{{input.value}}</span\r\n>\r\n<span\r\n  *ngIf=\"input.isVariable && !input.exist\"\r\n  (click)=\"onClickNonExistingVariable($event)\"\r\n  class=\"variable-checker__isVariableAndNotExist\"\r\n  >{{input.value}}</span\r\n>\r\n", styles: [".variable-checker__isVariableAndNotExist{border-bottom:2px dotted red;background-color:#f002}.variable-checker__isVariableAndNotExist:hover{cursor:help}.variable-checker__isVariableAndExist{background-color:#0002;color:#01a}.variable-checker__isVariableAndExist:hover{cursor:alias}\n"], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableCheckerComponent, decorators: [{
            type: Component,
            args: [{ selector: "variable-checker[input]", template: "<span *ngIf=\"!input.isVariable\">{{input.value}}</span>\r\n<span\r\n  *ngIf=\"input.isVariable && input.exist\"\r\n  (click)=\"onClickExistingVariable($event)\"\r\n  [class]=\"hightlightExistingVariables ? 'variable-checker__isVariableAndExist' : undefined\"\r\n  >{{input.value}}</span\r\n>\r\n<span\r\n  *ngIf=\"input.isVariable && !input.exist\"\r\n  (click)=\"onClickNonExistingVariable($event)\"\r\n  class=\"variable-checker__isVariableAndNotExist\"\r\n  >{{input.value}}</span\r\n>\r\n", styles: [".variable-checker__isVariableAndNotExist{border-bottom:2px dotted red;background-color:#f002}.variable-checker__isVariableAndNotExist:hover{cursor:help}.variable-checker__isVariableAndExist{background-color:#0002;color:#01a}.variable-checker__isVariableAndExist:hover{cursor:alias}\n"] }]
        }], propDecorators: { input: [{
                type: Input
            }], hightlightExistingVariables: [{
                type: Input
            }], clickExistingVariable: [{
                type: Output
            }], clickNonExistingVariable: [{
                type: Output
            }] } });

const stringToIsVariableAndExist = (text, data) => {
    const result = [];
    // const isVariableRegex = /([^({\s]+\.[^})\s]+)/g;
    const isVariableRegex = /([^({}\s]+\w\.[^{})\s]+)/g;
    // separe the matches and non matches into an array of objects:
    text.split(isVariableRegex).forEach((part) => {
        const isThereAMatchWithRegex = part.match(isVariableRegex)?.length;
        let isVariable = false, exist = false;
        if (isThereAMatchWithRegex) {
            isVariable = true;
            exist = checkIfPathExists(data, part);
        }
        result.push({
            value: part,
            isVariable,
            exist,
        });
    });
    return result;
};
// function that checks if a path exists in an object
function checkIfPathExists(obj, path) {
    return path
        .trim()
        .split(".")
        .every(function (key) {
        if (obj) {
            const objProps = obj["properties"];
            if (objProps) {
                obj = objProps;
            }
            obj = obj[key];
        }
        return obj;
    });
}

class VariableExistPipe {
    // text was typed as string, but packagr compiler can't understand it
    transform(text, object) {
        return stringToIsVariableAndExist(text, object);
    }
}
VariableExistPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableExistPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
VariableExistPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableExistPipe, name: "variableExist" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: VariableExistPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'variableExist'
                }]
        }] });

class ViewablePhraseComponent {
    constructor() {
        this.showModal = {
            phraseIndex: 0,
            showModal: false,
            modalPosition: { x: 0, y: 0 },
            arrowPosition: { x: 0 },
            data: undefined,
        };
        this.createClickoffListener = () => {
            window.addEventListener("click", () => {
                this.showModal.showModal = false;
            });
        };
    }
    ngAfterViewInit() {
        this.createClickoffListener();
    }
    showModalToggle(e, phraseIndex) {
        e.stopPropagation();
        this.showModal.phraseIndex = phraseIndex;
        this.showModal.showModal = !this.showModal.showModal;
        this.showModal.modalPosition.x = e.clientX;
        this.showModal.modalPosition.y = e.clientY - window.scrollY;
        this.translateHandlebarToInstructions(phraseIndex);
    }
    handlebarsToReadableIntructions(clasifiedText) {
        let result = [];
        result = clasifiedText.map((clasifiedTextOrHandlebar) => {
            if (clasifiedTextOrHandlebar.type === "handlebar") {
                clasifiedTextOrHandlebar = handlebarToInstruction(clasifiedTextOrHandlebar);
            }
            return clasifiedTextOrHandlebar;
        });
        return result;
    }
    translateHandlebarToInstructions(viewablePhraseIndex) {
        const handlebar = this.viewablePhrases[viewablePhraseIndex].value;
        const clasifiedText = clasificateStringBetweenTextAndHandlebars(handlebar);
        const readableInstructions = this.handlebarsToReadableIntructions(clasifiedText);
        this.showModal.data = readableInstructions;
    }
    setSearchData(e) {
        // get text from the clicked element
        e.stopImmediatePropagation();
        const element = e.target;
        this.workspace.searchData = element.innerHTML;
    }
    stopClickPropagation(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
}
ViewablePhraseComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ViewablePhraseComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ViewablePhraseComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: ViewablePhraseComponent, selector: "viewable-phrases[viewablePhrases][data][workspace]", inputs: { viewablePhrases: "viewablePhrases", data: "data", workspace: "workspace" }, ngImport: i0, template: "<ng-container *ngIf=\"viewablePhrases\"> \r\n  <ng-container *ngFor=\"let viewablePhrase of viewablePhrases; let i = index\">\r\n    <div\r\n      [class.viewable-phrase--typed]=\"viewablePhrase.type !== 'text'\"\r\n      [class.viewable-phrase--if]=\"viewablePhrase.type === 'if'\"\r\n      [class.viewable-phrase--handlebar]=\"viewablePhrase.type === 'handlebar'\"\r\n      [class.viewable-phrase--each]=\"viewablePhrase.type === 'each'\"\r\n      style=\"position: relative;\"\r\n      class=\"viewable-phrase\"\r\n      type=\"text\"\r\n      spellcheck=\"true\"\r\n      (click)=\"viewablePhrase.type !== 'text' ? showModalToggle($event,i) : undefined\"\r\n    >\r\n      <span *ngIf=\"viewablePhrase.type === 'text'\"\r\n        >{{viewablePhrase.value}}</span\r\n      >\r\n      <ng-container *ngIf=\"viewablePhrase.type !== 'text'\">\r\n        <ng-container\r\n          *ngFor=\"let variableChecker of viewablePhrase.value|variableExist:data\"\r\n          comment=\"I have to force the variable viewablePhrase to be string\"\r\n        >\r\n          <variable-checker\r\n            [input]=\"variableChecker\"\r\n            (clickExistingVariable)=\"setSearchData($event)\"\r\n            (clickNonExistingVariable)=\"stopClickPropagation($event)\"\r\n            [hightlightExistingVariables]=\"true\"\r\n            comment=\"check later\"\r\n          ></variable-checker>\r\n        </ng-container>\r\n\r\n        <!-- translated-instruction-modal -->\r\n        <div\r\n          #popup\r\n          class=\"window-modal\"\r\n          *ngIf=\"showModal.showModal && showModal.phraseIndex === i\"\r\n          (click)=\"stopClickPropagation($event)\"\r\n        >\r\n          <div class=\"window-modal__notch\">\r\n            <div class=\"window-modal__notch__triangle\"></div>\r\n          </div>\r\n          <div\r\n            *ngFor=\"let readableInstruction of showModal.data\"\r\n            [style]=\"'margin-left: '+readableInstruction.margin+'px'\"\r\n            class=\"readable-intruction\"\r\n            [class.readable-intruction--if]=\"readableInstruction.handlebarType === 'if'\"\r\n            [class.readable-intruction--each]=\"readableInstruction.handlebarType === 'each'\"\r\n            [class.readable-intruction--variable]=\"readableInstruction.handlebarType === 'variable'\"\r\n          >\r\n            <!-- {{readableInstruction.value}} -->\r\n            <span *ngIf=\"readableInstruction.type === 'text'\"\r\n              >{{readableInstruction.value}}</span\r\n            >\r\n            <ng-container *ngIf=\"readableInstruction.type !== 'text'\">\r\n              <ng-container\r\n                *ngFor=\"let variableChecker of readableInstruction.value|variableExist:data\"\r\n              >\r\n                <!-- this clasificates the variable checker into if, each, or variable. In other words, colors the sentenses. -->\r\n                <variable-checker\r\n                  [input]=\"variableChecker\"\r\n                  (clickExistingVariable)=\"setSearchData($event)\"\r\n                  [hightlightExistingVariables]=\"true\"\r\n                ></variable-checker>\r\n              </ng-container>\r\n            </ng-container>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n    </div>\r\n  </ng-container>\r\n</ng-container>\r\n", styles: ["*{--if-color: #1196d870;--handlebar-color: #7bd81170;--each-color: #ffae0070}.viewable-phrase-container{display:inline}.viewable-phrase{white-space:pre-wrap;outline-color:#1196d8;position:relative;font-size:13.4px;font-family:Arial;line-height:23px;box-sizing:border-box;display:inline;resize:none;cursor:default}.viewable-phrase--typed{cursor:pointer}.viewable-phrase--typed:hover{-webkit-user-select:none;user-select:none;outline:2px solid #ff0000}.viewable-phrase--if{background-color:var(--if-color)}.viewable-phrase--handlebar{background-color:var(--handlebar-color)}.viewable-phrase--each{background-color:var(--each-color)}.readable-intruction--if{background-color:var(--if-color)}.readable-intruction--each{background-color:var(--each-color)}.readable-intruction--variable{background-color:var(--handlebar-color)}.window-modal{height:-moz-fit-content;height:fit-content;width:300px;max-height:460px;resize:both;overflow:auto;background-color:#fff;z-index:2000;padding:8px;position:absolute;border:dotted;left:0;box-shadow:0 0 5px #000}.window-modal__notch{top:-18px;position:relative;left:0;width:0;height:0;z-index:10}.window-modal__notch__triangle{--shape-width: 8px;border-left:calc(var(--shape-width) * .5) solid transparent;border-right:calc(var(--shape-width) * .5) solid transparent;border-bottom:var(--shape-width) solid black}\n"], components: [{ type: VariableCheckerComponent, selector: "variable-checker[input]", inputs: ["input", "hightlightExistingVariables"], outputs: ["clickExistingVariable", "clickNonExistingVariable"] }], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], pipes: { "variableExist": VariableExistPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ViewablePhraseComponent, decorators: [{
            type: Component,
            args: [{ selector: "viewable-phrases[viewablePhrases][data][workspace]", template: "<ng-container *ngIf=\"viewablePhrases\"> \r\n  <ng-container *ngFor=\"let viewablePhrase of viewablePhrases; let i = index\">\r\n    <div\r\n      [class.viewable-phrase--typed]=\"viewablePhrase.type !== 'text'\"\r\n      [class.viewable-phrase--if]=\"viewablePhrase.type === 'if'\"\r\n      [class.viewable-phrase--handlebar]=\"viewablePhrase.type === 'handlebar'\"\r\n      [class.viewable-phrase--each]=\"viewablePhrase.type === 'each'\"\r\n      style=\"position: relative;\"\r\n      class=\"viewable-phrase\"\r\n      type=\"text\"\r\n      spellcheck=\"true\"\r\n      (click)=\"viewablePhrase.type !== 'text' ? showModalToggle($event,i) : undefined\"\r\n    >\r\n      <span *ngIf=\"viewablePhrase.type === 'text'\"\r\n        >{{viewablePhrase.value}}</span\r\n      >\r\n      <ng-container *ngIf=\"viewablePhrase.type !== 'text'\">\r\n        <ng-container\r\n          *ngFor=\"let variableChecker of viewablePhrase.value|variableExist:data\"\r\n          comment=\"I have to force the variable viewablePhrase to be string\"\r\n        >\r\n          <variable-checker\r\n            [input]=\"variableChecker\"\r\n            (clickExistingVariable)=\"setSearchData($event)\"\r\n            (clickNonExistingVariable)=\"stopClickPropagation($event)\"\r\n            [hightlightExistingVariables]=\"true\"\r\n            comment=\"check later\"\r\n          ></variable-checker>\r\n        </ng-container>\r\n\r\n        <!-- translated-instruction-modal -->\r\n        <div\r\n          #popup\r\n          class=\"window-modal\"\r\n          *ngIf=\"showModal.showModal && showModal.phraseIndex === i\"\r\n          (click)=\"stopClickPropagation($event)\"\r\n        >\r\n          <div class=\"window-modal__notch\">\r\n            <div class=\"window-modal__notch__triangle\"></div>\r\n          </div>\r\n          <div\r\n            *ngFor=\"let readableInstruction of showModal.data\"\r\n            [style]=\"'margin-left: '+readableInstruction.margin+'px'\"\r\n            class=\"readable-intruction\"\r\n            [class.readable-intruction--if]=\"readableInstruction.handlebarType === 'if'\"\r\n            [class.readable-intruction--each]=\"readableInstruction.handlebarType === 'each'\"\r\n            [class.readable-intruction--variable]=\"readableInstruction.handlebarType === 'variable'\"\r\n          >\r\n            <!-- {{readableInstruction.value}} -->\r\n            <span *ngIf=\"readableInstruction.type === 'text'\"\r\n              >{{readableInstruction.value}}</span\r\n            >\r\n            <ng-container *ngIf=\"readableInstruction.type !== 'text'\">\r\n              <ng-container\r\n                *ngFor=\"let variableChecker of readableInstruction.value|variableExist:data\"\r\n              >\r\n                <!-- this clasificates the variable checker into if, each, or variable. In other words, colors the sentenses. -->\r\n                <variable-checker\r\n                  [input]=\"variableChecker\"\r\n                  (clickExistingVariable)=\"setSearchData($event)\"\r\n                  [hightlightExistingVariables]=\"true\"\r\n                ></variable-checker>\r\n              </ng-container>\r\n            </ng-container>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n    </div>\r\n  </ng-container>\r\n</ng-container>\r\n", styles: ["*{--if-color: #1196d870;--handlebar-color: #7bd81170;--each-color: #ffae0070}.viewable-phrase-container{display:inline}.viewable-phrase{white-space:pre-wrap;outline-color:#1196d8;position:relative;font-size:13.4px;font-family:Arial;line-height:23px;box-sizing:border-box;display:inline;resize:none;cursor:default}.viewable-phrase--typed{cursor:pointer}.viewable-phrase--typed:hover{-webkit-user-select:none;user-select:none;outline:2px solid #ff0000}.viewable-phrase--if{background-color:var(--if-color)}.viewable-phrase--handlebar{background-color:var(--handlebar-color)}.viewable-phrase--each{background-color:var(--each-color)}.readable-intruction--if{background-color:var(--if-color)}.readable-intruction--each{background-color:var(--each-color)}.readable-intruction--variable{background-color:var(--handlebar-color)}.window-modal{height:-moz-fit-content;height:fit-content;width:300px;max-height:460px;resize:both;overflow:auto;background-color:#fff;z-index:2000;padding:8px;position:absolute;border:dotted;left:0;box-shadow:0 0 5px #000}.window-modal__notch{top:-18px;position:relative;left:0;width:0;height:0;z-index:10}.window-modal__notch__triangle{--shape-width: 8px;border-left:calc(var(--shape-width) * .5) solid transparent;border-right:calc(var(--shape-width) * .5) solid transparent;border-bottom:var(--shape-width) solid black}\n"] }]
        }], propDecorators: { viewablePhrases: [{
                type: Input
            }], data: [{
                type: Input
            }], workspace: [{
                type: Input
            }] } });

class WorkspaceComponent {
    constructor() {
        this.editablePhraseChanged = new EventEmitter();
        this.zoom = new Zoom();
    }
    onEditablePhraseChanged(e, index) {
        const inputEvent = e;
        this.editablePhraseChanged.emit({
            inputEvent,
            indexOfEditablePhrase: index,
        });
    }
    disableEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }
}
WorkspaceComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: WorkspaceComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
WorkspaceComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: WorkspaceComponent, selector: "app-workspace[data][workspace][editablePhrases][fileInput][viewablePhrases]", inputs: { data: "data", workspace: "workspace", editablePhrases: "editablePhrases", fileInput: "fileInput", viewablePhrases: "viewablePhrases" }, outputs: { editablePhraseChanged: "editablePhraseChanged" }, ngImport: i0, template: "<div class=\"workspace\">\r\n  <workspace-data [data]=\"data\" [workspace]=\"workspace\"></workspace-data>\r\n  <div\r\n    #templateContainer\r\n    class=\"workspace__template\"\r\n    (wheel)=\"zoom.makeZoom($event, workspace.paperZoom)\"\r\n  >\r\n    <div class=\"workspace__template__import\" *ngIf=\"!editablePhrases.length\">\r\n      <h2 (click)=\"fileInput.click()\" class=\"workspace__template__import__text\">\r\n        Importa un template o un documento de Word\r\n      </h2>\r\n    </div>\r\n    <div\r\n      class=\"workspace__template__paper-container\"\r\n      [ngStyle]=\"{'zoom': workspace.paperZoom.value}\"\r\n      [class.workspace__template__paper-container--double-paper]=\"workspace.mode === 'editView'\"\r\n    >\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'edit' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"editablePhrases.length > 0\">\r\n          <editable-phrases\r\n            [editablePhrases]=\"editablePhrases\"\r\n            [workspace]=\"workspace\"\r\n            (editablePhraseChanged)=\"onEditablePhraseChanged($event.inputEvent, $event.index)\"\r\n          ></editable-phrases>\r\n        </div>\r\n      </div>\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'view' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"viewablePhrases\">\r\n          <viewable-phrases\r\n            [viewablePhrases]=\"viewablePhrases\"\r\n            [data]=\"data\"\r\n            [workspace]=\"workspace\"\r\n          ></viewable-phrases>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["*{box-sizing:border-box!important}.workspace{display:flex;flex-direction:row;position:relative;height:100%;max-height:100%}.workspace__template{flex-grow:1;width:0px;position:relative;overflow:auto;overflow-y:auto}.workspace__template__import{display:flex;justify-content:center;align-items:center;width:100%;height:100%}.workspace__template__import__text{padding:30px;background-color:#fff;border:1px dashed #888;border-radius:20px;box-shadow:0 2px 4px #0003;transition-duration:.3s;margin:20px;-webkit-user-select:none;user-select:none;cursor:pointer}.workspace__template__import__text:hover{box-shadow:0 0 32px 16px #0000004d}.workspace__template__loading{height:100%;width:100%;flex-grow:1;background-color:#00000025;position:absolute;z-index:10001;top:0;left:0;display:flex;justify-content:center}.workspace__template__paper-container{flex-grow:1;min-width:calc(var(--legalSizeSheet-width) + 50px);display:flex;justify-content:center;position:relative;line-height:25px}.workspace__template__paper-container--double-paper{min-width:calc(var(--legalSizeSheet-width) * 2 + 100px)}.workspace__template__paper-container__paper{width:var(--legalSizeSheet-width);min-width:var(--legalSizeSheet-width);min-height:var(--legalSizeSheet-height);background-color:var(--elements-color);box-shadow:0 0 10px #0000004d;border-radius:10px;padding:72.7px;margin:20px 20px 20px 0;position:relative}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: DataComponent, selector: "workspace-data", inputs: ["data", "workspace"] }, { type: EditablePhraseComponent, selector: "editable-phrases[editablePhrases][workspace]", inputs: ["editablePhrases", "workspace"], outputs: ["editablePhraseChanged"] }, { type: ViewablePhraseComponent, selector: "viewable-phrases[viewablePhrases][data][workspace]", inputs: ["viewablePhrases", "data", "workspace"] }], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: WorkspaceComponent, decorators: [{
            type: Component,
            args: [{ selector: "app-workspace[data][workspace][editablePhrases][fileInput][viewablePhrases]", template: "<div class=\"workspace\">\r\n  <workspace-data [data]=\"data\" [workspace]=\"workspace\"></workspace-data>\r\n  <div\r\n    #templateContainer\r\n    class=\"workspace__template\"\r\n    (wheel)=\"zoom.makeZoom($event, workspace.paperZoom)\"\r\n  >\r\n    <div class=\"workspace__template__import\" *ngIf=\"!editablePhrases.length\">\r\n      <h2 (click)=\"fileInput.click()\" class=\"workspace__template__import__text\">\r\n        Importa un template o un documento de Word\r\n      </h2>\r\n    </div>\r\n    <div\r\n      class=\"workspace__template__paper-container\"\r\n      [ngStyle]=\"{'zoom': workspace.paperZoom.value}\"\r\n      [class.workspace__template__paper-container--double-paper]=\"workspace.mode === 'editView'\"\r\n    >\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'edit' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"editablePhrases.length > 0\">\r\n          <editable-phrases\r\n            [editablePhrases]=\"editablePhrases\"\r\n            [workspace]=\"workspace\"\r\n            (editablePhraseChanged)=\"onEditablePhraseChanged($event.inputEvent, $event.index)\"\r\n          ></editable-phrases>\r\n        </div>\r\n      </div>\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'view' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"viewablePhrases\">\r\n          <viewable-phrases\r\n            [viewablePhrases]=\"viewablePhrases\"\r\n            [data]=\"data\"\r\n            [workspace]=\"workspace\"\r\n          ></viewable-phrases>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["*{box-sizing:border-box!important}.workspace{display:flex;flex-direction:row;position:relative;height:100%;max-height:100%}.workspace__template{flex-grow:1;width:0px;position:relative;overflow:auto;overflow-y:auto}.workspace__template__import{display:flex;justify-content:center;align-items:center;width:100%;height:100%}.workspace__template__import__text{padding:30px;background-color:#fff;border:1px dashed #888;border-radius:20px;box-shadow:0 2px 4px #0003;transition-duration:.3s;margin:20px;-webkit-user-select:none;user-select:none;cursor:pointer}.workspace__template__import__text:hover{box-shadow:0 0 32px 16px #0000004d}.workspace__template__loading{height:100%;width:100%;flex-grow:1;background-color:#00000025;position:absolute;z-index:10001;top:0;left:0;display:flex;justify-content:center}.workspace__template__paper-container{flex-grow:1;min-width:calc(var(--legalSizeSheet-width) + 50px);display:flex;justify-content:center;position:relative;line-height:25px}.workspace__template__paper-container--double-paper{min-width:calc(var(--legalSizeSheet-width) * 2 + 100px)}.workspace__template__paper-container__paper{width:var(--legalSizeSheet-width);min-width:var(--legalSizeSheet-width);min-height:var(--legalSizeSheet-height);background-color:var(--elements-color);box-shadow:0 0 10px #0000004d;border-radius:10px;padding:72.7px;margin:20px 20px 20px 0;position:relative}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { data: [{
                type: Input
            }], workspace: [{
                type: Input
            }], editablePhrases: [{
                type: Input
            }], fileInput: [{
                type: Input
            }], viewablePhrases: [{
                type: Input
            }], editablePhraseChanged: [{
                type: Output
            }] } });

class FooterComponent {
    constructor() {
        this.clickEditMode = new EventEmitter();
        this.clickViewMode = new EventEmitter();
        this.clickSimulationMode = new EventEmitter();
        this.zoom = new Zoom();
    }
    onClickEditMode(e) {
        this.clickEditMode.emit(e);
    }
    onClickViewMode(e) {
        this.clickViewMode.emit(e);
    }
    onClickSimulationMode(e) {
        this.clickSimulationMode.emit(e);
    }
    ngOnInit() {
    }
}
FooterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: FooterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
FooterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: FooterComponent, selector: "app-footer[workspace]", inputs: { workspace: "workspace" }, outputs: { clickEditMode: "clickEditMode", clickViewMode: "clickViewMode", clickSimulationMode: "clickSimulationMode" }, ngImport: i0, template: "<footer class=\"status-bar\">\r\n  <div class=\"status-bar__zoom-container\">\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomOut(workspace.dataZoom)\">\r\n      -\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomNormal(workspace.dataZoom)\">\r\n      {{workspace.dataZoom.value * 100 | number}}%\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomIn(workspace.dataZoom)\">\r\n      +\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"status-bar__mode-container\">\r\n    <div class=\"status-bar__mode-container__item\" style=\"cursor: default;\">\r\n      Modo:\r\n    </div>\r\n    <div\r\n      class=\"status-bar__mode-container__item\"\r\n      [class]=\"workspace.mode==='edit'||workspace.mode==='editView' ? 'status-bar__mode-container__item--selected' : undefined\"\r\n      (click)=\"onClickEditMode($event)\"\r\n    >\r\n      Edici\u00F3n\r\n    </div>\r\n    <div\r\n      class=\"status-bar__mode-container__item\"\r\n      [class]=\"workspace.mode==='view'||workspace.mode==='editView' ? 'status-bar__mode-container__item--selected' : undefined\"\r\n      (click)=\"onClickViewMode($event)\"\r\n    >\r\n      Vista\r\n    </div>\r\n    <div\r\n      class=\"status-bar__mode-container__item\"\r\n      [class]=\"workspace.mode==='simulation' ? 'status-bar__mode-container__item--selected' : undefined\"\r\n      (click)=\"onClickSimulationMode($event)\"\r\n    >\r\n      Simulaci\u00F3n\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"status-bar__zoom-container status-bar__zoom-container--right\">\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomOut(workspace.paperZoom)\">\r\n      -\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomNormal(workspace.paperZoom)\">\r\n      {{workspace.paperZoom.value * 100 | number}}%\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomIn(workspace.paperZoom)\">\r\n      +\r\n    </div>\r\n  </div>\r\n</footer>\r\n", styles: [".status-bar{height:var(--footer-height);width:100%;z-index:10000;bottom:0;background-color:#00a4f7;display:flex;flex-direction:row}.status-bar__zoom-container{display:flex;flex-direction:row;justify-content:center;align-items:center;padding:10px}.status-bar__zoom-container--right{margin-left:auto}.status-bar__zoom-container__element{padding:0 5px;-webkit-user-select:none;user-select:none;display:flex;justify-content:center;align-items:center}.status-bar__zoom-container__element:hover{cursor:pointer;background-color:#1196d8}.status-bar__mode-container{display:flex;flex-direction:row;justify-content:center;align-items:center;padding:10px;-webkit-user-select:none;user-select:none}.status-bar__mode-container__item{padding:0 6px;cursor:pointer}.status-bar__mode-container__item--selected{background-color:#00e2e2}\n"], pipes: { "number": i1.DecimalPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: FooterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-footer[workspace]', template: "<footer class=\"status-bar\">\r\n  <div class=\"status-bar__zoom-container\">\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomOut(workspace.dataZoom)\">\r\n      -\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomNormal(workspace.dataZoom)\">\r\n      {{workspace.dataZoom.value * 100 | number}}%\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomIn(workspace.dataZoom)\">\r\n      +\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"status-bar__mode-container\">\r\n    <div class=\"status-bar__mode-container__item\" style=\"cursor: default;\">\r\n      Modo:\r\n    </div>\r\n    <div\r\n      class=\"status-bar__mode-container__item\"\r\n      [class]=\"workspace.mode==='edit'||workspace.mode==='editView' ? 'status-bar__mode-container__item--selected' : undefined\"\r\n      (click)=\"onClickEditMode($event)\"\r\n    >\r\n      Edici\u00F3n\r\n    </div>\r\n    <div\r\n      class=\"status-bar__mode-container__item\"\r\n      [class]=\"workspace.mode==='view'||workspace.mode==='editView' ? 'status-bar__mode-container__item--selected' : undefined\"\r\n      (click)=\"onClickViewMode($event)\"\r\n    >\r\n      Vista\r\n    </div>\r\n    <div\r\n      class=\"status-bar__mode-container__item\"\r\n      [class]=\"workspace.mode==='simulation' ? 'status-bar__mode-container__item--selected' : undefined\"\r\n      (click)=\"onClickSimulationMode($event)\"\r\n    >\r\n      Simulaci\u00F3n\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"status-bar__zoom-container status-bar__zoom-container--right\">\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomOut(workspace.paperZoom)\">\r\n      -\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomNormal(workspace.paperZoom)\">\r\n      {{workspace.paperZoom.value * 100 | number}}%\r\n    </div>\r\n    <div class=\"status-bar__zoom-container__element\" (click)=\"zoom.zoomIn(workspace.paperZoom)\">\r\n      +\r\n    </div>\r\n  </div>\r\n</footer>\r\n", styles: [".status-bar{height:var(--footer-height);width:100%;z-index:10000;bottom:0;background-color:#00a4f7;display:flex;flex-direction:row}.status-bar__zoom-container{display:flex;flex-direction:row;justify-content:center;align-items:center;padding:10px}.status-bar__zoom-container--right{margin-left:auto}.status-bar__zoom-container__element{padding:0 5px;-webkit-user-select:none;user-select:none;display:flex;justify-content:center;align-items:center}.status-bar__zoom-container__element:hover{cursor:pointer;background-color:#1196d8}.status-bar__mode-container{display:flex;flex-direction:row;justify-content:center;align-items:center;padding:10px;-webkit-user-select:none;user-select:none}.status-bar__mode-container__item{padding:0 6px;cursor:pointer}.status-bar__mode-container__item--selected{background-color:#00e2e2}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { workspace: [{
                type: Input
            }], clickEditMode: [{
                type: Output
            }], clickViewMode: [{
                type: Output
            }], clickSimulationMode: [{
                type: Output
            }] } });

class AppComponent {
    constructor() {
        this.title = "template-editor";
        this.save = new EventEmitter();
        this.updatedTemplateInformation = new EventEmitter();
        this.editablePhrases = [];
        this.viewablePhrases = [];
        this.history = [];
        this.zoom = new Zoom();
        this.workspace = {
            dropingFile: false,
            fileDropDown: false,
            detailsModal: false,
            paperZoom: { value: 1 },
            dataZoom: { value: 1 },
            mode: ViewMode.edit,
            historyIndex: 0,
            lastModifiedEditablePhraseIndex: 0,
            lastSelection: { start: 0, end: 0 },
            needToFocus: false,
        };
        this.docxFile = {
            content: "",
            name: "",
            lastModifiedDate: 0,
        };
        this.templateInformationForm = new FormGroup({
            name: new FormControl(undefined, [Validators.required]),
            description: new FormControl(undefined, [Validators.required]),
        });
        this.fileBackdropHandlerListener = () => {
            const initCount = -1;
            let count = initCount;
            window.ondragover = (e) => {
                e.preventDefault();
            };
            const docxFileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            window.ondragenter = (e) => {
                // if event contains a file with .docx extension
                if (e.dataTransfer.items[0].kind === "file" &&
                    e.dataTransfer.items[0].type === docxFileType) {
                    this.workspace.dropingFile = true;
                    count++;
                }
            };
            window.ondragleave = () => {
                count--;
                if (count < 0) {
                    this.workspace.dropingFile = false;
                    count = initCount;
                }
            };
            window.ondrop = (e) => {
                e.preventDefault();
                count = initCount;
                this.workspace.dropingFile = false;
                if (e.dataTransfer.items[0].kind === "file" &&
                    e.dataTransfer.items[0].type === docxFileType) {
                    this.setTemplateFromFile(e.dataTransfer.files[0]);
                }
            };
        };
        this.undo = () => {
            if (this.workspace.historyIndex > 0) {
                const editablePhrasesFromLastestElementInHistory = this.history[this.workspace.historyIndex].editablePhrases.map((a) => ({ ...a }));
                this.workspace.historyIndex--;
                this.workspace = {
                    ...this.workspace,
                    lastModifiedEditablePhraseIndex: this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex,
                    lastSelection: this.history[this.workspace.historyIndex].selection,
                };
                editablePhrasesFromLastestElementInHistory.map((editablePhrase, index) => {
                    const editablePhraseFromHistory = this.history[this.workspace.historyIndex].editablePhrases[index];
                    if (editablePhrase.value !== editablePhraseFromHistory.value) {
                        this.editablePhrases[index] = {
                            ...this.history[this.workspace.historyIndex].editablePhrases[index],
                        };
                    }
                });
                this.updateViewablePhrasesValue();
            }
        };
        this.redo = () => {
            if (this.workspace.historyIndex + 1 <= this.history.length - 1) {
                const editablePhrasesFromLastestElementInHistory = this.history[this.workspace.historyIndex].editablePhrases.map((a) => ({
                    ...a,
                }));
                this.workspace.historyIndex++;
                this.workspace = {
                    ...this.workspace,
                    lastModifiedEditablePhraseIndex: this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex,
                    lastSelection: this.history[this.workspace.historyIndex].selection,
                };
                editablePhrasesFromLastestElementInHistory.map((editablePhrase, index) => {
                    const editablePhraseFromHistory = this.history[this.workspace.historyIndex].editablePhrases[index];
                    if (editablePhrase.value !== editablePhraseFromHistory.value) {
                        this.editablePhrases[index] = { ...editablePhraseFromHistory };
                    }
                });
                this.updateViewablePhrasesValue();
            }
        };
    }
    saveHandler(docxFile) {
        this.save.emit(docxFile);
    }
    ngOnInit() {
        if (this.template) {
            this.setTemplateFromFile(this.template);
        }
        if (this.templateInformation) {
            this.templateInformationForm.setValue({
                name: this.templateInformation.name,
                description: this.templateInformation.description,
            });
        }
    }
    ngAfterViewInit() {
        this.fileBackdropHandlerListener();
        this.historyHandlerListener();
        this.changeModeWithHotkeysListener();
    }
    setTemplateFromInputEvent(inputEvent) {
        const inputFile = inputEvent.target;
        this.setTemplateFromFile(inputFile.files[0]);
    }
    setTemplateFromFile(inputFile) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const data = e.target.result;
            this.docxFile = {
                // template storage
                ...this.docxFile,
                name: inputFile.name,
                lastModifiedDate: inputFile.lastModified,
                content: data,
            };
            docxToEditableObjects(inputFile).then((editableObjects) => {
                this.setPhrases(editableObjects);
            });
        };
        reader.readAsArrayBuffer(inputFile);
    }
    setPhrases(editableObjects) {
        this.editablePhrases = editableObjects.map((a) => ({ ...a }));
        this.history = [
            {
                editablePhrases: editableObjects.map((a) => ({ ...a })),
                lastModifiedEditablePhraseIndex: 0,
                selection: undefined,
            },
        ];
        this.workspace.historyIndex = 0;
        this.updatesPhrasesValues();
    }
    updateEditablePhrase(inputEvent, editablePhraseIndex) {
        const doesHistoryIndexIsPosibleInHistory = this.workspace.historyIndex < this.history.length - 1;
        if (doesHistoryIndexIsPosibleInHistory) {
            const historyCuttedAfterCurrentIndex = this.history.slice(0, this.workspace.historyIndex + 1);
            this.history = historyCuttedAfterCurrentIndex;
        }
        const selection = window.getSelection();
        const selectionRange = {
            start: selection.anchorOffset,
            end: selection.focusOffset,
        };
        const phraseElement = inputEvent.target;
        const modifiedPhrasesFromHistory = this.history[this.history.length - 1].editablePhrases.map((a) => ({ ...a }));
        modifiedPhrasesFromHistory[editablePhraseIndex].value =
            phraseElement.innerText;
        this.history.push({
            editablePhrases: [...modifiedPhrasesFromHistory].map((a) => ({ ...a })),
            lastModifiedEditablePhraseIndex: editablePhraseIndex,
            selection: selectionRange,
        });
        this.workspace = {
            ...this.workspace,
            lastModifiedEditablePhraseIndex: editablePhraseIndex,
            lastSelection: selectionRange,
            historyIndex: this.history.length - 1,
        };
        this.updateViewablePhrasesValue();
    }
    setMode(mode) {
        if (mode === ViewMode.edit) {
            this.workspace.mode = ViewMode.edit;
            this.updatesPhrasesValues();
        }
        else if (mode === ViewMode.view) {
            this.workspace.mode = ViewMode.view;
            this.updatesPhrasesValues();
        }
        else if (mode === ViewMode.simulation) {
            this.workspace.mode = ViewMode.simulation;
        }
        else if (mode === ViewMode.editView) {
            this.workspace.mode = ViewMode.editView;
            if (this.workspace.paperZoom.value >= 1) {
                this.workspace.paperZoom.value = 0.9;
            }
        }
    }
    hideModals() {
        this.workspace.detailsModal = false;
    }
    updateTemplateInformation() {
        if (this.templateInformationForm.valid) {
            this.templateInformation = {
                name: this.templateInformationForm.value.name,
                description: this.templateInformationForm.value.description,
            };
            this.updatedTemplateInformation.emit(this.templateInformation);
            this.hideModals();
        }
    }
    updatesPhrasesValues() {
        this.updateEditablePhrasesValue();
        this.updateViewablePhrasesValue();
    }
    updateEditablePhrasesValue() {
        this.workspace.lastModifiedEditablePhraseIndex = this.history[this.workspace.historyIndex].lastModifiedEditablePhraseIndex;
        this.editablePhrases = this.history[this.workspace.historyIndex].editablePhrases.map((a) => ({
            ...a,
        }));
        this.workspace.needToFocus = true;
        this.workspace.needToFocus = false;
    }
    updateViewablePhrasesValue() {
        const updatedViewablePhrases = transformEditablePhrasesToViewablePhrases(this.history[this.workspace.historyIndex].editablePhrases);
        if (this.viewablePhrases.length === updatedViewablePhrases.length) {
            updatedViewablePhrases.forEach((updatedViewablePhrase, index) => {
                if (this.viewablePhrases[index].value !== updatedViewablePhrase.value) {
                    this.viewablePhrases[index].value = updatedViewablePhrase.value;
                }
            });
        }
        else {
            this.viewablePhrases = transformEditablePhrasesToViewablePhrases(this.history[this.workspace.historyIndex].editablePhrases);
        }
    }
    changeModeWithHotkeysListener() {
        document.addEventListener("keydown", (e) => {
            // detect when shift + v or shift + V and detect when stop pressing
            if ((e.key === "z" || e.key === "Z") && e.shiftKey && e.altKey) {
                e.preventDefault();
                if (this.workspace.mode !== ViewMode.edit) {
                    this.setMode("edit");
                }
            }
            else if ((e.key === "x" || e.key === "X") && e.shiftKey && e.altKey) {
                e.preventDefault();
                if (this.workspace.mode !== ViewMode.view) {
                    this.setMode("view");
                }
            }
            else if ((e.key === "c" || e.key === "C") && e.shiftKey && e.altKey) {
                e.preventDefault();
                if (this.workspace.mode !== ViewMode.simulation) {
                    this.setMode("simulation");
                }
            }
        });
    }
    historyHandlerListener() {
        // add event listener to ctrl + z and ctrl + y
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                if (e.key === "z") {
                    e.preventDefault();
                    this.undo();
                }
                else if (e.key === "y") {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }
}
AppComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
AppComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: AppComponent, selector: "template-editor", inputs: { data: "data", template: "template", templateInformation: "templateInformation" }, outputs: { save: "save", updatedTemplateInformation: "updatedTemplateInformation" }, viewQueries: [{ propertyName: "uploadFileInput", first: true, predicate: ["uploadFileInput"], descendants: true }, { propertyName: "workspaceContainer", first: true, predicate: ["workspaceContainer"], descendants: true }], ngImport: i0, template: "<body>\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"setTemplateFromInputEvent($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n    />\r\n\r\n  <div\r\n    class=\"backdrop\"\r\n    [class.backdrop--hover]=\"workspace.dropingFile\"\r\n    (wheel)=\"$event.preventDefault()\"\r\n  >\r\n    <div class=\"backdrop__drop-file-msg\">\r\n      Abrir template\r\n    </div>\r\n  </div>\r\n\r\n  <div\r\n    class=\"backdrop-modal\"\r\n    [class.backdrop-modal--hover]=\"workspace.detailsModal\"\r\n    (click)=\"hideModals()\"\r\n  >\r\n    <form\r\n      class=\"backdrop-modal__details-modal\"\r\n      (click)=\"$event.stopPropagation()\"\r\n      [formGroup]=\"templateInformationForm\"\r\n      (submit)=\"updateTemplateInformation()\"\r\n    >\r\n      <p>Nombre del template:</p>\r\n      <input\r\n        class=\"backdrop-modal__details-modal__input\"\r\n        [value]=\"templateInformation?.name || ''\"\r\n        formControlName=\"name\"\r\n        nz-input\r\n        type=\"text\"\r\n      >\r\n      <p>Descripci\u00F3n:</p>\r\n      <textarea\r\n        class=\"backdrop-modal__details-modal__input backdrop-modal__details-modal__input--textarea\"\r\n        formControlName=\"description\"\r\n        nz-input\r\n      >{{templateInformation?.description}}</textarea>\r\n      <div class=\"backdrop-modal__details-modal__buttons-container\">\r\n        <button\r\n          class=\"backdrop-modal__details-modal__buttons-container__btn backdrop-modal__details-modal__buttons-container__btn--save\"\r\n          type=\"submit\"\r\n        >Guardar</button>\r\n        <button\r\n          class=\"backdrop-modal__details-modal__buttons-container__btn backdrop-modal__details-modal__buttons-container__btn--cancel\"\r\n          (click)=\"hideModals()\"\r\n          type=\"button\"\r\n        >\r\n          Cerrar\r\n        </button>\r\n      </div>\r\n    </form>\r\n  </div>\r\n\r\n  <app-header\r\n    [workspace]=\"workspace\"\r\n    [docxFile]=\"docxFile\"\r\n    [history]=\"history\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [uploadFileInput]=\"uploadFileInput\"\r\n    (fileChange)=\"setTemplateFromInputEvent($event)\"\r\n    (docxFileChanged)=\"saveHandler($event)\"\r\n  ></app-header>\r\n\r\n  <app-workspace\r\n    [data]=\"data\"\r\n    [workspace]=\"workspace\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [fileInput]=\"uploadFileInput\"\r\n    [viewablePhrases]=\"viewablePhrases\"\r\n    #workspaceContainer\r\n    style=\"flex-grow: 1; height: 100%; overflow: auto;\"\r\n    (editablePhraseChanged)=\"updateEditablePhrase($event.inputEvent, $event.indexOfEditablePhrase)\"\r\n  ></app-workspace>\r\n\r\n  <app-footer\r\n    [workspace]=\"workspace\"\r\n    (clickEditMode)=\"!$event.shiftKey ? setMode('edit') : setMode('editView')\"\r\n    (clickViewMode)=\"!$event.shiftKey ? setMode('view') : setMode('editView')\"\r\n    (clickSimulationMode)=\"setMode('simulation')\"\r\n  ></app-footer>\r\n</body>", styles: ["@font-face{font-family:Readex Pro;font-style:normal;font-weight:200;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQzfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQwBm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxtm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQyBnLw3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQy4nLw3.ttf) format(\"truetype\")}body{margin:0;position:relative;display:flex;flex-direction:column;font-family:Readex Pro,sans-serif;background-color:#f4f6f7;font-weight:300;box-sizing:border-box;height:100%;width:100%;--elements-color: #fff;--legalSizeSheet-width: 816px;--legalSizeSheet-height: 1344px;--header-height: 50px;--footer-height: 20px;--data-searchbar-height: 20px}.backdrop{display:flex;background:radial-gradient(circle,#000D 0%,#0009 70%,#0005 100%);position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop--hover{visibility:initial;opacity:1}.backdrop__drop-file-msg{font-size:5vw;color:#fff;font-weight:300;border-style:dashed;border-radius:.8vw;border-color:#fff;border-width:1vw;padding:1.5vw}.backdrop-modal{display:flex;background-color:#0009;position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop-modal--hover{visibility:initial;opacity:1}.backdrop-modal__details-modal{background-color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4vw 3vw;font-size:2vw;border-radius:20px}.backdrop-modal__details-modal>*{margin:0;font-family:sans-serif;margin-bottom:1vw}.backdrop-modal__details-modal>*:last-child{margin-bottom:0}.backdrop-modal__details-modal__input{width:35vw;height:5vh;max-height:40px;font-size:1.5vw}.backdrop-modal__details-modal__input--textarea{max-height:150px;height:10vw;resize:none;font-size:1.3vw}.backdrop-modal__details-modal__buttons-container{display:flex;flex-direction:row}.backdrop-modal__details-modal__buttons-container__btn{width:10vw;height:4vw;font-size:1.5vw;border-radius:20px;border-style:solid;border-width:2px;cursor:pointer;transition-duration:.2s;margin-right:1vw}.backdrop-modal__details-modal__buttons-container__btn:last-child{margin-right:0}.backdrop-modal__details-modal__buttons-container__btn--save{border-color:#fff;background-color:#fff;border-color:#00a8ff}.backdrop-modal__details-modal__buttons-container__btn--save:hover{background-color:#00b9ff;border-color:#002fff}.backdrop-modal__details-modal__buttons-container__btn--cancel{border-color:#fff;background-color:#fff;border-color:red}.backdrop-modal__details-modal__buttons-container__btn--cancel:hover{background-color:red;border-color:red}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: HeaderComponent, selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]", inputs: ["workspace", "docxFile", "history", "uploadFileInput", "editablePhrases"], outputs: ["fileChange", "docxFileChanged"] }, { type: WorkspaceComponent, selector: "app-workspace[data][workspace][editablePhrases][fileInput][viewablePhrases]", inputs: ["data", "workspace", "editablePhrases", "fileInput", "viewablePhrases"], outputs: ["editablePhraseChanged"] }, { type: FooterComponent, selector: "app-footer[workspace]", inputs: ["workspace"], outputs: ["clickEditMode", "clickViewMode", "clickSimulationMode"] }], directives: [{ type: i4.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { type: i4.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { type: i4.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i4.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: AppComponent, decorators: [{
            type: Component,
            args: [{ selector: "template-editor", template: "<body>\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"setTemplateFromInputEvent($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n    />\r\n\r\n  <div\r\n    class=\"backdrop\"\r\n    [class.backdrop--hover]=\"workspace.dropingFile\"\r\n    (wheel)=\"$event.preventDefault()\"\r\n  >\r\n    <div class=\"backdrop__drop-file-msg\">\r\n      Abrir template\r\n    </div>\r\n  </div>\r\n\r\n  <div\r\n    class=\"backdrop-modal\"\r\n    [class.backdrop-modal--hover]=\"workspace.detailsModal\"\r\n    (click)=\"hideModals()\"\r\n  >\r\n    <form\r\n      class=\"backdrop-modal__details-modal\"\r\n      (click)=\"$event.stopPropagation()\"\r\n      [formGroup]=\"templateInformationForm\"\r\n      (submit)=\"updateTemplateInformation()\"\r\n    >\r\n      <p>Nombre del template:</p>\r\n      <input\r\n        class=\"backdrop-modal__details-modal__input\"\r\n        [value]=\"templateInformation?.name || ''\"\r\n        formControlName=\"name\"\r\n        nz-input\r\n        type=\"text\"\r\n      >\r\n      <p>Descripci\u00F3n:</p>\r\n      <textarea\r\n        class=\"backdrop-modal__details-modal__input backdrop-modal__details-modal__input--textarea\"\r\n        formControlName=\"description\"\r\n        nz-input\r\n      >{{templateInformation?.description}}</textarea>\r\n      <div class=\"backdrop-modal__details-modal__buttons-container\">\r\n        <button\r\n          class=\"backdrop-modal__details-modal__buttons-container__btn backdrop-modal__details-modal__buttons-container__btn--save\"\r\n          type=\"submit\"\r\n        >Guardar</button>\r\n        <button\r\n          class=\"backdrop-modal__details-modal__buttons-container__btn backdrop-modal__details-modal__buttons-container__btn--cancel\"\r\n          (click)=\"hideModals()\"\r\n          type=\"button\"\r\n        >\r\n          Cerrar\r\n        </button>\r\n      </div>\r\n    </form>\r\n  </div>\r\n\r\n  <app-header\r\n    [workspace]=\"workspace\"\r\n    [docxFile]=\"docxFile\"\r\n    [history]=\"history\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [uploadFileInput]=\"uploadFileInput\"\r\n    (fileChange)=\"setTemplateFromInputEvent($event)\"\r\n    (docxFileChanged)=\"saveHandler($event)\"\r\n  ></app-header>\r\n\r\n  <app-workspace\r\n    [data]=\"data\"\r\n    [workspace]=\"workspace\"\r\n    [editablePhrases]=\"editablePhrases\"\r\n    [fileInput]=\"uploadFileInput\"\r\n    [viewablePhrases]=\"viewablePhrases\"\r\n    #workspaceContainer\r\n    style=\"flex-grow: 1; height: 100%; overflow: auto;\"\r\n    (editablePhraseChanged)=\"updateEditablePhrase($event.inputEvent, $event.indexOfEditablePhrase)\"\r\n  ></app-workspace>\r\n\r\n  <app-footer\r\n    [workspace]=\"workspace\"\r\n    (clickEditMode)=\"!$event.shiftKey ? setMode('edit') : setMode('editView')\"\r\n    (clickViewMode)=\"!$event.shiftKey ? setMode('view') : setMode('editView')\"\r\n    (clickSimulationMode)=\"setMode('simulation')\"\r\n  ></app-footer>\r\n</body>", styles: ["@font-face{font-family:Readex Pro;font-style:normal;font-weight:200;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQzfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQwBm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxfm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQxtm7w3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:600;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQyBnLw3.ttf) format(\"truetype\")}@font-face{font-family:Readex Pro;font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/s/readexpro/v9/SLXYc1bJ7HE5YDoGPuzj_dh8na74KiwZQQy4nLw3.ttf) format(\"truetype\")}body{margin:0;position:relative;display:flex;flex-direction:column;font-family:Readex Pro,sans-serif;background-color:#f4f6f7;font-weight:300;box-sizing:border-box;height:100%;width:100%;--elements-color: #fff;--legalSizeSheet-width: 816px;--legalSizeSheet-height: 1344px;--header-height: 50px;--footer-height: 20px;--data-searchbar-height: 20px}.backdrop{display:flex;background:radial-gradient(circle,#000D 0%,#0009 70%,#0005 100%);position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop--hover{visibility:initial;opacity:1}.backdrop__drop-file-msg{font-size:5vw;color:#fff;font-weight:300;border-style:dashed;border-radius:.8vw;border-color:#fff;border-width:1vw;padding:1.5vw}.backdrop-modal{display:flex;background-color:#0009;position:absolute;top:0px;width:100%;height:100%;z-index:110000;justify-content:center;align-items:center;transition-duration:.3s;transition-property:opacity,visibility;opacity:0;visibility:hidden}.backdrop-modal--hover{visibility:initial;opacity:1}.backdrop-modal__details-modal{background-color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4vw 3vw;font-size:2vw;border-radius:20px}.backdrop-modal__details-modal>*{margin:0;font-family:sans-serif;margin-bottom:1vw}.backdrop-modal__details-modal>*:last-child{margin-bottom:0}.backdrop-modal__details-modal__input{width:35vw;height:5vh;max-height:40px;font-size:1.5vw}.backdrop-modal__details-modal__input--textarea{max-height:150px;height:10vw;resize:none;font-size:1.3vw}.backdrop-modal__details-modal__buttons-container{display:flex;flex-direction:row}.backdrop-modal__details-modal__buttons-container__btn{width:10vw;height:4vw;font-size:1.5vw;border-radius:20px;border-style:solid;border-width:2px;cursor:pointer;transition-duration:.2s;margin-right:1vw}.backdrop-modal__details-modal__buttons-container__btn:last-child{margin-right:0}.backdrop-modal__details-modal__buttons-container__btn--save{border-color:#fff;background-color:#fff;border-color:#00a8ff}.backdrop-modal__details-modal__buttons-container__btn--save:hover{background-color:#00b9ff;border-color:#002fff}.backdrop-modal__details-modal__buttons-container__btn--cancel{border-color:#fff;background-color:#fff;border-color:red}.backdrop-modal__details-modal__buttons-container__btn--cancel:hover{background-color:red;border-color:red}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { uploadFileInput: [{
                type: ViewChild,
                args: ["uploadFileInput"]
            }], workspaceContainer: [{
                type: ViewChild,
                args: ["workspaceContainer"]
            }], data: [{
                type: Input
            }], template: [{
                type: Input
            }], templateInformation: [{
                type: Input
            }], save: [{
                type: Output
            }], updatedTemplateInformation: [{
                type: Output
            }] } });

class EntersToBrPipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(value) {
        // regex \n or \r\n
        const entersRegex = /(\r\n|\n)/gm;
        let result = value.replace(entersRegex, (match) => {
            return `<br/>`;
        });
        return this.sanitizer.bypassSecurityTrustHtml(result);
    }
}
EntersToBrPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EntersToBrPipe, deps: [{ token: i1$1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Pipe });
EntersToBrPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EntersToBrPipe, name: "entersToBr" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: EntersToBrPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'entersToBr'
                }]
        }], ctorParameters: function () { return [{ type: i1$1.DomSanitizer }]; } });

class IsArrayPipe {
    transform(value) {
        return Array.isArray(value);
    }
}
IsArrayPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: IsArrayPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IsArrayPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: IsArrayPipe, name: "isArray" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: IsArrayPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "isArray",
                }]
        }] });

class CheckVariableExistenceDirective {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        const element = this.element.nativeElement;
        element.innerHTML = element.innerHTML.replace(/([^({\s]+\.[^})\s]+)/g, (variable) => {
            if (variable.indexOf(".") === -1) {
                return `<span class="variable-not-found">TESTING${variable}</span>`;
            }
            return variable;
        });
    }
}
CheckVariableExistenceDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: CheckVariableExistenceDirective, deps: [{ token: ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
CheckVariableExistenceDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: CheckVariableExistenceDirective, selector: "[check-variable-existence]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: CheckVariableExistenceDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[check-variable-existence]",
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef, decorators: [{
                    type: Inject,
                    args: [ElementRef]
                }] }]; } });

class TemplateEditorModule {
}
TemplateEditorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TemplateEditorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, bootstrap: [AppComponent], declarations: [AppComponent,
        isObject,
        TreeNodeComponent,
        HasThesePropsPipe,
        DoesStringRepresentPrimitivePipe,
        EntersToBrPipe,
        ViewablePhraseComponent,
        IsArrayPipe,
        FocusDirective,
        EditablePhraseComponent,
        DataComponent,
        HeaderComponent,
        WorkspaceComponent,
        FooterComponent,
        SelectionRangeDirective,
        CheckVariableExistenceDirective,
        VariableExistPipe,
        VariableCheckerComponent], imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule], exports: [AppComponent] });
TemplateEditorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, providers: [], imports: [[
            CommonModule,
            ReactiveFormsModule,
            FormsModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: TemplateEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        AppComponent,
                        isObject,
                        TreeNodeComponent,
                        HasThesePropsPipe,
                        DoesStringRepresentPrimitivePipe,
                        EntersToBrPipe,
                        ViewablePhraseComponent,
                        IsArrayPipe,
                        FocusDirective,
                        EditablePhraseComponent,
                        DataComponent,
                        HeaderComponent,
                        WorkspaceComponent,
                        FooterComponent,
                        SelectionRangeDirective,
                        CheckVariableExistenceDirective,
                        VariableExistPipe,
                        VariableCheckerComponent,
                    ],
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        FormsModule
                    ],
                    providers: [],
                    exports: [
                        AppComponent
                    ],
                    bootstrap: [AppComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { AppComponent, TemplateEditorModule };
//# sourceMappingURL=saidtorres3-template-editor.mjs.map
