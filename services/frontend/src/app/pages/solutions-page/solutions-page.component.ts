import { Component, OnDestroy } from '@angular/core';
import {
  first,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Databag, Solution } from '../../../../build/openapi/modelmanager';
import { DatabagService } from '../../databags/services/databag.service';
import { SolutionService } from '../../solutions/services/solution.service';
import { HasElementsPipe } from '../../shared/pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NoDatabagsPlaceholderComponent } from '../../databags/components/no-databags-placeholder/no-databags-placeholder.component';
import { NoSolutionsPlaceholderComponent } from '../../solutions/components/no-solutions-placeholder/no-solutions-placeholder.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Os4mlDefaultTemplateComponent } from '../../shared/components/templates/os4ml-default-template/os4ml-default-template.component';
import { SolutionSettingComponent } from '../../solutions/components/solution-setting/solution-setting.component';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { SolutionDataTableComponent } from '../../shared/components/organisms/solution-data-table/solution-data-table.component';
import { SolutionCreateButtonComponent } from '../../shared/components/organisms/solution-create-button/solution-create-button.component';
import { DatabagFilterComponent } from '../../shared/components/organisms/databag-filter/databag-filter.component';
import { NewButtonComponent } from '../../shared/components/molecules/new-button/new-button.component';
import { DatabagCreateButtonComponent } from '../../shared/components/organisms/databag-create-button/databag-create-button.component';
import { PredictionsCreateDialogComponent } from '../predictions-create-dialog/predictions-create-dialog.component';
import { DatabagsCreateDialogComponent } from '../databags-create-dialog/databags-create-dialog.component';
import { MlEntityStatusPlaceholderComponent } from '../../shared/components/organisms/ml-entity-status-placeholder/ml-entity-status-placeholder.component';

@Component({
  selector: 'app-solutions-page',
  templateUrl: './solutions-page.component.html',
  styleUrls: ['./solutions-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NoSolutionsPlaceholderComponent,
    NoDatabagsPlaceholderComponent,
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
export class SolutionsPageComponent implements OnDestroy {
  public databags$: Observable<Databag[]>;
  public solutions$: Observable<Solution[]>;
  public selectedDatabag$: Observable<Databag | null>;
  private destroy$ = new Subject<void>();
  constructor(
    private databagService: DatabagService,
    private solutionService: SolutionService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.selectedDatabag$ = this.databagId$.pipe(
      switchMap(id => {
        if (id) {
          return this.databagService.getDatabagById(id).pipe(first());
        } else {
          return of(null);
        }
      })
    );

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
  openSolutionSettingDialog(solution: Solution): void {
    this.dialog.open(SolutionSettingComponent, {
      data: { solution },
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      },
    });
  }
  openCreatePredictionDialog(solutionId: string): void {
    this.dialog.open(PredictionsCreateDialogComponent, {
      data: { solutionId },
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
