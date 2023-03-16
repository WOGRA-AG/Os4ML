import { Component, Input } from '@angular/core';
import { Prediction } from 'build/openapi/modelmanager';
import { map, Observable, startWith, takeWhile, timer } from 'rxjs';
import { getRuntime } from 'src/app/shared/lib/runtime/runtime';
import { getCssClassForStatus } from 'src/app/shared/lib/status/status';

@Component({
  selector: 'app-predictions-list-item',
  templateUrl: './predictions-list-item.component.html',
  styleUrls: ['./predictions-list-item.component.scss'],
})
export class PredictionsListItemComponent {
  @Input() public prediction: Prediction = {};

  public runtime$: Observable<number>;

  constructor() {
    this.runtime$ = timer(0, 1000).pipe(
      takeWhile(() => !this.prediction.completionTime),
      startWith(null),
      map(() => {
        const completionTime =
          this.prediction.completionTime || new Date().toISOString();
        return getRuntime(this.prediction.creationTime, completionTime);
      })
    );
  }

  getCssClassForStatus(status: string | null | undefined): string {
    return getCssClassForStatus(status);
  }
}
