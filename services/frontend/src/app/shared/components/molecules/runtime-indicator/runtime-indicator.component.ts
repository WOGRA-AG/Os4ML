import {Component, Input} from '@angular/core';
import {map, Observable, startWith, takeWhile, timer} from 'rxjs';
import {getRuntime} from '../../../lib/runtime/runtime';
import {AsyncPipe, DatePipe} from '@angular/common';
import {FormatTimeDiffPipe} from '../../../pipes/format-time-diff';

@Component({
  selector: 'app-runtime-indicator',
  templateUrl: './runtime-indicator.component.html',
  styleUrls: ['./runtime-indicator.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    FormatTimeDiffPipe,
    DatePipe
  ]
})
export class RuntimeIndicatorComponent {

  @Input() public creationTime: string | undefined;
  @Input() public completionTime: string | null | undefined;

  public runtime$: Observable<number>;

  constructor() {
    this.runtime$ = timer(0, 1000).pipe(
      takeWhile(() => !this.completionTime),
      startWith(null),
      map(() => {
        const completionTime =
          this.completionTime || new Date().toISOString();
        return getRuntime(this.creationTime, completionTime);
      })
    );
  }

}
