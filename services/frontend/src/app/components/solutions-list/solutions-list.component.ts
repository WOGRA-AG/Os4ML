import {Component, Input} from '@angular/core';
import {Solution} from '../../../../build/openapi/objectstore';
import {PipelinePrecision} from '../../models/pipeline-precision';

@Component({
  selector: 'app-solutions-list',
  templateUrl: './solutions-list.component.html',
  styleUrls: ['./solutions-list.component.scss']
})
export class SolutionsListComponent {
  @Input() solutions: Solution[] = [];

  precision(precision: string | undefined): string {
    switch (precision) {
      case PipelinePrecision.high:
        return 'accent';
      case PipelinePrecision.medium:
        return 'medium';
      case PipelinePrecision.low:
        return 'warn';
      default:
        return 'medium';
    }
  }
}
