import { Pipe, PipeTransform } from '@angular/core';
export interface SelectOption {
  value: string;
  viewValue: string;
}

@Pipe({
  name: 'toSelectOption',
  standalone: true,
})
export class ToSelectOptionPipe implements PipeTransform {
  transform<T>(
    items: T[],
    valueFn: (item: T) => string,
    viewValueFn: (item: T) => string
  ): SelectOption[] {
    return items.map(item => ({
      value: valueFn(item),
      viewValue: viewValueFn(item),
    }));
  }
}
