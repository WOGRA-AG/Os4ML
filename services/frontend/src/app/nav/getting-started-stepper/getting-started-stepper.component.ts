import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {catchError, Observable, of} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import { CreateDatabagComponent } from 'src/app/databags/components/create-databag/create-databag.component';
import { Databag, Solution, Solver } from 'build/openapi/modelmanager';
import { DialogDynamicComponent } from 'src/app/shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { DatabagService } from 'src/app/databags/services/databag.service';
import { SolutionService } from 'src/app/solutions/services/solution.service';
import { SolverService } from 'src/app/solutions/services/solver.service';

@Component({
  selector: 'app-getting-started-stepper',
  templateUrl: './getting-started-stepper.component.html',
  styleUrls: ['./getting-started-stepper.component.scss']
})
export class GettingStartedStepperComponent {

  solvers$: Observable<Solver[]>;

  file: File = new File([], '');
  fileUrl = '';
  running = false;
  runId = '';
  databagName = '';
  intervalID = 0;
  stepperStep = 0;
  urlRgex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  databag: Databag = {};
  solution: Solution = {};
  solvers: Solver[] = [];
  submitting = false;

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>,
              private databagService: DatabagService,
              private solutionService: SolutionService,
              private solverService: SolverService) {
    this.solvers$ = this.solverService.solvers$;
  }

  async next(stepper: MatStepper): Promise<void> {
    this.submitting = true;

    // TODO make switch case statement
    if (this.stepperStep === 0) {
      this.running = true; // TODO are submitting and running needed or is one sufficient
      // await createDatabagComponent.createDatabag();
      this.running = false;
    }

    if (this.stepperStep === 1) {
      this.solution.inputFields = this.getInputFields();
    }

    if (this.stepperStep === 2) {
      if (!this.databag || !this.databag.databagId || !this.databag.databagName) {
        return;
      }
      this.submitting = true;
      this.solution.status = 'Created';
      this.solution.databagId = this.databag.databagId;
      this.solution.databagName = this.databag.databagName;
      this.solution.metrics = [];
      this.solutionService.createSolution(this.solution)
        .pipe(
          catchError(() => {
            this.submitting = false;
            return of('');
          })
        ).subscribe(() => {
        this.submitting = false;
        this.dialogRef.close();
      });
    }
    stepper.next();
    this.stepperStep += 1;
    this.submitting = false;
  }

  back(stepper: MatStepper): void {
    this.clearIntervalSafe();
    if (this.stepperStep === 1 && this.databag.databagId !== undefined) {
      this.databagService.deleteDatabagById(this.databag.databagId).subscribe(() => {
        this.solution = {};
        this.solvers = [];
        stepper.previous();
        this.stepperStep -= 1;
      });
    } else {
      stepper.previous();
      this.stepperStep -= 1;
    }
  }

  close(): void {
    this.clearProgress().subscribe(() => {
      this.dialogRef.close();
    });
  }

  clearIntervalSafe(): void {
    if (this.intervalID > 0) {
      clearInterval(this.intervalID);
    }
  }

  clearProgress(): Observable<void> {
    this.clearIntervalSafe();
    if (this.databag.databagId === undefined) {
      return of(undefined);
    }
    return this.databagService.deleteDatabagById(this.databag.databagId);
  }

  selectPrediction(columnName: string | undefined) {
    if (!columnName) {
      return;
    } else {
      this.solution = {};
    }

    const outputFields = this.solution.outputFields || [];
    const columnIndex = outputFields.indexOf(columnName);
    if (columnIndex === -1) {
      outputFields.push(columnName);
    } else {
      outputFields.splice(columnIndex, 1);
    }
    this.solution.outputFields = outputFields;
  }

  selectSolver(solver: Solver) {
    this.solution.solver = solver.name;
  }

  isDisabled(
    file: any,
    dbUrl: any,
    validSolutionName: any) {
    if (this.submitting) {
      return false;
    }
    if (this.stepperStep === 0) {
      if (file.name && ((dbUrl?.valid && dbUrl?.value?.length > 0))) {
        this.databag.status = 'message.pipeline.running.url_is_ignored';
        return false;
      } else {
        return !(this.databagName !== '' && (file.name || ((dbUrl?.valid && dbUrl?.value?.length > 0))));
      }
    }
    if (this.stepperStep === 1) {
      return !(this.solution.outputFields);
    }
    if (this.stepperStep === 2) {
      return !(validSolutionName && this.solution.solver);
    }
    return false;
  }

  databagUpdate(databag: any) {
    this.databag = databag;
  }

  private getInputFields(): string[] | undefined {
    return this.databag.columns?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(columnName => columnName && !this.solution.outputFields?.includes(columnName));
  }

}
