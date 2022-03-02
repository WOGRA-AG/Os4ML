import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Databag} from "../../../../build/openapi/objectstore";

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss']
})
export class DatabagListComponent {

  @Input()
  databags: Array<Databag> = [];
  @Input()
  selectedDatabag: Databag = {databag_name: ""};
  @Output()
  selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();

}
