import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Databag } from 'build/openapi/modelmanager';
import { of, Observable, map } from 'rxjs';
import { ListItem } from 'src/app/shared/models/list-item';
import { TranslateModule } from '@ngx-translate/core';
import { SelectableListComponent } from '../../../design/components/organisms/selectable-list/selectable-list.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-choose-databag-column',
  templateUrl: './choose-databag-column.component.html',
  styleUrls: ['./choose-databag-column.component.scss'],
  standalone: true,
  imports: [NgIf, SelectableListComponent, TranslateModule],
})
export class ChooseDatabagColumnComponent implements OnChanges {
  @Input() public databag: Databag = {};
  @Output() public selectedColumnChange = new EventEmitter<string[]>();
  public listItems$: Observable<ListItem[]> | undefined;

  private allowedColumnTypes = ['category', 'numerical'];

  public get outputColumnAvailable(): boolean {
    return !!this.databag.columns?.find(
      column => column.type && this.allowedColumnTypes.includes(column.type)
    );
  }

  ngOnChanges(): void {
    if (!this.databag.columns) {
      return;
    }
    this.listItems$ = of(this.databag.columns).pipe(
      map(columns =>
        columns.filter(
          column => column.type && this.allowedColumnTypes.includes(column.type)
        )
      ),
      map(columns =>
        columns.map(column => ({
          key: column.name || '',
          label: column.name || '',
          description: column.type || '',
        }))
      )
    );
  }
}
