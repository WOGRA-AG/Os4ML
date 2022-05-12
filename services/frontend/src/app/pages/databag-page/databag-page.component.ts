import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Databag, Solution, SolutionService} from '../../../../build/openapi/objectstore';
import {MatDialog} from '@angular/material/dialog';
import {DialogAddDatabagComponent} from '../../components/dialog-add-databag/dialog-add-databag.component';
import {DialogDynamicComponent} from '../../components/dialog-dynamic/dialog-dynamic.component';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-databag-page',
  templateUrl: './databag-page.component.html',
  styleUrls: ['./databag-page.component.scss']
})
export class DatabagPageComponent implements OnDestroy {
  databags: Databag[] = [];
  solutions: Solution[] = [];
  selectedDatabag: Databag = {};
  intervalSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private solutionService: SolutionService, public dialog: MatDialog) {
    this.intervalSub = interval(10000).subscribe(x => {
      router.navigate(['.'], {relativeTo: activatedRoute});
    });
    activatedRoute.data.subscribe(data => {
      this.databags = data['databags'];
      this.solutions = data['solutions'];
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: DialogAddDatabagComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.activatedRoute});
    });
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
  }
}
