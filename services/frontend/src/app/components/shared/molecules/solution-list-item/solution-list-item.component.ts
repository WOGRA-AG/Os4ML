import {Component, Input, OnDestroy} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {Solution} from '../../../../../../build/openapi/modelmanager';
import {PipelineStatus} from '../../../../models/pipeline-status';

@Component({
  selector: 'app-shared-solution-list-item',
  templateUrl: './solution-list-item.component.html',
  styleUrls: ['./solution-list-item.component.scss']
})
export class SolutionListItemComponent implements OnDestroy {

  @Input() solution: Solution = {};
  runtime = '';
  intervalSub: Subscription;
  readonly pipelineStatus = PipelineStatus;

  constructor() {
    this.intervalSub = timer(0, 250).subscribe(x => {
      const completionTime = this.solution.completionTime || new Date().toISOString();
      this.runtime = this.getRuntime(this.solution.creationTime, completionTime);
    });
  }

  private static msToHMS(ms: number): string {
    // https://stackoverflow.com/a/29816921 with small fixes
    let seconds = ms / 1000;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.round(seconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
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

  trimSolutionName(name: string | undefined): string {
    if (!name) {
      return '';
    }
    const uuidIndex = name.indexOf('_');
    return name.substring(uuidIndex + 1);
  }

  formatTimestamp(creationTime: string | undefined): string {
    if (!creationTime) {
      return '';
    }
    const creationDate = new Date(creationTime);
    return creationDate.toLocaleDateString('de-DE');
  }

  formatAccuracy(solutionAccuracy: number): number {
    return Math.round(solutionAccuracy * 100);
  }
}
