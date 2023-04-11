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
  @Input() public multiSelect = false;

  @Output() public selectedItemKeyChange: EventEmitter<string[]> =
    new EventEmitter<string[]>();

  public currentSelectedItems: string[] = [];

  public selectItem(item: ListItem): void {
    if (this.multiSelect) {
      this.handleMultiselectItem(item);
    } else {
      this.currentSelectedItems = [item.key];
    }
    this.selectedItemKeyChange.emit(this.currentSelectedItems);
  }

  private handleMultiselectItem(item: ListItem): void {
    if (!this.currentSelectedItems.includes(item.key)) {
      this.currentSelectedItems.push(item.key);
    } else {
      this.currentSelectedItems.splice(
        this.currentSelectedItems.indexOf(item.key),
        1
      );
    }
  }
}
