import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Databag} from '../../../../../../build/openapi/objectstore';
import {
  DialogDynamicComponent
} from '../../../dialog-dynamic/dialog-dynamic.component';
import {
  PopupUploadComponent
} from '../../organisms/popup-upload/popup-upload.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-shared-databag-choose',
  templateUrl: './databag-choose.component.html',
  styleUrls: ['./databag-choose.component.scss']
})
export class DatabagChooseComponent {

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
      data: {component: PopupUploadComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.activatedRoute});
    });
  }
}
