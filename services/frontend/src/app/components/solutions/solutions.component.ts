import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Databag} from '../../../../build/openapi/objectstore';
import {Solution} from '../../../../build/openapi/jobmanager';
import {PopupOutputComponent} from '../shared/organisms/popup-output/popup-output.component';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss']
})
export class SolutionsComponent {
  @Input() solutions: Solution[] = [];
  @Input() databag: Databag | undefined;
  @Output() solutionsChange: EventEmitter<Solution[]> = new EventEmitter<Solution[]>();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dialog: MatDialog) {
  }

  openCreateSolutionDialog() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: PopupOutputComponent, databag: this.databag}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && (result as Solution).name) {
        this.solutions.push(result);
        this.solutionsChange.emit(this.solutions);
      }
    });
  }

  getSolutionsInDatabag() {
    return this.solutions.filter(
      solution => solution.databagId === this.databag?.databagId
    );
  }
}
