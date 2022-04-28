import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Zoom } from "../../../app/shared/zoom-class/Zoom";
import * as i0 from "@angular/core";
import * as i1 from "./data/data.component";
import * as i2 from "./editable-phrase/editable-phrase.component";
import * as i3 from "./viewable-phrase/viewable-phrase.component";
import * as i4 from "@angular/common";
export class WorkspaceComponent {
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
WorkspaceComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: WorkspaceComponent, selector: "app-workspace[objectData][workspace][editablePhrases][fileInput][viewablePhrases]", inputs: { objectData: "objectData", workspace: "workspace", editablePhrases: "editablePhrases", fileInput: "fileInput", viewablePhrases: "viewablePhrases" }, outputs: { editablePhraseChanged: "editablePhraseChanged" }, ngImport: i0, template: "<div class=\"workspace\">\r\n  <workspace-data [data]=\"objectData\" [workspace]=\"workspace\"></workspace-data>\r\n  <div\r\n    #templateContainer\r\n    class=\"workspace__template\"\r\n    (wheel)=\"zoom.makeZoom($event, workspace.paperZoom)\"\r\n  >\r\n    <div class=\"workspace__template__import\" *ngIf=\"!editablePhrases.length\">\r\n      <h2 (click)=\"fileInput.click()\" class=\"workspace__template__import__text\">\r\n        Importa un template o un documento de Word\r\n      </h2>\r\n    </div>\r\n    <div\r\n      class=\"workspace__template__paper-container\"\r\n      [ngStyle]=\"{'zoom': workspace.paperZoom.value}\"\r\n      [class.workspace__template__paper-container--double-paper]=\"workspace.mode === 'editView'\"\r\n    >\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'edit' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"editablePhrases.length > 0\">\r\n          <editable-phrases\r\n            [editablePhrases]=\"editablePhrases\"\r\n            [workspace]=\"workspace\"\r\n            (editablePhraseChanged)=\"onEditablePhraseChanged($event.inputEvent, $event.index)\"\r\n          ></editable-phrases>\r\n        </div>\r\n      </div>\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'view' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"viewablePhrases\">\r\n          <viewable-phrases\r\n            [viewablePhrases]=\"viewablePhrases\"\r\n            [data]=\"objectData\"\r\n            [workspace]=\"workspace\"\r\n          ></viewable-phrases>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["*{box-sizing:border-box!important}.workspace{margin-top:var(--header-height);margin-bottom:var(--footer-height);display:flex;flex-direction:row;position:relative;height:calc(100vh - var(--header-height) - var(--footer-height));overflow:auto}.workspace__template{flex-grow:1;width:0px;position:relative;overflow:auto;overflow-y:auto}.workspace__template__import{display:flex;justify-content:center;align-items:center;height:calc(100% - var(--header-height));width:100%}.workspace__template__import__text{padding:30px;background-color:#fff;border:1px dashed #888;border-radius:20px;box-shadow:0 2px 4px #0003;transition-duration:.3s;margin:20px;-webkit-user-select:none;user-select:none;cursor:pointer}.workspace__template__import__text:hover{box-shadow:0 0 32px 16px #0000004d}.workspace__template__loading{height:100%;width:100%;flex-grow:1;background-color:#00000025;position:absolute;z-index:10001;top:0;left:0;display:flex;justify-content:center}.workspace__template__paper-container{flex-grow:1;min-width:calc(var(--legalSizeSheet-width) + 50px);display:flex;justify-content:center;position:relative;line-height:25px}.workspace__template__paper-container--double-paper{min-width:calc(var(--legalSizeSheet-width) * 2 + 100px)}.workspace__template__paper-container__paper{width:var(--legalSizeSheet-width);min-width:var(--legalSizeSheet-width);min-height:var(--legalSizeSheet-height);background-color:var(--elements-color);box-shadow:0 0 10px #0000004d;border-radius:10px;padding:72.7px;margin:20px 20px 20px 0;position:relative}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"], components: [{ type: i1.DataComponent, selector: "workspace-data", inputs: ["data", "workspace"] }, { type: i2.EditablePhraseComponent, selector: "editable-phrases[editablePhrases][workspace]", inputs: ["editablePhrases", "workspace"], outputs: ["editablePhraseChanged"] }, { type: i3.ViewablePhraseComponent, selector: "viewable-phrases[viewablePhrases][data][workspace]", inputs: ["viewablePhrases", "data", "workspace"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: WorkspaceComponent, decorators: [{
            type: Component,
            args: [{ selector: "app-workspace[objectData][workspace][editablePhrases][fileInput][viewablePhrases]", template: "<div class=\"workspace\">\r\n  <workspace-data [data]=\"objectData\" [workspace]=\"workspace\"></workspace-data>\r\n  <div\r\n    #templateContainer\r\n    class=\"workspace__template\"\r\n    (wheel)=\"zoom.makeZoom($event, workspace.paperZoom)\"\r\n  >\r\n    <div class=\"workspace__template__import\" *ngIf=\"!editablePhrases.length\">\r\n      <h2 (click)=\"fileInput.click()\" class=\"workspace__template__import__text\">\r\n        Importa un template o un documento de Word\r\n      </h2>\r\n    </div>\r\n    <div\r\n      class=\"workspace__template__paper-container\"\r\n      [ngStyle]=\"{'zoom': workspace.paperZoom.value}\"\r\n      [class.workspace__template__paper-container--double-paper]=\"workspace.mode === 'editView'\"\r\n    >\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'edit' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"editablePhrases.length > 0\">\r\n          <editable-phrases\r\n            [editablePhrases]=\"editablePhrases\"\r\n            [workspace]=\"workspace\"\r\n            (editablePhraseChanged)=\"onEditablePhraseChanged($event.inputEvent, $event.index)\"\r\n          ></editable-phrases>\r\n        </div>\r\n      </div>\r\n      <div\r\n        #paper\r\n        *ngIf=\"(workspace.mode === 'view' || workspace.mode === 'editView') && editablePhrases.length\"\r\n        class=\"workspace__template__paper-container__paper\"\r\n        (keypress)=\"disableEnter($event)\"\r\n      >\r\n        <div *ngIf=\"viewablePhrases\">\r\n          <viewable-phrases\r\n            [viewablePhrases]=\"viewablePhrases\"\r\n            [data]=\"objectData\"\r\n            [workspace]=\"workspace\"\r\n          ></viewable-phrases>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["*{box-sizing:border-box!important}.workspace{margin-top:var(--header-height);margin-bottom:var(--footer-height);display:flex;flex-direction:row;position:relative;height:calc(100vh - var(--header-height) - var(--footer-height));overflow:auto}.workspace__template{flex-grow:1;width:0px;position:relative;overflow:auto;overflow-y:auto}.workspace__template__import{display:flex;justify-content:center;align-items:center;height:calc(100% - var(--header-height));width:100%}.workspace__template__import__text{padding:30px;background-color:#fff;border:1px dashed #888;border-radius:20px;box-shadow:0 2px 4px #0003;transition-duration:.3s;margin:20px;-webkit-user-select:none;user-select:none;cursor:pointer}.workspace__template__import__text:hover{box-shadow:0 0 32px 16px #0000004d}.workspace__template__loading{height:100%;width:100%;flex-grow:1;background-color:#00000025;position:absolute;z-index:10001;top:0;left:0;display:flex;justify-content:center}.workspace__template__paper-container{flex-grow:1;min-width:calc(var(--legalSizeSheet-width) + 50px);display:flex;justify-content:center;position:relative;line-height:25px}.workspace__template__paper-container--double-paper{min-width:calc(var(--legalSizeSheet-width) * 2 + 100px)}.workspace__template__paper-container__paper{width:var(--legalSizeSheet-width);min-width:var(--legalSizeSheet-width);min-height:var(--legalSizeSheet-height);background-color:var(--elements-color);box-shadow:0 0 10px #0000004d;border-radius:10px;padding:72.7px;margin:20px 20px 20px 0;position:relative}\n", "*{box-sizing:border-box!important}.invisible{visibility:hidden;display:none}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8888}::-webkit-scrollbar-thumb:hover{background:#555}\n"] }]
        }], propDecorators: { objectData: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya3NwYWNlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy93b3Jrc3BhY2Uvd29ya3NwYWNlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy93b3Jrc3BhY2Uvd29ya3NwYWNlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFDQUFxQyxDQUFDOzs7Ozs7QUFlM0QsTUFBTSxPQUFPLGtCQUFrQjtJQVQvQjtRQWVZLDBCQUFxQixHQUcxQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpCLFNBQUksR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0tBZWhDO0lBYlEsdUJBQXVCLENBQUMsQ0FBUSxFQUFFLEtBQWE7UUFDcEQsTUFBTSxVQUFVLEdBQUcsQ0FBZSxDQUFDO1FBQ25DLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7WUFDOUIsVUFBVTtZQUNWLHFCQUFxQixFQUFFLEtBQUs7U0FDN0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFlBQVksQ0FBQyxDQUFnQjtRQUNsQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxFQUFFO1lBQ3JCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7OytHQXpCVSxrQkFBa0I7bUdBQWxCLGtCQUFrQixvVkNqQi9CLGc1REFnREE7MkZEL0JhLGtCQUFrQjtrQkFUOUIsU0FBUzsrQkFFTixtRkFBbUY7OEJBUTVFLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDSSxxQkFBcUI7c0JBQTlCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFdvcmtTcGFjZSB9IGZyb20gXCIuLi8uLi8uLi9hcHAvaW50ZXJmYWNlc1wiO1xyXG5pbXBvcnQgeyBab29tIH0gZnJvbSBcIi4uLy4uLy4uL2FwcC9zaGFyZWQvem9vbS1jbGFzcy9ab29tXCI7XHJcbmltcG9ydCB7XHJcbiAgRWRpdGFibGVQaHJhc2UsXHJcbiAgVmlld2FibGVQaHJhc2UsXHJcbn0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2RvY3hQYXJzZXJzL3R5cGVzXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjpcclxuICAgIFwiYXBwLXdvcmtzcGFjZVtvYmplY3REYXRhXVt3b3Jrc3BhY2VdW2VkaXRhYmxlUGhyYXNlc11bZmlsZUlucHV0XVt2aWV3YWJsZVBocmFzZXNdXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwiLi93b3Jrc3BhY2UuY29tcG9uZW50Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcclxuICAgIFwiLi93b3Jrc3BhY2UuY29tcG9uZW50Lmxlc3NcIixcclxuICAgIFwiLi4vLi4vc2hhcmVkL3N0eWxlcy9jb21tb25TdHlsZXMubGVzc1wiLFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIG9iamVjdERhdGE6IGFueTtcclxuICBASW5wdXQoKSB3b3Jrc3BhY2U6IFdvcmtTcGFjZTtcclxuICBASW5wdXQoKSBlZGl0YWJsZVBocmFzZXM6IEVkaXRhYmxlUGhyYXNlW107XHJcbiAgQElucHV0KCkgZmlsZUlucHV0OiBIVE1MQnV0dG9uRWxlbWVudDtcclxuICBASW5wdXQoKSB2aWV3YWJsZVBocmFzZXM6IFZpZXdhYmxlUGhyYXNlW107XHJcbiAgQE91dHB1dCgpIGVkaXRhYmxlUGhyYXNlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPHtcclxuICAgIGlucHV0RXZlbnQ6IElucHV0RXZlbnQ7XHJcbiAgICBpbmRleE9mRWRpdGFibGVQaHJhc2U6IG51bWJlcjtcclxuICB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHVibGljIHpvb206IFpvb20gPSBuZXcgWm9vbSgpO1xyXG5cclxuICBwdWJsaWMgb25FZGl0YWJsZVBocmFzZUNoYW5nZWQoZTogRXZlbnQsIGluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGlucHV0RXZlbnQgPSBlIGFzIElucHV0RXZlbnQ7XHJcbiAgICB0aGlzLmVkaXRhYmxlUGhyYXNlQ2hhbmdlZC5lbWl0KHtcclxuICAgICAgaW5wdXRFdmVudCxcclxuICAgICAgaW5kZXhPZkVkaXRhYmxlUGhyYXNlOiBpbmRleCxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc2FibGVFbnRlcihlOiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIjxkaXYgY2xhc3M9XCJ3b3Jrc3BhY2VcIj5cclxuICA8d29ya3NwYWNlLWRhdGEgW2RhdGFdPVwib2JqZWN0RGF0YVwiIFt3b3Jrc3BhY2VdPVwid29ya3NwYWNlXCI+PC93b3Jrc3BhY2UtZGF0YT5cclxuICA8ZGl2XHJcbiAgICAjdGVtcGxhdGVDb250YWluZXJcclxuICAgIGNsYXNzPVwid29ya3NwYWNlX190ZW1wbGF0ZVwiXHJcbiAgICAod2hlZWwpPVwiem9vbS5tYWtlWm9vbSgkZXZlbnQsIHdvcmtzcGFjZS5wYXBlclpvb20pXCJcclxuICA+XHJcbiAgICA8ZGl2IGNsYXNzPVwid29ya3NwYWNlX190ZW1wbGF0ZV9faW1wb3J0XCIgKm5nSWY9XCIhZWRpdGFibGVQaHJhc2VzLmxlbmd0aFwiPlxyXG4gICAgICA8aDIgKGNsaWNrKT1cImZpbGVJbnB1dC5jbGljaygpXCIgY2xhc3M9XCJ3b3Jrc3BhY2VfX3RlbXBsYXRlX19pbXBvcnRfX3RleHRcIj5cclxuICAgICAgICBJbXBvcnRhIHVuIHRlbXBsYXRlIG8gdW4gZG9jdW1lbnRvIGRlIFdvcmRcclxuICAgICAgPC9oMj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdlxyXG4gICAgICBjbGFzcz1cIndvcmtzcGFjZV9fdGVtcGxhdGVfX3BhcGVyLWNvbnRhaW5lclwiXHJcbiAgICAgIFtuZ1N0eWxlXT1cInsnem9vbSc6IHdvcmtzcGFjZS5wYXBlclpvb20udmFsdWV9XCJcclxuICAgICAgW2NsYXNzLndvcmtzcGFjZV9fdGVtcGxhdGVfX3BhcGVyLWNvbnRhaW5lci0tZG91YmxlLXBhcGVyXT1cIndvcmtzcGFjZS5tb2RlID09PSAnZWRpdFZpZXcnXCJcclxuICAgID5cclxuICAgICAgPGRpdlxyXG4gICAgICAgICNwYXBlclxyXG4gICAgICAgICpuZ0lmPVwiKHdvcmtzcGFjZS5tb2RlID09PSAnZWRpdCcgfHwgd29ya3NwYWNlLm1vZGUgPT09ICdlZGl0VmlldycpICYmIGVkaXRhYmxlUGhyYXNlcy5sZW5ndGhcIlxyXG4gICAgICAgIGNsYXNzPVwid29ya3NwYWNlX190ZW1wbGF0ZV9fcGFwZXItY29udGFpbmVyX19wYXBlclwiXHJcbiAgICAgICAgKGtleXByZXNzKT1cImRpc2FibGVFbnRlcigkZXZlbnQpXCJcclxuICAgICAgPlxyXG4gICAgICAgIDxkaXYgKm5nSWY9XCJlZGl0YWJsZVBocmFzZXMubGVuZ3RoID4gMFwiPlxyXG4gICAgICAgICAgPGVkaXRhYmxlLXBocmFzZXNcclxuICAgICAgICAgICAgW2VkaXRhYmxlUGhyYXNlc109XCJlZGl0YWJsZVBocmFzZXNcIlxyXG4gICAgICAgICAgICBbd29ya3NwYWNlXT1cIndvcmtzcGFjZVwiXHJcbiAgICAgICAgICAgIChlZGl0YWJsZVBocmFzZUNoYW5nZWQpPVwib25FZGl0YWJsZVBocmFzZUNoYW5nZWQoJGV2ZW50LmlucHV0RXZlbnQsICRldmVudC5pbmRleClcIlxyXG4gICAgICAgICAgPjwvZWRpdGFibGUtcGhyYXNlcz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICAjcGFwZXJcclxuICAgICAgICAqbmdJZj1cIih3b3Jrc3BhY2UubW9kZSA9PT0gJ3ZpZXcnIHx8IHdvcmtzcGFjZS5tb2RlID09PSAnZWRpdFZpZXcnKSAmJiBlZGl0YWJsZVBocmFzZXMubGVuZ3RoXCJcclxuICAgICAgICBjbGFzcz1cIndvcmtzcGFjZV9fdGVtcGxhdGVfX3BhcGVyLWNvbnRhaW5lcl9fcGFwZXJcIlxyXG4gICAgICAgIChrZXlwcmVzcyk9XCJkaXNhYmxlRW50ZXIoJGV2ZW50KVwiXHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2ICpuZ0lmPVwidmlld2FibGVQaHJhc2VzXCI+XHJcbiAgICAgICAgICA8dmlld2FibGUtcGhyYXNlc1xyXG4gICAgICAgICAgICBbdmlld2FibGVQaHJhc2VzXT1cInZpZXdhYmxlUGhyYXNlc1wiXHJcbiAgICAgICAgICAgIFtkYXRhXT1cIm9iamVjdERhdGFcIlxyXG4gICAgICAgICAgICBbd29ya3NwYWNlXT1cIndvcmtzcGFjZVwiXHJcbiAgICAgICAgICA+PC92aWV3YWJsZS1waHJhc2VzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuIl19