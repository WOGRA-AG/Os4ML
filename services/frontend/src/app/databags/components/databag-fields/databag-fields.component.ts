import { Component, Input } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MlTypes } from '../../../core/models/ml-types';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-databag-fields',
  templateUrl: './databag-fields.component.html',
  standalone: true,
  imports: [
    NgFor,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgClass,
    MatOptionModule,
  ],
})
export class DatabagFieldsComponent {
  @Input() public databag: Databag = {};
  public mlTypesArray = Object.keys(MlTypes);
}
