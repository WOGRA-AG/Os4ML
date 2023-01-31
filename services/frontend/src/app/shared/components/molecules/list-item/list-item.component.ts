import { Component, Input } from '@angular/core';
import { ListItem } from 'src/app/shared/models/list-item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
})
export class ListItemComponent {
  @Input() item: ListItem = {
    key: '',
    label: '',
    description: '',
  };

  constructor() {}
}
