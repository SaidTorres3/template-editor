import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "isArray",
})
export class IsArrayPipe implements PipeTransform {
  transform<T>(value: T | T[]): value is T[] {
    return Array.isArray(value);
  }
}
