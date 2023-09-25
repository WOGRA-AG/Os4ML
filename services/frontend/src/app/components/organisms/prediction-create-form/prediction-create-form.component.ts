import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Solution } from '../../../../../build/openapi/modelmanager';
import {
  AbstractControl,
  AbstractControlOptions,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { GetPredictListItemsFromDatabagPipe } from '../../../pipes/get-predict-list-items-from-databag.pipe';
import { ButtonComponent } from '../../molecules/button/button.component';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';
import { FileDropzoneComponent } from '../../molecules/file-dropzone/file-dropzone.component';
import { MatListModule } from '@angular/material/list';
import { GetSolutionByIdPipe } from '../../../pipes/get-solution-by-id.pipe';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { DocumentationHintTextComponent } from '../../molecules/documentation-hint-text/documentation-hint-text.component';
import { MatSelectModule } from '@angular/material/select';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';

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
    GetDatabagByIdPipe,
    GetPredictListItemsFromDatabagPipe,
    ButtonComponent,
    ElementDividerComponent,
    ReactiveFormsModule,
    FileDropzoneComponent,
    MatListModule,
    GetSolutionByIdPipe,
    NewButtonComponent,
    DocumentationHintTextComponent,
    MatSelectModule,
    NgIf,
    NgForOf,
    JsonPipe,
  ],
})
export class PredictionCreateFormComponent implements OnInit {
  @Input() public selectedSolutionId: string | undefined;
  @Input() public solutions: Solution[] = [];
  @Output() public submitPrediction = new EventEmitter<PredictionFormOutput>();
  @Output() public downloadPredictionTemplate = new EventEmitter<string>();

  public localFileMode = true;
  public allowedFormats = [
    '.csv',
    '.xls',
    '.xlsx',
    '.xlsm',
    '.xlsb',
    '.odf',
    '.ods',
    '.zip',
  ];
  public createPredictionForm: FormGroup<{
    predictionName: FormControl<string>;
    solutionId: FormControl<string>;
    predictionDataFile: FormControl;
    predictionDataUrl: FormControl<string>;
  }>;
  constructor(private fb: NonNullableFormBuilder) {
    this.createPredictionForm = this.fb.group(
      {
        predictionName: ['', Validators.required],
        solutionId: ['', Validators.required],
        predictionDataFile: [undefined, this.validateFileFormats.bind(this)],
        predictionDataUrl: [''],
      },
      { validator: this.eitherUrlOrFile } as AbstractControlOptions
    );
  }
  get predictionName(): FormControl<string> {
    return this.createPredictionForm.controls.predictionName;
  }
  get solutionId(): FormControl<string> {
    return this.createPredictionForm.controls.solutionId;
  }
  get predictionDataFile(): FormControl<undefined | File> {
    return this.createPredictionForm.controls.predictionDataFile;
  }
  get predictionDataUrl(): FormControl<string> {
    return this.createPredictionForm.controls.predictionDataUrl;
  }

  ngOnInit(): void {
    if (this.selectedSolutionId) {
      this.solutionId.setValue(this.selectedSolutionId);
    }
  }

  public predictionDataFileSelected(predictionDataFile: File): void {
    this.createPredictionForm
      .get('predictionDataFile')
      ?.setValue(predictionDataFile);
  }
  public toggleFileMode(): void {
    this.localFileMode = !this.localFileMode;
    this.predictionDataFile.setValue(undefined);
    this.predictionDataUrl.setValue('');
  }
  public onDownloadPredictionTemplate(): void {
    this.downloadPredictionTemplate.emit(this.solutionId.value);
  }
  public onSubmit(): void {
    if (this.createPredictionForm.valid) {
      this.submitPrediction.emit({
        predictionName: this.predictionName.value,
        solutionId: this.solutionId.value,
        predictionDataFile: this.predictionDataFile.value,
        predictionDataUrl: this.predictionDataUrl.value,
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
