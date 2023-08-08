import { Injectable } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import {
  tap,
  map,
  Observable,
  switchMap,
  of,
  concatWith,
  first,
  raceWith,
  BehaviorSubject,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  Databag,
  ModelmanagerService,
  Prediction,
} from '../../../../build/openapi/modelmanager';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { databagsWebsocketPath } from 'src/environments/environment';
import { filterNotDefined } from 'src/app/shared/lib/rxjs/filter-not-defined';
import { putFileAsOctetStream } from 'src/app/shared/lib/http/http';

@Injectable({
  providedIn: 'root',
})
export class DatabagService {
  private readonly _uploadDatabagFileProgressSubject$ =
    new BehaviorSubject<number>(0);

  private readonly _databagsSubject$ = new BehaviorSubject<Databag[]>([]);

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService,
    private http: HttpClient
  ) {
    const webSocketConnection$ = this.webSocketConnectionService.connect(
      databagsWebsocketPath
    );
    this.userService.currentToken$
      .pipe(
        switchMap(token => this.modelManager.getDatabags(token)),
        first(),
        concatWith(webSocketConnection$),
        raceWith(webSocketConnection$)
      )
      .subscribe(databags => {
        this._databagsSubject$.next(databags);
      });
  }

  get databags$(): Observable<Databag[]> {
    return this._databagsSubject$.asObservable();
  }

  getUploadDatabagFileProgress(): BehaviorSubject<number> {
    return this._uploadDatabagFileProgressSubject$;
  }

  getDatabagsSortByCreationTime(): Observable<Databag[]> {
    return this.databags$.pipe(
      map(databags => databags.sort(sortByCreationTime))
    );
  }

  getDatabagById$(id: string): Observable<Databag> {
    return this.databags$.pipe(
      map(databags => databags.find(databag => databag.id === id)),
      filterNotDefined()
    );
  }
  getDatabagById(id: string): Databag | undefined {
    const databags = this._databagsSubject$.getValue();
    if (!databags) {
      return undefined;
    }
    return databags.find(databag => databag.id === id);
  }
  deleteDatabagById(id: string | undefined): Observable<void> {
    if (!id) {
      return of(undefined);
    }
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.deleteDatabagById(id, token))
    );
  }

  updateDatabagById(
    id: string | undefined,
    databag: Databag
  ): Observable<Databag> {
    if (!id) {
      return of(databag);
    }
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.updateDatabagById(id, token, databag)
      )
    );
  }

  isSameDatabag(databag1: Databag, databag2: Databag): boolean {
    return databag1.id === databag2.id;
  }

  createLocalFileDatabag(
    file: File,
    databag: Databag,
    cancelUpload: Subject<void>
  ): Observable<Databag> {
    this._uploadDatabagFileProgressSubject$.next(0);
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager
          .createDatabag(token, databag)
          .pipe(
            switchMap(updatedDatabag =>
              this._createLocalFileDatabag(file, updatedDatabag, token).pipe(
                takeUntil(
                  cancelUpload.pipe(
                    tap(() => this.logCancellation(updatedDatabag))
                  )
                )
              )
            )
          )
      )
    );
  }
  createUrlDatabag(
    databag: Databag,
    cancelUpload: Subject<void>
  ): Observable<Databag> {
    this._uploadDatabagFileProgressSubject$.next(0);
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager
          .createDatabag(token, databag)
          .pipe(
            switchMap(updatedDatabag =>
              this._createUrlDatabag(updatedDatabag, token).pipe(
                takeUntil(
                  cancelUpload.pipe(
                    tap(() => this.logCancellation(updatedDatabag))
                  )
                )
              )
            )
          )
      )
    );
  }
  private _createLocalFileDatabag(
    file: File,
    databag: Databag,
    token: string
  ): Observable<Databag> {
    console.log(databag)
    return this.modelManager.createDatasetPutUrl(databag.id!, token).pipe(
      switchMap(url => putFileAsOctetStream(this.http, url, file)),
      tap(upload => this.handleUploadProgress(upload)),
      switchMap(() =>
        this.modelManager.startDatabagPipeline(databag.id!, token)
      )
    );
  }
  private _createUrlDatabag(
    databag: Databag,
    token: string
  ): Observable<Databag> {
    return this.modelManager
      .createDatabag(token, databag)
      .pipe(
        switchMap(createdPrediction =>
          this.modelManager.startDatabagPipeline(createdPrediction.id!, token)
        )
      );
  }
  private handleUploadProgress(upload: any): void {
    if (upload.type === HttpEventType.UploadProgress) {
      this._uploadDatabagFileProgressSubject$.next(
        Math.round((upload.loaded / upload.total) * 100)
      );
    }
  }
  private logCancellation(prediction: Prediction): void {
    this.deleteDatabagById(prediction.id).subscribe();
    console.log('Upload canceled');
  }
}
