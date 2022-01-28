import { Component, Input, OnInit } from "@angular/core";
import { ViewablePhrase } from "src/utils/docxParsers/types";
import { handlebarToInstruction } from "src/utils/handlebarTranslators/handlebarToReadableInstruction";
import { ReadableInstruction } from "src/utils/handlebarTranslators/types";
import { clasificateStringBetweenTextAndHandlebars } from "src/utils/handlebarTranslators/clasificateStringBetweenTextAndHandlebars";

@Component({
  selector: "viewable-phrases",
  templateUrl: "./viewable-phrase.component.html",
  styleUrls: ["./viewable-phrase.component.less"],
})
export class ViewablePhraseComponent {
  @Input() viewablePhrases: ViewablePhrase[];
  public showModal: ShowModal = {
    phraseIndex: 0,
    showModal: false,
    modalPostion: { x: 0, y: 0 },
    data: undefined,
  };

  public showModalToggle(e: MouseEvent, phraseIndex: number): void {
    this.showModal.phraseIndex = phraseIndex;
    this.showModal.showModal = !this.showModal.showModal;
    this.showModal.modalPostion.x = e.clientX;
    this.showModal.modalPostion.y = e.clientY;
    this.translateHandlebarToInstructions(phraseIndex);
  }

  public handlebarsToReadableIntructions(clasifiedText: ReadableInstruction[]): ReadableInstruction[] {
    let result: ReadableInstruction[] = [];
    result = clasifiedText.map((clasifiedTextOrHandlebar) => {
      if (clasifiedTextOrHandlebar.type === "handlebar") {
        clasifiedTextOrHandlebar = handlebarToInstruction(clasifiedTextOrHandlebar);
      }
      return clasifiedTextOrHandlebar;
    });
    return result;
  }

  public translateHandlebarToInstructions(viewablePhraseIndex: number): void {
    const handlebar = this.viewablePhrases[viewablePhraseIndex].value as string;
    const clasifiedText = clasificateStringBetweenTextAndHandlebars(handlebar);
    const readableInstructions = this.handlebarsToReadableIntructions(clasifiedText);
    this.showModal.data = readableInstructions;
  }
}

interface ShowModal {
  showModal: boolean;
  phraseIndex: number;
  modalPostion: { x: number; y: number };
  data: ReadableInstruction[] | undefined;
}
