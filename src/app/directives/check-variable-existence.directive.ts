import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
} from "@angular/core";

@Directive({
  selector: "[check-variable-existence]",
})
export class CheckVariableExistenceDirective implements AfterViewInit {
  constructor(@Inject(ElementRef) private element: ElementRef) {}
  ngAfterViewInit() {
    const element = this.element.nativeElement as HTMLElement;
    element.innerHTML = element.innerHTML.replace(
      /([^({\s]+\.[^})\s]+)/g,
      (variable) => {
        if (variable.indexOf(".") === -1) {
          return `<span class="variable-not-found">TESTING${variable}</span>`;
        }
        return variable;
      }
    );
  }
}
