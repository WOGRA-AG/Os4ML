import {Component} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../components/dialog-dynamic/dialog-dynamic.component';
import {
  CreateDatabagComponent
} from '../../components/shared/organisms/create-databag/create-databag.component';
import {
  CreateSolutionComponent
} from '../../components/shared/organisms/create-solution/create-solution.component';
import {UserFacade} from '../../user/services/user-facade.service';
import {Databag, ModelmanagerService, Solution} from '../../../../build/openapi/modelmanager';
import {DatabagService} from '../../databags/services/databag.service';
import {SolutionService} from '../../solutions/services/solution.service';

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
    public userFacade: UserFacade,
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
      data: {component: CreateDatabagComponent}
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
