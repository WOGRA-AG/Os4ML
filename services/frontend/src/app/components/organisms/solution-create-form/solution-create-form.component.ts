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
    selectedFields: FormControl<string[]>;
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
  };
  constructor(
    private databagService: DatabagService,
    private fb: NonNullableFormBuilder
  ) {
    this.createSolutionForm = this.fb.group({
      name: ['', Validators.required],
      databagId: ['', Validators.required],
      selectedFields: [[] as string[], Validators.required],
      transferLearningSettings: this.fb.array([] as FormGroup[]),
    });
  }
  get name(): FormControl<string> {
    return this.createSolutionForm.controls.name;
  }
  get databagId(): FormControl<string> {
    return this.createSolutionForm.controls.databagId;
  }
  get selectedFields(): FormControl<string[]> {
    return this.createSolutionForm.controls.selectedFields;
  }
  get transferLearningSettingsFormArray(): FormArray<
    FormGroup<TransferLearningSettingFormGroup>
  > {
    return this.createSolutionForm.controls.transferLearningSettings;
  }
  ngOnInit(): void {
    this.setInitialDatabagId();
    this.updateTransferLearningSettings();
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
  public updateTransferLearningSettings(): void {
    this.transferLearningSettingsFormArray.clear();
    const selectedDatabag = this.databagService.getDatabagById(
      this.databagId.value
    );
    if (!selectedDatabag?.columns) return;
    selectedDatabag.columns.forEach(column => {
      const transferLearningSetting = this.fb.group({
        name: [column.name ?? 'Not defined', Validators.required],
        type: [column.type ?? 'Not defined', Validators.required],
        selectedTransferLearningModel: [
          this.defaultTransferLearningModel,
          Validators.required,
        ],
      });
      this.transferLearningSettingsFormArray.push(transferLearningSetting);
    });
  }
  public onSubmit(): void {
    if (!this.createSolutionForm.valid) return;
    const submitSolution: Solution = {
      name: this.name.value,
      databagId: this.databagId.value,
      outputFields: this.selectedFields.value,
      inputFields: this.getUnselectedColumns(this.selectedFields.value),
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
    }
  }
  private getTransferLearningSettings(): TransferLearningSetting[] {
    const filteredTransferLearningSettings =
      this.transferLearningSettingsFormArray.controls
        .filter(
          transferLearningSetting =>
            !this.selectedFields.value.includes(
              transferLearningSetting.controls.name.value
            )
        )
        .map(
          transferLearningSetting =>
            transferLearningSetting.value as TransferLearningSetting
        );
    return filteredTransferLearningSettings;
  }
  private getUnselectedColumns(selectedColumns: string[]): string[] {
    const allColumnNames =
      this.databagService
        .getDatabagById(this.databagId.value)
        ?.columns?.map(column => column.name!) ?? [];
    return allColumnNames.filter(name => !selectedColumns.includes(name));
  }
}
