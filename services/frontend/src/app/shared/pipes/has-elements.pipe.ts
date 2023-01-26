import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasElements'
})
export class HasElementsPipe implements PipeTransform {

  transform(arr: unknown[] | undefined | null): boolean {
    return !!arr && arr.length > 0;
  }

}
