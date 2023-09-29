import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Databag, Solution } from '../../../../../build/openapi/modelmanager';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { StarRatingComponent } from '../../molecules/star-rating/star-rating.component';
import { RuntimeIndicatorComponent } from '../../molecules/runtime-indicator/runtime-indicator.component';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { ProcessingStatusIndicatorComponent } from '../../molecules/processing-status-indicator/processing-status-indicator.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { IsSolutionDonePipe } from '../../../pipes/is-solution-done.pipe';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-solution-data-table',
  templateUrl: './solution-data-table.component.html',
  styleUrls: ['./solution-data-table.component.scss'],
  imports: [
    MatTableModule,
    TranslateModule,
    GetDatabagByIdPipe,
    StarRatingComponent,
    RuntimeIndicatorComponent,
    LocalizedDatePipe,
    ShortStatusPipe,
    ProcessingStatusIndicatorComponent,
    IconButtonComponent,
    IsSolutionDonePipe,
    RouterLink,
    MatTooltipModule,
    NgIf,
  ],
  standalone: true,
})
export class SolutionDataTableComponent {
  @Input() public solutions: Solution[] = [];
  @Input() public databags: Databag[] = [];
  @Output() public createPredictionButton = new EventEmitter<string>();

  public displayedColumns: string[] = [
    'solutionName',
    'databagName',
    'metrics',
    'creationTime',
    'creation',
    'status',
    'actions',
  ];
}
