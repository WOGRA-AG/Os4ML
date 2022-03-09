import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-solutions-list',
  templateUrl: './solutions-list.component.html',
  styleUrls: ['./solutions-list.component.scss']
})
export class SolutionsListComponent {
  @Input() solutions: Array<any> = [];
  severity: string = "medium";
}
