import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { WorkSpace } from "src/app/app.component";
import { DoesStringRepresentPrimitivePipe } from "src/app/pipes/does-string-represent-primitive.pipe";

@Component({
  selector: "tree-node[workspace]",
  templateUrl: "./tree-node.component.html",
  styleUrls: [
    "./tree-node.component.less",
    "../../../../shared/styles/commonStyles.less",
  ],
})
export class TreeNodeComponent {
  @ViewChild("treeRoot") treeRoot: ElementRef<HTMLDivElement>;
  @Input() node: any;
  @Input() tabulation: number;
  @Input() path: string = "";
  @Input() workspace: WorkSpace;
  public tabulationLenght: number = 20;
  public showRealValue = false;
  public actualIndex: number;
  public isHovering: boolean = false;

  ngOnInit() {
    if (this.tabulation == undefined) {
      this.tabulation = 0;
    }
  }

  public setHovering(isHovering: boolean) {
    this.isHovering = isHovering;
  }

  public showPath(item: any): string {
    return `{{${this.path + item.key}}}`;
  }

  public pathToSend(item: any): string {
    if (item.key === "items") return this.path + "∀.";
    if (item.key === "properties") return this.path + "";
    return this.path + item.key + ".";
  }

  public showRealPath(e: MouseEvent, index: number) {
    this.showRealValue = true;
    this.actualIndex = index;
    const element = e.target as HTMLAnchorElement;
    element.onmouseleave = () => {
      this.showRealValue = false;
      element.onmouseleave = null;
    };
  }

  public isFoundedItem(
    titleValue: string | undefined,
    pathValue: string | undefined
  ): boolean {
    titleValue = titleValue
      ?.trim()
      ?.toLowerCase()
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // replace accent characters to non accent characters
    pathValue = pathValue
      ?.trim()
      ?.toLowerCase()
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, " ");
    const search = this.workspace.searchData
      ?.trim()
      ?.toLowerCase()
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, " ");
    if (titleValue && search) {
      const includesInTitle = titleValue.includes(search);
      if (includesInTitle) {
        return true;
      } else {
        if (pathValue && search) {
          return pathValue.includes(search);
        }
      }
    }
    return false;
  }

  public replaceSelectionWithInnertext(e: MouseEvent, type: string) {
    const primitivizerChecker = new DoesStringRepresentPrimitivePipe();
    const isPrimitive = primitivizerChecker.transform(type);
    if (!isPrimitive) return;
    let text = (e.target as HTMLDivElement).innerHTML;
    text = this.replaceArraySymbolToEachSentence(text);
    document.execCommand("insertText", true, text);
  }

  private replaceArraySymbolToEachSentence(text: string): string {
    const dividedText = text.replace(/[\{\}]/g, "").split(".");
    console.log(dividedText);
    let posibleResult = "";
    let previousIterationWasAnUniversalQuantizer = false;
    for (let [index, sentence] of dividedText.entries()) {
      const regexToFindLastContentVariable = /}}([\w\.]+){{\/each}}/g;
      const match = regexToFindLastContentVariable.exec(posibleResult);
      const part1 = dividedText[index - 1];
      const part2 = dividedText[index + 1];
      if (
        sentence.includes("∀") &&
        !dividedText[index - 1]?.includes("∀") &&
        !dividedText[index + 1]?.includes("∀")
      ) {
        if (!posibleResult) {
          posibleResult = `{{#each ${part1}}}${part2}{{/each}}`;
        } else {
          // replace text of the first group
          posibleResult = posibleResult.replace(
            match[1],
            `{{#each ${part1}}}${part2}{{/each}}`
          );
          previousIterationWasAnUniversalQuantizer = true;
        }
      } else if (match) {
        posibleResult = posibleResult.replace(
          match[1],
          `${
            previousIterationWasAnUniversalQuantizer ? "" : match[1] + "."
          }${sentence}`
        );
        previousIterationWasAnUniversalQuantizer = false;
      }
    }
    if (posibleResult) return posibleResult;
    return text;
  }
}
