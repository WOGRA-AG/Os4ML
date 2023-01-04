import {Component,} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {filter, firstValueFrom, last, map, Observable, of, share, startWith, takeWhile, tap} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import {Databag} from '../../../../../build/openapi/modelmanager';
import {DialogDynamicComponent} from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import {ShortStatusPipe} from '../../../shared/pipes/short-status.pipe';
import {DatabagService} from '../../services/databag.service';
import {PipelineStatus} from '../../../core/models/pipeline-status';
import {ErrorService} from '../../../core/services/error.service';

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

  creationStatus$: Observable<string> | undefined;

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>,
              private errorService: ErrorService,
              private shortStatus: ShortStatusPipe,
              private translate: TranslateService,
              private databagService: DatabagService) {
  }

  async nextClick(stepper: MatStepper): Promise<void> {
    if (!(this.file.name || this.fileUrl)) {
      this.translate.get('message.no_dataset').subscribe((res: string) => {
        this.translate.get('action.confirm').subscribe((conf: string) => {
          this.errorService.reportError(res, conf);
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
      this.creationStatus$ = this.retrievePipelineStatus();
      if (this.file.name && this.databag.databagId) {
        await firstValueFrom(this.databagService.uploadDataset(this.databag.databagId, this.file));
      }
      await firstValueFrom(this.creationStatus$.pipe(last()));
    } catch (err: any) {
      this.errorService.reportError(err);
      if (this.databag.databagId) {
        await firstValueFrom(this.databagService.deleteDatabagById(this.databag.databagId));
      }
    } finally {
      this.running = false;
      this.stepperStep = 1;
      stepper.next();
    }
  }

  retrievePipelineStatus(): Observable<string> {
    return this.databagService.databags$.pipe(
      map(databags => databags.filter(databag => databag.databagId === this.databag.databagId)),
      filter(databags => databags.length > 0),
      tap(databags => this.databag = databags[0]),
      map(databags => databags[0].status || ''),
      takeWhile(status => this.shortStatus.transform(status) === PipelineStatus.running),
      startWith('message.pipeline.default'),
      share(),
    );
  }

  async onSubmit(): Promise<void> {
    if (this.databag.databagId === undefined) {
      return;
    }
    await firstValueFrom(this.databagService.updateDatabagById(this.databag.databagId, this.databag));
    this.dialogRef.close();
  }

  async clearProgress(): Promise<void> {
    if (this.databag.databagId) {
      await firstValueFrom(this.databagService.deleteDatabagById(this.databag.databagId));
    }
    this.running = false;
  }

  async back(stepper: MatStepper): Promise<void> {
    await this.clearProgress();
    stepper.previous();
    this.stepperStep -= 1;
  }

  async close(): Promise<void> {
    await this.clearProgress();
    this.dialogRef.close();
  }
}
