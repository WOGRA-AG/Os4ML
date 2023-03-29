import { Component } from '@angular/core';
import { DatabagService } from '../../../databags/services/databag.service';
import { Observable } from 'rxjs';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { CreateDatabagStepperComponent } from '../../dialogs/create-databag-stepper/create-databag-stepper.component';
import { HasElementsPipe } from '../../../shared/pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NoDatabagsPlaceholderComponent } from '../../../databags/components/no-databags-placeholder/no-databags-placeholder.component';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { DatabagListComponent } from '../../../databags/components/databag-list/databag-list.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-databags-page',
  templateUrl: './databags-page.component.html',
  styleUrls: ['./databags-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    DatabagListComponent,
    ButtonComponent,
    NoDatabagsPlaceholderComponent,
    AsyncPipe,
    TranslateModule,
    HasElementsPipe,
  ],
})
export class DatabagsPageComponent {
  public readonly databags$: Observable<Databag[]>;

  constructor(
    private databagService: DatabagService,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
  }

  addDatabag(): void {
    this.dialog.open(CreateDatabagStepperComponent);
  }
}
