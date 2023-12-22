import { Pipe, PipeTransform } from '@angular/core';
import { Databag } from 'build/openapi/modelmanager';
import { PipelineStatus } from '../models/pipeline-status';
import { getShortStatus } from '../lib/status/status';

@Pipe({
  name: 'isDatabagDone',
  standalone: true,
})
export class IsDatabagDonePipe implements PipeTransform {
  transform(databag: Databag): boolean {
    return getShortStatus(databag.status) === PipelineStatus.done;
  }
}
