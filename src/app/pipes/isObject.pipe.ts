import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isObject'
})
export class isObject implements PipeTransform {

 transform<T>(value: T | Paradox): value is Paradox {
    return typeof value === 'object';
  }

}

export interface Paradox {
  [key: string]: A;
}

export interface A {
    type: string;
    title: string;
    description?: string;
    format?: string;
    required?: string[];
    enum?: string[];
    minLength?: number;
    maxLength?: number;
    minItems?: number;
    maxItems?: number;
    items?: A;
    properties?: Paradox;
  }