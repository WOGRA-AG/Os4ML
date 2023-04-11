import { Component, Input } from '@angular/core';
import { map, Observable, startWith, takeWhile, timer } from 'rxjs';
import { Solution } from '../../../../../build/openapi/modelmanager';
import { getRuntime } from 'src/app/shared/lib/runtime/runtime';
import { getCssClassForStatus } from 'src/app/shared/lib/status/status';
import { TranslateModule } from '@ngx-translate/core';
import { ShortStatusPipe } from '../../../shared/pipes/short-status.pipe';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { FormatTimeDiffPipe } from '../../../shared/pipes/format-time-diff';
import { NgClass, AsyncPipe } from '@angular/common';
import { StarRatingComponent } from '../../../shared/components/molecules/star-rating/star-rating.component';

@Component({
  selector: 'app-solution-list-item',
  templateUrl: './solution-list-item.component.html',
  styleUrls: ['./solution-list-item.component.scss'],
  standalone: true,
  imports: [
    StarRatingComponent,
    NgClass,
    FormatTimeDiffPipe,
    LocalizedDatePipe,
    ShortStatusPipe,
    AsyncPipe,
    TranslateModule,
  ],
})
export class SolutionListItemComponent {
  @Input() public solution: Solution = {};
  public runtime$: Observable<number>;

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
}
