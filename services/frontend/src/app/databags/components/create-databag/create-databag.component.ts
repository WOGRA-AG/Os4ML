import {Component,} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, Observable, of} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import {Databag} from '../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {ShortStatusPipe} from '../../../shared/pipes/short-status.pipe';
import {DatabagService} from '../../services/databag.service';
import {PipelineStatus} from '../../../models/pipeline-status';

@Component({
  selector: 'app-create-databag',
  templateUrl: './create-databag.component.html',
  styleUrls: ['./create-databag.component.scss']
})
export class CreateDatabagComponent {

  file: File = new File([], '');
  fileUrl = '';
  running = false;
  intervalID = 0;
  stepperStep = 0;
  urlRgex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  databag: Databag = {};

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private shortStatus: ShortStatusPipe,
              private translate: TranslateService,
              private databagService: DatabagService) {
  }

  async nextClick(stepper: MatStepper): Promise<void> {
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
      this.databag = await firstValueFrom(this.databagService.createDatabag(databagToCreate));
      if (this.file.name && this.databag.databagId) {
        await firstValueFrom(this.databagService.uploadDataset(this.databag.databagId, this.file));
      }
      await this.retrievePipelineStatus();
    } catch (err: any) {
      this.matSnackBar.open(err, '', {duration: 3000});
      if (this.databag.databagId) {
        await firstValueFrom(this.databagService.deleteDatabagById(this.databag.databagId));
      }
    } finally {
      this.running = false;
      this.stepperStep = 1;
      stepper.next();
    }
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
              this.clearIntervalSafe();
              resolve();
              break;
          }
        });
      }, 2000);
    });
  }

  onSubmit(): void {
    if (this.databag.databagId === undefined) {
      return;
    }
    this.clearIntervalSafe();
    this.databagService.updateDatabagById(this.databag.databagId, this.databag).subscribe(() => {
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

  back(stepper: MatStepper): void {
    this.clearProgress().subscribe(() => {
      stepper.previous();
      this.stepperStep -= 1;
    });
  }


  close(): void {
    this.clearProgress().subscribe(() => {
      this.dialogRef.close();
    });
  }
}
