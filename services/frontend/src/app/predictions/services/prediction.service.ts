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
  BehaviorSubject, takeUntil, Subject,
} from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';
import { predictionsWebsocketPath } from 'src/environments/environment';
import { putFileAsOctetStream } from 'src/app/shared/lib/http/http';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private readonly _uploadFileProgressSubject$ = new BehaviorSubject<number>(0);
  private readonly _predictionsSubject$ = new BehaviorSubject<Prediction[]>([]);
  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService,
    private http: HttpClient
  ) {
    const webSocketConnection = this.webSocketConnectionService.connect(
      predictionsWebsocketPath
    );
    this.userService.currentToken$
      .pipe(
        switchMap(token => this.modelManager.getPredictions(token)),
        first(),
        concatWith(webSocketConnection),
        raceWith(webSocketConnection),
        shareReplay(1)
      )
      .subscribe(predictions => {
        this._predictionsSubject$.next(predictions);
      });
  }
  get predictions$(): Observable<Prediction[]> {
    return this._predictionsSubject$.asObservable();
  }

  getPredictionUploadProgress(): BehaviorSubject<number> {
    return this._uploadFileProgressSubject$;
  }
  getFilteredPredictions(
    databagId: string | null,
    solutionId: string | null
  ): Observable<Prediction[]> {
    return this.predictions$.pipe(
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
    prediction: Prediction,
    cancelUpload: Subject<void>
  ): Observable<Prediction> {
    this._uploadFileProgressSubject$.next(0);
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.createPrediction(token, prediction).pipe(
          switchMap(updatedPrediction => this._createLocalFilePrediction(file, updatedPrediction, token).pipe(
            takeUntil(cancelUpload.pipe(
              tap(() => this.logCancellation(updatedPrediction))
            )),
          ))
        )
      ),
    );
  }
  createURLPrediction(
    url: string,
    prediction: Prediction,
    cancelUpload: Subject<void>
  ): Observable<Prediction> {
    this._uploadFileProgressSubject$.next(0);
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.createPrediction(token, prediction).pipe(
          switchMap(updatedPrediction => this._createUrlPrediction(url, updatedPrediction, token).pipe(
            takeUntil(cancelUpload.pipe(
              tap(() => this.logCancellation(updatedPrediction))
            )),
          )))
      ),
    );
  }
  private _createLocalFilePrediction(
    file: File,
    prediction: Prediction,
    token: string
  ): Observable<Prediction> {
    return this.modelManager.createPredictionDataPutUrl(prediction.id!, token).pipe(
      switchMap(url => putFileAsOctetStream(this.http, url, file)),
      tap(upload => this.handleUploadProgress(upload)),
      switchMap(() =>
        this.modelManager.startPredictionPipeline(prediction.id!, token)
      )
    );
  }
  private _createUrlPrediction(
    url: string,
    prediction: Prediction,
    token: string
  ): Observable<Prediction> {
    prediction.dataUrl = url;
    return this.modelManager
      .createPrediction(token, prediction)
      .pipe(
        switchMap(createdPrediction =>
          this.modelManager.startPredictionPipeline(
            createdPrediction.id!,
            token
          )
        )
      );
  }
  private handleUploadProgress(upload: any): void {
    if (upload.type === HttpEventType.UploadProgress) {
      this._uploadFileProgressSubject$.next(
        Math.round((upload.loaded / upload.total) * 100)
      );
    }
  }
  private logCancellation(prediction: Prediction): void {
    this.deletePredictionById(prediction.id).subscribe();
    console.log('Upload canceled');
  }
}
