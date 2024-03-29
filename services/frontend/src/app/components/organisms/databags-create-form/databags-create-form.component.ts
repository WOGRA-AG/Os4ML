import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentationHintTextComponent } from '../../molecules/documentation-hint-text/documentation-hint-text.component';
import { MatInputModule } from '@angular/material/input';
import { FileDropzoneComponent } from '../../molecules/file-dropzone/file-dropzone.component';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';
import { NgForOf, NgIf } from '@angular/common';

export interface DatabagFormOutput {
  databagName: string;
  databagDataFile?: File;
  databagDataUrl?: string;
}

@Component({
  selector: 'app-databags-create-form',
  templateUrl: './databags-create-form.component.html',
  styleUrls: ['./databags-create-form.component.scss'],
  standalone: true,
  imports: [
    NewButtonComponent,
    TranslateModule,
    DocumentationHintTextComponent,
    MatInputModule,
    FileDropzoneComponent,
    ElementDividerComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
  ],
})
export class DatabagsCreateFormComponent {
  @Output() public submitDatabag = new EventEmitter<DatabagFormOutput>();

  public localFileMode = true;
  public createDatabagForm: FormGroup;
  public allowedFormats = [
    '.csv',
    '.xls',
    '.xlsx',
    '.xlsm',
    '.xlsb',
    '.odf',
    '.ods',
    '.py',
    '.zip',
  ];
  constructor(private fb: FormBuilder) {
    this.createDatabagForm = this.fb.group(
      {
        databagName: ['', Validators.required],
        databagDataFile: ['', this.validateFileFormats.bind(this)],
        databagDataUrl: [''],
      },
      { validator: this.eitherUrlOrFile } as AbstractControlOptions
    );
  }
  get databagName(): AbstractControl | null {
    return this.createDatabagForm.get('databagName');
  }
  get databagDataFile(): AbstractControl | null {
    return this.createDatabagForm.get('databagDataFile');
  }
  get databagDataUrl(): AbstractControl | null {
    return this.createDatabagForm.get('databagDataUrl');
  }
  public databagDataFileSelected(databagDataFile: File): void {
    this.createDatabagForm.get('databagDataFile')?.setValue(databagDataFile);
  }
  public toggleFileMode(): void {
    this.localFileMode = !this.localFileMode;
    this.databagDataFile?.setValue('');
    this.databagDataUrl?.setValue('');
  }
  public onSubmit(): void {
    if (this.createDatabagForm.valid) {
      this.submitDatabag.emit({
        databagName: this.databagName?.value,
        databagDataFile: this.databagDataFile?.value,
        databagDataUrl: this.databagDataUrl?.value,
      });
    }
  }

  private eitherUrlOrFile(control: AbstractControl): ValidationErrors | null {
    const file = control.get('databagDataFile')?.value;
    const url = control.get('databagDataUrl')?.value;
    if (file && url) {
      return { onlyUrlOrFile: true };
    }
    if ((file && !url) || (!file && url)) {
      return null;
    }
    return { eitherUrlOrFile: true };
  }

  private validateFileFormats(
    control: AbstractControl
  ): ValidationErrors | null {
    const allowedFormats: string[] = this.allowedFormats;
    const file = control.value;
    if (file) {
      const extension = file.name ? file.name.split('.').pop() : '';
      if (allowedFormats.indexOf('.' + extension) === -1) {
        return { invalidFileFormat: true };
      }
    }
    return null;
  }
}
