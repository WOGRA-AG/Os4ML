import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ListItem } from 'src/app/shared/models/list-item';
import { ListItemComponent } from '../../molecules/list-item/list-item.component';
import { MatListModule } from '@angular/material/list';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.scss'],
  standalone: true,
  imports: [NgIf, MatListModule, NgFor, NgClass, ListItemComponent, AsyncPipe],
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
