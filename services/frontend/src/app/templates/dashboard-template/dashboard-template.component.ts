import {Component} from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Databag, Solution} from '../../../../build/openapi/modelmanager';
import {DatabagService} from '../../databags/services/databag.service';
import {SolutionService} from '../../solutions/services/solution.service';
import {DialogDynamicComponent} from '../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {
  CreateDatabagStepperComponent
} from '../../databags/components/create-databag-stepper/create-databag-stepper.component';
import { CreateSolutionStepperComponent } from 'src/app/solutions/components/create-solution-stepper/create-solution-stepper.component';

@Component({
  selector: 'app-dashboard-template',
  templateUrl: './dashboard-template.component.html',
  styleUrls: ['./dashboard-template.component.scss']
})
export class DashboardTemplateComponent {
  databags$: Observable<Databag[]>;
  selectedDatabag$: BehaviorSubject<Databag> = new BehaviorSubject({});
  solutionsInDatabag$: Observable<Solution[]>;

  constructor(
    private databagService: DatabagService,
    private solutionService: SolutionService,
    private dialog: MatDialog,
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.solutionsInDatabag$ = this.selectedDatabag$.pipe(
      switchMap(databag => this.solutionService.getSolutionsByDatabagIdSortByCreationTime(databag.databagId))
    );
  }

  addDatabag() {
    this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateDatabagStepperComponent}
    });
  }

  addSolution() {
    this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateSolutionStepperComponent, databag: this.selectedDatabag$.getValue()}
    });
  }

  selectedDatabagChanged(databag: Databag): void {
    this.selectedDatabag$.next(databag);
  }
}
