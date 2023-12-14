import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Databag, Prediction, Solution } from 'build/openapi/modelmanager';
import { Observable, map, first, combineLatest, switchMap } from 'rxjs';
import { PredictionService } from 'src/app/services/prediction.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { HasElementsPipe } from '../../../pipes/has-elements.pipe';
import { DatabagService } from '../../../services/databag.service';
import { PredictionsDataTableComponent } from '../../organisms/predictions-data-table/predictions-data-table.component';
import { SolutionCreateButtonComponent } from '../../organisms/solution-create-button/solution-create-button.component';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { PredictionsCreateDialogComponent } from '../predictions-create-dialog/predictions-create-dialog.component';
import { DatabagFilterComponent } from '../../organisms/databag-filter/databag-filter.component';
import { SolutionFilterComponent } from '../../organisms/solution-filter/solution-filter.component';
import { PredictionCreateButtonComponent } from '../../organisms/prediction-create-button/prediction-create-button.component';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { PopupConfirmComponent } from '../../organisms/popup-confirm/popup-confirm.component';
import { DatabagsCreateDialogComponent } from '../databags-create-dialog/databags-create-dialog.component';
import { MlEntityStatusPlaceholderComponent } from '../../organisms/ml-entity-status-placeholder/ml-entity-status-placeholder.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatatableSkeletonComponent } from '../../molecules/datatable-skeleton/datatable-skeleton.component';
import { DatatableComponent } from '../../molecules/datatable/datatable.component';
@Component({
  selector: 'app-predictions-page',
  templateUrl: './predictions-page.component.html',
  styleUrls: ['./predictions-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
    Os4mlDefaultTemplateComponent,
    HasElementsPipe,
    PredictionsDataTableComponent,
    SolutionCreateButtonComponent,
    DatabagFilterComponent,
    SolutionFilterComponent,
    PredictionCreateButtonComponent,
    DatabagCreateButtonComponent,
    MlEntityStatusPlaceholderComponent,
    MatProgressBarModule,
    DatatableSkeletonComponent,
    DatatableComponent,
  ],
})
export class PredictionsPageComponent {
  public databags$: Observable<Databag[]>;
  public solutions$: Observable<Solution[]>;
  public predictions$: Observable<Prediction[]>;
  public isLoading$: Observable<boolean>;
  public headerNames = [
    'organisms.prediction_data_table.column_header.prediction_name',
    'organisms.prediction_data_table.column_header.solution_name',
    'organisms.prediction_data_table.column_header.databag_name',
    'organisms.prediction_data_table.column_header.runtime',
    'organisms.prediction_data_table.column_header.creation',
    'organisms.prediction_data_table.column_header.status',
    'organisms.prediction_data_table.column_header.actions',
  ];
  public displayedColumns = [
    'predictionName',
    'solutionName',
    'databagName',
    'runtime',
    'creation',
    'status',
    'actions',
  ];
  private destroyRef = inject(DestroyRef);
  constructor(
    private databagService: DatabagService,
    private solutionService: SolutionService,
    private predictionService: PredictionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.solutions$ = this.solutionService.getSolutionsByCreationTime();
    this.predictions$ = combineLatest([this.databagId$, this.solutionId$]).pipe(
      switchMap(([databagId, solutionId]) =>
        this.predictionService.getFilteredPredictions(databagId, solutionId)
      )
    );
    this.isLoading$ = this.predictionService.isLoading$;
  }
  public get databagId$(): Observable<string | null> {
    return this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('selectedDatabag'))
    );
  }
  public get solutionId$(): Observable<string | null> {
    return this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('selectedSolution'))
    );
  }
  onDatabagChanged(databagId: string | null): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { selectedDatabag: databagId },
      queryParamsHandling: 'merge',
    });
  }
  onSolutionChanged(solutionId: string | null): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { selectedSolution: solutionId },
      queryParamsHandling: 'merge',
    });
  }
  addDatabag(): void {
    this.dialog.open(DatabagsCreateDialogComponent, {
      ariaLabelledBy: 'dialog-title',
    });
  }
  addSolution(): void {
    this.databagId$
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe(databagId => {
        this.dialog.open(SolutionCreateDialogComponent, {
          data: { databagId },
          ariaLabelledBy: 'dialog-title',
        });
      });
  }
  addPrediction(): void {
    this.solutionId$
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe(solutionId => {
        this.dialog.open(PredictionsCreateDialogComponent, {
          data: { solutionId },
          ariaLabelledBy: 'dialog-title',
        });
      });
  }
  downloadPredictionResult(
    predictionId: string,
    downloadLink: HTMLAnchorElement
  ): void {
    this.predictionService
      .getPredictionResultGetUrl(predictionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(url => {
        if (url != null) {
          downloadLink.href = url;
          downloadLink.click();
        }
      });
  }
  deletePrediction(predictionId: string): void {
    const deletePrediction =
      this.predictionService.deletePredictionById(predictionId);
    this.dialog.open(PopupConfirmComponent, {
      ariaLabelledBy: 'dialog-title',
      data: {
        titleKey: 'organisms.popup_confirm.delete_prediction.title',
        messageKey: 'organisms.popup_confirm.delete_prediction.message',
        onConfirm: deletePrediction,
      },
    });
  }
}
