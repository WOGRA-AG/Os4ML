import {Component, Input} from '@angular/core';
import {map, Observable, startWith, takeWhile, timer} from 'rxjs';
import {Metric, Solution} from '../../../../../build/openapi/modelmanager';
import {ShortStatusPipe} from '../../../shared/pipes/short-status.pipe';
import {PipelineStatus} from '../../../models/pipeline-status';

@Component({
  selector: 'app-solution-list-item',
  templateUrl: './solution-list-item.component.html',
  styleUrls: ['./solution-list-item.component.scss']
})
export class SolutionListItemComponent {

  @Input() solution: Solution = {};
  runtime$: Observable<number>;

  constructor(private shortStatus: ShortStatusPipe) {
    this.runtime$ = timer(0, 1000).pipe(
      takeWhile(() => !this.solution.completionTime),
      startWith(null),
      map(() => {
        const completionTime = this.solution.completionTime || new Date().toISOString();
        return this.getRuntime(this.solution.creationTime, completionTime);
      }),
    );
  }

  getRuntime(creationTime: string | undefined, completionTime: string | undefined): number {
    if (!creationTime) {
      return 0;
    }
    const creationDate = new Date(creationTime);
    const completionDate = completionTime ? new Date(completionTime) : new Date();
    return completionDate.getTime() - creationDate.getTime();
  }

  getCssClassForStatus(status: string | undefined | null): string {
    if (!status) {
      return 'running';
    }
    switch(this.shortStatus.transform(status)) {
      case PipelineStatus.running:
        return 'running';
      case PipelineStatus.done:
        return 'done';
      case PipelineStatus.error:
        return 'error';
    }
  }

  getModelQualityMetric(): Metric | undefined {
    const metrics = this.solution.metrics;
    if (!metrics) {
      return undefined;
    }
    return metrics[0];
  }
}
