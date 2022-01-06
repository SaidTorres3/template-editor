import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'entersToBr'
})
export class EntersToBrPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

  transform(value: string): SafeHtml {

    // regex \n or \r\n
    const entersRegex = /(\r\n|\n)/gm;
    
    let result = value.replace(entersRegex, (match) => {
      return `<br/>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

}
