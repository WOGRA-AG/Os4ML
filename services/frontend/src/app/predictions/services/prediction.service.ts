import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelmanagerService, Prediction } from 'build/openapi/modelmanager';
import {
  concatWith,
  map,
  Observable,
  of,
  switchMap,
  first,
  shareReplay,
  raceWith,
  tap,
  BehaviorSubject,
} from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';
import { predictionsWebsocketPath } from 'src/environments/environment';
import { putFileAsOctetStream } from 'src/app/shared/lib/http/http';

export interface UploadFile {
  name: string;
  progress: number;
}
@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private readonly _uploadFileProgressSubject$ = new BehaviorSubject<number>(0);

  private readonly _predictions$: Observable<Prediction[]>;

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService,
    private http: HttpClient
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

  getPredictionUploadProgress(): Observable<number> {
    return this._uploadFileProgressSubject$;
  }
  getFilteredPredictions(
    databagId: string | null,
    solutionId: string | null
  ): Observable<Prediction[]> {
    return this._predictions$.pipe(
      map(predictions =>
        predictions.filter(
          prediction =>
            (databagId ? prediction.databagId === databagId : true) &&
            (solutionId ? prediction.solutionId === solutionId : true)
        )
      ),
      map(predictions => predictions.sort(sortByCreationTime))
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

  getPredictionResultGetUrl(predictionId: string): Observable<string> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.getPredictionResultGetUrl(predictionId, token)
      )
    );
  }

  getPredictionTemplateGetUrl(solutionId: string): Observable<string> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.getPredictionTemplateGetUrl(solutionId, token)
      )
    );
  }

  createLocalFilePrediction(
    file: File,
    prediction: Prediction
  ): Observable<Prediction> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this._createLocalFilePrediction(file, prediction, token)
      )
    );
  }

  createFileUrlPrediction(
    url: string,
    prediction: Prediction
  ): Observable<Prediction> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this._createFileUrlPrediction(url, prediction, token))
    );
  }

  private _createLocalFilePrediction(
    file: File,
    prediction: Prediction,
    token: string
  ): Observable<Prediction> {
    prediction.status = 'message.pipeline.running.uploading_file';
    prediction.dataFileName = file.name;
    this._uploadFileProgressSubject$.next(0);

    return this.modelManager.createPrediction(token, prediction).pipe(
      tap(createdPrediction => (prediction = createdPrediction)),
      switchMap(() =>
        this.modelManager.createPredictionDataPutUrl(prediction.id!, token)
      ),
      switchMap(url => putFileAsOctetStream(this.http, url, file)),
      tap(upload => {
        if (upload.type === HttpEventType.UploadProgress) {
          this._uploadFileProgressSubject$.next(
            Math.round((upload.loaded / upload.total) * 100)
          );
        }
      }),
      switchMap(() =>
        this.modelManager.startPredictionPipeline(prediction.id!, token)
      )
    );
  }

  private _createFileUrlPrediction(
    url: string,
    prediction: Prediction,
    token: string
  ): Observable<Prediction> {
    prediction.dataUrl = url;
    this._uploadFileProgressSubject$.next(0);
    return this.modelManager.createPrediction(token, prediction).pipe(
      tap(() => this._uploadFileProgressSubject$.next(100)),
      switchMap(createdPrediction =>
        this.modelManager.startPredictionPipeline(createdPrediction.id!, token)
      )
    );
  }
}
