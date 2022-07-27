import {Component} from '@angular/core';
import {ObjectstoreService} from '../../../../build/openapi/objectstore';
import {JobmanagerService, RunParams} from '../../../../build/openapi/jobmanager';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineDatabagComponent} from '../dialog-define-databag/dialog-define-databag.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, Observable} from 'rxjs';
import {PipelineStatus} from '../../models/pipeline-status';

@Component({
  selector: 'app-dialog-add-databag',
  templateUrl: './dialog-add-databag.component.html',
  styleUrls: ['./dialog-add-databag.component.scss']
})
export class DialogAddDatabagComponent {
  file: File = new File([], '');
  fileUrl = '';
  running = false;
  uuid: string = uuidv4();
  intervalID = 0;
  urlRgex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private translate: TranslateService, private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService) {
    this.dialogRef.backdropClick().subscribe(() => {
      this.clearProgress().subscribe();
    });
  }

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
    let runId = '';
    const runParams: RunParams = {
      bucket: this.uuid,
      fileName: this.file.name ? this.file.name : this.fileUrl
    };
    try {
      await firstValueFrom(this.objectstoreService.postNewBucket(this.uuid));
      if (this.file.name) {
        await firstValueFrom(this.objectstoreService.putObjectByName(this.uuid, this.file.name, this.file));
      }
      runId = await firstValueFrom(
        this.jobmanagerService.postTemplate('init-databag-sniffle-upload', runParams)
      );
      await this.retrievePipelineStatus(runId);
      this.dialogRef.componentInstance.data.component = DialogDefineDatabagComponent;
    } catch (err: any) {
      this.matSnackBar.open(err, '', {duration: 3000});
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
    return this.objectstoreService.deleteBucket(this.uuid);
  }

  retrievePipelineStatus(runId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.intervalID = setInterval(() => {
        this.jobmanagerService.getRun(runId).pipe().subscribe(run => {
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
