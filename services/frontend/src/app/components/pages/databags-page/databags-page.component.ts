import { Component } from '@angular/core';
import { DatabagService } from '../../../services/databag.service';
import { Observable } from 'rxjs';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { MatDialog } from '@angular/material/dialog';
import { HasElementsPipe } from '../../../pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf, AsyncPipe, NgForOf } from '@angular/common';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { SolutionCreateDialogComponent } from '../solution-create-dialog/solution-create-dialog.component';
import { DatabagDataTableComponent } from '../../organisms/databag-data-table/databag-data-table.component';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { DatabagsCreateDialogComponent } from '../databags-create-dialog/databags-create-dialog.component';
import { MlEntityStatusPlaceholderComponent } from '../../organisms/ml-entity-status-placeholder/ml-entity-status-placeholder.component';
import { PopupConfirmComponent } from '../../organisms/popup-confirm/popup-confirm.component';

@Component({
  selector: 'app-databags-page',
  templateUrl: './databags-page.component.html',
  styleUrls: ['./databags-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
    HasElementsPipe,
    NgForOf,
    LocalizedDatePipe,
    Os4mlDefaultTemplateComponent,
    NewButtonComponent,
    DatabagDataTableComponent,
    DatabagCreateButtonComponent,
    MlEntityStatusPlaceholderComponent,
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

  openCreateSolutionStepperDialog(databagId: string): void {
    this.dialog.open(SolutionCreateDialogComponent, {
      data: { databagId },
    });
  }
  openDeleteDatabagDialog(databagId: string): void {
    const deleteDatabag = this.databagService.deleteDatabagById(databagId);
    this.dialog.open(PopupConfirmComponent, {
      ariaLabelledBy: 'dialog-title',
      data: {
        titleKey: 'organisms.popup_confirm.delete_databag.title',
        messageKey: 'organisms.popup_confirm.delete_databag.message',
        onConfirm: deleteDatabag,
      },
    });
    // deleteDialogRef
    //   .afterClosed()
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(confirm => {
    //     if (confirm) {
    //       this.router.navigate(['/databags']);
    //     }
    //   });
  }
  addDatabag(): void {
    this.dialog.open(DatabagsCreateDialogComponent, {
      ariaLabelledBy: 'dialog-title',
      disableClose: true,
    });
  }
}
