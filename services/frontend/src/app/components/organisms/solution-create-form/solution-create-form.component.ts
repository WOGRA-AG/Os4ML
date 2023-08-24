import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Column,
  Databag,
  Solution,
  TransferLearningModel,
} from '../../../../../build/openapi/modelmanager';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';
import { GetPredictListItemsFromDatabagPipe } from '../../../pipes/get-predict-list-items-from-databag.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf, NgIf } from '@angular/common';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { ButtonComponent } from '../../molecules/button/button.component';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-solution-create-form',
  templateUrl: './solution-create-form.component.html',
  styleUrls: ['./solution-create-form.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    ElementDividerComponent,
    GetPredictListItemsFromDatabagPipe,
    TranslateModule,
    NgIf,
    NgForOf,
    GetDatabagByIdPipe,
    ButtonComponent,
    SolutionCreateButtonComponent,
    NewButtonComponent,
    MatSlideToggleModule,
  ],
})
export class SolutionCreateFormComponent implements OnInit {
  @Input() public selectedDatabagId: string | undefined;
  @Input() public databags: Databag[] = [];
  @Input() public transferLearningModels: TransferLearningModel[] = [];
  @Output() public submitSolution = new EventEmitter<Solution>();

  public createSolutionForm: FormGroup;
  public transferLearningSettingsActive = false;

  public defaultTransferLearningModel: TransferLearningModel = {
    label: 'Default Model',
    id: 'default-model',
    origin: 'OS4ML',
  };
  constructor(private fb: FormBuilder) {
    this.createSolutionForm = this.fb.group({
      name: ['', Validators.required],
      databagId: ['', Validators.required],
      selectedFields: ['', Validators.required],
      transferLearningSettings: this.fb.array([]),
    });
    console.log(this.transferLearningModels);
  }
  get name(): AbstractControl | null {
    return this.createSolutionForm.get('name');
  }
  get databagId(): AbstractControl | null {
    return this.createSolutionForm.get('databagId');
  }
  get selectedFields(): AbstractControl | null {
    return this.createSolutionForm.get('selectedFields');
  }
  get transferLearningSettingsFormArray(): FormArray {
    return this.createSolutionForm.get('transferLearningSettings') as FormArray;
  }
  ngOnInit(): void {
    this.createSolutionForm.get('databagId')?.setValue(this.selectedDatabagId);
    this.populateTransferLearningSettings();
  }

  getControlValue(group: AbstractControl, controlName: string): string | null {
    const control = group.get(controlName);
    return control instanceof FormControl ? control.value : null;
  }

  getFormControl(group: AbstractControl, controlName: string): FormControl {
    const control = group.get(controlName);
    if (control instanceof FormControl) {
      return control;
    } else {
      throw new Error(`Control ${controlName} is not a FormControl`);
    }
  }

  populateTransferLearningSettings(): void {
    const selectedDatabag = this.databags.find(
      databag => databag.id === this.databagId?.value
    );

    if (selectedDatabag && selectedDatabag.columns) {
      this.transferLearningSettingsFormArray.clear(); // Clear existing form controls

      selectedDatabag.columns.forEach(column => {
        const control = this.fb.group({
          name: column.name,
          type: column.type,
          selectedTransferLearningModel: this.defaultTransferLearningModel,
        });
        this.transferLearningSettingsFormArray.push(control);
      });
    }
  }

  toggleTransferLearningSettings(event: MatSlideToggleChange): void {
    this.transferLearningSettingsActive = event.checked;
  }

  modelOfTypeExists(type: string | null): boolean {
    return this.transferLearningModels.some(model => model.type === type);
  }

  getModelsByType(type: string | null): TransferLearningModel[] {
    return this.transferLearningModels.filter(model => model.type === type);
  }

  public onSubmit(): void {
    if (this.createSolutionForm.valid) {
      const submitSolution: Solution = {
        name: this.name?.value,
        databagId: this.databagId?.value,
        outputFields: this.selectedFields?.value,
        inputFields: this.getUnselectedColumns(this.selectedFields?.value),
      };
      if (this.transferLearningSettingsActive) {
        submitSolution.transferLearningSettings =
          this.transferLearningSettingsFormArray.controls
            .filter(
              control =>
                !this.selectedFields?.value.includes(
                  this.getControlValue(control, 'name')
                )
            )
            .map(control => control.value);
      }
      this.submitSolution.emit(submitSolution);
    }
  }
  public getUnselectedColumns(selectedFields: string[]): string[] {
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
