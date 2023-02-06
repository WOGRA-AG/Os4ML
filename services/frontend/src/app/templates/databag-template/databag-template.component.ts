import { Component } from '@angular/core';
import { DatabagService } from '../../databags/services/databag.service';
import { Observable } from 'rxjs';
import { Databag } from '../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { DialogDynamicComponent } from '../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { CreateDatabagStepperComponent } from '../../databags/components/create-databag-stepper/create-databag-stepper.component';

@Component({
  selector: 'app-databag-template',
  templateUrl: './databag-template.component.html',
  styleUrls: ['./databag-template.component.scss'],
})
export class DatabagTemplateComponent {
  readonly databags$: Observable<Databag[]>;

  constructor(
    private databagService: DatabagService,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.databags$;
  }

  addDatabag() {
    this.dialog.open(DialogDynamicComponent, {
      data: { component: CreateDatabagStepperComponent },
    });
  }
}
