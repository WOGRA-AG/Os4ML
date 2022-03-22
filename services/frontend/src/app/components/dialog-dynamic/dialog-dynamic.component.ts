import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Column, Solution} from '../../../../build/openapi/objectstore';

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
    columns: Column[];
  }) {
  }

}
