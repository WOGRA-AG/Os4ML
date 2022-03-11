import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bucket} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss']
})
export class DatabagListComponent {

  @Input() databags: Bucket[] = [];
  @Input() selectedDatabag: Bucket = {name: ''};
  @Output() selectedDatabagChange: EventEmitter<Bucket> = new EventEmitter<Bucket>();

}
