import { Component } from '@angular/core';
import { DatabagService } from '../../../databags/services/databag.service';
import { Observable } from 'rxjs';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateDatabagStepperComponent } from '../../dialogs/create-databag-stepper/create-databag-stepper.component';
import { HasElementsPipe } from '../../../shared/pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NoDatabagsPlaceholderComponent } from '../../../databags/components/no-databags-placeholder/no-databags-placeholder.component';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { NgIf, AsyncPipe, NgForOf } from '@angular/common';
import { DataInsightCardComponent } from '../../../shared/components/organisms/data-insight-card/data-insight-card.component';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { DataInsightItemComponent } from '../../../shared/components/molecules/data-insight-item/data-insight-item.component';
import { IconButtonComponent } from '../../../design/components/atoms/icon-button/icon-button.component';
import { DatabagSettingComponent } from '../../../databags/components/databag-setting/databag-setting.component';
import { CreateSolutionStepperComponent } from '../../dialogs/create-solution-stepper/create-solution-stepper.component';

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
    DataInsightCardComponent,
    NgForOf,
    LocalizedDatePipe,
    DataInsightItemComponent,
    MatTooltipModule,
    IconButtonComponent,
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
  openCreateSolutionStepperDialog(databag: Databag): void {
    this.dialog.open(CreateSolutionStepperComponent, {
      data: { databag },
    });
  }
  addDatabag(): void {
    this.dialog.open(CreateDatabagStepperComponent);
  }
}
