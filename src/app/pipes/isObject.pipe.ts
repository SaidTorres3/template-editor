import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isObject'
})
export class isObject implements PipeTransform {

  transform(value: any): boolean {
    return typeof value === 'object'
  }

}
