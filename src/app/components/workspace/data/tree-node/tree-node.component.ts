import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DoesStringRepresentPrimitivePipe } from 'src/app/pipes/does-string-represent-primitive.pipe'

@Component({
  selector: 'tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.less', '../../../../shared/styles/commonStyles.less']
})
export class TreeNodeComponent {

  @ViewChild('treeRoot') treeRoot: ElementRef<HTMLDivElement>;
  @Input() node: any;
  @Input() tabulation: number;
  @Input() path: string = '';
  @Input() search?: string = '';
  public tabulationLenght: number = 20
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
    if (item.key === 'items') return this.path + '0.'
    if (item.key === 'properties') return this.path + ''
    return this.path + item.key + '.';
  }

  public showRealPath(e: MouseEvent, index: number) {
    this.showRealValue = true;
    this.actualIndex = index;
    const element = e.target as HTMLAnchorElement;
    element.onmouseleave = () => {
      this.showRealValue = false;
      element.onmouseleave = null;
    }
  }

  public isFoundedItem(titleValue: string | undefined, pathValue: string | undefined): boolean {
    titleValue = titleValue?.trim()?.toLowerCase()?.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    pathValue = pathValue?.trim()?.toLowerCase()?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\./g, ' ')
    const search = this.search?.trim()?.toLowerCase()?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\./g, ' ')
    if (titleValue && search) { 
      const includesInTitle = titleValue.includes(search)
      if (includesInTitle) { return true }
      else {
        if (pathValue && search) {
          return pathValue.includes(search)
        }
      }
    }
    return false
  }

  public replaceSelectionWithInnertext(e: MouseEvent, type: string) {
    const primitivizerChecker = new DoesStringRepresentPrimitivePipe()
    const isPrimitive = primitivizerChecker.transform(type)
    if (!isPrimitive) return
    const text = (e.target as HTMLDivElement).innerHTML
    document.execCommand('insertText', true, text)
  }
}
