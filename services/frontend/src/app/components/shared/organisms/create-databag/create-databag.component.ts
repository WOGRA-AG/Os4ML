import {
  Component,
} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogDynamicComponent} from '../../../dialog-dynamic/dialog-dynamic.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, Observable, of} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import {UserFacade} from '../../../../user/services/user-facade.service';
import {Databag, ModelmanagerService, User} from '../../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-shared-popup-upload',
  templateUrl: './create-databag.component.html',
  styleUrls: ['./create-databag.component.scss']
})
export class CreateDatabagComponent {

  file: File = new File([], '');
  fileUrl = '';
  running = false;
  runId = '';
  intervalID = 0;
  stepperStep = 0;
  pipelineStatus: string | null | undefined = null;
  urlRgex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  databag: Databag = {};
  user: User = {id: '', email: '', rawToken: ''};

  constructor(public dialogRef: MatDialogRef<DialogDynamicComponent>, private matSnackBar: MatSnackBar,
              private translate: TranslateService,
              private modelManager: ModelmanagerService,
              private userFacade: UserFacade) {
    userFacade.currentUser$.pipe().subscribe(
      currentUser => this.user = currentUser
    );
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
      this.databag = await firstValueFrom(this.modelManager.createDatabag(this.user?.rawToken, databagToCreate));
      if (this.file.name && this.databag.databagId) {
        await firstValueFrom(
          this.modelManager.uploadDataset(this.databag.databagId, this.user?.rawToken, this.file)
        );
      }
      this.pipelineStatus = this.translate.instant('message.pipeline.default');
      await this.retrievePipelineStatus();
    } catch (err: any) {
      this.matSnackBar.open(err, '', {duration: 3000});
      if (this.databag.databagId) {
        await firstValueFrom(this.modelManager.deleteDatabagById(this.databag.databagId, this.user?.rawToken));
      }
    } finally {
      this.running = false;
      this.pipelineStatus = null;
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
        this.modelManager.getDatabagById(this.databag.databagId, this.user?.rawToken).pipe().subscribe(databag => {
          this.databag = databag;
          if (this.databag.status !== undefined && this.databag.status !== '') {
            this.pipelineStatus = this.databag.status;
          }
          switch (this.databag.status) {
            case 'error':
              clearInterval(this.intervalID);
              reject();
              break;
            case 'Creating databag':
              if(this.databag.columns === undefined) {
                return;
              }
              clearInterval(this.intervalID);
              resolve();
              break;
          }
        });
      }, 2000);
    });
  }

  clearProgress(): Observable<void> {
    if (this.intervalID > 0) {
      clearInterval(this.intervalID);
    }
    if (this.databag.databagId === undefined) {
      return of(undefined);
    }
    return this.modelManager.deleteDatabagById(this.databag.databagId, this.user?.rawToken);
  }

  back(stepper: MatStepper): void {
    if (this.databag.databagId === undefined) {
      return;
    }
    this.modelManager.deleteDatabagById(this.databag.databagId, this.user?.rawToken).pipe().subscribe(() => {
      stepper.previous();
      this.stepperStep -= 1;
    });
  }

  onSubmit(): void {
    if (this.databag.databagId === undefined) {
      return;
    }
    this.modelManager.updateDatabagById(this.databag.databagId, this.user?.rawToken, this.databag).subscribe(() => {
      this.dialogRef.close();
    });
  }

  close(): void {
    if (this.databag.databagId === undefined) {
      return;
    }
    this.modelManager.deleteDatabagById(this.databag.databagId, this.user?.rawToken).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
