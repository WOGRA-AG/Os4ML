import {Component, Input, OnDestroy} from '@angular/core';
import {Databag} from '../../../../../../build/openapi/objectstore';

@Component({
  selector: 'app-shared-databag-list-item',
  templateUrl: './databag-list-item.component.html',
  styleUrls: ['./databag-list-item.component.scss']
})
export class DatabagListItemComponent {
  @Input() databag: Databag = {};
  constructor() {
  }
}