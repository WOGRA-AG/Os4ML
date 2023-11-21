import { Component } from '@angular/core';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgClass, NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MlTypes } from '../../../models/ml-types';

@Component({
  selector: 'app-databag-detail-field-settings',
  templateUrl: './databag-detail-field-settings.component.html',
  styleUrls: ['./databag-detail-field-settings.component.scss'],
  standalone: true,
  imports: [
    ProcessingStatusIndicatorComponent,
    ShortStatusPipe,
    TranslateModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
  ],
})
export class DatabagDetailFieldSettingsComponent {
  public mlTypesArray = Object.keys(MlTypes);
  public dataBag: Databag = {
    id: '0876bee5-fa1d-4aa5-ae5b-62bbbee3aae8',
    name: 'e2e solution test databag',
    status: 'message.pipeline.done.databag_done',
    runId: '8bfc8dc1-72ca-4551-b7c2-9a9ece4b0268',
    creationTime: '2023-11-13T17:19:10Z',
    completionTime: '2023-11-13T17:19:50Z',
    databagType: 'local_file',
    numberRows: 891,
    numberColumns: 11,
    columns: [
      {
        name: 'survived',
        type: 'category',
        numEntries: 891,
      },
      {
        name: 'pclass',
        type: 'category',
        numEntries: 891,
      },
      {
        name: 'name',
        type: 'text',
        numEntries: 891,
      },
      {
        name: 'sex',
        type: 'category',
        numEntries: 891,
      },
      {
        name: 'age',
        type: 'numerical',
        numEntries: 891,
      },
      {
        name: 'sibsp',
        type: 'category',
        numEntries: 891,
      },
      {
        name: 'parch',
        type: 'category',
        numEntries: 891,
      },
      {
        name: 'ticket',
        type: 'text',
        numEntries: 891,
      },
      {
        name: 'fare',
        type: 'numerical',
        numEntries: 891,
      },
      {
        name: 'cabin',
        type: 'text',
        numEntries: 891,
      },
      {
        name: 'embarked',
        type: 'category',
        numEntries: 891,
      },
    ],
    datasetFileName: 'titanic.xls',
    datasetUrl: null,
  };
}
