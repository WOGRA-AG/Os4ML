import {Component} from '@angular/core';
import {ObjectstoreService} from '../../../../build/openapi/objectstore';
import {JobmanagerService} from '../../../../build/openapi/jobmanager';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineDatabagComponent} from '../dialog-define-databag/dialog-define-databag.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, Observable} from 'rxjs';

@Component({
  selector: 'app-dialog-add-databag',
  templateUrl: './dialog-add-databag.component.html',
  styleUrls: ['./dialog-add-databag.component.scss']
})
export class DialogAddDatabagComponent {
  file: File = new File([], '');
  running: boolean = false;
  uuid: string = uuidv4();
  intervalID: number = 0;

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private _snackbar: MatSnackBar,
              private translate: TranslateService, private objectstoreService: ObjectstoreService,
              private jobmanagerService: JobmanagerService) {
    this.dialogRef.backdropClick().subscribe(() => {
      this.clearProgress().subscribe();
    });
  }

  async nextPageClick(): Promise<void> {
    if (!this.file.name) {
      this.translate.get('error.no_dataset').subscribe((res: string) => {
        this.translate.get('error.confirm').subscribe((conf: string) => {
          this._snackbar.open(res, conf, {duration: 3000});
        });
      });
    }
    const runParams = {
      download_bucket: `${this.uuid}`,
      download_file_name: `${this.file.name}`,
      upload_bucket: `${this.uuid}`
    };

    this.running = true;
    try {
      await firstValueFrom(this.objectstoreService.postNewBucket(this.uuid));
      await firstValueFrom(this.objectstoreService.putObjectByName(this.uuid, this.file.name, this.file));
      const runId: string = await firstValueFrom(
        this.jobmanagerService.postTemplate("download-sniffle-upload", runParams)
      );
      await this.retrievePipelineStatus(runId);
      this.dialogRef.componentInstance.data.uuid = this.uuid;
      this.dialogRef.componentInstance.data.component = DialogDefineDatabagComponent;
    } catch (err: any) {
      this._snackbar.open(err, '', {duration: 3000});
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
    return this.objectstoreService.deleteBucket(this.uuid)
  }

  retrievePipelineStatus(runId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.intervalID = setInterval(() => {
        this.jobmanagerService.getRun(runId).pipe().subscribe(run => {
          if (run.status === 'Failed') {
            clearInterval(this.intervalID);
            this.translate.get('error.run_failed').subscribe((res: string) => {
              reject(run.error || res);
            });
          }
          if (run.status === 'Succeeded') {
            clearInterval(this.intervalID);
            resolve(run.status);
          }
        });
      }, 2000);
    });
  }
}
