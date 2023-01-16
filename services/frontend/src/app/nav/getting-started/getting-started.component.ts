import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {catchError, firstValueFrom, Observable, of} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import { Databag, Solution, Solver } from 'build/openapi/modelmanager';
import { DialogDynamicComponent } from 'src/app/shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { DatabagService } from 'src/app/databags/services/databag.service';
import { SolutionService } from 'src/app/solutions/services/solution.service';
import { SolverService } from 'src/app/solutions/services/solver.service';
import { ShortStatusPipe } from 'src/app/shared/pipes/short-status.pipe';
import { PipelineStatus } from 'src/app/core/models/pipeline-status';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent {

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

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private databagService: DatabagService,
              private solutionService: SolutionService,
              private solverService: SolverService,
              private shortStatus: ShortStatusPipe,
              private translate: TranslateService) {
    this.solvers$ = this.solverService.solvers$;
  }

  async next(stepper: MatStepper): Promise<void> {
    this.submitting = true;

    if (this.stepperStep === 0) {
      if (!(this.file.name || this.fileUrl)) {
        this.translate.get('message.no_dataset').subscribe((res: string) => {
          this.translate.get('action.confirm').subscribe((conf: string) => {
            this.matSnackBar.open(res, conf, {duration: 3000});
          });
        });
        return;
      }

      this.running = true;
      try {
        const databagToCreate: Databag = {
          fileName: this.file.name ? this.file.name : this.fileUrl,
          databagName: this.databagName,
        };
        this.databag = await firstValueFrom(this.databagService.createDatabag(databagToCreate));
        if (this.file.name && this.databag.databagId !== undefined) {
          await firstValueFrom(
            this.databagService.uploadDataset(this.databag.databagId, this.file)
          );
        }
        await this.retrievePipelineStatus();
      } catch (err: any) {
        this.matSnackBar.open(err, '', {duration: 3000});
        if (this.databag.databagId === undefined) {
          return;
        }
        await firstValueFrom(this.databagService.deleteDatabagById(this.databag.databagId));
      } finally {
        this.running = false;
      }
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

  retrievePipelineStatus(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.intervalID = setInterval(() => {
        if (this.databag.databagId === undefined) {
          return;
        }
        this.databagService.getDatabagById(this.databag.databagId).subscribe(databag => {
          this.databag = databag;
          switch (this.shortStatus.transform(this.databag.status)) {
            case PipelineStatus.error:
              this.clearIntervalSafe();
              reject();
              break;
            case PipelineStatus.done:
              clearInterval(this.intervalID);
              resolve();
              break;
          }
        });
      }, 2000);
    });
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

  private getInputFields(): string[] | undefined {
    return this.databag.columns?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(columnName => columnName && !this.solution.outputFields?.includes(columnName));
  }
}
