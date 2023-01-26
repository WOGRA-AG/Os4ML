import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogDynamicComponent } from 'src/app/shared/components/dialog/dialog-dynamic/dialog-dynamic.component';

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

  async openGettingStartedDialog(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { GettingStartedStepperComponent } = await
      import('src/app/fast-lane/components/getting-started-stepper/getting-started-stepper.component');

    const dialogRef = this.dialog.open(DialogDynamicComponent, {
      data: {component: GettingStartedStepperComponent},
      panelClass: 'getting-started-dialog'
    });
    dialogRef.afterClosed().subscribe();
  }
}
