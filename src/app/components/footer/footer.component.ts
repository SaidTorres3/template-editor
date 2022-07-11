import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkSpace } from '../../../app/interfaces';
import { Zoom } from '../../../app/shared/zoom-class/Zoom';

@Component({
  selector: 'app-footer[workspace]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  @Input() workspace: WorkSpace;
  @Output() clickEditMode: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() clickViewMode: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() clickSimulationMode: EventEmitter<MouseEvent> = new EventEmitter();

  onClickEditMode(e: MouseEvent) {
    this.clickEditMode.emit(e);
  }

  onClickViewMode(e: MouseEvent) {
    this.clickViewMode.emit(e);
  }

  onClickSimulationMode(e: MouseEvent) {
    this.clickSimulationMode.emit(e);
  }

  public zoom: Zoom = new Zoom();

  constructor() {}

  ngOnInit(): void {}
}
