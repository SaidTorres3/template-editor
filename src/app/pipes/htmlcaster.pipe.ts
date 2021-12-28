import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'hTMLCaster'
})
export class HTMLCasterPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

  transform(value: string): SafeHtml {
    // encapsulate beetween '{{' and '}}' in <a></a> tags. Do not encapsulate if '{{#if'
    // let betweenBracketsRegex = /\{\{(?!#if)(.*?)\}\}/g;
    const betweenBracketsRegex = /\{\{(.*?)\}\}/g;
    // regex beetween '{{#if' and '{{/if}}'
    
    
    const ifRegex = /\{\{#if(.*?)\{\{\/if\}\}/g
    
    let result = value.replace(ifRegex, (match) => {
      return `<span style="background: #ff000069;">${match}</span>`;
    });
    result = result.replace(betweenBracketsRegex, (match) => {
      return `<a style="color: #090;">${match}</a>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

}
