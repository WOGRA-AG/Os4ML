import { Component, Input } from '@angular/core';
import {
  Databag,
  Prediction,
  Solution,
} from '../../../../../../build/openapi/modelmanager';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { GetSolutionByIdPipe } from '../../../pipes/get-solution-by-id.pipe';
import { JsonPipe } from '@angular/common';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { RuntimeIndicatorComponent } from '../../molecules/runtime-indicator/runtime-indicator.component';

@Component({
  selector: 'app-predictions-data-table',
  templateUrl: './predictions-data-table.component.html',
  styleUrls: ['./predictions-data-table.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    TranslateModule,
    GetSolutionByIdPipe,
    JsonPipe,
    GetDatabagByIdPipe,
    ProcessingStatusIndicatorComponent,
    ShortStatusPipe,
    ButtonComponent,
    IconButtonComponent,
    LocalizedDatePipe,
    RuntimeIndicatorComponent,
  ],
})
export class PredictionsDataTableComponent {
  @Input() public solutions: Solution[] = [];
  @Input() public databags: Databag[] = [];
  @Input() public predictions: Prediction[] = [];

  public displayedColumns: string[] = [
    'predictionName',
    'solutionName',
    'databagName',
    'runtime',
    'creation',
    'status',
    'actions',
  ];
}
