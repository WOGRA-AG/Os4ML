import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Databag } from 'build/openapi/modelmanager';
import { of, Observable } from 'rxjs';
import { ListItem } from 'src/app/shared/models/list-item';

@Component({
  selector: 'app-choose-databag-column',
  templateUrl: './choose-databag-column.component.html',
  styleUrls: ['./choose-databag-column.component.scss'],
})
export class ChooseDatabagColumnComponent implements OnInit {
  @Input() databag: Databag = {};
  @Output() selectedColumn = new EventEmitter<string>();
  listItems$: Observable<ListItem[]> | undefined;

  allowedColumnTypes = ['category', 'numerical'];

  public get outputColumnAvailable(): boolean {
    return !!this.databag.columns?.find(
      column => column.type && this.allowedColumnTypes.includes(column.type)
    );
  }

  ngOnInit(): void {
    if (!this.databag.columns) {
      return;
    }
    this.listItems$ = of(
      this.databag.columns
        .filter(
          column => column.type && this.allowedColumnTypes.includes(column.type)
        )
        .map(column => ({
          key: column.name || '',
          label: column.name || '',
          description: column.type || '',
        }))
    );
  }
}
