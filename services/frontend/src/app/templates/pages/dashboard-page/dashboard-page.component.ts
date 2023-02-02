import { Component } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Databag, Solution } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../../databags/services/databag.service';
import { SolutionService } from '../../../solutions/services/solution.service';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { CreateDatabagStepperComponent } from '../../dialogs/create-databag-stepper/create-databag-stepper.component';
import { CreateSolutionStepperComponent } from '../../dialogs/create-solution-stepper/create-solution-stepper.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {
  databags$: Observable<Databag[]>;
  selectedDatabagId$: BehaviorSubject<string> = new BehaviorSubject('');
  solutionsInDatabag$: Observable<Solution[]>;

  constructor(
    private databagService: DatabagService,
    private solutionService: SolutionService,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.solutionsInDatabag$ = this.selectedDatabagId$.pipe(
      switchMap(databagId =>
        this.solutionService.getSolutionsByDatabagIdSortByCreationTime(
          databagId
        )
      )
    );
  }

  addDatabag(): void {
    this.dialog.open(DialogDynamicComponent, {
      data: { component: CreateDatabagStepperComponent },
    });
  }

  async addSolution(): Promise<void> {
    const databag = await firstValueFrom(
      this.databagService.getDatabagById(this.selectedDatabagId$.getValue())
    );
    this.dialog.open(DialogDynamicComponent, {
      data: { component: CreateSolutionStepperComponent, databag },
    });
  }

  selectedDatabagChanged(databagId: string): void {
    this.selectedDatabagId$.next(databagId);
  }
}
