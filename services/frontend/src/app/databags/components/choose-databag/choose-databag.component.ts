import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Databag} from '../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {CreateDatabagStepperComponent} from '../create-databag-stepper/create-databag-stepper.component';

@Component({
  selector: 'app-choose-databag',
  templateUrl: './choose-databag.component.html',
  styleUrls: ['./choose-databag.component.scss']
})
export class ChooseDatabagComponent implements OnInit{

  @Input() databags: Databag[] = [];
  @Output() selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();
  selectedDatabag: Databag = {};

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.databags.length > 0) {
      this.changeSelectedDatabag(this.databags[0]);
    }
  }

  changeSelectedDatabag(databag: Databag) {
    this.selectedDatabag = databag;
    this.selectedDatabagChange.emit(this.selectedDatabag);
  }

  isSameDatabag(databag1: Databag, databag2: Databag) {
    return databag1.databagId === databag2.databagId;
  }

  openAddDialog() {
    this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateDatabagStepperComponent}
    });
  }
}
