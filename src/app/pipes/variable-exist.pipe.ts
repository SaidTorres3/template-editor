import { Pipe, PipeTransform } from '@angular/core';
import { stringToIsVariableAndExist } from 'src/utils/phrasesParsers/stringToIsVariableAndExist';
import { isVariableAndExist } from 'src/utils/phrasesParsers/types';

@Pipe({
  name: 'variableExist'
})
export class VariableExistPipe implements PipeTransform {

  transform(text: string, object: any): isVariableAndExist[] {
    return stringToIsVariableAndExist(text, object);
  }

}
