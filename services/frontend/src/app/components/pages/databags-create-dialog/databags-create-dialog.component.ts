import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  Databag,
  DatabagType,
} from '../../../../../build/openapi/modelmanager';
import { Router } from '@angular/router';
import { DatabagService } from '../../../services/databag.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  DatabagFormOutput,
  DatabagsCreateFormComponent,
} from '../../organisms/databags-create-form/databags-create-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { Os4mlDialogTemplateComponent } from '../../templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { UploadingFilesComponent } from '../../organisms/uploading-files/uploading-files.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
enum DatabagCreateStatus {
  Input = 'input',
  Uploading = 'uploading',
  Done = 'done',
}
@Component({
  selector: 'app-databags-create-dialog',
  templateUrl: './databags-create-dialog.component.html',
  styleUrls: ['./databags-create-dialog.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    DatabagsCreateFormComponent,
    TranslateModule,
    Os4mlDialogTemplateComponent,
    IconButtonComponent,
    UploadingFilesComponent,
    AsyncPipe,
  ],
})
export class DatabagsCreateDialogComponent implements OnDestroy {
  public DatabagCreateStatusEnum = DatabagCreateStatus;
  public databagCreateStatus: DatabagCreateStatus = DatabagCreateStatus.Input;
  public uploadingFileName = '';
  public databagUploadProgress$: BehaviorSubject<number>;
  private cancelUpload$: Subject<void> = new Subject<void>();
  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private databagService: DatabagService,
    public dialogRef: MatDialogRef<DatabagsCreateDialogComponent>
  ) {
    dialogRef.id = 'dialog-title';
    this.databagUploadProgress$ =
      this.databagService.getUploadDatabagFileProgress();
  }
  close(): void {
    if (this.databagCreateStatus !== DatabagCreateStatus.Done) {
      this.cancelUpload();
    }
    this.dialogRef.close();
  }
  public cancelUpload(): void {
    this.cancelUpload$.next();
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
  }
  public finishUpload(): void {
    this.dialogRef.close();
    this.router.navigate(['databags']);
  }
  public submitDatabag(databagFormOutput: DatabagFormOutput): void {
    this.databagCreateStatus = DatabagCreateStatus.Uploading;
    const databag: Databag = {
      name: databagFormOutput.databagName,
    };

    if (databagFormOutput.databagDataFile) {
      this.uploadingFileName = databagFormOutput.databagDataFile.name;
      this.createLocalFileDatabag(databagFormOutput, databag);
      return;
    }
    if (databagFormOutput.databagDataUrl) {
      this.createUrlDatabag(databagFormOutput, databag);
      return;
    }
    console.error('Both predictionDataFile and predictionDataUrl are null.');
  }
  private createLocalFileDatabag(
    databagFormOutput: DatabagFormOutput,
    databag: Databag
  ): void {
    databag.databagType = DatabagType.LocalFile;
    databag.datasetFileName = databagFormOutput.databagDataFile!.name;
    this.databagService
      .createLocalFileDatabag(
        databagFormOutput.databagDataFile!,
        databag,
        this.cancelUpload$
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.databagCreateStatus = DatabagCreateStatus.Done;
      });
  }
  private createUrlDatabag(
    databagFormOutput: DatabagFormOutput,
    databag: Databag
  ): void {
    databag.datasetUrl = databagFormOutput.databagDataUrl!;
    databag.databagType = DatabagType.FileUrl;
    this.databagService
      .createUrlDatabag(databag, this.cancelUpload$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.databagCreateStatus = DatabagCreateStatus.Done;
      });
  }
}
