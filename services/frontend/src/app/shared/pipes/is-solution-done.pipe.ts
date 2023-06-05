import { Pipe, PipeTransform } from '@angular/core';
import { Solution } from 'build/openapi/modelmanager';
import { PipelineStatus } from '../../core/models/pipeline-status';
import { getShortStatus } from '../lib/status/status';

@Pipe({
  name: 'isSolutionDone',
  standalone: true,
})
export class IsSolutionDonePipe implements PipeTransform {
  transform(solution: Solution): boolean {
    return getShortStatus(solution.status) === PipelineStatus.done;
  }
}
