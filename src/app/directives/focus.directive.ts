import { Directive, ElementRef, Inject, Input } from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective {
  @Input() focus: boolean;
  constructor(@Inject(ElementRef) private element: ElementRef) { }
  protected ngOnChanges() {
    if (this.focus) {
      const element = this.element.nativeElement as HTMLElement
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}