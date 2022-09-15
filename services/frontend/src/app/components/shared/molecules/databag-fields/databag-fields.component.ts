import {Component, Input} from '@angular/core';
import {MlTypes} from '../../../../models/ml-types';
import {Databag} from '../../../../../../build/openapi/objectstore';

@Component({
  selector: 'app-shared-databag-fields',
  templateUrl: './databag-fields.component.html',
  styleUrls: ['./databag-fields.component.scss']
})

export class DatabagFieldsComponent {
  @Input() databag: Databag = {};
  mlTypesArray = Object.keys(MlTypes);
}
