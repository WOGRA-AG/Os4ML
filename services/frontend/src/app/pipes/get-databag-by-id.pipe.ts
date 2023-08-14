import { Pipe, PipeTransform } from '@angular/core';
import { Databag } from '../../../build/openapi/modelmanager';
import { DatabagService } from '../services/databag.service';

@Pipe({
  name: 'getDatabagById',
  standalone: true,
})
export class GetDatabagByIdPipe implements PipeTransform {
  constructor(private databagService: DatabagService) {}
  transform(id: string): Databag | undefined {
    return this.databagService.getDatabagById(id);
  }
}
