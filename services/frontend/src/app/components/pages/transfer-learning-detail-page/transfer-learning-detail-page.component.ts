import { Component, DestroyRef, inject } from '@angular/core';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap, tap } from 'rxjs';
import { TransferLearningModel } from '../../../../../build/openapi/modelmanager';
import { TransferLearningService } from '../../../services/transfer-learning.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferLearningModelsDetailSettingsComponent } from '../../organisms/transfer-learning-models-detail-settings/transfer-learning-models-detail-settings.component';
import { TransferLearningModelsDetailAuthorizedUsersComponent } from '../../organisms/transfer-learning-models-detail-authorized-users/transfer-learning-models-detail-authorized-users.component';
import { TransferLearningModelsDetailDependenciesComponent } from '../../organisms/transfer-learning-models-detail-dependencies/transfer-learning-models-detail-dependencies.component';
import { TransferLearningModelsDetailDeleteModelComponent } from '../../organisms/transfer-learning-models-detail-delete-model/transfer-learning-models-detail-delete-model.component';
import { PopupInputComponent } from '../../organisms/popup-input/popup-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupConfirmComponent } from '../../organisms/popup-confirm/popup-confirm.component';
import { MlTypes } from '../../../models/ml-types';
import { StringToMLTypePipe } from '../../../pipes/string-to-mltype.pipe';
import { StringToTLMOriginPipe } from '../../../pipes/string-to-tlmorigin.pipe';
import { TransferLearningModelOrigins } from '../../../models/transfer-learning-model-origins';

@Component({
  selector: 'app-transfer-learning-detail-page',
  templateUrl: './transfer-learning-detail-page.component.html',
  styleUrls: ['./transfer-learning-detail-page.component.scss'],
  standalone: true,
  imports: [
    Os4mlDefaultTemplateComponent,
    AsyncPipe,
    NgIf,
    NewButtonComponent,
    TranslateModule,
    JsonPipe,
    TransferLearningModelsDetailSettingsComponent,
    TransferLearningModelsDetailAuthorizedUsersComponent,
    TransferLearningModelsDetailDependenciesComponent,
    TransferLearningModelsDetailDeleteModelComponent,
    StringToMLTypePipe,
    StringToTLMOriginPipe,
  ],
})
export class TransferLearningDetailPageComponent {
  public transferLearningModel$: Observable<TransferLearningModel>;
  public transferLearningModeId: string;
  protected readonly TransferLearningModelOrigins =
    TransferLearningModelOrigins;
  protected readonly MlTypes = MlTypes;
  private destroyRef = inject(DestroyRef);
  constructor(
    private activatedRoute: ActivatedRoute,
    private transferLearningService: TransferLearningService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.transferLearningModeId =
      this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.transferLearningModel$ =
      this.transferLearningService.getTransferLearningModelById$(
        this.transferLearningModeId
      );
  }

  renameTransferLearningModel(
    transferLearningModel: TransferLearningModel
  ): void {
    const renameTransferLearningModelDialogRef = this.dialog.open(
      PopupInputComponent,
      {
        ariaLabelledBy: 'dialog-title',
        data: {
          inputValue: transferLearningModel.name,
          titleKey:
            'organisms.popup_input.rename_transfer_learning_model.title',
          ariaLabelKey:
            'organisms.popup_input.rename_transfer_learning_model.aria_label',
          inputFormField: {
            label:
              'organisms.popup_input.rename_transfer_learning_model.input_form_field.label',
            ariaLabel:
              'organisms.popup_input.rename_transfer_learning_model.input_form_field.aria-label',
            errorRequired:
              'organisms.popup_input.rename_transfer_learning_model.input_form_field.error_required',
            hint: 'organisms.popup_input.rename_transfer_learning_model.input_form_field.hint',
          },
          submit: {
            aria_label:
              'organisms.popup_input.rename_transfer_learning_model.submit.aria_label',
            button_text:
              'organisms.popup_input.rename_transfer_learning_model.submit.button_text',
          },
        },
      }
    );
    renameTransferLearningModelDialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(newName => (transferLearningModel.name = newName)),
        switchMap(() =>
          this.transferLearningService.updateTransferLearningModelById(
            this.transferLearningModeId,
            transferLearningModel
          )
        )
      )
      .subscribe();
  }

  addAuthorizedUser(transferLearningModel: TransferLearningModel): void {
    const addAuthorizedUserDialogRef = this.dialog.open(PopupInputComponent, {
      ariaLabelledBy: 'dialog-title',
      data: {
        inputValue: '',
        titleKey:
          'organisms.popup_input.add_authorized_user_transfer_learning_model.title',
        ariaLabelKey:
          'organisms.popup_input.add_authorized_user_transfer_learning_model.aria_label',
        inputFormField: {
          label:
            'organisms.popup_input.add_authorized_user_transfer_learning_model.input_form_field.label',
          ariaLabel:
            'organisms.popup_input.add_authorized_user_transfer_learning_model.input_form_field.aria-label',
          errorRequired:
            'organisms.popup_input.add_authorized_user_transfer_learning_model.input_form_field.error_required',
          hint: 'organisms.popup_input.add_authorized_user_transfer_learning_model.input_form_field.hint',
        },
        submit: {
          aria_label:
            'organisms.popup_input.add_authorized_user_transfer_learning_model.submit.aria_label',
          button_text:
            'organisms.popup_input.add_authorized_user_transfer_learning_model.submit.button_text',
        },
      },
    });

    addAuthorizedUserDialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(sharedUserId =>
          this.transferLearningService.shareTransferLearningModel(
            this.transferLearningModeId,
            { userId: sharedUserId }
          )
        )
      )
      .subscribe(
        transferLearningModelUpdated =>
          (transferLearningModel.modelShares =
            transferLearningModelUpdated.modelShares)
      );
  }
  deleteTransferLearningModel(): void {
    const deleteDatabag =
      this.transferLearningService.deleteTransferLearningModelById(
        this.transferLearningModeId
      );
    const deleteDialogRef = this.dialog.open(PopupConfirmComponent, {
      ariaLabelledBy: 'dialog-title',
      data: {
        titleKey:
          'organisms.popup_confirm.delete_transfer_learning_model.title',
        messageKey:
          'organisms.popup_confirm.delete_transfer_learning_model.message',
        onConfirm: deleteDatabag,
      },
    });
    deleteDialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirm => {
        if (confirm) {
          this.router.navigate(['/transfer-learning']);
        }
      });
  }
}
