import { Component, Input } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MlTypes } from '../../../models/ml-types';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/components/atoms/material/material.module';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-databag-fields',
  templateUrl: './databag-fields.component.html',
  standalone: true,
  imports: [NgFor, MaterialModule, FormsModule, NgClass],
})
export class DatabagFieldsComponent {
  @Input() public databag: Databag = {};
  public mlTypesArray = Object.keys(MlTypes);
}
