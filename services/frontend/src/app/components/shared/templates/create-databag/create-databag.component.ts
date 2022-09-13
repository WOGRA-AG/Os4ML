import {Component} from '@angular/core';
import {
  Databag,
  ObjectstoreService
} from '../../../../../../build/openapi/objectstore';
import {JobmanagerService, RunParams} from '../../../../../../build/openapi/jobmanager';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {PopupDatabagComponent} from '../../organisms/popup-databag/popup-databag.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {catchError, firstValueFrom, Observable, of} from 'rxjs';
import {PipelineStatus} from '../../../../models/pipeline-status';
import {HttpClient} from '@angular/common/http';

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
  pipelineStatus: string | null | undefined = null;
  urlRgex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private translate: TranslateService, private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService, private http: HttpClient) {}

  async nextPageClick(): Promise<void> {
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
        this.jobmanagerService.postTemplate('init-databag-sniffle-upload', runParams)
      );
      this.pipelineStatus = this.translate.instant('dialog.add_databag.placeholder_status');
      await this.retrievePipelineStatus(this.runId);
      this.dialogRef.componentInstance.data.component = PopupDatabagComponent;
    } catch (err: any) {
      this.matSnackBar.open(err, '', {duration: 3000});
      await firstValueFrom(this.objectstoreService.deleteDatabag(this.uuid));
    } finally {
      this.running = false;
    }
  }

  close(): void {
    this.clearProgress().subscribe(() => {
      this.dialogRef.close();
    });
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
          if (run.status === PipelineStatus.running) {
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
          }
          if (run.status === PipelineStatus.failed) {
            clearInterval(this.intervalID);
            this.translate.get('error.run_failed').subscribe((res: string) => {
              reject(run.error || res);
            });
          }
          if (run.status === PipelineStatus.succeeded) {
            clearInterval(this.intervalID);
            resolve(run.status);
          }
        });
      }, 2000);
    });
  }
}
