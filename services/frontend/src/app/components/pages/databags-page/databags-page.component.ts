import { Component } from '@angular/core';
import { DatabagService } from '../../../services/databag.service';
import { Observable } from 'rxjs';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { HasElementsPipe } from '../../../pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf, AsyncPipe, NgForOf } from '@angular/common';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { DatabagDataTableComponent } from '../../organisms/databag-data-table/databag-data-table.component';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { DatabagsCreateDialogComponent } from '../databags-create-dialog/databags-create-dialog.component';
import { MlEntityStatusPlaceholderComponent } from '../../organisms/ml-entity-status-placeholder/ml-entity-status-placeholder.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatatableSkeletonComponent } from '../../molecules/datatable-skeleton/datatable-skeleton.component';
import { DatatableComponent } from '../../molecules/datatable/datatable.component';
import { PredictionsDataTableComponent } from '../../organisms/predictions-data-table/predictions-data-table.component';

@Component({
  selector: 'app-databags-page',
  templateUrl: './databags-page.component.html',
  styleUrls: ['./databags-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
    HasElementsPipe,
    NgForOf,
    LocalizedDatePipe,
    Os4mlDefaultTemplateComponent,
    NewButtonComponent,
    DatabagDataTableComponent,
    DatabagCreateButtonComponent,
    MlEntityStatusPlaceholderComponent,
    MatProgressBarModule,
    DatatableSkeletonComponent,
    DatatableComponent,
    PredictionsDataTableComponent,
  ],
})
export class DatabagsPageComponent {
  public readonly databags$: Observable<Databag[]>;
  public isLoading$: Observable<boolean>;
  public headerNames = [
    'organisms.databag_data_table.column_header.databag_name',
    'organisms.databag_data_table.column_header.features',
    'organisms.databag_data_table.column_header.samples',
    'organisms.solution_data_table.column_header.runtime',
    'organisms.databag_data_table.column_header.creation',
    'organisms.databag_data_table.column_header.status',
    'organisms.databag_data_table.column_header.actions',
  ];
  public displayedColumns = [
    'databagName',
    'features',
    'samples',
    'creationTime',
    'creation',
    'status',
    'actions',
  ];

  constructor(
    private databagService: DatabagService,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.isLoading$ = this.databagService.isLoading$;
  }

  openCreateSolutionStepperDialog(databagId: string): void {
    this.dialog.open(SolutionCreateDialogComponent, {
      data: { databagId },
    });
  }
  addDatabag(): void {
    this.dialog.open(DatabagsCreateDialogComponent, {
      ariaLabelledBy: 'dialog-title',
      disableClose: true,
    });
  }
}
