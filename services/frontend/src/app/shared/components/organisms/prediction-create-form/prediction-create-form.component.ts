import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Solution } from '../../../../../../build/openapi/modelmanager';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { SelectableListComponent } from '../../molecules/selectable-list/selectable-list.component';
import { NgForOf, NgIf } from '@angular/common';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { GetPredictListItemsFromDatabagPipe } from '../../../pipes/get-predict-list-items-from-databag.pipe';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';
import { DatasetUploadComponent } from '../dataset-upload/dataset-upload.component';
import { UploadFieldComponent } from '../../molecules/upload-field/upload-field.component';
import { FileDropzoneComponent } from '../../molecules/file-dropzone/file-dropzone.component';
import { MatListModule } from '@angular/material/list';
import { GetSolutionByIdPipe } from '../../../pipes/get-solution-by-id.pipe';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { DocumentationHintTextComponent } from '../../molecules/documentation-hint-text/documentation-hint-text.component';

export interface PredictionFormOutput {
  predictionName: string;
  solutionId: string;
  predictionDataFile?: File;
  predictionDataUrl?: string;
}

@Component({
  selector: 'app-prediction-create-form',
  templateUrl: './prediction-create-form.component.html',
  styleUrls: ['./prediction-create-form.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    TranslateModule,
    MatSelectModule,
    SelectableListComponent,
    NgIf,
    GetDatabagByIdPipe,
    GetPredictListItemsFromDatabagPipe,
    ButtonComponent,
    ElementDividerComponent,
    ReactiveFormsModule,
    NgForOf,
    DatasetUploadComponent,
    UploadFieldComponent,
    FileDropzoneComponent,
    MatListModule,
    GetSolutionByIdPipe,
    NewButtonComponent,
    DocumentationHintTextComponent,
  ],
})
export class PredictionCreateFormComponent implements OnInit {
  @Input() public selectedSolutionId: string | undefined;
  @Input() public solutions: Solution[] = [];
  @Output() public submitPrediction = new EventEmitter<PredictionFormOutput>();
  @Output() public downloadPredictionTemplate = new EventEmitter<string>();

  public localFileMode = true;
  public createPredictionForm: FormGroup;
  public  allowedFormats = [
    '.csv',
    '.xls',
    '.xlsx',
    '.xlsm',
    '.xlsb',
    '.odf',
    '.ods',
  ];
  constructor(private fb: FormBuilder) {
    this.createPredictionForm = this.fb.group(
      {
        predictionName: ['', Validators.required],
        solutionId: ['', Validators.required],
        predictionDataFile: ['', this.validateFileFormats.bind(this)],
        predictionDataUrl: [''],
      },
      { validator: this.eitherUrlOrFile } as AbstractControlOptions
    );
  }
  get predictionName(): AbstractControl | null {
    return this.createPredictionForm.get('predictionName');
  }
  get solutionId(): AbstractControl | null {
    return this.createPredictionForm.get('solutionId');
  }
  get predictionDataFile(): AbstractControl | null {
    return this.createPredictionForm.get('predictionDataFile');
  }
  get predictionDataUrl(): AbstractControl | null {
    return this.createPredictionForm.get('predictionDataUrl');
  }

  ngOnInit(): void {
    this.createPredictionForm
      .get('solutionId')
      ?.setValue(this.selectedSolutionId);
  }

  public predictionDataFileSelected(predictionDataFile: File): void {
    this.createPredictionForm
      .get('predictionDataFile')
      ?.setValue(predictionDataFile);
  }
  public toggleFileMode(): void {
    this.localFileMode = !this.localFileMode;
    this.predictionDataFile?.setValue('');
    this.predictionDataUrl?.setValue('');
  }
  public onDownloadPredictionTemplate(): void {
    this.downloadPredictionTemplate.emit(this.solutionId?.value);
  }
  public onSubmit(): void {
    if (this.createPredictionForm.valid) {
      this.submitPrediction.emit({
        predictionName: this.predictionName?.value,
        solutionId: this.solutionId?.value,
        predictionDataFile: this.predictionDataFile?.value,
        predictionDataUrl: this.predictionDataUrl?.value,
      });
    }
  }

  private eitherUrlOrFile(control: AbstractControl): ValidationErrors | null {
    const file = control.get('predictionDataFile')?.value;
    const url = control.get('predictionDataUrl')?.value;
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
    const file = control.value;
    const allowedFormats: string[] = this.allowedFormats;
    if (file) {
      const extension = file.name ? file.name.split('.').pop() : '';
      if (allowedFormats.indexOf('.' + extension) === -1) {
        return { invalidFileFormat: true };
      }
    }
    return null;
  }
}
