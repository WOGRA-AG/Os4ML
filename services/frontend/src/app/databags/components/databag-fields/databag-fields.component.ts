import { Component, Input } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MlTypes } from '../../../core/models/ml-types';

@Component({
  selector: 'app-databag-fields',
  templateUrl: './databag-fields.component.html',
})
export class DatabagFieldsComponent {
  @Input() public databag: Databag = {};
  public mlTypesArray = Object.keys(MlTypes);
}
