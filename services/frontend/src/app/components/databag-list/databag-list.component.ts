import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';
import {
  DialogDynamicComponent
} from '../dialog-dynamic/dialog-dynamic.component';
import {
  DialogAddDatabagComponent
} from '../dialog-add-databag/dialog-add-databag.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss']
})
export class DatabagListComponent {

  @Input() databags: Databag[] = [];
  @Input() selectedDatabag: Databag = {};
  @Output() selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();

  intervalSub: Subscription;

  constructor(public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    this.intervalSub = interval(10000).subscribe(x => {
      router.navigate(['.'], {relativeTo: activatedRoute});
    });
  }

  changeSelectedDatabag(databag: Databag) {
    this.selectedDatabag = databag;
    this.selectedDatabagChange.emit(this.selectedDatabag);
  }

  isSameDatabag(databag1: Databag, databag2: Databag) {
    const isSameDatabagName = databag1.databagName === databag2.databagName;
    const isSameBucketName = databag1.bucketName === databag2.bucketName;
    const isSameFileName = databag1.fileName === databag2.fileName;
    const isSameCreationTime = databag1.creationTime === databag2.creationTime;
    return isSameDatabagName && isSameBucketName && isSameFileName && isSameCreationTime;
  }

  formatTimestamp(creationTime: string | undefined): string {
    if (!creationTime) {
      return '';
    }
    const creationDate = new Date(creationTime);
    return creationDate.toLocaleDateString('de-DE');
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
