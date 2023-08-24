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

  public createSolutionForm: FormGroup;
  public transferLearningSettingsActive = false;
  public defaultTransferLearningModel: TransferLearningModel = {
    label: 'Default Model',
    id: 'default-model',
    origin: 'OS4ML',
  };
  constructor(
    private databagService: DatabagService,
    private fb: FormBuilder
  ) {
    this.createSolutionForm = this.fb.group({
      name: ['', Validators.required],
      databagId: ['', Validators.required],
      selectedFields: ['', Validators.required],
      transferLearningSettings: this.fb.array([]),
    });
  }
  get name(): FormControl {
    return this.createSolutionForm.get('name') as FormControl;
  }
  get databagId(): FormControl {
    return this.createSolutionForm.get('databagId') as FormControl;
  }
  get selectedFields(): AbstractControl {
    return this.createSolutionForm.get('selectedFields') as AbstractControl;
  }
  get transferLearningSettingsFormArray(): FormArray {
    return this.createSolutionForm.get('transferLearningSettings') as FormArray;
  }
  ngOnInit(): void {
    this.setInitialDatabagId();
    this.updateTransferLearningSettings();
  }
  public getFormControl(
    group: AbstractControl,
    controlName: string
  ): FormControl {
    const control = group.get(controlName);
    if (control instanceof FormControl) {
      return control;
    } else {
      throw new Error(`Control ${controlName} is not a FormControl`);
    }
  }
  public modelOfTypeExists(type: string | null): boolean {
    return this.transferLearningModels.some(model => model.type === type);
  }
  public getModelsByType(type: string | null): TransferLearningModel[] {
    return this.transferLearningModels.filter(model => model.type === type);
  }
  public toggleTransferLearningSettings(event: MatSlideToggleChange): void {
    this.transferLearningSettingsActive = event.checked;
  }
  public updateTransferLearningSettings(): void {
    const settings = this.createInitialTransferLearningSettingsFromDatabag(
      this.databagId.value
    );
    this.setInitialTransferLearningSettings(settings);
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
    this.createSolutionForm.get('databagId')?.setValue(this.selectedDatabagId);
  }
  private createInitialTransferLearningSettingsFromDatabag(
    databagId: string
  ): TransferLearningSetting[] {
    const selectedDatabag = this.databagService.getDatabagById(databagId);
    if (!selectedDatabag?.columns) return [];

    return selectedDatabag.columns.map(column => ({
      name: column.name,
      type: column.type,
      selectedTransferLearningModel: this.defaultTransferLearningModel,
    }));
  }
  private setInitialTransferLearningSettings(
    settings: TransferLearningSetting[]
  ): void {
    const settingsArray = this.transferLearningSettingsFormArray;
    settingsArray.clear();
    settings.forEach(setting => {
      const control = this.fb.group(setting);
      settingsArray.push(control);
    });
  }
  private getTransferLearningSettings(): TransferLearningSetting[] {
    const filteredControls =
      this.transferLearningSettingsFormArray.controls.filter(
        control =>
          !this.selectedFields?.value.includes(control.get('name')?.value)
      );
    return filteredControls.map(control => control.value);
  }
  private getUnselectedColumns(selectedColumns: string[]): string[] {
    const allColumnNames =
      this.databagService
        .getDatabagById(this.databagId.value)
        ?.columns?.map(column => column.name!) ?? [];
    return allColumnNames.filter(name => !selectedColumns.includes(name));
  }
}
