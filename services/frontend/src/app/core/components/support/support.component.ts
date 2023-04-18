import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
})
export class SupportComponent {
  constructor(private dialog: MatDialog) {}

  async openGettingStartedDialog(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { GettingStartedStepperComponent } = await import(
      'src/app/pages/dialogs/getting-started-stepper/getting-started-stepper.component'
    );

    this.dialog.open(GettingStartedStepperComponent, {
      panelClass: 'getting-started-dialog',
    });
  }
}
