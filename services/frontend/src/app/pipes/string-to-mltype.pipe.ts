import { Pipe, PipeTransform } from '@angular/core';
import { MlTypes } from '../models/ml-types';

@Pipe({
  name: 'stringToMLType',
  standalone: true,
})
export class StringToMLTypePipe implements PipeTransform {
  transform(value: string | undefined): MlTypes | undefined {
    return MlTypes[value as keyof typeof MlTypes] || undefined;
  }
}
