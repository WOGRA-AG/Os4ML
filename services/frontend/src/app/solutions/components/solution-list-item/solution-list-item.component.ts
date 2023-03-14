import { Component, Input } from '@angular/core';
import { map, Observable, startWith, takeWhile, timer } from 'rxjs';
import { Metric, Solution } from '../../../../../build/openapi/modelmanager';
import { getRuntime } from 'src/app/shared/lib/runtime/runtime';
import { getCssClassForStatus } from 'src/app/shared/lib/status/status';

@Component({
  selector: 'app-solution-list-item',
  templateUrl: './solution-list-item.component.html',
  styleUrls: ['./solution-list-item.component.scss'],
})
export class SolutionListItemComponent {
  @Input() solution: Solution = {};
  runtime$: Observable<number>;

  constructor() {
    this.runtime$ = timer(0, 1000).pipe(
      takeWhile(() => !this.solution.completionTime),
      startWith(null),
      map(() => {
        const completionTime =
          this.solution.completionTime || new Date().toISOString();
        return getRuntime(this.solution.creationTime, completionTime);
      })
    );
  }

  getCssClassForStatus(status: string | undefined | null): string {
    return getCssClassForStatus(status);
  }

  getModelQualityMetric(): Metric | undefined {
    const metrics = this.solution.metrics;
    if (!metrics) {
      return undefined;
    }
    return metrics[0];
  }
}
