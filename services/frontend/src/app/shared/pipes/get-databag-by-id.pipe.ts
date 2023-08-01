import { Pipe, PipeTransform } from '@angular/core';
import { Databag } from '../../../../build/openapi/modelmanager';

@Pipe({
  name: 'getDatabagById',
  standalone: true,
})
export class GetDatabagByIdPipe implements PipeTransform {
  transform(databags: Databag[] | null, id: string): Databag | undefined {
    if (!databags) {
      return undefined;
    }
    return databags.find(databag => databag.id === id);
  }
}
