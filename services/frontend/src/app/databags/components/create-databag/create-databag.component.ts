import { Component, EventEmitter, Output } from '@angular/core';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { firstValueFrom, last, Observable, takeWhile, tap } from 'rxjs';
import { ErrorService } from '../../../core/services/error.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DatabagService } from '../../services/databag.service';
import { PipelineStatus } from '../../../core/models/pipeline-status';
import { urlRegex } from 'src/app/shared/lib/regex/regex';
import { getShortStatus } from 'src/app/shared/lib/status/status';
import { DatasetUploadComponent } from '../../../shared/components/organisms/dataset-upload/dataset-upload.component';

@Component({
  selector: 'app-create-databag',
  templateUrl: './create-databag.component.html',
  styleUrls: ['./create-databag.component.scss'],
  standalone: true,
  imports: [DatasetUploadComponent, TranslateModule],
})
export class CreateDatabagComponent {
  @Output() public databagChange = new EventEmitter<Databag>();

  public file: File = new File([], '');
  public fileUrl = '';
  public urlRegex = urlRegex;
  public databag: Databag = {};

  constructor(
    private errorService: ErrorService,
    private translate: TranslateService,
    private databagService: DatabagService
  ) {}

  async createDatabag(): Promise<void> {
    if (!(this.file.name || this.fileUrl)) {
      const res = this.translate.instant('message_no_dataset');
      const conf = this.translate.instant('action.confirm');
      this.errorService.reportError(res, conf);
      return;
    }

    try {
      if (this.file.name) {
        this.databag.status = 'message.pipeline.running.uploading_file';
        this.databagChange.next(this.databag);
        this.databag = await firstValueFrom(
          this.databagService.createLocalFileDatabag(this.file, this.databag)
        );
      } else {
        this.databag = await firstValueFrom(
          this.databagService.createFileUrlDatabag(this.fileUrl, this.databag)
        );
      }

      this.databagChange.next(this.databag);

      await firstValueFrom(this.outputDatabagUpdates(this.databag.id!));
    } catch (err: any) {
      this.errorService.reportError(err);
    }
  }

  outputDatabagUpdates(databagId: string): Observable<Databag> {
    return this.databagService.getDatabagById(databagId).pipe(
      tap(databag => this.databagChange.next(databag)),
      takeWhile(
        databag => getShortStatus(databag.status) === PipelineStatus.running,
        true
      ),
      last()
    );
  }

  valid(): boolean {
    if (!this.databag.databagName || this.databag.databagName.length === 0) {
      return false;
    }
    if (this.fileUrl) {
      return !!this.fileUrl.match(this.urlRegex);
    }
    return !!this.file.name;
  }
}
