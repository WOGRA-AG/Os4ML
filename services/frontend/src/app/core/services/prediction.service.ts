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
  raceWith,
  tap,
  BehaviorSubject,
  takeUntil,
  last,
} from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/core/lib/sort/sort-by-creation-time';
import { predictionsWebsocketPath } from 'src/environments/environment';
import { putFileAsOctetStream } from 'src/app/core/lib/http/http';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private readonly _uploadPredictionFileProgressSubject$ =
    new BehaviorSubject<number>(0);
  private readonly _predictionsSubject$ = new BehaviorSubject<Prediction[]>([]);

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService,
    private http: HttpClient
  ) {
    this.initializePredictions();
  }

  // Read methods
  get predictions$(): Observable<Prediction[]> {
    return this._predictionsSubject$.asObservable();
  }

  getPredictionUploadProgress(): BehaviorSubject<number> {
    return this._uploadPredictionFileProgressSubject$;
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

  // Create, Update, Delete methods
  createLocalFilePrediction(
    file: File,
    prediction: Prediction,
    cancelUpload: Observable<void>
  ): Observable<Prediction> {
    return this.createPrediction(prediction, (updatedPrediction, token) =>
      this._createLocalFilePrediction(
        file,
        updatedPrediction,
        token,
        cancelUpload
      )
    );
  }
  createUrlPrediction(
    url: string,
    prediction: Prediction,
    cancelUpload: Observable<void>
  ): Observable<Prediction> {
    return this.createPrediction(prediction, (updatedPrediction, token) =>
      this._createUrlPrediction(url, updatedPrediction, token, cancelUpload)
    );
  }
  deletePredictionById(id: string | undefined): Observable<void> {
    return id
      ? this.userService.currentToken$.pipe(
          switchMap(token => this.modelManager.deletePredictionById(id, token))
        )
      : of(undefined);
  }

  // Private methods
  private initializePredictions(): void {
    const webSocketConnection$ = this.webSocketConnectionService.connect(
      predictionsWebsocketPath
    );
    this.userService.currentToken$
      .pipe(
        switchMap(token => this.modelManager.getPredictions(token)),
        first(),
        concatWith(webSocketConnection$),
        raceWith(webSocketConnection$)
      )
      .subscribe(predictions => this._predictionsSubject$.next(predictions));
  }
  private createPrediction(
    prediction: Prediction,
    createOperation: (
      updatedPrediction: Prediction,
      token: string
    ) => Observable<Prediction>
  ): Observable<Prediction> {
    this._uploadPredictionFileProgressSubject$.next(0);
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager
          .createPrediction(token, prediction)
          .pipe(
            switchMap(updatedPrediction =>
              createOperation(updatedPrediction, token)
            )
          )
      )
    );
  }
  private _createLocalFilePrediction(
    file: File,
    updatedPrediction: Prediction,
    token: string,
    cancelUpload: Observable<void>
  ): Observable<Prediction> {
    return this.modelManager
      .createPredictionDataPutUrl(updatedPrediction.id!, token)
      .pipe(
        switchMap(url => putFileAsOctetStream(this.http, url, file)),
        tap(upload => this.handleUploadProgress(upload)),
        last(),
        switchMap(() =>
          this.modelManager.startPredictionPipeline(
            updatedPrediction.id!,
            token
          )
        ),
        takeUntil(
          cancelUpload.pipe(tap(() => this.cancelUpload(updatedPrediction)))
        )
      );
  }
  private _createUrlPrediction(
    url: string,
    updatedPrediction: Prediction,
    token: string,
    cancelUpload: Observable<void>
  ): Observable<Prediction> {
    updatedPrediction.dataUrl = url;
    return this.modelManager.createPrediction(token, updatedPrediction).pipe(
      switchMap(createdPrediction =>
        this.modelManager.startPredictionPipeline(createdPrediction.id!, token)
      ),
      takeUntil(
        cancelUpload.pipe(tap(() => this.cancelUpload(updatedPrediction)))
      )
    );
  }
  private handleUploadProgress(upload: any): void {
    if (upload.type === HttpEventType.UploadProgress) {
      this._uploadPredictionFileProgressSubject$.next(
        Math.round((upload.loaded / upload.total) * 100)
      );
    }
  }
  private cancelUpload(prediction: Prediction): void {
    this.deletePredictionById(prediction.id).subscribe();
  }
}
