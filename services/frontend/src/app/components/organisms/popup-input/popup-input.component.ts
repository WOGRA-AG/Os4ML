import { Component, DestroyRef, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import { StatusSpinnerComponent } from '../../molecules/status-spinner/status-spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { Os4mlDialogTemplateComponent } from '../../templates/os4ml-dialog-template/os4ml-dialog-template.component';

@Component({
  selector: 'app-popup-input',
  templateUrl: './popup-input.component.html',
  styleUrls: ['./popup-input.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    NgIf,
    StatusSpinnerComponent,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    NewButtonComponent,
    ReactiveFormsModule,
    AsyncPipe,
    IconButtonComponent,
    Os4mlDialogTemplateComponent,
  ],
})
export class PopupInputComponent {
  public submitting = false;
  public inputForm: FormGroup<{
    inputValue: FormControl<string>;
  }>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: NonNullableFormBuilder,
    private dialog: MatDialogRef<PopupInputComponent, string>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      inputValue: string;
      titleKey: string;
      ariaLabelKey: string;
      inputFormField: {
        label: string;
        ariaLabel: string;
        errorRequired: string;
        hint: string;
      };
      submit: {
        aria_label: string;
        button_text: string;
      };
    }
  ) {
    this.inputForm = this.fb.group({
      inputValue: [this.data.inputValue, Validators.required],
    });
  }
  get inputValue(): FormControl<string> {
    return this.inputForm.controls.inputValue;
  }

  close(): void {
    this.dialog.close();
  }
  submit(): void {
    this.submitting = true;
    this.dialog.close(this.inputValue.value);
  }
}
