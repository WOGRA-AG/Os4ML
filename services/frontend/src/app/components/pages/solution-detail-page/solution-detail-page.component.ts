import { Component, DestroyRef, inject } from '@angular/core';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import {
  Prediction,
  Solution,
} from '../../../../../build/openapi/modelmanager';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { SolutionDetailInputComponent } from '../../organisms/solution-detail-input/solution-detail-input.component';
import { SolutionDetailOutputComponent } from '../../organisms/solution-detail-output/solution-detail-output.component';
import { HasElementsPipe } from '../../../pipes/has-elements.pipe';
import { PredictionCreateButtonComponent } from '../../organisms/prediction-create-button/prediction-create-button.component';
import { SolutionCreateButtonComponent } from '../../organisms/solution-create-button/solution-create-button.component';
import { SolutionDetailDependenciesComponent } from '../../organisms/solution-detail-dependencies/solution-detail-dependencies.component';
import { SolutionDetailDownloadModelComponent } from '../../organisms/solution-detail-download-model/solution-detail-download-model.component';
import { SolutionDetailDeleteSolutionComponent } from '../../organisms/solution-detail-delete-solution/solution-detail-delete-solution.component';
import { MatIconModule } from '@angular/material/icon';
import { SolutionService } from '../../../services/solution.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { PredictionsCreateDialogComponent } from '../predictions-create-dialog/predictions-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupConfirmComponent } from '../../organisms/popup-confirm/popup-confirm.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { SolutionDetailPipelineStatusComponent } from '../../organisms/solution-detail-pipeline-status/solution-detail-pipeline-status.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopupInputComponent } from '../../organisms/popup-input/popup-input.component';
import { PredictionService } from '../../../services/prediction.service';

@Component({
  selector: 'app-solution-detail-page',
  templateUrl: './solution-detail-page.component.html',
  styleUrls: ['./solution-detail-page.component.scss'],
  standalone: true,
  imports: [
    DatabagCreateButtonComponent,
    Os4mlDefaultTemplateComponent,
    SolutionDetailInputComponent,
    NgIf,
    SolutionDetailOutputComponent,
    NgForOf,
    AsyncPipe,
    HasElementsPipe,
    PredictionCreateButtonComponent,
    SolutionCreateButtonComponent,
    SolutionDetailDependenciesComponent,
    SolutionDetailDownloadModelComponent,
    SolutionDetailDeleteSolutionComponent,
    MatIconModule,
    ShortStatusPipe,
    SolutionDetailPipelineStatusComponent,
    NewButtonComponent,
    TranslateModule,
  ],
})
export class SolutionDetailPageComponent {
  public solution$: Observable<Solution | null>;
  public predictions$: Observable<Prediction[]>;
  public solutionId: string;
  private reloadSubject = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private solutionService: SolutionService,
    private predictionService: PredictionService,
    private dialog: MatDialog
  ) {
    this.solutionId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.solution$ = this.reloadSubject.pipe(
      startWith(null),
      switchMap(() => this.solutionService.loadSolutionById(this.solutionId)),
      catchError(() => {
        this.router.navigate(['**']);
        return of(null);
      })
    );
    this.predictions$ = this.predictionService.getFilteredPredictions(
      null,
      this.solutionId
    );
  }
  addSolution(): void {
    this.dialog.open(SolutionCreateDialogComponent);
  }
  addPrediction(): void {
    this.dialog.open(PredictionsCreateDialogComponent, {
      data: { solutionId: this.solutionId },
    });
  }
  renameSolution(oldName: string): void {
    const renameSolutionDialogRef = this.dialog.open(PopupInputComponent, {
      data: {
        inputValue: oldName,
        titleKey: 'organisms.popup_input.rename_solution.title',
        ariaLabelKey: 'organisms.popup_input.rename_solution.aria_label',
        inputFormField: {
          label: 'organisms.popup_input.rename_solution.input_form_field.label',
          ariaLabel:
            'organisms.popup_input.rename_solution.input_form_field.aria-label',
          errorRequired:
            'organisms.popup_input.rename_solution.input_form_field.error_required',
          hint: 'organisms.popup_input.rename_solution.input_form_field.hint',
        },
        submit: {
          aria_label: 'organisms.popup_input.rename_solution.submit.aria_label',
          button_text:
            'organisms.popup_input.rename_solution.submit.button_text',
        },
      },
    });

    renameSolutionDialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          const solution = this.solutionService.getSolutionById(
            this.solutionId
          );
          if (result && solution) {
            solution.name = result;
            this.updateSolutionName(solution);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  updateSolutionName(solution: Solution): void {
    this.solutionService
      .updateSolutionById(this.solutionId, solution)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reloadSubject.next());
  }

  deleteSolution(): void {
    const deleteSolution = this.solutionService.deleteSolutionById(
      this.solutionId
    );
    const deleteDialogRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        titleKey: 'organisms.popup_confirm.delete_solution.title',
        messageKey: 'organisms.popup_confirm.delete_solution.message',
        onConfirm: deleteSolution,
      },
    });
    deleteDialogRef
      .afterClosed()
      .pipe(
        tap(confirm => {
          if (confirm) {
            this.router.navigate(['/solutions']);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  downloadModel(downloadLink: HTMLAnchorElement): void {
    this.solutionService
      .getModelGetUlr(this.solutionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(url => {
        downloadLink.href = url;
        downloadLink.click();
      });
  }
}
