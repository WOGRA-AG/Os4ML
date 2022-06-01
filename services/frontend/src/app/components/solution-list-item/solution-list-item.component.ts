import {Component, Input, OnDestroy} from '@angular/core';
import {Solution} from '../../../../build/openapi/jobmanager';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-solution-list-item',
  templateUrl: './solution-list-item.component.html',
  styleUrls: ['./solution-list-item.component.scss']
})
export class SolutionListItemComponent implements OnDestroy {

  @Input() solution: Solution = {};
  runtime = '';
  intervalSub: Subscription;

  constructor() {
    this.intervalSub = timer(0, 250).subscribe(x => {
      const completionTime = this.solution.completionTime || new Date().toISOString();
      this.runtime = this.getRuntime(this.solution.creationTime, completionTime);
    });
  }

  private static msToHMS(ms: number): string {
    // https://stackoverflow.com/a/29816921 with small fixes
    let seconds = ms / 1000;
    const hours = Math.round(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.round(seconds / 60);
    seconds = Math.round(seconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  getRuntime(creationTime: string | undefined, completionTime: string | undefined): string {
    if (!creationTime) {
      return '0s';
    }
    const creationDate = new Date(creationTime);
    const completionDate = completionTime ? new Date(completionTime) : new Date();
    const timeDiff = completionDate.getTime() - creationDate.getTime();
    return SolutionListItemComponent.msToHMS(timeDiff);
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
  }

  trimSolutionName(name: string | undefined): string {
    if(!name) {
      return '';
    }
    const uuidIndex = name.indexOf('_');
    return name.substring(uuidIndex + 1);
  }
}
