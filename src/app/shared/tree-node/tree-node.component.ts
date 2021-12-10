import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.less']
})
export class TreeNodeComponent {

  @Input() node;
  @Input() tabulation: number;
  public tabulationLenght: number = 12

  ngOnInit() {
    if(this.tabulation == undefined) {
      this.tabulation = 0;
    }
  }

  public consoleLog(arg: any) {
    console.log(arg);
  }

}
