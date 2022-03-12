import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss']
})
export class DatabagListComponent {

  @Input() databags: Databag[] = [];
  @Input() selectedDatabag: Databag = {databagName: ''};
  @Output() selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();

}
