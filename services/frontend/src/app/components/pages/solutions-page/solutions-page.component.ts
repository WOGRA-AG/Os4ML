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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatatableSkeletonComponent } from '../../molecules/datatable-skeleton/datatable-skeleton.component';
import { DatabagDataTableComponent } from '../../organisms/databag-data-table/databag-data-table.component';

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
    MatProgressBarModule,
    DatatableSkeletonComponent,
    DatabagDataTableComponent,
  ],
})
export class SolutionsPageComponent {
  public databags$: Observable<Databag[]>;
  public solutions$: Observable<Solution[]>;
  public isLoading$: Observable<boolean>;
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
    this.isLoading$ = this.solutionService.isLoading$;
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
}
