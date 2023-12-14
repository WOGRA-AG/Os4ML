import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import {
  Databag,
  Prediction,
  Solution,
} from '../../../../../build/openapi/modelmanager';
import { RuntimeIndicatorComponent } from '../runtime-indicator/runtime-indicator.component';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { DatabagContextMenuComponent } from '../../organisms/databag-context-menu/databag-context-menu.component';
import { ProcessingStatusIndicatorComponent } from '../processing-status-indicator/processing-status-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { NgIf } from '@angular/common';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { GetSolutionByIdPipe } from '../../../pipes/get-solution-by-id.pipe';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { SolutionContextMenuComponent } from '../../organisms/solution-context-menu/solution-context-menu.component';
import { PredictionContextMenuComponent } from '../../organisms/prediction-context-menu/prediction-context-menu.component';
import { CdkTableDataSourceInput } from '@angular/cdk/table';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
    RuntimeIndicatorComponent,
    LocalizedDatePipe,
    DatabagContextMenuComponent,
    ProcessingStatusIndicatorComponent,
    ShortStatusPipe,
    NgIf,
    GetDatabagByIdPipe,
    GetSolutionByIdPipe,
    StarRatingComponent,
    SolutionContextMenuComponent,
    PredictionContextMenuComponent,
  ],
})
export class DatatableComponent {
  @Input() public isDatabagTable = false;
  @Input() public isSolutionsTable = false;
  @Input() public isPredictionsTable = false;
  @Input() public displayedColumns: string[] = [];
  @Input() public headerNames: string[] = [];
  @Input() public datasource: CdkTableDataSourceInput<
    Solution | Databag | Prediction
  > = [];
  @Input() public solutions: Solution[] = [];
  @Input() public databags: Databag[] = [];
  @Input() public predictions: Prediction[] = [];

  @Output() public createSolutionButton = new EventEmitter<string>();
  @Output() public createPredictionButton = new EventEmitter<string>();
  @Output() public downloadPredictionButton = new EventEmitter<string>();
  @Output() public deletePredictionButton = new EventEmitter<string>();
}
