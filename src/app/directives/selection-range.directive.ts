import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
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
      this.setCaretPosition(targetElement, this.selectionRange.start);
    }
  }

  ngOnChanges(): void {
    if (this.selectionRange) {
      const targetElement = this.element.nativeElement as HTMLElement;
      // set caret position at the selection range start
      this.setCaretPosition(targetElement, this.selectionRange.start);
    }
  }

  private setCaretPosition(el, pos) {
    // Loop through all child nodes
    for (var node of el.childNodes) {
      if (node.nodeType == 3) {
        // we have a text node
        if (node.length >= pos) {
          // finally add our range
          var range = document.createRange(),
            sel = window.getSelection();
          range.setStart(node, pos);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          return -1; // we are done
        } else {
          pos -= node.length;
        }
      } else {
        pos = this.setCaretPosition(node, pos);
        if (pos == -1) {
          return -1; // no need to finish the for loop
        }
      }
    }
    return pos; // needed because of recursion stuff
  }
}
