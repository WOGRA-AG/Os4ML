import {Component} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {
  DialogDynamicComponent
} from '../../../dialog-dynamic/dialog-dynamic.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {catchError, firstValueFrom, Observable, of} from 'rxjs';
import {PipelineStep} from '../../../../models/pipeline-step';
import {HttpClient} from '@angular/common/http';
import {MatStepper} from '@angular/material/stepper';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Databag, ModelmanagerService, Solution, Solver, User} from '../../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-shared-popup-upload',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent {

  file: File = new File([], '');
  fileUrl = '';
  running = false;
  uuid: string = uuidv4();
  runId = '';
  databagName = '';
  intervalID = 0;
  stepperStep = 0;
  pipelineStatus: string | null | undefined = null;
  urlRgex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  databag: Databag = {};
  solution: Solution = {};
  solvers: Solver[] = [];
  submitting = false;
  user: User = {id: '', email: '', rawToken: ''};

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
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
          databagName: this.file.name ? this.file.name : this.fileUrl,
        };
        await firstValueFrom(this.modelManager.createDatabag(this.user?.rawToken, databagToCreate));
        if (this.file.name) {
          await firstValueFrom(
            this.modelManager.uploadDataset(this.uuid, this.user?.rawToken, this.file)
          );
        }
        this.pipelineStatus = this.translate.instant('message.pipeline.default');
        this.modelManager.getDatabagById(this.uuid, this.user?.rawToken).subscribe((databag: Databag) => {
          this.databag = databag;
          this.databag.databagName = this.databagName;
          this.modelManager.updateDatabagById(this.uuid, this.user?.rawToken, this.databag).subscribe(() => {
          });
        });
      } catch (err: any) {
        this.matSnackBar.open(err, '', {duration: 3000});
        await firstValueFrom(this.modelManager.deleteDatabagById(this.uuid, this.user?.rawToken));
      } finally {
        this.running = false;
        this.pipelineStatus = null;
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
      this.modelManager.createSolution(this.user?.rawToken, this.solution)
        .pipe(
          catchError(err => {
            this.submitting = false;
            return of('');
          })
        ).subscribe(runId => {
        this.submitting = false;
        this.dialogRef.close();
      });
    }
    stepper.next();
    this.stepperStep += 1;
    this.submitting = false;
  }


  back(stepper: MatStepper): void {
    if (this.stepperStep === 1) {
      this.modelManager.deleteDatabagById(this.uuid, this.user?.rawToken);
      this.uuid = uuidv4();
      this.solution = {};
      this.solvers = [];
    }
    stepper.previous();
    this.stepperStep -= 1;
  }

  close(): void {
    this.modelManager.deleteDatabagById(this.uuid, this.user?.rawToken).subscribe(() => {
      this.dialogRef.close();
    });
  }

  clearProgress(): Observable<void> {
    if (this.intervalID > 0) {
      clearInterval(this.intervalID);
    }
    return this.modelManager.deleteDatabagById(this.uuid, this.user?.rawToken);
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
        this.pipelineStatus = 'Url is ignored!';
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
