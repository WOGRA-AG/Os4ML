import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Column,
  Databag,
  Solution,
  TransferLearningModel,
  TransferLearningSetting,
} from '../../../../../build/openapi/modelmanager';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { GetPredictListItemsFromDatabagPipe } from '../../../pipes/get-predict-list-items-from-databag.pipe';
import { NgForOf, NgIf } from '@angular/common';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { DatabagService } from '../../../services/databag.service';

interface TransferLearningSettingFormGroup {
  name: FormControl<string>;
  type: FormControl<string>;
  selectedTransferLearningModel: FormControl<TransferLearningModel>;
}

@Component({
  selector: 'app-solution-create-form',
  templateUrl: './solution-create-form.component.html',
  styleUrls: ['./solution-create-form.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    MatInputModule,
    MatSelectModule,
    ElementDividerComponent,
    GetDatabagByIdPipe,
    GetPredictListItemsFromDatabagPipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    MatSlideToggleModule,
    NewButtonComponent,
  ],
})
export class SolutionCreateFormComponent implements OnInit {
  @Input() public selectedDatabagId: string | undefined;
  @Input() public databags: Databag[] = [];
  @Input() public transferLearningModels: TransferLearningModel[] = [];
  @Output() public submitSolution = new EventEmitter<Solution>();

  public createSolutionForm: FormGroup<{
    name: FormControl<string>;
    databagId: FormControl<string>;
    inputFields: FormControl<string[]>;
    outputFields: FormControl<string[]>;
    transferLearningSettings: FormArray<
      FormGroup<TransferLearningSettingFormGroup>
    >;
  }>;
  public transferLearningSettingsActive = false;
  public defaultTransferLearningModel: TransferLearningModel = {
    name: 'Default Model',
    id: 'default-model',
    type: 'Default',
    origin: 'OS4ML',
    value: 'default-value',
  };
  public allDatabagColumns: Column[] | undefined = undefined;
  public availableDatabagOutputColumns: Column[] | undefined = undefined;
  public availableDatabagInputColumns: Column[] | undefined = undefined;
  public allTransferLearningSettings: FormGroup<TransferLearningSettingFormGroup>[] =
    [];
  constructor(
    private databagService: DatabagService,
    private fb: NonNullableFormBuilder
  ) {
    this.createSolutionForm = this.fb.group({
      name: ['', Validators.required],
      databagId: ['', Validators.required],
      inputFields: [[] as string[], Validators.required],
      outputFields: [[] as string[], Validators.required],
      transferLearningSettings: this.fb.array([] as FormGroup[]),
    });
  }
  get name(): FormControl<string> {
    return this.createSolutionForm.controls.name;
  }
  get databagId(): FormControl<string> {
    return this.createSolutionForm.controls.databagId;
  }
  get outputFields(): FormControl<string[]> {
    return this.createSolutionForm.controls.outputFields;
  }
  get inputFields(): FormControl<string[]> {
    return this.createSolutionForm.controls.inputFields;
  }
  get transferLearningSettingsFormArray(): FormArray<
    FormGroup<TransferLearningSettingFormGroup>
  > {
    return this.createSolutionForm.controls.transferLearningSettings;
  }
  ngOnInit(): void {
    this.setInitialDatabagId();
    this.initTransferLearningSettings();
  }

  public selectDatabagColumns(databagId: string): void {
    const databag = this.databagService.getDatabagById(databagId);
    if (databag && databag.columns) {
      const databagColumns = databag.columns.filter(column => column.type);
      this.updateDatabagColumns(databagColumns);
    }
  }

  public updateDatabagColumns(databagColumns: Column[]): void {
    this.allDatabagColumns = [...databagColumns];
    this.availableDatabagOutputColumns = databagColumns;
    this.availableDatabagInputColumns = databagColumns;

    const selectedInputColumns = databagColumns
      .filter(column => column.name !== undefined)
      .map(column => column.name as string);
    this.inputFields.setValue(selectedInputColumns);
  }

  public updateAvailableDatabagInputColumns(): void {
    const outputFieldsValues = this.outputFields.value || [];

    if (this.allDatabagColumns?.length) {
      // Filtern basierend auf allDatabagColumns und nicht auf availableDatabagInputColumns
      this.availableDatabagInputColumns = this.allDatabagColumns.filter(
        column => !column.name || !outputFieldsValues.includes(column.name)
      );
      const updatedSelectedInputFields = this.inputFields.value.filter(
        value => !value || !outputFieldsValues.includes(value)
      );

      this.createSolutionForm
        .get('inputFields')
        ?.setValue(updatedSelectedInputFields);
    }
  }
  public modelOfTypeExists(type: string): boolean {
    return this.transferLearningModels.some(model => model.type === type);
  }
  public getModelsByType(type: string): TransferLearningModel[] {
    return this.transferLearningModels.filter(model => model.type === type);
  }
  public toggleTransferLearningSettings(event: MatSlideToggleChange): void {
    this.transferLearningSettingsActive = event.checked;
  }

  public initTransferLearningSettings(): void {
    this.allTransferLearningSettings = [];
    if (!this.availableDatabagInputColumns) return;
    this.availableDatabagInputColumns.forEach(column => {
      const transferLearningSetting = this.fb.group({
        name: [column.name ?? 'Not defined', Validators.required],
        type: [column.type ?? 'Not defined', Validators.required],
        selectedTransferLearningModel: [
          this.defaultTransferLearningModel,
          Validators.required,
        ],
      });
      this.allTransferLearningSettings.push(transferLearningSetting);
    });
    this.updateTransferLearningSettings(); // Um das FormArray beim ersten Initialisieren zu füllen
  }

  public updateTransferLearningSettings(): void {
    const currentNamesInFormArray =
      this.transferLearningSettingsFormArray.controls.map(
        control => (control as FormGroup).get('name')?.value
      );
    const selectedNames = this.inputFields.value;

    // Entfernen Sie FormGroups, die nicht in selectedNames sind
    for (
      let i = this.transferLearningSettingsFormArray.length - 1;
      i >= 0;
      i--
    ) {
      const formGroup = this.transferLearningSettingsFormArray.at(
        i
      ) as FormGroup;
      if (!selectedNames.includes(formGroup.get('name')?.value)) {
        this.transferLearningSettingsFormArray.removeAt(i);
      }
    }

    // Fügen Sie FormGroups hinzu, die in selectedNames sind, aber noch nicht in transferLearningSettingsFormArray
    this.allTransferLearningSettings.forEach(formGroup => {
      if (
        selectedNames.includes(formGroup.get('name')?.value || '') &&
        !currentNamesInFormArray.includes(formGroup.get('name')?.value)
      ) {
        this.transferLearningSettingsFormArray.push(formGroup);
      }
    });
  }
  public onSubmit(): void {
    if (!this.createSolutionForm.valid) return;
    const submitSolution: Solution = {
      name: this.name.value,
      databagId: this.databagId.value,
      inputFields: this.inputFields.value,
      outputFields: this.outputFields.value,
    };
    if (this.transferLearningSettingsActive) {
      submitSolution.transferLearningSettings =
        this.getTransferLearningSettings();
    }
    this.submitSolution.emit(submitSolution);
  }
  private setInitialDatabagId(): void {
    if (this.selectedDatabagId) {
      this.createSolutionForm
        .get('databagId')
        ?.setValue(this.selectedDatabagId);
      this.selectDatabagColumns(this.selectedDatabagId);
    }
  }
  private getTransferLearningSettings(): TransferLearningSetting[] {
    const filteredTransferLearningSettings =
      this.transferLearningSettingsFormArray.controls
        .filter(
          transferLearningSetting =>
            !this.outputFields.value.includes(
              transferLearningSetting.controls.name.value
            )
        )
        .map(
          transferLearningSetting =>
            transferLearningSetting.value as TransferLearningSetting
        );
    return filteredTransferLearningSettings;
  }
}
