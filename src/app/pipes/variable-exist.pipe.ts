import { Pipe, PipeTransform } from '@angular/core';
import { stringToIsVariableAndExist } from '../../utils/phrasesParsers/stringToIsVariableAndExist';
import { isVariableAndExist } from '../../utils/phrasesParsers/types';

@Pipe({
  name: 'variableExist'
})
export class VariableExistPipe implements PipeTransform {

  // text was typed as string, but packagr compiler can't understand it
  transform(text: any, object: any): isVariableAndExist[] {
    return stringToIsVariableAndExist(text, object);
  }

}
