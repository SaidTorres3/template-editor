import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
import { setCaretPosition } from "src/utils/javascript/setCaretPosition";
import { SelectionRange } from "../app.component";

@Directive({
  selector: "[selectionRange]",
})
export class SelectionRangeDirective implements AfterViewInit, OnChanges {
  @Input() selectionRange: SelectionRange;
  constructor(@Inject(ElementRef) private element: ElementRef) {}
  ngAfterViewInit(): void {
    if (this.selectionRange) {
      const targetElement = this.element.nativeElement as HTMLElement;
      // set caret position at the selection range start
      setCaretPosition(targetElement, this.selectionRange.start);
    }
  }

  ngOnChanges(): void {
    if (this.selectionRange) {
      const targetElement = this.element.nativeElement as HTMLElement;
      // set caret position at the selection range start
      setCaretPosition(targetElement, this.selectionRange.start);
    }
  }
}
