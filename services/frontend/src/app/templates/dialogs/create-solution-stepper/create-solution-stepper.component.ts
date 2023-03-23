import { Component, OnDestroy, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Subject, takeUntil } from 'rxjs';
import { SolutionService } from 'src/app/solutions/services/solution.service';
import {
  Databag,
  Solution,
  Solver,
} from '../../../../../build/openapi/modelmanager';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { ChooseSolverComponent } from '../../../solutions/components/choose-solver/choose-solver.component';
import { NgClass, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ChooseDatabagColumnComponent } from '../../../solutions/components/choose-databag-column/choose-databag-column.component';
import { DialogSectionComponent } from '../../../shared/components/molecules/dialog-section/dialog-section.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogHeaderComponent } from '../../../shared/components/molecules/dialog-header/dialog-header.component';

@Component({
  selector: 'app-create-solution-stepper',
  templateUrl: './create-solution-stepper.component.html',
  styleUrls: ['./create-solution-stepper.component.scss'],
  standalone: true,
  imports: [
    DialogHeaderComponent,
    MatStepperModule,
    MatIconModule,
    MatDialogModule,
    DialogSectionComponent,
    ChooseDatabagColumnComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    ChooseSolverComponent,
    NgIf,
    ButtonComponent,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
})
export class CreateSolutionStepperComponent implements OnDestroy {
  public databag: Databag = {};
  public solution: Solution = {};
  public submitting = false;
  public stepperStep = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CreateSolutionStepperComponent>,
    private solutionService: SolutionService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      databag: Databag;
    }
  ) {
    this.dialogRef.disableClose = true;
    this.databag = data.databag;
  }

  onSubmit(): void {
    if (!this.databag || !this.databag.id || !this.databag.databagName) {
      this.close();
      return;
    }
    this.submitting = true;
    this.solutionService
      .createSolution(this.solution, this.databag)
      .pipe(takeUntil(this.destroy$))
      .subscribe(solution => {
        this.submitting = false;
        this.dialogRef.close(solution);
      });
  }

  nextPageClick(stepper: MatStepper): void {
    this.stepperStep = 1;
    stepper.next();
  }

  selectOutputColumn(columnName: string): void {
    this.solution.outputFields = [columnName];
  }

  close(): void {
    this.dialogRef.close();
  }

  back(stepper: MatStepper): void {
    stepper.previous();
    this.stepperStep -= 1;
  }

  selectSolver(solver: Solver): void {
    this.solution.solver = solver.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
