import { Component } from '@angular/core';
import { DatabagService } from '../../databags/services/databag.service';
import { Observable } from 'rxjs';
import { Databag } from '../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { CreateDatabagStepperComponent } from '../dialogs/create-databag-stepper/create-databag-stepper.component';
import { HasElementsPipe } from '../../shared/pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NoDatabagsPlaceholderComponent } from '../../databags/components/no-databags-placeholder/no-databags-placeholder.component';
import { ButtonComponent } from '../../design/components/atoms/button/button.component';
import { NgIf, AsyncPipe, NgForOf } from '@angular/common';
import { LocalizedDatePipe } from '../../shared/pipes/localized-date.pipe';
import { DatabagSettingComponent } from '../../databags/components/databag-setting/databag-setting.component';
import { Os4mlDefaultTemplateComponent } from '../../shared/components/templates/os4ml-default-template/os4ml-default-template.component';
import { NewButtonComponent } from '../../shared/components/molecules/new-button/new-button.component';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { DatabagDataTableComponent } from '../../shared/components/organisms/databag-data-table/databag-data-table.component';
import { DatabagCreateButtonComponent } from '../../shared/components/organisms/databag-create-button/databag-create-button.component';
import { PlaceholderComponent } from 'src/app/shared/components/organisms/placeholder/placeholder.component';
import { GetPlaceholderVariantPipe } from '../../shared/pipes/get-placeholder-variant.pipe';

@Component({
  selector: 'app-databags-page',
  templateUrl: './databags-page.component.html',
  styleUrls: ['./databags-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ButtonComponent,
    NoDatabagsPlaceholderComponent,
    AsyncPipe,
    TranslateModule,
    HasElementsPipe,
    NgForOf,
    LocalizedDatePipe,
    Os4mlDefaultTemplateComponent,
    NewButtonComponent,
    DatabagDataTableComponent,
    DatabagCreateButtonComponent,
    PlaceholderComponent,
    GetPlaceholderVariantPipe,
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

  openDatabagSettingDialog(databag: Databag): void {
    this.dialog.open(DatabagSettingComponent, {
      data: { databag },
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      },
    });
  }
  openCreateSolutionStepperDialog(databagId: string): void {
    this.dialog.open(SolutionCreateDialogComponent, {
      data: { databagId },
    });
  }
  addDatabag(): void {
    this.dialog.open(CreateDatabagStepperComponent);
  }
}
