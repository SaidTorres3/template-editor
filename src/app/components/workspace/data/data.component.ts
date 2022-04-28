import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { WorkSpace } from "../../../../app/interfaces";
import { Zoom } from "../../../../app/shared/zoom-class/Zoom";

@Component({
  selector: "workspace-data",
  templateUrl: "./data.component.html",
  styleUrls: [
    "./data.component.less",
    "../../../shared/styles/commonStyles.less",
  ],
})
export class DataComponent implements OnDestroy, AfterViewInit {
  @Input() data: any;
  @Input() workspace: WorkSpace;

  @ViewChild("dataElement") dataElement: ElementRef<HTMLDivElement>;
  @ViewChild("dataContainer") dataContainer: ElementRef<HTMLDivElement>;
  @ViewChild("dataContainerData") dataContainerData: ElementRef<HTMLDivElement>;

  public zoom: Zoom = new Zoom();
  private zoomSuscription: Subscription;

  ngAfterViewInit(): void {
    console.log("testinggg.");
    console.log(this.data);
    this.zoomSuscription = this.zoom.zoomObserver.subscribe(() => {
      this.updateDataColumnsAmmount();
    });
  }

  ngOnDestroy(): void {
    this.zoomSuscription.unsubscribe();
  }

  public resizeDataContainerToCursorPosition(e: MouseEvent) {
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

  public searchInData(e: Event) {
    const inputEvent = e as InputEvent;
    const searchData = (inputEvent.target as HTMLInputElement).value;
    this.workspace.searchData = searchData;
  }

  private updateDataColumnsAmmount() {
    const newWidth = this.dataElement.nativeElement.clientWidth;
    if (this.dataContainerData) {
      if (newWidth > 1700) {
        this.dataContainerData.nativeElement.classList.add(
          "workspace__data__data-container__data--three-columns"
        );
      } else if (newWidth > 1000) {
        this.dataContainerData.nativeElement.classList.remove(
          "workspace__data__data-container__data--three-columns"
        );
        this.dataContainerData.nativeElement.classList.add(
          "workspace__data__data-container__data--two-columns"
        );
      } else if (newWidth < 1000) {
        this.dataContainerData.nativeElement.classList.remove(
          "workspace__data__data-container__data--three-columns"
        );
        this.dataContainerData.nativeElement.classList.remove(
          "workspace__data__data-container__data--two-columns"
        );
      }
    }
  }
}
