import {Pipe, PipeTransform} from '@angular/core';
import {PipelineStatus} from '../../models/pipeline-status';

@Pipe({
  name: 'shortStatus'
})
export class ShortStatusPipe implements PipeTransform {

  transform(status: string | undefined | null): PipelineStatus {
    if (!status) {
      return PipelineStatus.running;
    }
    if (status.startsWith('message.pipeline.done')) {
      return PipelineStatus.done;
    }
    if (status.startsWith('message.pipeline.error')) {
      return PipelineStatus.error;
    }
    return PipelineStatus.running;
  }

}
