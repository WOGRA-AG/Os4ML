import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  NewTransferLearningModelDto,
  Solution,
} from '../../../../../build/openapi/modelmanager';
import { MatSelectModule } from '@angular/material/select';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { GetPredictListItemsFromDatabagPipe } from '../../../pipes/get-predict-list-items-from-databag.pipe';
import { GetSolutionByIdPipe } from '../../../pipes/get-solution-by-id.pipe';
@Component({
  selector: 'app-transfer-learning-model-create-form',
  templateUrl: './transfer-learning-model-create-form.component.html',
  styleUrls: ['./transfer-learning-model-create-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NewButtonComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    GetDatabagByIdPipe,
    GetPredictListItemsFromDatabagPipe,
    GetSolutionByIdPipe,
  ],
})
export class TransferLearningModelCreateFormComponent {
  @Input() public solutions: Solution[] = [];
  @Output() public submitNewTransferLearningModel =
    new EventEmitter<NewTransferLearningModelDto>();

  public createTransferLearningModelForm: FormGroup<{
    name: FormControl<string>;
    solutionId: FormControl<string>;
    selectedSolutionInput: FormControl<string>;
  }>;

  constructor(private fb: NonNullableFormBuilder) {
    this.createTransferLearningModelForm = this.fb.group({
      name: ['', Validators.required],
      solutionId: ['', Validators.required],
      selectedSolutionInput: ['', Validators.required],
    });
  }

  get name(): FormControl<string> {
    return this.createTransferLearningModelForm.controls.name;
  }
  get solutionId(): FormControl<string> {
    return this.createTransferLearningModelForm.controls.solutionId;
  }
  get selectedSolutionInput(): FormControl<string> {
    return this.createTransferLearningModelForm.controls.selectedSolutionInput;
  }

  public onSubmit(): void {
    if (!this.createTransferLearningModelForm.valid) return;
    const submitNewTransferlearningModel: NewTransferLearningModelDto = {
      name: this.name.value,
      solutionId: this.solutionId.value,
      selectedSolutionInput: this.selectedSolutionInput.value,
    };
    this.submitNewTransferLearningModel.emit(submitNewTransferlearningModel);
  }
}
