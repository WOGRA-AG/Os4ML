import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Databag, Prediction, Solution } from 'build/openapi/modelmanager';
import {
  Observable,
  Subject,
  takeUntil,
  map,
  first,
  combineLatest,
  switchMap,
} from 'rxjs';
import { PredictionService } from 'src/app/core/services/prediction.service';
import { SolutionService } from 'src/app/core/services/solution.service';
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
  ],
})
export class PredictionsPageComponent implements OnDestroy {
  public databags$: Observable<Databag[]>;
  public solutions$: Observable<Solution[]>;
  public predictions$: Observable<Prediction[]>;
  private destroy$ = new Subject<void>();

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
    this.dialog.open(DatabagsCreateDialogComponent);
  }

  addSolution(): void {
    this.databagId$
      .pipe(takeUntil(this.destroy$), first())
      .subscribe(databagId => {
        this.dialog.open(SolutionCreateDialogComponent, {
          data: { databagId },
        });
      });
  }

  addPrediction(): void {
    this.solutionId$
      .pipe(takeUntil(this.destroy$), first())
      .subscribe(solutionId => {
        this.dialog.open(PredictionsCreateDialogComponent, {
          data: { solutionId },
        });
      });
  }

  downloadPredictionResult(
    predictionId: string,
    downloadLink: HTMLAnchorElement
  ): void {
    this.predictionService
      .getPredictionResultGetUrl(predictionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        downloadLink.href = url;
        downloadLink.click();
      });
  }

  deletePrediction(predictionId: string): void {
    const deletePrediction =
      this.predictionService.deletePredictionById(predictionId);
    this.dialog.open(PopupConfirmComponent, {
      data: {
        titleKey: 'solution.delete.title',
        messageKey: 'solution.delete.confirmation',
        onConfirm: deletePrediction,
      },
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
