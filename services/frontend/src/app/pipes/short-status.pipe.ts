import { Pipe, PipeTransform } from '@angular/core';
import { PipelineStatus } from '../models/pipeline-status';
import { getShortStatus } from '../lib/status/status';

@Pipe({
  name: 'shortStatus',
  standalone: true,
})
export class ShortStatusPipe implements PipeTransform {
  transform(status: string | undefined | null): PipelineStatus {
    return getShortStatus(status);
  }
}
