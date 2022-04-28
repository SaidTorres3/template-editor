import { Component, EventEmitter, Input, Output } from "@angular/core";
import { docxToString } from "../../../utils/docxParsers/docxToString";
import { editableObjectToDocx } from "../../../utils/docxParsers/editableObjectsToDocx";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class HeaderComponent {
    constructor() {
        this.fileChange = new EventEmitter();
    }
    onFileChangeHandler(e) {
        const event = e;
        this.fileChange.emit(event);
    }
    save() {
        if (!this.docxFile.content) {
            return;
        }
        // update the last modified date 
        console.log(this.docxFile.content);
        editableObjectToDocx({
            modifiedObjects: this.history[this.workspace.historyIndex].editablePhrases,
            fileIn: this.docxFile.content,
        }).then((newDocx) => {
            // this.setTemplateFromFile(newDocx); TODO
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
            docxToString(newDocx).then((string) => {
                console.log(string);
            });
        });
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
HeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: HeaderComponent, selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]", inputs: { workspace: "workspace", docxFile: "docxFile", history: "history", uploadFileInput: "uploadFileInput", editablePhrases: "editablePhrases" }, outputs: { fileChange: "fileChange" }, ngImport: i0, template: "<div class=\"header\">\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"onFileChangeHandler($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n  />\r\n  <div *ngIf=\"workspace.fileDropDown\" class=\"header__element__dropdown\">\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"save()\"\r\n    >\r\n      Guardar\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"saveToComputer()\"\r\n    >\r\n      Guardar a computadora\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      (click)=\"uploadFileInput.click()\"\r\n    >\r\n      Abrir template\r\n    </p>\r\n  </div>\r\n  <div\r\n    class=\"header__element header__element--file\"\r\n    (click)=\"fileDropDownToggle()\"\r\n  >\r\n    <label>Archivo</label>\r\n  </div>\r\n  <div class=\"header__element header__element--title\">\r\n    {{docxFile.name}}\r\n  </div>\r\n  <div class=\"header__element\" *ngIf=\"docxFile.lastModifiedDate\">\r\n    <!-- date with hour -->\r\n    \u00DAltima modificaci\u00F3n: {{docxFile.lastModifiedDate | date: 'dd/MM/yyyy HH:mm'}}\r\n  </div>\r\n</div>\r\n", styles: [".invisible{visibility:hidden;display:none}.header{position:fixed;top:0px!important;height:var(--header-height);width:100%;box-shadow:0 2px 4px #0003;z-index:10000;background-color:var(--elements-color);display:flex;flex-direction:row}.header__element{border-right:1px solid #888;padding:10px;display:flex;justify-content:center;align-items:center}.header__element:hover{background-color:#f0f0f0}.header__element--file{-webkit-user-select:none;user-select:none;width:150px}.header__element--title{min-width:400px;flex-grow:1}.header__element__dropdown{position:absolute;display:flex;flex-direction:column;width:200px;background-color:#fff;margin-top:var(--header-height);z-index:10001;border:1px solid #888}.header__element__dropdown__item{margin:0;padding:10px;text-align:center;-webkit-user-select:none;user-select:none;cursor:pointer}.header__element__dropdown__item:hover{background-color:#f0f0f0}.header__element__dropdown__item--inactive{color:#0005}.header__element__dropdown__item--inactive{background-color:#fff!important;cursor:default}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "date": i1.DatePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: HeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: "app-header[history][docxFile][uploadFileInput][editablePhrases]", template: "<div class=\"header\">\r\n  <input\r\n    #uploadFileInput\r\n    (change)=\"onFileChangeHandler($event)\"\r\n    class=\"invisible\"\r\n    type=\"file\"\r\n    id=\"template\"\r\n    name=\"template\"\r\n    accept=\".docx\"\r\n  />\r\n  <div *ngIf=\"workspace.fileDropDown\" class=\"header__element__dropdown\">\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"save()\"\r\n    >\r\n      Guardar\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      [class.header__element__dropdown__item--inactive]=\"!docxFile.content\"\r\n      (click)=\"saveToComputer()\"\r\n    >\r\n      Guardar a computadora\r\n    </p>\r\n    <p\r\n      class=\"header__element__dropdown__item\"\r\n      (click)=\"uploadFileInput.click()\"\r\n    >\r\n      Abrir template\r\n    </p>\r\n  </div>\r\n  <div\r\n    class=\"header__element header__element--file\"\r\n    (click)=\"fileDropDownToggle()\"\r\n  >\r\n    <label>Archivo</label>\r\n  </div>\r\n  <div class=\"header__element header__element--title\">\r\n    {{docxFile.name}}\r\n  </div>\r\n  <div class=\"header__element\" *ngIf=\"docxFile.lastModifiedDate\">\r\n    <!-- date with hour -->\r\n    \u00DAltima modificaci\u00F3n: {{docxFile.lastModifiedDate | date: 'dd/MM/yyyy HH:mm'}}\r\n  </div>\r\n</div>\r\n", styles: [".invisible{visibility:hidden;display:none}.header{position:fixed;top:0px!important;height:var(--header-height);width:100%;box-shadow:0 2px 4px #0003;z-index:10000;background-color:var(--elements-color);display:flex;flex-direction:row}.header__element{border-right:1px solid #888;padding:10px;display:flex;justify-content:center;align-items:center}.header__element:hover{background-color:#f0f0f0}.header__element--file{-webkit-user-select:none;user-select:none;width:150px}.header__element--title{min-width:400px;flex-grow:1}.header__element__dropdown{position:absolute;display:flex;flex-direction:column;width:200px;background-color:#fff;margin-top:var(--header-height);z-index:10001;border:1px solid #888}.header__element__dropdown__item{margin:0;padding:10px;text-align:center;-webkit-user-select:none;user-select:none;cursor:pointer}.header__element__dropdown__item:hover{background-color:#f0f0f0}.header__element__dropdown__item--inactive{color:#0005}.header__element__dropdown__item--inactive{background-color:#fff!important;cursor:default}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDOzs7QUFReEYsTUFBTSxPQUFPLGVBQWU7SUFMNUI7UUFXWSxlQUFVLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7S0F3RGpGO0lBdERDLG1CQUFtQixDQUFDLENBQVE7UUFDMUIsTUFBTSxLQUFLLEdBQUcsQ0FBZSxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxJQUFJO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUNELGlDQUFpQztRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUNULElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUN0QixDQUFBO1FBQ0Qsb0JBQW9CLENBQUM7WUFDbkIsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxlQUFlO1lBQzFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU87U0FDOUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2xCLDBDQUEwQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxjQUFjO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFDRCxvQkFBb0IsQ0FBQztZQUNuQixlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLGVBQWU7WUFDMUUsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTztTQUM5QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDbEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDbkMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxrQkFBa0I7UUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixNQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFVBQVUsRUFBRSxDQUFDO1lBQ2IsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO2dCQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDaEMsQ0FBQzs7NEdBN0RVLGVBQWU7Z0dBQWYsZUFBZSxvU0NYNUIsbTNDQThDQTsyRkRuQ2EsZUFBZTtrQkFMM0IsU0FBUzsrQkFDRSxpRUFBaUU7OEJBS2xFLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNJLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IERvY3hGaWxlLCBIaXN0b3J5LCBXb3JrU3BhY2UgfSBmcm9tIFwiLi4vLi4vLi4vYXBwL2ludGVyZmFjZXNcIjtcclxuaW1wb3J0IHsgZG9jeFRvU3RyaW5nIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2RvY3hQYXJzZXJzL2RvY3hUb1N0cmluZ1wiO1xyXG5pbXBvcnQgeyBlZGl0YWJsZU9iamVjdFRvRG9jeCB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9kb2N4UGFyc2Vycy9lZGl0YWJsZU9iamVjdHNUb0RvY3hcIjtcclxuaW1wb3J0IHsgRWRpdGFibGVQaHJhc2UgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZG9jeFBhcnNlcnMvdHlwZXNcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcImFwcC1oZWFkZXJbaGlzdG9yeV1bZG9jeEZpbGVdW3VwbG9hZEZpbGVJbnB1dF1bZWRpdGFibGVQaHJhc2VzXVwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vaGVhZGVyLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCIuL2hlYWRlci5jb21wb25lbnQubGVzc1wiLCBcIi4uLy4uL3NoYXJlZC9zdHlsZXMvY29tbW9uU3R5bGVzLmxlc3NcIl0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIZWFkZXJDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIHdvcmtzcGFjZTogV29ya1NwYWNlO1xyXG4gIEBJbnB1dCgpIGRvY3hGaWxlOiBEb2N4RmlsZTtcclxuICBASW5wdXQoKSBoaXN0b3J5OiBIaXN0b3J5W107XHJcbiAgQElucHV0KCkgdXBsb2FkRmlsZUlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIEBJbnB1dCgpIGVkaXRhYmxlUGhyYXNlczogRWRpdGFibGVQaHJhc2VbXTtcclxuICBAT3V0cHV0KCkgZmlsZUNoYW5nZTogRXZlbnRFbWl0dGVyPElucHV0RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxJbnB1dEV2ZW50PigpO1xyXG5cclxuICBvbkZpbGVDaGFuZ2VIYW5kbGVyKGU6IEV2ZW50KSB7XHJcbiAgICBjb25zdCBldmVudCA9IGUgYXMgSW5wdXRFdmVudDtcclxuICAgIHRoaXMuZmlsZUNoYW5nZS5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzYXZlKCkge1xyXG4gICAgaWYgKCF0aGlzLmRvY3hGaWxlLmNvbnRlbnQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gdXBkYXRlIHRoZSBsYXN0IG1vZGlmaWVkIGRhdGUgXHJcbiAgICBjb25zb2xlLmxvZyhcclxuICAgICAgdGhpcy5kb2N4RmlsZS5jb250ZW50XHJcbiAgICApXHJcbiAgICBlZGl0YWJsZU9iamVjdFRvRG9jeCh7XHJcbiAgICAgIG1vZGlmaWVkT2JqZWN0czogdGhpcy5oaXN0b3J5W3RoaXMud29ya3NwYWNlLmhpc3RvcnlJbmRleF0uZWRpdGFibGVQaHJhc2VzLFxyXG4gICAgICBmaWxlSW46IHRoaXMuZG9jeEZpbGUuY29udGVudCxcclxuICAgIH0pLnRoZW4oKG5ld0RvY3gpID0+IHtcclxuICAgICAgLy8gdGhpcy5zZXRUZW1wbGF0ZUZyb21GaWxlKG5ld0RvY3gpOyBUT0RPXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzYXZlVG9Db21wdXRlcigpIHtcclxuICAgIGlmICghdGhpcy5kb2N4RmlsZS5jb250ZW50KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVkaXRhYmxlT2JqZWN0VG9Eb2N4KHtcclxuICAgICAgbW9kaWZpZWRPYmplY3RzOiB0aGlzLmhpc3RvcnlbdGhpcy53b3Jrc3BhY2UuaGlzdG9yeUluZGV4XS5lZGl0YWJsZVBocmFzZXMsXHJcbiAgICAgIGZpbGVJbjogdGhpcy5kb2N4RmlsZS5jb250ZW50LFxyXG4gICAgfSkudGhlbigobmV3RG9jeCkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ld0RvY3gpO1xyXG4gICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcclxuICAgICAgbGluay5kb3dubG9hZCA9IHRoaXMuZG9jeEZpbGUubmFtZTtcclxuICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICBsaW5rLnJlbW92ZSgpO1xyXG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XHJcbiAgICAgIGRvY3hUb1N0cmluZyhuZXdEb2N4KS50aGVuKChzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhzdHJpbmcpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZpbGVEcm9wRG93blRvZ2dsZSgpIHtcclxuICAgIHRoaXMud29ya3NwYWNlLmZpbGVEcm9wRG93biA9IHRydWU7XHJcbiAgICBsZXQgY2xpY2tDb3VudCA9IDA7XHJcbiAgICBjb25zdCBxdWl0RHJvcERvd24gPSAoZSkgPT4ge1xyXG4gICAgICBjbGlja0NvdW50Kys7XHJcbiAgICAgIGlmIChjbGlja0NvdW50ID4gMSkge1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmZpbGVEcm9wRG93biA9IGZhbHNlO1xyXG4gICAgICAgIHdpbmRvdy5vbmNsaWNrID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHdpbmRvdy5vbmNsaWNrID0gcXVpdERyb3BEb3duO1xyXG4gIH1cclxufVxyXG4iLCI8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgPGlucHV0XHJcbiAgICAjdXBsb2FkRmlsZUlucHV0XHJcbiAgICAoY2hhbmdlKT1cIm9uRmlsZUNoYW5nZUhhbmRsZXIoJGV2ZW50KVwiXHJcbiAgICBjbGFzcz1cImludmlzaWJsZVwiXHJcbiAgICB0eXBlPVwiZmlsZVwiXHJcbiAgICBpZD1cInRlbXBsYXRlXCJcclxuICAgIG5hbWU9XCJ0ZW1wbGF0ZVwiXHJcbiAgICBhY2NlcHQ9XCIuZG9jeFwiXHJcbiAgLz5cclxuICA8ZGl2ICpuZ0lmPVwid29ya3NwYWNlLmZpbGVEcm9wRG93blwiIGNsYXNzPVwiaGVhZGVyX19lbGVtZW50X19kcm9wZG93blwiPlxyXG4gICAgPHBcclxuICAgICAgY2xhc3M9XCJoZWFkZXJfX2VsZW1lbnRfX2Ryb3Bkb3duX19pdGVtXCJcclxuICAgICAgW2NsYXNzLmhlYWRlcl9fZWxlbWVudF9fZHJvcGRvd25fX2l0ZW0tLWluYWN0aXZlXT1cIiFkb2N4RmlsZS5jb250ZW50XCJcclxuICAgICAgKGNsaWNrKT1cInNhdmUoKVwiXHJcbiAgICA+XHJcbiAgICAgIEd1YXJkYXJcclxuICAgIDwvcD5cclxuICAgIDxwXHJcbiAgICAgIGNsYXNzPVwiaGVhZGVyX19lbGVtZW50X19kcm9wZG93bl9faXRlbVwiXHJcbiAgICAgIFtjbGFzcy5oZWFkZXJfX2VsZW1lbnRfX2Ryb3Bkb3duX19pdGVtLS1pbmFjdGl2ZV09XCIhZG9jeEZpbGUuY29udGVudFwiXHJcbiAgICAgIChjbGljayk9XCJzYXZlVG9Db21wdXRlcigpXCJcclxuICAgID5cclxuICAgICAgR3VhcmRhciBhIGNvbXB1dGFkb3JhXHJcbiAgICA8L3A+XHJcbiAgICA8cFxyXG4gICAgICBjbGFzcz1cImhlYWRlcl9fZWxlbWVudF9fZHJvcGRvd25fX2l0ZW1cIlxyXG4gICAgICAoY2xpY2spPVwidXBsb2FkRmlsZUlucHV0LmNsaWNrKClcIlxyXG4gICAgPlxyXG4gICAgICBBYnJpciB0ZW1wbGF0ZVxyXG4gICAgPC9wPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXZcclxuICAgIGNsYXNzPVwiaGVhZGVyX19lbGVtZW50IGhlYWRlcl9fZWxlbWVudC0tZmlsZVwiXHJcbiAgICAoY2xpY2spPVwiZmlsZURyb3BEb3duVG9nZ2xlKClcIlxyXG4gID5cclxuICAgIDxsYWJlbD5BcmNoaXZvPC9sYWJlbD5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiaGVhZGVyX19lbGVtZW50IGhlYWRlcl9fZWxlbWVudC0tdGl0bGVcIj5cclxuICAgIHt7ZG9jeEZpbGUubmFtZX19XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cImhlYWRlcl9fZWxlbWVudFwiICpuZ0lmPVwiZG9jeEZpbGUubGFzdE1vZGlmaWVkRGF0ZVwiPlxyXG4gICAgPCEtLSBkYXRlIHdpdGggaG91ciAtLT5cclxuICAgIMOabHRpbWEgbW9kaWZpY2FjacOzbjoge3tkb2N4RmlsZS5sYXN0TW9kaWZpZWREYXRlIHwgZGF0ZTogJ2RkL01NL3l5eXkgSEg6bW0nfX1cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbiJdfQ==