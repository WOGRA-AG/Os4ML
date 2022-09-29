import {Component, OnDestroy} from '@angular/core';
import {
  Databag,
} from '../../../../build/openapi/objectstore';
import {interval, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../components/dialog-dynamic/dialog-dynamic.component';
import {
  CreateDatabagComponent
} from '../../components/shared/organisms/create-databag/create-databag.component';
import {Solution} from '../../../../build/openapi/jobmanager';
import {
  CreateSolutionComponent
} from '../../components/shared/organisms/create-solution/create-solution.component';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.intervalSub = interval(10000).subscribe(x => {
      router.navigate(['.'], {relativeTo: activatedRoute});
    });
    activatedRoute.data.subscribe(data => {
      this.databags = data['databags'];
      this.solutions = data['solutions'];
    });
  }

  addDatabag() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateDatabagComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.activatedRoute});
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
  }
}
