import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  DialogDynamicComponent
} from '../../../dialog-dynamic/dialog-dynamic.component';
import {
  CreateDatabagComponent
} from '../../organisms/create-databag/create-databag.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Databag} from '../../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-shared-databag-choose',
  templateUrl: './databag-choose.component.html',
  styleUrls: ['./databag-choose.component.scss']
})
export class DatabagChooseComponent {

  @Input() databags: Databag[] = [];
  @Input() selectedDatabag: Databag = {};
  @Output() selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();

  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute,
              private userFacade: UserFacade) {
  }

  changeSelectedDatabag(databag: Databag) {
    this.selectedDatabag = databag;
    this.selectedDatabagChange.emit(this.selectedDatabag);
  }

  isSameDatabag(databag1: Databag, databag2: Databag) {
    const isSameDatabagId = databag1.databagId === databag2.databagId;
    const isSameFileName = databag1.fileName === databag2.fileName;
    const isSameCreationTime = databag1.creationTime === databag2.creationTime;
    return isSameDatabagId && isSameFileName && isSameCreationTime;
  }

  formatTimestamp(creationTime: string | null | undefined): string {
    if (!creationTime) {
      return '';
    }
    const creationDate = new Date(creationTime);
    return creationDate.toLocaleDateString('de-DE');
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: CreateDatabagComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userFacade.refresh();
    });
  }
}
