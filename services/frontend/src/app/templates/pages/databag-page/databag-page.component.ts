import { Component } from '@angular/core';
import { DatabagService } from '../../../databags/services/databag.service';
import { Observable } from 'rxjs';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { CreateDatabagStepperComponent } from '../../dialogs/create-databag-stepper/create-databag-stepper.component';

@Component({
  selector: 'app-databag-page',
  templateUrl: './databag-page.component.html',
  styleUrls: ['./databag-page.component.scss'],
})
export class DatabagPageComponent {
  readonly databags$: Observable<Databag[]>;

  constructor(
    private databagService: DatabagService,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.databags$;
  }

  addDatabag(): void {
    this.dialog.open(DialogDynamicComponent, {
      data: { component: CreateDatabagStepperComponent },
    });
  }
}
