import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doesStringRepresentPrimitive'
})
export class DoesStringRepresentPrimitivePipe implements PipeTransform {

  transform(value: string): boolean {
    return (value === 'number' || value === 'string' || value === 'boolean' || value === 'integer' || value === 'float');
  }

}
