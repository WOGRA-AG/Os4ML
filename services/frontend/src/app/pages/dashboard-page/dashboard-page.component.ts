import {Component, OnDestroy} from '@angular/core';
import {
  Databag, ObjectstoreService,
} from '../../../../build/openapi/objectstore';
import {interval, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../components/dialog-dynamic/dialog-dynamic.component';
import {
  CreateDatabagComponent
} from '../../components/shared/organisms/create-databag/create-databag.component';
import {JobmanagerService, Solution, User} from '../../../../build/openapi/jobmanager';
import {
  CreateSolutionComponent
} from '../../components/shared/organisms/create-solution/create-solution.component';
import {UserFacade} from '../../user/services/user-facade.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnDestroy {
  databags: Databag[] = [];
  solutions: Solution[] = [];
  selectedDatabag: Databag = {};
  intervalSub: Subscription;
  userSub: Subscription;
  user: User = {id: '', email: '', rawToken: ''};

  constructor(
    public dialog: MatDialog,
    public userFacade: UserFacade,
    public objectstore: ObjectstoreService,
    public jobmanager: JobmanagerService,
  ) {
    this.intervalSub = interval(10000).subscribe(x => {
      this.userFacade.refresh();
    });
    this.userSub = this.userFacade.currentUser$.pipe().subscribe(currentUser => {
        this.user = currentUser;
        this.objectstore.getAllDatabags(currentUser.rawToken).pipe().subscribe(
          databags => this.databags = databags
        );
        this.jobmanager.getAllSolutions(currentUser.rawToken).pipe().subscribe(
          solutions => this.solutions = solutions
        );
      }
    );
  }

  addDatabag() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateDatabagComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userFacade.refresh();
    });
  }

  addSolution() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateSolutionComponent, databag: this.selectedDatabag}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && (result as Solution).name) {
        this.solutions.push(result);
      }
    });
  }

  getSolutionsInDatabag() {
    return this.solutions.filter(
      solution => solution.databagId === this.selectedDatabag.databagId
    );
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
