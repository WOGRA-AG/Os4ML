import {Component, Input} from '@angular/core';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PopupUploadComponent} from '../../organisms/popup-upload/popup-upload.component';
import {Databag} from '../../../../../../build/openapi/objectstore';
@Component({
  selector: 'app-shared-databags',
  templateUrl: './databags.component.html',
  styleUrls: ['./databags.component.scss']
})
export class DatabagsComponent {
  @Input() databags: Databag[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dialog: MatDialog) {
  }

  addDatabag() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: PopupUploadComponent}
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }
}