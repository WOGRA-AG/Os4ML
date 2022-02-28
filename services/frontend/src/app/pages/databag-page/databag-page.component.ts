import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Bucket} from '../../../../build/openapi/objectstore';
import {MatDialog} from '@angular/material/dialog';
import {DialogAddDatabagComponent} from '../../components/dialog-add-databag/dialog-add-databag.component';
import {DialogDynamicComponent} from "../../components/dialog-dynamic/dialog-dynamic.component";

@Component({
  selector: 'app-databag-page',
  templateUrl: './databag-page.component.html',
  styleUrls: ['./databag-page.component.scss']
})
export class DatabagPageComponent {
  databags: Array<Bucket> = [];

  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog) {
    this.databags = this.activatedRoute.snapshot.data['databags'];
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: DialogAddDatabagComponent}
    });
  }
}
