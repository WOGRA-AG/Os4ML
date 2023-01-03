import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Databag} from '../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {CreateDatabagComponent} from '../create-databag/create-databag.component';

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
    this.databags = this.sortDatabagsByCreationTimeRecentFirst(this.databags);
    if (this.databags.length > 0) {
      this.changeSelectedDatabag(this.databags[0]);
    }
  }

  sortDatabagsByCreationTimeRecentFirst(databags: Databag[]): Databag[] {
    return databags.sort(
      (objA, objB) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const date1 = new Date(objA.creationTime!);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const date2 = new Date(objB.creationTime!);
        return date2.getTime() - date1.getTime();
      },
    );
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
      data: {component: CreateDatabagComponent}
    });
  }

}
