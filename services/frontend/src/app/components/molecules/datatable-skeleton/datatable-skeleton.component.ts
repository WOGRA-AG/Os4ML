import { Component, Input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTableModule } from '@angular/material/table';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DatabagContextMenuComponent } from '../../organisms/databag-context-menu/databag-context-menu.component';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProcessingStatusIndicatorComponent } from '../processing-status-indicator/processing-status-indicator.component';
import { RuntimeIndicatorComponent } from '../runtime-indicator/runtime-indicator.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';

@Component({
  selector: 'app-datatable-skeleton',
  templateUrl: './datatable-skeleton.component.html',
  styleUrls: ['./datatable-skeleton.component.scss'],
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    MatTableModule,
    NgIf,
    NgForOf,
    TranslateModule,
    DatabagContextMenuComponent,
    LocalizedDatePipe,
    MatProgressBarModule,
    ProcessingStatusIndicatorComponent,
    RuntimeIndicatorComponent,
    ShortStatusPipe,
  ],
})
export class DatatableSkeletonComponent {
  @Input() public isDatabagTable = false;
  @Input() public isSolutionsTable = false;
  @Input() public isPredictionsTable = false;
  public datasource = Array(5)
    .fill({})
    .map(() => ({ value: '' }));
  public headerNames: string[] = [];
  public theme = {
    background: 'var(--md-sys-color-surface-container)',
    height: '26px',
  };
  getDisplayedColumns(): string[] {
    if (this.isDatabagTable) {
      this.headerNames = [
        'organisms.databag_data_table.column_header.databag_name',
        'organisms.databag_data_table.column_header.features',
        'organisms.databag_data_table.column_header.samples',
        'organisms.solution_data_table.column_header.runtime',
        'organisms.databag_data_table.column_header.creation',
        'organisms.databag_data_table.column_header.status',
        'organisms.databag_data_table.column_header.actions',
      ];
      return [
        'databagName',
        'features',
        'samples',
        'creationTime',
        'creation',
        'status',
        'actions',
      ];
    }
    if (this.isSolutionsTable) {
      this.headerNames = [
        'organisms.solution_data_table.column_header.solution_name',
        'organisms.solution_data_table.column_header.databag_name',
        'organisms.solution_data_table.column_header.quality',
        'organisms.solution_data_table.column_header.runtime',
        'organisms.solution_data_table.column_header.creation',
        'organisms.solution_data_table.column_header.status',
        'organisms.solution_data_table.column_header.actions',
      ];
      return [
        'solutionName',
        'databagName',
        'metrics',
        'creationTime',
        'creation',
        'status',
        'actions',
      ];
    }
    if (this.isPredictionsTable) {
      this.headerNames = [
        'organisms.prediction_data_table.column_header.prediction_name',
        'organisms.prediction_data_table.column_header.solution_name',
        'organisms.prediction_data_table.column_header.databag_name',
        'organisms.prediction_data_table.column_header.runtime',
        'organisms.prediction_data_table.column_header.creation',
        'organisms.prediction_data_table.column_header.status',
        'organisms.prediction_data_table.column_header.actions',
      ];
      return [
        'predictionName',
        'solutionName',
        'databagName',
        'runtime',
        'creation',
        'status',
        'actions',
      ];
    }
    return [];
  }
}
