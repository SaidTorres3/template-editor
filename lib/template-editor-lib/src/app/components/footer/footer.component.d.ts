import { OnInit, EventEmitter } from '@angular/core';
import { WorkSpace } from '../../../app/interfaces';
import { Zoom } from '../../../app/shared/zoom-class/Zoom';
import * as i0 from "@angular/core";
export declare class FooterComponent implements OnInit {
    workspace: WorkSpace;
    clickEditMode: EventEmitter<MouseEvent>;
    clickViewMode: EventEmitter<MouseEvent>;
    clickSimulationMode: EventEmitter<MouseEvent>;
    onClickEditMode(e: MouseEvent): void;
    onClickViewMode(e: MouseEvent): void;
    onClickSimulationMode(e: MouseEvent): void;
    zoom: Zoom;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FooterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FooterComponent, "app-footer[workspace]", never, { "workspace": "workspace"; }, { "clickEditMode": "clickEditMode"; "clickViewMode": "clickViewMode"; "clickSimulationMode": "clickSimulationMode"; }, never, never>;
}
