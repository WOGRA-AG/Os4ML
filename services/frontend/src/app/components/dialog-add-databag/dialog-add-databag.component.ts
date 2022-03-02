import {Component} from '@angular/core';
import {Item, ObjectstoreService} from '../../../../build/openapi/objectstore';
import {v4 as uuidv4} from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../dialog-dynamic/dialog-dynamic.component';
import {DialogDefineDatabagComponent} from '../dialog-define-databag/dialog-define-databag.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom} from 'rxjs';
import {CreatePipeline, CreateRun, Experiment, JobmanagerService} from '../../../../build/openapi/jobmanager';

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
      if (this.intervalID > 0) {
        clearInterval(this.intervalID);
      }
      this.objectstoreService.deleteBucket(this.uuid).subscribe(() => {
      });
    });
  }

  uploadFile(file: File): void {
    this.file = file;
  }

  async nextPageClick(): Promise<void> {
    if (this.file.size === 0) {
      this.translate.get('error.no_dataset').subscribe((res: string) => {
        this.translate.get('error.confirm').subscribe((conf: string) => {
          this._snackbar.open(res, conf, {duration: 3000});
        });
      });
    }
    const objectstore_url: string = 'http://os4ml-objectstore-manager.os4ml:8000/apis/v1beta1';
    const experiment: Experiment = {name: `experiment_${this.uuid}`, description: `desc_${this.uuid}`};
    const create_run: CreateRun = {
      name: `run_analyze_${this.uuid}`,
      description: `${this.uuid}`,
      params: {download_bucket: `${this.uuid}`, download_file_name: `${this.file.name}`, upload_bucket: `${this.uuid}`}
    };
    this.running = true;
    await firstValueFrom(this.objectstoreService.postNewBucket(this.uuid));
    const item: Item = await firstValueFrom(this.objectstoreService.putObjectByName(this.uuid, this.file.name, this.file));
    const file_url: string = `${objectstore_url}/objectstore/templates/object/download-sniffle-upload.yaml`;
    const exp_id: string = await firstValueFrom(this.jobmanagerService.postExperiment(experiment));
    const pipeline: CreatePipeline = {
      name: `analyze_${this.uuid}`,
      description: `${this.uuid}`,
      config_url: `${file_url}`
    };
    const pipe_id: string = await firstValueFrom(this.jobmanagerService.postPipeline(pipeline));
    const run_id: string = await firstValueFrom(this.jobmanagerService.postRun(exp_id, pipe_id, create_run));
    const run_prom: Promise<boolean> = new Promise<boolean>(resolve => {
      this.intervalID = setInterval(() => {
        this.jobmanagerService.getRun(run_id).pipe().subscribe(run => {
          if (run.status === 'Succeeded') {
            resolve(false);
            clearInterval(this.intervalID);
          }
        });
      }, 2000);
    });
    this.running = await run_prom;
    this.dialogRef.componentInstance.data.uuid = this.uuid;
    this.dialogRef.componentInstance.data.component = DialogDefineDatabagComponent;
    return;
  }

  close(): void {
    this.stopInterval();
    this.objectstoreService.deleteBucket(this.uuid).pipe().subscribe(() => {
      this.dialogRef.close();
    });
  }

  stopInterval(): void {
    if (this.intervalID > 0) {
      clearInterval(this.intervalID);
    }
  }
}
