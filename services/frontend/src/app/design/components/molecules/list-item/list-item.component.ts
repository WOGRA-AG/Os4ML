import { Component, Input } from '@angular/core';
import { ListItem } from 'src/app/shared/models/list-item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  standalone: true,
})
export class ListItemComponent {
  @Input() public item: ListItem = {
    key: '',
    label: '',
    description: '',
  };
}
