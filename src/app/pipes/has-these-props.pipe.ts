import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasTheseProps'
})
export class HasThesePropsPipe implements PipeTransform {

  transform(value: any, ...args: string[]): boolean {
    if(typeof value !== 'object') return false;
    const props = Object.keys(value)
    const answersStorage = {};
    
    for (const prop of args) {
      if (props.includes(prop)) {
        answersStorage[prop] = value[prop]
      }
    }
    const isTrue = Object.keys(answersStorage).length === args.length
    // debugger;
    return isTrue;
  }

}
