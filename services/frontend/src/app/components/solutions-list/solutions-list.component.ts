import {Component, Input} from '@angular/core';
import {Solution} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-solutions-list',
  templateUrl: './solutions-list.component.html',
  styleUrls: ['./solutions-list.component.scss']
})
export class SolutionsListComponent {
  @Input() solutions: Solution[] = [];
  severity = 'medium';
}
