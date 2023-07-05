import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Column,
  Databag,
  Solution,
} from '../../../../../../build/openapi/modelmanager';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { SelectableListComponent } from '../../molecules/selectable-list/selectable-list.component';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { GetPredictListItemsFromDatabagPipe } from '../../../pipes/get-predict-list-items-from-databag.pipe';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';
import { DatasetUploadComponent } from '../dataset-upload/dataset-upload.component';
import { UploadFieldComponent } from '../../molecules/upload-field/upload-field.component';

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
    JsonPipe,
    NgForOf,
    DatasetUploadComponent,
    UploadFieldComponent,
  ],
})
export class PredictionCreateFormComponent implements OnInit {
  @Input() public selectedDatabagId: string | undefined;
  @Input() public selectedSolutionId: string | undefined;
  @Input() public databags: Databag[] = [];
  @Input() public solutions: Solution[] = [];
  @Output() public submitSolution = new EventEmitter<Solution>();

  public createSolutionForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createSolutionForm = this.fb.group({
      name: ['', Validators.required],
      databagId: ['', Validators.required],
      solutionId: ['', Validators.required],
      selectedFields: this.fb.array([], Validators.required),
    });
  }
  get name(): AbstractControl | null {
    return this.createSolutionForm.get('name');
  }
  get databagId(): AbstractControl | null {
    return this.createSolutionForm.get('databagId');
  }

  get solutionId(): AbstractControl | null {
    return this.createSolutionForm.get('databagId');
  }
  get selectedFields(): AbstractControl | null {
    return this.createSolutionForm.get('selectedFields');
  }

  ngOnInit(): void {
    this.createSolutionForm.get('databagId')?.setValue(this.selectedDatabagId);
  }
  selectedFieldsChange(columns: string[]): void {
    this.selectedFields?.markAsTouched();
    const selectedFields = this.selectedFields as FormArray;
    while (selectedFields.length !== 0) {
      selectedFields.removeAt(0);
    }
    columns.forEach(column => {
      selectedFields.push(this.fb.control(column, Validators.required));
    });
  }
  public onSubmit(): void {
    if (this.createSolutionForm.valid) {
      const sumbitSolution: Solution = {
        name: this.name?.value,
        databagId: this.databagId?.value,
        outputFields: this.selectedFields?.value,
        inputFields: this.getUnselectedColumns(this.selectedFields?.value),
      };
      this.submitSolution.emit(sumbitSolution);
    }
  }
  private getUnselectedColumns(selectedFields: string[]): string[] {
    const selectedDatabag = this.databags.find(
      databag => databag.id === this.databagId?.value
    );
    const allFields: Column[] = selectedDatabag?.columns ?? [];
    const allFieldsNames: string[] = allFields.map(column => column.name!);
    const inputFields: string[] = allFieldsNames.filter(
      name => !selectedFields.includes(name)
    );
    return inputFields;
  }
}
