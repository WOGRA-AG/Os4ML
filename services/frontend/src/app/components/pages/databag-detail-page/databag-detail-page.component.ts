import { Component, DestroyRef, inject } from '@angular/core';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { DatabagsCreateDialogComponent } from '../databags-create-dialog/databags-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SolutionDetailPipelineStatusComponent } from '../../organisms/solution-detail-pipeline-status/solution-detail-pipeline-status.component';
import { DatabagDetailPiplineStatusComponent } from '../../organisms/databag-detail-pipline-status/databag-detail-pipline-status.component';
import { DatabagDetailFieldSettingsComponent } from '../../organisms/databag-detail-field-settings/databag-detail-field-settings.component';
import { DatabagDetailDownloadDatabagComponent } from '../../organisms/databag-detail-download-databag/databag-detail-download-databag.component';
import { DatabagDetailDeleteDatabagComponent } from '../../organisms/databag-detail-delete-databag/databag-detail-delete-databag.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, Subject, switchMap } from 'rxjs';
import { Column, Databag } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../../services/databag.service';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { SolutionDetailDeleteSolutionComponent } from '../../organisms/solution-detail-delete-solution/solution-detail-delete-solution.component';
import { PopupConfirmComponent } from '../../organisms/popup-confirm/popup-confirm.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupInputComponent } from '../../organisms/popup-input/popup-input.component';
import { ShortStatusPipe } from '../../../pipes/short-status.pipe';
import { SolutionDetailDownloadModelComponent } from '../../organisms/solution-detail-download-model/solution-detail-download-model.component';

@Component({
  selector: 'app-databag-detail-page',
  templateUrl: './databag-detail-page.component.html',
  styleUrls: ['./databag-detail-page.component.scss'],
  standalone: true,
  imports: [
    Os4mlDefaultTemplateComponent,
    NewButtonComponent,
    TranslateModule,
    DatabagCreateButtonComponent,
    SolutionDetailPipelineStatusComponent,
    DatabagDetailPiplineStatusComponent,
    DatabagDetailFieldSettingsComponent,
    DatabagDetailDownloadDatabagComponent,
    DatabagDetailDeleteDatabagComponent,
    JsonPipe,
    AsyncPipe,
    NgIf,
    SolutionDetailDeleteSolutionComponent,
    ShortStatusPipe,
    SolutionDetailDownloadModelComponent,
  ],
})
export class DatabagDetailPageComponent {
  public databag$: Observable<Databag>;
  public databagId: string;
  private databagUpdateSubject = new Subject<Databag>();
  private destroyRef = inject(DestroyRef);
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private databagService: DatabagService
  ) {
    this.databagId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.databag$ = this.databagService.getDatabagById$(this.databagId);
    this.databagUpdateSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(databag => {
          return this.databagService.updateDatabagById(this.databagId, databag);
        })
      )
      .subscribe();
  }
  addDatabag(): void {
    this.dialog.open(DatabagsCreateDialogComponent, {
      ariaLabelledBy: 'dialog-title',
      disableClose: true,
    });
  }

  renameDatabag(oldName: string): void {
    const renameSolutionDialogRef = this.dialog.open(PopupInputComponent, {
      ariaLabelledBy: 'dialog-title',
      data: {
        inputValue: oldName,
        titleKey: 'organisms.popup_input.rename_databag.title',
        ariaLabelKey: 'organisms.popup_input.rename_databag.aria_label',
        inputFormField: {
          label: 'organisms.popup_input.rename_databag.input_form_field.label',
          ariaLabel:
            'organisms.popup_input.rename_databag.input_form_field.aria-label',
          errorRequired:
            'organisms.popup_input.rename_databag.input_form_field.error_required',
          hint: 'organisms.popup_input.rename_databag.input_form_field.hint',
        },
        submit: {
          aria_label: 'organisms.popup_input.rename_databag.submit.aria_label',
          button_text:
            'organisms.popup_input.rename_databag.submit.button_text',
        },
      },
    });

    renameSolutionDialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(result => {
          const databag = this.databagService.getDatabagById(this.databagId);
          if (result && databag) {
            databag.name = result;
            return this.databagService.updateDatabagById(
              this.databagId,
              databag
            );
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe();
  }
  deleteDatabag(): void {
    const deleteDatabag = this.databagService.deleteDatabagById(this.databagId);
    const deleteDialogRef = this.dialog.open(PopupConfirmComponent, {
      ariaLabelledBy: 'dialog-title',
      data: {
        titleKey: 'organisms.popup_confirm.delete_databag.title',
        messageKey: 'organisms.popup_confirm.delete_databag.message',
        onConfirm: deleteDatabag,
      },
    });
    deleteDialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirm => {
        if (confirm) {
          this.router.navigate(['/databags']);
        }
      });
  }
  updateDatabagColumns(databag: Databag, columns: Column[]): void {
    databag.columns = columns;
    this.databagUpdateSubject.next(databag);
  }

  downloadDatabag(downloadLink: HTMLAnchorElement): void {
    this.databagService
      .getDatabagUlr(this.databagId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(url => {
        downloadLink.href = url;
        downloadLink.click();
      });
  }
}
