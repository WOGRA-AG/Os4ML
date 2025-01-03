import { Component, DestroyRef, inject } from '@angular/core';
import { first, map, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Databag, Solution } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../../services/databag.service';
import { SolutionService } from '../../../services/solution.service';
import { HasElementsPipe } from '../../../pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { SolutionDataTableComponent } from '../../organisms/solution-data-table/solution-data-table.component';
import { SolutionCreateButtonComponent } from '../../organisms/solution-create-button/solution-create-button.component';
import { DatabagFilterComponent } from '../../organisms/databag-filter/databag-filter.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { PredictionsCreateDialogComponent } from '../predictions-create-dialog/predictions-create-dialog.component';
import { DatabagsCreateDialogComponent } from '../databags-create-dialog/databags-create-dialog.component';
import { MlEntityStatusPlaceholderComponent } from '../../organisms/ml-entity-status-placeholder/ml-entity-status-placeholder.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { PopupConfirmComponent } from '../../organisms/popup-confirm/popup-confirm.component';

@Component({
  selector: 'app-solutions-page',
  templateUrl: './solutions-page.component.html',
  styleUrls: ['./solutions-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
    Os4mlDefaultTemplateComponent,
    SolutionDataTableComponent,
    HasElementsPipe,
    NgForOf,
    SolutionCreateButtonComponent,
    DatabagFilterComponent,
    NewButtonComponent,
    DatabagCreateButtonComponent,
    MlEntityStatusPlaceholderComponent,
  ],
})
export class SolutionsPageComponent {
  public databags$: Observable<Databag[]>;
  public solutions$: Observable<Solution[]>;
  private destroyRef = inject(DestroyRef);
  constructor(
    private databagService: DatabagService,
    private solutionService: SolutionService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.solutions$ = this.databagId$.pipe(
      switchMap(databagId =>
        this.solutionService.getFilteredSolutions(databagId)
      )
    );
  }
  public get databagId$(): Observable<string | null> {
    return this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('selectedDatabag'))
    );
  }
  onDatabagChanged(databagId: string | null): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { selectedDatabag: databagId },
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
  openCreatePredictionDialog(solutionId: string): void {
    this.dialog.open(PredictionsCreateDialogComponent, {
      ariaLabelledBy: 'dialog-title',
      data: { solutionId },
    });
  }
  openDeleteSolutionDialog(solutionId: string): void {
    const deleteSolution = this.solutionService.deleteSolutionById(solutionId);
    this.dialog.open(PopupConfirmComponent, {
      ariaLabelledBy: 'dialog-title',
      data: {
        titleKey: 'organisms.popup_confirm.delete_solution.title',
        messageKey: 'organisms.popup_confirm.delete_solution.message',
        onConfirm: deleteSolution,
      },
    });
  }
}
