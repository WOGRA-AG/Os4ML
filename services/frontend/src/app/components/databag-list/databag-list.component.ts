import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Databag} from '../../../../build/openapi/objectstore';

@Component({
  selector: 'app-databag-list',
  templateUrl: './databag-list.component.html',
  styleUrls: ['./databag-list.component.scss']
})
export class DatabagListComponent {

  @Input() databags: Databag[] = [];
  @Input() selectedDatabag: Databag = {};
  @Output() selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();

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
}
