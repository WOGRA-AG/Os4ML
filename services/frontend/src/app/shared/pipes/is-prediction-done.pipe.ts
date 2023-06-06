import { Pipe, PipeTransform } from '@angular/core';
import { Prediction } from 'build/openapi/modelmanager';
import { PipelineStatus } from '../../core/models/pipeline-status';
import { getShortStatus } from '../lib/status/status';

@Pipe({
  name: 'isPredictionDone',
  standalone: true,
})
export class IsPredictionDonePipe implements PipeTransform {
  transform(solution: Prediction): boolean {
    return getShortStatus(solution.status) === PipelineStatus.done;
  }
}
