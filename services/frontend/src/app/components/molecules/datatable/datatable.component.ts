import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  standalone: true,
  imports: [],
})
export class DatatableComponent {
  @Input() public isDatabagTable = false;
  @Input() public isSolutionsTable = false;
  @Input() public isPredictionsTable = false;
  @Input() public displayedColumns: string[] = [];
  @Input() public headerNames: string[] = [];
}
