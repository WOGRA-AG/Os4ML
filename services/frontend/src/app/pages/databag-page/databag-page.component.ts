import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Databag, Solution} from '../../../../build/openapi/objectstore';
import {MatDialog} from '@angular/material/dialog';
import {DialogAddDatabagComponent} from '../../components/dialog-add-databag/dialog-add-databag.component';
import {DialogDynamicComponent} from '../../components/dialog-dynamic/dialog-dynamic.component';

@Component({
  selector: 'app-databag-page',
  templateUrl: './databag-page.component.html',
  styleUrls: ['./databag-page.component.scss']
})
export class DatabagPageComponent {
  databags: Databag[] = [];
  solutions: Solution[] = [];
  selectedDatabag: Databag = {};

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    this.activatedRoute.data.subscribe(data => {
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
}
