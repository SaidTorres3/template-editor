import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.less']
})
export class TreeNodeComponent {

  @ViewChild('treeRoot') treeRoot: ElementRef<HTMLDivElement>;

  @Input() node: any;
  @Input() tabulation: number;
  @Input() path: string = '';
  public tabulationLenght: number = 20
  public showRealValue = false;
  public actualIndex: number
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

}
