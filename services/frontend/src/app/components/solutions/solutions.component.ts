import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogDefineInputComponent} from '../dialog-define-input/dialog-define-input.component';
import {Databag} from '../../../../build/openapi/objectstore';
import {Solution} from '../../../../build/openapi/jobmanager';

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
      data: {component: DialogDefineInputComponent, databag: this.databag}
    });
    dialogRef.afterClosed().subscribe(result => {
      if ((result as Solution).name) {
        this.solutions.push(result);
        this.solutionsChange.emit(this.solutions);
        this.router.navigate(['.'], {relativeTo: this.activatedRoute});
      }
      this.router.navigate(['.'], {relativeTo: this.activatedRoute});
    });
  }

  getSolutionsInDatabag() {
    return this.solutions.filter(solution =>
      (solution.databagName === this.databag?.databagName && solution.bucketName === this.databag?.bucketName)
    );
  }
}
