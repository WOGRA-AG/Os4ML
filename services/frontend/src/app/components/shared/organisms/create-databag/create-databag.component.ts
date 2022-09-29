import {
  Component,
} from '@angular/core';
import {
  Databag,
  ObjectstoreService
} from '../../../../../../build/openapi/objectstore';
import {JobmanagerService, RunParams} from '../../../../../../build/openapi/jobmanager';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {catchError, firstValueFrom, map, mergeMap, Observable, of} from 'rxjs';
import {PipelineStatus} from '../../../../models/pipeline-status';
import {HttpClient} from '@angular/common/http';
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-shared-popup-upload',
  templateUrl: './create-databag.component.html',
  styleUrls: ['./create-databag.component.scss']
})
export class CreateDatabagComponent {

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

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private translate: TranslateService, private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService, private http: HttpClient) {}

  async nextClick(stepper: MatStepper): Promise<void> {
    if (!(this.file.name || this.fileUrl)) {
      this.translate.get('error.no_dataset').subscribe((res: string) => {
        this.translate.get('error.confirm').subscribe((conf: string) => {
          this.matSnackBar.open(res, conf, {duration: 3000});
        });
      });
      return;
    }

    this.dialogRef.componentInstance.data.uuid = this.uuid;
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
        this.jobmanagerService.postTemplate('databag', runParams)
      );
      this.pipelineStatus = this.translate.instant('message.pipeline.default');
      await this.retrievePipelineStatus(this.runId);
      this.objectstoreService.getDatabagById(this.uuid).subscribe((databag: Databag) => {
        this.databag = databag;
      });
    } catch (err: any) {
      this.matSnackBar.open(err, '', {duration: 3000});
    } finally {
      this.running = false;
      this.pipelineStatus = null;
      this.stepperStep = 1;
      stepper.next();
    }
  }

  clearProgress(): Observable<void> {
    if (this.intervalID > 0) {
      clearInterval(this.intervalID);
    }
    return this.objectstoreService.deleteDatabag(this.uuid);
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

  back(stepper: MatStepper): void {
    this.objectstoreService.deleteDatabag(this.uuid).pipe().subscribe(() => {
      stepper.previous();
      this.stepperStep -= 1;
    });
  }

  onSubmit(): void {
    this.objectstoreService.putDatabagById(this.uuid, this.databag).subscribe(() => {
      this.dialogRef.close();
    });
  }

  close(): void {
    this.objectstoreService.deleteDatabag(this.uuid).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
