import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ModelmanagerService,
  Prediction,
  UrlAndPredictionId,
} from 'build/openapi/modelmanager';
import {
  concatWith,
  map,
  filter,
  Observable,
  of,
  switchMap,
  takeWhile,
  throwError,
  catchError,
} from 'rxjs';
import { PipelineStatus } from 'src/app/core/models/pipeline-status';
import { ErrorService } from 'src/app/core/services/error.service';
import { UserService } from 'src/app/core/services/user.service';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';
import { ShortStatusPipe } from 'src/app/shared/pipes/short-status.pipe';
import { predictionsWebsocketPath } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private readonly _predictions$: Observable<Prediction[]>;

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService,
    private shortStatus: ShortStatusPipe,
    private http: HttpClient,
    private translateService: TranslateService,
    private errorService: ErrorService
  ) {
    this._predictions$ = this.webSocketConnectionService.connect(
      predictionsWebsocketPath
    );
  }

  get predictions$(): Observable<Prediction[]> {
    return this._predictions$;
  }

  getPredictionsBySolutionIdSortByCreationTime(
    solutionId: string | undefined
  ): Observable<Prediction[]> {
    return this._predictions$.pipe(
      map(predictions =>
        predictions.filter(prediction => prediction.solutionId === solutionId)
      ),
      filter(predictions => predictions.length > 0),
      map(predictions => predictions.sort(sortByCreationTime))
    );
  }

  getPredictionsSortByCreationTime(): Observable<Prediction[]> {
    return this._predictions$.pipe(
      map(predictions => predictions.sort(sortByCreationTime))
    );
  }

  getPredictionById(
    id: string | undefined
  ): Observable<Prediction | undefined> {
    return this._predictions$.pipe(
      map(predictions => predictions.find(prediction => prediction.id === id))
    );
  }

  deletePredictionById(id: string | undefined): Observable<void> {
    if (!id) {
      return of(undefined);
    }

    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.deletePredictionById(id, token))
    );
  }

  createPrediction(prediction: Prediction): Observable<Prediction> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.createPrediction(token, prediction)),
      switchMap(pred =>
        of(pred).pipe(concatWith(this.getPredictionById(pred.id)))
      ),
      takeWhile(
        pred =>
          this.shortStatus.transform(pred?.status) === PipelineStatus.running,
        true
      ),
      filter(pred => !!pred),
      map(pred => pred!)
    );
  }

  getPredictionDataPutUrl(solutionId: string): Observable<UrlAndPredictionId> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.getPredictionDataPutUrl(solutionId, token)
      )
    );
  }

  uploadData(file: File, prediciton: Prediction): Observable<Prediction> {
    return this.getPredictionDataPutUrl(prediciton.solutionId!).pipe(
      switchMap(({ url, predictionId }) => {
        prediciton.id = predictionId;
        if (!url) {
          return throwError(
            () =>
              new Error(
                this.translateService.instant(
                  'prediction.error.invalid_put_url'
                )
              )
          );
        }
        const headers = new HttpHeaders({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/octet-stream',
        });
        return this.http.put(url, file, { headers });
      }),
      map(() => prediciton),
      catchError(err => {
        this.errorService.reportError(err);
        return throwError(() => err);
      })
    );
  }
}
