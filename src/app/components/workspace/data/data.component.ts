import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { WorkSpace } from "src/app/app.component";
import { Zoom } from "src/app/shared/zoom-class/Zoom";

@Component({
  selector: "workspace-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.less", "../../../shared/styles/commonStyles.less"],
})
export class DataComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() workspace: WorkSpace;

  @ViewChild("dataElement") dataElement: ElementRef<HTMLDivElement>;
  @ViewChild("dataContainer") dataContainer: ElementRef<HTMLDivElement>;
  @ViewChild("dataContainerData") dataContainerData: ElementRef<HTMLDivElement>;

  public zoom: Zoom = new Zoom();
  private zoomSuscription: Subscription

  ngOnInit(): void {
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

  public searchInData(searchData: string) {
    this.workspace.searchData = searchData;
  }

  private updateDataColumnsAmmount() {
    const newWidth = this.dataElement.nativeElement.clientWidth;
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
