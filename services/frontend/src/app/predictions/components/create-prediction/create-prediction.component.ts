import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Prediction, Solution } from 'build/openapi/modelmanager';
import { firstValueFrom, last, Subject, takeUntil, tap } from 'rxjs';
import { ErrorService } from 'src/app/core/services/error.service';
import { urlRegex } from 'src/app/shared/lib/regex/regex';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-create-prediction',
  templateUrl: './create-prediction.component.html',
  styleUrls: ['./create-prediction.component.scss'],
})
export class CreatePredictionComponent implements OnDestroy {
  @Input() public solution: Solution = {};
  @Output() public predictionChange = new EventEmitter<Prediction>();

  public file: File = new File([], '');
  public url = '';
  public urlRegex = urlRegex;
  public prediction: Prediction = {};

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private errorService: ErrorService,
    private translate: TranslateService,
    private predictionService: PredictionService
  ) {}

  async createPrediction(): Promise<void> {
    if (!this.solution.id) {
      return;
    }
    this.prediction.solutionId = this.solution.id;

    if (this.file.name) {
      this.prediction.status = 'message.pipeline.running.uploading_file';
      this.predictionChange.next(this.prediction);
      this.prediction = await firstValueFrom(
        this.predictionService.uploadData(this.file, this.prediction)
      );
    } else if (this.url) {
      this.prediction.dataUrl = this.url;
    } else {
      const res = this.translate.instant('message_no_dataset');
      const conf = this.translate.instant('action.confirm');
      this.errorService.reportError(res, conf);
      return;
    }

    await firstValueFrom(
      this.predictionService
        .createPrediction(this.prediction)
        .pipe(takeUntil(this.destroy$))
        .pipe(
          tap(pred => this.predictionChange.next(pred)),
          last()
        )
    );
  }

  valid(): boolean {
    if (!this.prediction.name || this.prediction.name.length === 0) {
      return false;
    }
    if (this.url) {
      return !!this.url.match(this.urlRegex);
    }
    return !!this.file.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
