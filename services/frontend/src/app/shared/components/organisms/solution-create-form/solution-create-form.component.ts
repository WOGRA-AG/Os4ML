import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Column,
  Databag,
  Solution,
} from '../../../../../../build/openapi/modelmanager';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';
import { SelectableListComponent } from '../../molecules/selectable-list/selectable-list.component';
import { GetPredictListItemsFromDatabagPipe } from '../../../pipes/get-predict-list-items-from-databag.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf, NgIf } from '@angular/common';
import { GetDatabagByIdPipe } from '../../../pipes/get-databag-by-id.pipe';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';

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
    SelectableListComponent,
    GetPredictListItemsFromDatabagPipe,
    TranslateModule,
    NgIf,
    NgForOf,
    GetDatabagByIdPipe,
    ButtonComponent,
    SolutionCreateButtonComponent,
    NewButtonComponent,
  ],
})
export class SolutionCreateFormComponent implements OnInit {
  @Input() public selectedDatabagId: string | undefined;
  @Input() public databags: Databag[] = [];
  @Output() public submitSolution = new EventEmitter<Solution>();

  public createSolutionForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createSolutionForm = this.fb.group({
      name: ['', Validators.required],
      databagId: ['', Validators.required],
      selectedFields: ['', Validators.required],
    });
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

  ngOnInit(): void {
    this.createSolutionForm.get('databagId')?.setValue(this.selectedDatabagId);
  }
  public onSubmit(): void {
    if (this.createSolutionForm.valid) {
      const submitSolution: Solution = {
        name: this.name?.value,
        databagId: this.databagId?.value,
        outputFields: this.selectedFields?.value,
        inputFields: this.getUnselectedColumns(this.selectedFields?.value),
      };
      this.submitSolution.emit(submitSolution);
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
