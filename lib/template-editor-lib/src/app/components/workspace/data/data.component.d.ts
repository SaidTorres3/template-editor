import { AfterViewInit, ElementRef, OnDestroy } from "@angular/core";
import { WorkSpace } from "../../../../app/interfaces";
import { Zoom } from "../../../../app/shared/zoom-class/Zoom";
import * as i0 from "@angular/core";
export declare class DataComponent implements OnDestroy, AfterViewInit {
    data: any;
    workspace: WorkSpace;
    dataElement: ElementRef<HTMLDivElement>;
    dataContainer: ElementRef<HTMLDivElement>;
    dataContainerData: ElementRef<HTMLDivElement>;
    zoom: Zoom;
    private zoomSuscription;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    resizeDataContainerToCursorPosition(e: MouseEvent): void;
    searchInData(e: Event): void;
    private updateDataColumnsAmmount;
    static ɵfac: i0.ɵɵFactoryDeclaration<DataComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DataComponent, "workspace-data", never, { "data": "data"; "workspace": "workspace"; }, {}, never, never>;
}
