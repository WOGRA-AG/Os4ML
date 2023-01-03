import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {catchError, firstValueFrom, Observable, of} from 'rxjs';
import {PipelineStep} from '../../../../models/pipeline-step';
import {HttpClient} from '@angular/common/http';
import {MatStepper} from '@angular/material/stepper';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Databag, ModelmanagerService, Solution, Solver, User} from '../../../../../../build/openapi/modelmanager';
import {PipelineStatus} from '../../../../models/pipeline-status';
import {DialogDynamicComponent} from '../../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {ShortStatusPipe} from '../../../../shared/pipes/short-status.pipe';

@Component({
  selector: 'app-shared-popup-upload',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent {

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
  user: User = {id: '', email: '', rawToken: ''};

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private shortStatus: ShortStatusPipe,
              private translate: TranslateService,
              private modelManager: ModelmanagerService,
              private http: HttpClient,
              private userFacade: UserFacade) {
    this.userFacade.currentUser$.pipe().subscribe(currentUser => {
        this.user = currentUser;
        this.modelManager.getSolvers(currentUser.rawToken).subscribe((solvers: Solver[]) => {
            this.solvers = solvers.filter(solver => solver.pipelineStep === PipelineStep.solver);
            if (this.solution.solver === undefined) {
              this.solution.solver = this.solvers[0].name;
            }
          }
        );
      }
    );
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
        this.databag = await firstValueFrom(this.modelManager.createDatabag(this.user?.rawToken, databagToCreate));
        if (this.file.name && this.databag.databagId !== undefined) {
          await firstValueFrom(
            this.modelManager.uploadDataset(this.databag.databagId, this.user?.rawToken, this.file)
          );
        }
        await this.retrievePipelineStatus();
      } catch (err: any) {
        this.matSnackBar.open(err, '', {duration: 3000});
        if (this.databag.databagId === undefined) {
          return;
        }
        await firstValueFrom(this.modelManager.deleteDatabagById(this.databag.databagId, this.user?.rawToken));
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
      this.modelManager.createSolution(this.user?.rawToken, this.solution)
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
        this.modelManager.getDatabagById(this.databag.databagId, this.user?.rawToken).pipe().subscribe(databag => {
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
      this.modelManager.deleteDatabagById(this.databag.databagId, this.user?.rawToken).subscribe(() => {
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
    return this.modelManager.deleteDatabagById(this.databag.databagId, this.user?.rawToken);
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
    validDatabagName: any,
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
