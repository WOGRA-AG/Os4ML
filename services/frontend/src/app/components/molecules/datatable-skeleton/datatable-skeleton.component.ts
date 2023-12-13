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
  @Input() public displayedColumns: string[] = [];
  @Input() public headerNames: string[] = [];
  public datasource = Array(5)
    .fill({})
    .map(() => ({ value: '' }));
  public theme = {
    background: 'var(--md-sys-color-surface-container)',
    height: '26px',
  };
}
