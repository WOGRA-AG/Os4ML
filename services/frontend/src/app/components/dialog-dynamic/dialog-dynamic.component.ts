import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Databag} from '../../../../build/openapi/objectstore';
import {Solution} from '../../../../build/openapi/jobmanager';

@Component({
  selector: 'app-dialog-dynamic',
  templateUrl: './dialog-dynamic.component.html',
  styleUrls: ['./dialog-dynamic.component.scss']
})
export class DialogDynamicComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    component: any;
    uuid: string;
    solution: Solution;
    databag: Databag;
  }) {
  }

}
