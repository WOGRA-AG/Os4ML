import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDynamicComponent } from 'src/app/shared/components/dialog/dialog-dynamic/dialog-dynamic.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  constructor(private dialog: MatDialog) {}

  async openGettingStartedDialog(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { GettingStartedStepperComponent } = await import(
      'src/app/templates/dialogs/getting-started-stepper/getting-started-stepper.component'
    );

    this.dialog.open(DialogDynamicComponent, {
      data: { component: GettingStartedStepperComponent },
      panelClass: 'getting-started-dialog',
    });
  }
}
