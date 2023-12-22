import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
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
import { RouterLink } from '@angular/router';
import { TransferLearningModelCreateButtonComponent } from '../transfer-learning-model-create-button/transfer-learning-model-create-button.component';
import { IsDatabagDonePipe } from '../../../pipes/is-databag-done.pipe';
import { PipelineStatus } from '../../../models/pipeline-status';

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
    RouterLink,
    TransferLearningModelCreateButtonComponent,
    IsDatabagDonePipe,
  ],
})
export class SolutionCreateFormComponent implements OnInit, OnChanges {
  @Input() public selectedDatabagId: string | undefined;
  @Input() public databags: Databag[] = [];
  @Input() public transferLearningModels: TransferLearningModel[] = [];
  @Output() public addTransferLearningModel = new EventEmitter<void>();
  @Output() public submitSolution = new EventEmitter<Solution>();
  public pipelineStatus = PipelineStatus;

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
      transferLearningSettings: this.fb.array(
        [] as FormGroup<TransferLearningSettingFormGroup>[]
      ),
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
  set transferLearningSettingsFormArray(
    formArray: FormArray<FormGroup<TransferLearningSettingFormGroup>>
  ) {
    this.createSolutionForm.controls.transferLearningSettings = formArray;
  }
  ngOnInit(): void {
    this.setInitialDatabagId();
    this.initTransferLearningSettings();
  }
  ngOnChanges(): void {
    if (this.databags.length === 0) {
      this.databagId.disable();
    } else {
      this.databagId.enable();
    }
  }
  public selectDatabagColumns(databagId: string): void {
    const databag = this.databagService.getDatabagById(databagId);
    if (databag && databag.columns) {
      const databagColumns = databag.columns.filter(column => column.type);
      this.updateDatabagColumns(databagColumns);
      this.outputFields.enable();
      this.inputFields.enable();
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
    this.updateTransferLearningSettings();
  }
  public updateTransferLearningSettings(): void {
    const currentNamesInFormArray = this.getNamesFromFormArray(
      this.transferLearningSettingsFormArray
    );
    const selectedNames = this.inputFields.value;
    this.removeUnselectedTransferLearningSettings(selectedNames);
    this.addNewSelectedTransferLearningSettings(
      selectedNames,
      currentNamesInFormArray
    );
    this.sortTransferLearningSettingsByOrder(this.inputFields.value);
  }
  public updateDatabagColumns(databagColumns: Column[]): void {
    const validOutputTypes = ['text', 'category', 'numerical'];
    this.allDatabagColumns = [...databagColumns];
    this.availableDatabagOutputColumns = databagColumns.filter(column =>
      validOutputTypes.includes(column?.type || '')
    );
    this.availableDatabagInputColumns = databagColumns;
    const selectedInputColumns = databagColumns
      .filter(column => column.name !== undefined)
      .map(column => column.name as string);
    this.inputFields.setValue(selectedInputColumns);
  }

  public updateAvailableDatabagInputColumns(): void {
    if (!this.allDatabagColumns?.length) return;
    const outputFieldsValues = this.outputFields.value || [];
    this.updateAvailableInputColumns(outputFieldsValues);
  }
  public onSubmit(): void {
    if (!this.createSolutionForm.valid) return;
    const submitSolution: Solution = {
      name: this.name.value,
      databagId: this.databagId.value,
      inputFields: this.inputFields.value.filter(
        inputField => !this.outputFields.value.includes(inputField)
      ),
      outputFields: this.outputFields.value,
    };
    if (this.transferLearningSettingsActive) {
      submitSolution.transferLearningSettings =
        this.getTransferLearningSettings();
    }
    this.submitSolution.emit(submitSolution);
  }
  private updateAvailableInputColumns(outputFieldsValues: string[]): void {
    this.availableDatabagInputColumns = (this.allDatabagColumns || []).filter(
      column => !column.name || !outputFieldsValues.includes(column.name)
    );
  }
  private getNamesFromFormArray(
    transferLearningSettingsFormArray: FormArray<
      FormGroup<TransferLearningSettingFormGroup>
    >
  ): string[] {
    return transferLearningSettingsFormArray.controls.map(
      transferLearningSettings => transferLearningSettings.controls.name.value
    );
  }
  private removeUnselectedTransferLearningSettings(
    selectedNames: string[]
  ): void {
    const filteredFormControls =
      this.transferLearningSettingsFormArray.controls.filter(
        transferLearningSetting =>
          selectedNames.includes(transferLearningSetting.controls.name.value)
      );
    this.transferLearningSettingsFormArray = new FormArray(
      filteredFormControls
    );
  }
  private addNewSelectedTransferLearningSettings(
    selectedNames: string[],
    currentNamesInFormArray: string[]
  ): void {
    this.allTransferLearningSettings.forEach(
      transferLearningSettingFormGroup => {
        const nameValue = transferLearningSettingFormGroup.controls.name.value;
        if (
          selectedNames.includes(nameValue) &&
          !currentNamesInFormArray.includes(nameValue)
        ) {
          this.transferLearningSettingsFormArray.push(
            transferLearningSettingFormGroup
          );
        }
      }
    );
  }
  private sortTransferLearningSettingsByOrder(order: string[]): void {
    const controlsMap = new Map<
      string,
      FormGroup<TransferLearningSettingFormGroup>
    >();
    this.transferLearningSettingsFormArray.controls.forEach(
      transferLearningSettings => {
        const name = transferLearningSettings.controls.name.value;
        controlsMap.set(name, transferLearningSettings);
      }
    );
    const sortedControls = order
      .map(name => controlsMap.get(name))
      .filter(transferLearningSetting => transferLearningSetting);
    this.transferLearningSettingsFormArray.clear();
    sortedControls.forEach(transferLearningSetting => {
      if (!transferLearningSetting) {
        return;
      }
      this.transferLearningSettingsFormArray.push(transferLearningSetting);
    });
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
  private setInitialDatabagId(): void {
    if (this.selectedDatabagId) {
      this.databagId.setValue(this.selectedDatabagId);
      this.selectDatabagColumns(this.selectedDatabagId);
    } else {
      this.outputFields.disable();
      this.inputFields.disable();
    }
  }
}
