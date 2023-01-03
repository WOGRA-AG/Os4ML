import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  GettingStartedComponent
} from '../shared/organisms/getting-started/getting-started.component';
import {DialogDynamicComponent} from '../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';

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
      data: {component: GettingStartedComponent},
      panelClass: 'getting-started-dialog'
    });
    dialogRef.afterClosed().subscribe();
  }
}
