import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Databag } from 'build/openapi/modelmanager';

@Component({
  selector: 'app-choose-databag-column',
  templateUrl: './choose-databag-column.component.html',
  styleUrls: ['./choose-databag-column.component.scss']
})
export class ChooseDatabagColumnComponent {
  @Input() databag: Databag = {};
  @Output() selectedColumn = new EventEmitter<string>();
  lastSelectedColumn = '';
  allowedColumnTypes = ['category', 'numerical'];
  outputColumnAvailable = !!this.databag.columns?.find(column => column.type && this.allowedColumnTypes.includes(column.type));

  selectColumn(column: string | undefined): void {
    if (!column) {
      return;
    }
    this.lastSelectedColumn = column;
    this.selectedColumn.emit(column);
  }
}
