import { Pipe, PipeTransform } from '@angular/core';
import { Databag } from '../../../build/openapi/modelmanager';
import { ListItem } from '../models/list-item';

@Pipe({
  name: 'getPredictListItemsFromDatabag',
  standalone: true,
})
export class GetPredictListItemsFromDatabagPipe implements PipeTransform {
  private allowedColumnTypes = ['category', 'numerical', 'binary'];
  transform(databag: Databag | undefined): ListItem[] {
    if (!databag?.columns) {
      return [];
    }

    const columns = databag.columns.filter(
      column => column.type && this.allowedColumnTypes.includes(column.type)
    );

    return columns.map(column => ({
      key: column.name || '',
      label: column.name || '',
      description: column.type || '',
    }));
  }
}
