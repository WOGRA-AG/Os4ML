import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ListItem } from 'src/app/shared/models/list-item';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.scss'],
})
export class SelectableListComponent {
  @Input() public listItems$: Observable<ListItem[]> | null = null;

  @Output() public selectedItemKeyChange: EventEmitter<string> =
    new EventEmitter<string>();

  public currentSelectedItem: ListItem | null = null;

  selectItem(item: ListItem): void {
    this.selectedItemKeyChange.emit(item.key);
    this.currentSelectedItem = item;
  }
}
