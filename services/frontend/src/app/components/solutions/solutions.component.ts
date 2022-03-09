import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogDefineInputComponent} from '../dialog-define-input/dialog-define-input.component';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss']
})
export class SolutionsComponent {
  @Input() solutions: Array<any> = [];
  @Output() solutionsChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dialog: MatDialog) {
  }

  openSolutionsDialog() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: DialogDefineInputComponent}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['.'], {relativeTo: this.activatedRoute});
    });
  }
}
