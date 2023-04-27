import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Prediction, Solution } from 'build/openapi/modelmanager';
import { Observable, Subject, switchMap, takeUntil, map, of } from 'rxjs';
import { Breadcrumb } from 'src/app/design/components/molecules/breadcrumbs/breadcrumbs.component';
import { PredictionService } from 'src/app/predictions/services/prediction.service';
import { filterNotDefined } from 'src/app/shared/lib/rxjs/filter-not-defined';
import { SolutionService } from 'src/app/solutions/services/solution.service';
import { TranslateModule } from '@ngx-translate/core';
import { NoPredictionPlaceholderComponent } from '../../../predictions/components/no-prediction-placeholder/no-prediction-placeholder.component';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { NgIf, AsyncPipe, NgForOf } from '@angular/common';
import { BreadcrumbsComponent } from '../../../design/components/molecules/breadcrumbs/breadcrumbs.component';
import { CreatePredictionComponent } from '../../dialogs/create-prediction/create-prediction.component';
import { DataInsightCardComponent } from '../../../shared/components/organisms/data-insight-card/data-insight-card.component';
import { DataInsightItemComponent } from '../../../shared/components/molecules/data-insight-item/data-insight-item.component';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { RuntimeIndicatorComponent } from '../../../shared/components/molecules/runtime-indicator/runtime-indicator.component';
import { ProcessingStatusIndicatorComponent } from '../../../shared/components/molecules/processing-status-indicator/processing-status-indicator.component';
import { MaterialModule } from '../../../material/material.module';
import { PipelineStatus } from '../../../core/models/pipeline-status';
import { ShortStatusPipe } from '../../../shared/pipes/short-status.pipe';

@Component({
  selector: 'app-predictions-page',
  templateUrl: './predictions-page.component.html',
  styleUrls: ['./predictions-page.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    NgIf,
    ButtonComponent,
    NoPredictionPlaceholderComponent,
    AsyncPipe,
    TranslateModule,
    DataInsightCardComponent,
    NgForOf,
    DataInsightItemComponent,
    LocalizedDatePipe,
    RuntimeIndicatorComponent,
    ProcessingStatusIndicatorComponent,
    MaterialModule,
    ShortStatusPipe,
  ],
})
export class PredictionsPageComponent implements OnInit, OnDestroy {
  public predictions$: Observable<Prediction[]> = of([]);
  public pipelineStatus = PipelineStatus;
  public breadcrumbs: Breadcrumb[] = [];
  private solution: Solution = {};
  private readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private predictionService: PredictionService,
    private solutionService: SolutionService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this._destroy$),
        map(params => params.get('solutionId')),
        filterNotDefined(),
        switchMap(solutionId =>
          this.solutionService.getSolutionById(solutionId)
        )
      )
      .subscribe(solution => {
        this.solution = solution;
        this.predictions$ =
          this.predictionService.getPredictionsBySolutionIdSortByCreationTime(
            solution.id
          );
        this.breadcrumbs = [
          { label: 'Solutions', link: '/solutions' },
          { label: this.solution.name! },
        ];
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next(undefined);
    this._destroy$.complete();
  }

  createPrediction(): void {
    this.dialog.open(CreatePredictionComponent, {
      data: {
        solution: this.solution,
      },
    });
  }
}
