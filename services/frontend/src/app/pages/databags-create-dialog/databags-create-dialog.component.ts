import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Databag } from '../../../../build/openapi/modelmanager';
import { Router } from '@angular/router';
import { DatabagService } from '../../databags/services/databag.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  DatabagFormOutput,
  DatabagsCreateFormComponent,
} from '../../shared/components/organisms/databags-create-form/databags-create-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { Os4mlDialogTemplateComponent } from '../../shared/components/templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { IconButtonComponent } from '../../design/components/atoms/icon-button/icon-button.component';
import { UploadingFilesComponent } from '../../shared/components/organisms/uploading-files/uploading-files.component';

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
  public submitting = false;
  public databagUploadProgress$: Observable<number>;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private databagService: DatabagService,
    public dialogRef: MatDialogRef<DatabagsCreateDialogComponent>
  ) {
    this.databagUploadProgress$ =
      this.databagService.getUploadDatabagFileProgress();
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
  public submitDatabag(databagFormOutput: DatabagFormOutput): void {
    this.submitting = true;
    const databag: Databag = {
      name: databagFormOutput.databagName,
    };

    if (databagFormOutput.databagDataFile) {
      this.createDatabagFromLocalFile(databag, databagFormOutput);
      return;
    }
    if (databagFormOutput.databagDataUrl) {
      this.createDatabagFromFileUrl(databag, databagFormOutput);
      return;
    }
    console.error('Both predictionDataFile and predictionDataUrl are null.');
  }

  public finishUpload(): void {
    this.dialogRef.close();
    this.router.navigate(['databags']);
  }

  private createDatabagFromLocalFile(
    databag: Databag,
    databagFormOutput: DatabagFormOutput
  ): void {
    databag.datasetFileName = databagFormOutput.databagDataFile!.name;
    this.databagService
      .createLocalFileDatabag(databagFormOutput.databagDataFile!, databag)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  private createDatabagFromFileUrl(
    databag: Databag,
    databagFormOutput: DatabagFormOutput
  ): void {
    databag.datasetUrl = databagFormOutput.databagDataUrl;
    this.databagService
      .createLocalFileDatabag(databagFormOutput.databagDataFile!, databag)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
