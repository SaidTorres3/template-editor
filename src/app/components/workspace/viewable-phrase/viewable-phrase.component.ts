import { Component, Input, AfterViewInit } from "@angular/core";
import { ViewablePhrase } from "src/utils/docxParsers/types";
import { handlebarToInstruction } from "src/utils/handlebarTranslators/handlebarToReadableInstruction";
import { ReadableInstruction } from "src/utils/handlebarTranslators/types";
import { clasificateStringBetweenTextAndHandlebars } from "src/utils/handlebarTranslators/clasificateStringBetweenTextAndHandlebars";
import { WorkSpace } from "src/app/app.component";

@Component({
  selector: "viewable-phrases[viewablePhrases][data][workspace]",
  templateUrl: "./viewable-phrase.component.html",
  styleUrls: ["./viewable-phrase.component.less"],
})
export class ViewablePhraseComponent implements AfterViewInit {
  @Input() viewablePhrases: ViewablePhrase[];
  @Input() data: any;
  @Input() workspace: WorkSpace;

  public showModal: ShowModal = {
    phraseIndex: 0,
    showModal: false,
    modalPosition: { x: 0, y: 0 },
    arrowPosition: { x: 0 },
    data: undefined,
  };

  ngAfterViewInit(): void {
    this.createClickoffListener()
  }

  private createClickoffListener = () => {
    window.addEventListener('click', () => {
      this.showModal.showModal = false;
    })
  }

  public showModalToggle(e: MouseEvent, phraseIndex: number): void {
    e.stopPropagation();
    this.showModal.phraseIndex = phraseIndex;
    this.showModal.showModal = !this.showModal.showModal;
    this.showModal.modalPosition.x = e.clientX;
    this.showModal.modalPosition.y = e.clientY - window.scrollY;
    this.translateHandlebarToInstructions(phraseIndex);
  }

  public handlebarsToReadableIntructions(
    clasifiedText: ReadableInstruction[]
  ): ReadableInstruction[] {
    let result: ReadableInstruction[] = [];
    result = clasifiedText.map((clasifiedTextOrHandlebar) => {
      if (clasifiedTextOrHandlebar.type === "handlebar") {
        clasifiedTextOrHandlebar = handlebarToInstruction(
          clasifiedTextOrHandlebar
        );
      }
      return clasifiedTextOrHandlebar;
    });
    return result;
  }

  public translateHandlebarToInstructions(viewablePhraseIndex: number): void {
    const handlebar = this.viewablePhrases[viewablePhraseIndex].value as string;
    const clasifiedText = clasificateStringBetweenTextAndHandlebars(handlebar);
    const readableInstructions = this.handlebarsToReadableIntructions(
      clasifiedText
    );
    this.showModal.data = readableInstructions;
  }

  public setSearchData(e: MouseEvent) {
    // get text from the clicked element
    e.stopImmediatePropagation();
    const element = e.target as HTMLElement;
    this.workspace.searchData = element.innerHTML;
  }

  public stopClickPropagation(e: MouseEvent) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  }
}

interface ShowModal {
  showModal: boolean;
  phraseIndex: number;
  modalPosition: { x: number; y: number };
  arrowPosition: { x: number };
  data: ReadableInstruction[] | undefined;
}
