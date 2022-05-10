import {Component, Input} from '@angular/core';
import {Solution} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-solutions-list',
  templateUrl: './solutions-list.component.html',
  styleUrls: ['./solutions-list.component.scss']
})
export class SolutionsListComponent {
  @Input() solutions: Solution[] = [];

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
    return SolutionsListComponent.msToHMS(timeDiff);
  }
}
