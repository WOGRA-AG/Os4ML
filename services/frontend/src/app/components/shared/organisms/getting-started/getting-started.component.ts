import {Component} from '@angular/core';
import {Databag, ObjectstoreService} from '../../../../../../build/openapi/objectstore';
import {JobmanagerService, RunParams, PipelineTemplate, Solution} from '../../../../../../build/openapi/jobmanager';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {catchError, firstValueFrom, map, mergeMap, Observable, of} from 'rxjs';
import {PipelineStatus} from '../../../../models/pipeline-status';
import {PipelineStep} from '../../../../models/pipeline-step';
import {HttpClient} from '@angular/common/http';
import {MatStepper} from '@angular/material/stepper';

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
  intervalID = 0;
  stepperStep = 0;
  pipelineStatus: string | null | undefined = null;
  urlRgex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  databag: Databag = {};
  solution: Solution = {};
  solvers: PipelineTemplate[] = [];
  submitting = false;

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private translate: TranslateService, private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService, private http: HttpClient) {
    this.jobmanagerService.getAllPipelineTemplates().subscribe((templates: PipelineTemplate[]) => {
        this.solvers = templates.filter(template => template.pipelineStep === PipelineStep.solver);
        if (this.solution.solver === undefined) {
          this.solution.solver = this.solvers[0].name;
        }
      }
    );
  }

  async next(stepper: MatStepper): Promise<void> {
    if (this.stepperStep === 0) {
      if (!(this.file.name || this.fileUrl)) {
        this.translate.get('error.no_dataset').subscribe((res: string) => {
          this.translate.get('error.confirm').subscribe((conf: string) => {
            this.matSnackBar.open(res, conf, {duration: 3000});
          });
        });
        return;
      }

      this.running = true;
      const runParams: RunParams = {
        bucket: '',
        databagId: this.uuid,
        fileName: this.file.name ? this.file.name : this.fileUrl
      };
      try {
        await firstValueFrom(this.objectstoreService.postNewDatabag(this.uuid));
        if (this.file.name) {
          await firstValueFrom(
            this.objectstoreService.putDatasetByDatabagId(this.uuid, `${this.file.name}`, this.file)
          );
        }
        this.runId = await firstValueFrom(
          this.jobmanagerService.postTemplate('init-databag-sniffle-upload', runParams)
        );
        this.pipelineStatus = this.translate.instant('dialog.add_databag.placeholder_status');
        await this.retrievePipelineStatus(this.runId);
        this.objectstoreService.getDatabagById(this.uuid).subscribe((databag: Databag) => {
          this.databag = databag;
        });
      } catch (err: any) {
        this.matSnackBar.open(err, '', {duration: 3000});
        await firstValueFrom(this.objectstoreService.deleteDatabag(this.uuid));
      } finally {
        this.running = false;
        this.pipelineStatus = null;
      }
    }

    if (this.stepperStep === 1) {
      this.objectstoreService.putDatabagById(this.uuid, this.databag).subscribe(() => {
      });
    }

    if (this.stepperStep === 2) {
      this.solution.inputFields = this.getInputFields();
    }

    if (this.stepperStep === 3) {
      if (!this.databag || !this.databag.databagId || !this.databag.databagName) {
        return;
      }
      this.submitting = true;
      this.solution.status = 'Created';
      this.solution.databagId = this.databag.databagId;
      this.solution.databagName = this.databag.databagName;
      this.jobmanagerService.postSolution(this.solution)
        .pipe(
          catchError(err => {
            this.submitting = false;
            return of('');
          })
        ).subscribe( runId => {
        this.solution.runId = runId;
        this.submitting = false;
      });
      this.dialogRef.close();
    }
    stepper.next();
    this.stepperStep += 1;
  }


  back(stepper: MatStepper): void {
    if (this.stepperStep === 1) {
      this.objectstoreService.deleteDatabag(this.uuid);
      this.uuid = uuidv4();
      this.solution = {};
      this.solvers = [];
    }
    stepper.previous();
    this.stepperStep -= 1;
  }

  close(): void {
    this.objectstoreService.deleteDatabag(this.uuid).subscribe(() => {
      this.dialogRef.close();
    });
  }

  clearProgress(): Observable<void> {
    if (this.intervalID > 0) {
      clearInterval(this.intervalID);
    }
    return this.objectstoreService.deleteDatabag(this.uuid);
  }

  selectPrediction(columnName: string | undefined) {
    if (!columnName) {
      return;
    }
    else {
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

  selectSolver(solver: PipelineTemplate) {
    this.solution.solver = solver.name;
  }

  retrievePipelineStatus(runId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.intervalID = setInterval(() => {
        this.jobmanagerService.getRun(runId).pipe().subscribe(run => {
          switch (run.status) {
            case PipelineStatus.running:
              this.objectstoreService.getDatabagByRunId(runId)
                .pipe(
                  catchError(err => of({} as Databag)
                  )
                )
                .subscribe((databag) => {
                  if (databag.status) {
                    this.pipelineStatus = databag.status;
                  }
                });
              break;
            case PipelineStatus.failed:
              clearInterval(this.intervalID);
              this.objectstoreService.getDatabagByRunId(runId)
                .pipe(
                  catchError(err => of({} as Databag)),
                  map(databag => {
                    if (!databag.errorMsgKey) {
                      return 'error.error_msg_key.default';
                    }
                    return `error.error_msg_key.${databag.errorMsgKey}`;
                  }),
                  mergeMap((toTranslate) => this.translate.get(toTranslate))
                )
                .subscribe((rejectMsg) => {
                  reject(rejectMsg);
                });
              break;
            case PipelineStatus.succeeded:
              clearInterval(this.intervalID);
              resolve(run.status);
              break;
          }
        });
      }, 2000);
    });
  }

  private getInputFields(): string[] | undefined {
    return this.databag.columns?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(columnName => columnName && !this.solution.outputFields?.includes(columnName));
  }
}
