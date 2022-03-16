import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss']
})
export class DatabagListComponent {

  @Input() databags: Databag[] = [];
  @Input() selectedDatabag: Databag = {};
  @Output() selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();

  changeSelectedDatabag(databag: Databag) {
    this.selectedDatabag = databag;
    this.selectedDatabagChange.emit(this.selectedDatabag);
  }

  isSameDatabag(selectedDatabag: Databag, databag: Databag) {
    return Object.is(selectedDatabag, databag);
  }
}
