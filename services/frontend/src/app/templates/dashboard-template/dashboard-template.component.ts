import {Component} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Databag, ModelmanagerService, Solution} from '../../../../build/openapi/modelmanager';
import {DatabagService} from '../../databags/services/databag.service';
import {SolutionService} from '../../solutions/services/solution.service';
import {DialogDynamicComponent} from '../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {CreateSolutionComponent} from '../../solutions/components/create-solution/create-solution.component';
import {
  CreateDatabagStepperComponent
} from '../../databags/components/create-databag-stepper/create-databag-stepper.component';

@Component({
  selector: 'app-dashboard-template',
  templateUrl: './dashboard-template.component.html',
  styleUrls: ['./dashboard-template.component.scss']
})
export class DashboardTemplateComponent {
  databags$: Observable<Databag[]>;
  solutions$: Observable<Solution[]>;
  selectedDatabag$: BehaviorSubject<Databag> = new BehaviorSubject({});
  solutionsInDatabag$: Observable<Solution[]>;

  constructor(
    private databagService: DatabagService,
    private solutionService: SolutionService,
    public dialog: MatDialog,
    public modelManager: ModelmanagerService,
  ) {
    this.databags$ = this.databagService.databags$;
    this.solutions$ = this.solutionService.solutions$;
    this.solutionsInDatabag$ = combineLatest([this.selectedDatabag$, this.solutions$]).pipe(
      map(([selectedDatabag, solutions]) => solutions.filter(solution => solution.databagId === selectedDatabag.databagId))
    );
  }

  addDatabag() {
    this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateDatabagStepperComponent}
    });
  }

  addSolution() {
    this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateSolutionComponent, databag: this.selectedDatabag$.getValue()}
    });
  }

  selectedDatabagChanged(databag: Databag): void {
    this.selectedDatabag$.next(databag);
  }
}
