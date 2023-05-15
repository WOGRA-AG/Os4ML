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
  Observable,
  of,
  switchMap,
  throwError,
  catchError,
  first,
  shareReplay,
  raceWith,
} from 'rxjs';
import { ErrorService } from 'src/app/core/services/error.service';
import { UserService } from 'src/app/core/services/user.service';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';
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
    private http: HttpClient,
    private translateService: TranslateService,
    private errorService: ErrorService
  ) {
    const webSocketConnection = this.webSocketConnectionService.connect(
      predictionsWebsocketPath
    );
    this._predictions$ = this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getPredictions(token)),
      first(),
      concatWith(webSocketConnection),
      raceWith(webSocketConnection),
      shareReplay(1)
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
      switchMap(token => this.modelManager.createPrediction(token, prediction))
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
