import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {
  GettingStartedComponent
} from '../shared/organisms/getting-started/getting-started.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
    constructor(
    private dialog: MatDialog,
    ) {
  }

  openGettingStartedDialog() {
    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: GettingStartedComponent}
    });
    dialogRef.afterClosed().subscribe();
  }
}
