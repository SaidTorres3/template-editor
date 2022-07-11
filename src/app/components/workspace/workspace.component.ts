import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkSpace } from '../../../app/interfaces';
import { Zoom } from '../../../app/shared/zoom-class/Zoom';
import {
  EditablePhrase,
  ViewablePhrase,
} from '../../../utils/docxParsers/types';

@Component({
  selector:
    'app-workspace[data][workspace][editablePhrases][fileInput][viewablePhrases]',
  templateUrl: './workspace.component.html',
  styleUrls: [
    './workspace.component.less',
    '../../shared/styles/commonStyles.less',
  ],
})
export class WorkspaceComponent {
  @Input() data: any;
  @Input() workspace: WorkSpace;
  @Input() editablePhrases: EditablePhrase[];
  @Input() fileInput: HTMLButtonElement;
  @Input() viewablePhrases: ViewablePhrase[];
  @Output() editablePhraseChanged: EventEmitter<{
    inputEvent: InputEvent;
    indexOfEditablePhrase: number;
  }> = new EventEmitter();

  public zoom: Zoom = new Zoom();

  public onEditablePhraseChanged(e: Event, index: number) {
    const inputEvent = e as InputEvent;
    this.editablePhraseChanged.emit({
      inputEvent,
      indexOfEditablePhrase: index,
    });
  }

  public disableEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }
}
