import {Component, Input} from '@angular/core';
import {Databag} from '../../../../../build/openapi/modelmanager';
import {MlTypes} from '../../../models/ml-types';

@Component({
  selector: 'app-databag-fields',
  templateUrl: './databag-fields.component.html',
})
export class DatabagFieldsComponent {
  @Input() databag: Databag = {};
  mlTypesArray = Object.keys(MlTypes);
}
