import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
} from "@angular/core";
import { setCaretPosition } from "../../utils/javascript/setCaretPosition";
import { SelectionRange } from "../interfaces";

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
