import { Component, Input } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-databag-list-item',
  templateUrl: './databag-list-item.component.html',
  styleUrls: ['./databag-list-item.component.scss'],
})
export class DatabagListItemComponent {
  @Input() databag: Databag = {};

  constructor() {}
}
