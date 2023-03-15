import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Prediction, Solution } from 'build/openapi/modelmanager';
import { Observable, Subject, switchMap, takeUntil, map, of } from 'rxjs';
import { PredictionService } from 'src/app/predictions/services/prediction.service';
import { Breadcrumb } from 'src/app/shared/components/molecules/breadcrumbs/breadcrumbs.component';
import { filterNotDefined } from 'src/app/shared/lib/rxjs/filter-not-defined';
import { SolutionService } from 'src/app/solutions/services/solution.service';
import { CreatePredictionStepperComponent } from '../../dialogs/create-prediction-stepper/create-prediction-stepper.component';

@Component({
  selector: 'app-predictions-page',
  templateUrl: './predictions-page.component.html',
  styleUrls: ['./predictions-page.component.scss'],
})
export class PredictionsPageComponent implements OnInit, OnDestroy {
  predictions$: Observable<Prediction[]> = of([]);
  breadcrumbs: Breadcrumb[] = [];
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
    this.dialog.open(CreatePredictionStepperComponent, {
      data: {
        solution: this.solution,
      },
    });
  }
}
