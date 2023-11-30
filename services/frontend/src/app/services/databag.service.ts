import { Injectable } from '@angular/core';
import { UserService } from './user.service';
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
  takeUntil,
  last,
} from 'rxjs';
import {
  Databag,
  ModelmanagerService,
} from '../../../build/openapi/modelmanager';
import { WebSocketConnectionService } from 'src/app/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/lib/sort/sort-by-creation-time';
import {
  HttpClient,
  HttpEventType,
  HttpProgressEvent,
} from '@angular/common/http';
import { databagsWebsocketPath } from 'src/environments/environment';
import { putFileAsOctetStream } from 'src/app/lib/http/http';

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
    this.initializeDatabags();
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
  getDatabagById(id: string): Databag | undefined {
    return this._databagsSubject$.getValue().find(databag => databag.id === id);
  }
  getDatabagById$(id: string): Observable<Databag> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getDatabagById(id, token))
    );
  }
  // Create, Update, Delete methods
  deleteDatabagById(id: string | undefined): Observable<void> {
    return id
      ? this.userService.currentToken$.pipe(
          switchMap(token => this.modelManager.deleteDatabagById(id, token))
        )
      : of(undefined);
  }
  updateDatabagById(
    id: string | undefined,
    databag: Databag
  ): Observable<Databag> {
    return id
      ? this.userService.currentToken$.pipe(
          switchMap(token =>
            this.modelManager.updateDatabagById(id, token, databag)
          )
        )
      : of(databag);
  }
  createLocalFileDatabag(
    file: File,
    databag: Databag,
    cancelUpload: Observable<void>
  ): Observable<Databag> {
    return this.createDatabag(databag, (updatedDatabag, token) =>
      this._createFileDatabag(file, updatedDatabag, token, cancelUpload)
    );
  }
  createUrlDatabag(
    databag: Databag,
    cancelUpload: Observable<void>
  ): Observable<Databag> {
    return this.createDatabag(databag, (updatedDatabag, token) =>
      this._createUrlDatabag(updatedDatabag, token, cancelUpload)
    );
  }
  getDatabagUlr(id: string): Observable<string> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getDatasetGetUrl(id, token))
    );
  }
  // Utility methods
  isSameDatabag(databag1: Databag, databag2: Databag): boolean {
    return databag1.id === databag2.id;
  }
  // Private methods
  private initializeDatabags(): void {
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
      .subscribe(databags => this._databagsSubject$.next(databags));
  }
  private createDatabag(
    databag: Databag,
    createOperation: (
      updatedDatabag: Databag,
      token: string
    ) => Observable<Databag>
  ): Observable<Databag> {
    this._uploadDatabagFileProgressSubject$.next(0);
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager
          .createDatabag(token, databag)
          .pipe(
            switchMap(updatedDatabag => createOperation(updatedDatabag, token))
          )
      )
    );
  }
  private _createFileDatabag(
    file: File,
    updatedDatabag: Databag,
    token: string,
    cancelUpload: Observable<void>
  ): Observable<Databag> {
    return this.modelManager
      .createDatasetPutUrl(updatedDatabag.id!, token)
      .pipe(
        switchMap(url => putFileAsOctetStream(this.http, url, file)),
        tap(upload => this.handleUploadProgress(upload as HttpProgressEvent)),
        last(),
        switchMap(() =>
          this.modelManager.startDatabagPipeline(updatedDatabag.id!, token)
        ),
        takeUntil(
          cancelUpload.pipe(tap(() => this.cancelUpload(updatedDatabag)))
        )
      );
  }
  private _createUrlDatabag(
    databag: Databag,
    token: string,
    cancelUpload: Observable<void>
  ): Observable<Databag> {
    return this.modelManager.createDatabag(token, databag).pipe(
      switchMap(createdDatabag =>
        this.modelManager.startDatabagPipeline(createdDatabag.id!, token)
      ),
      takeUntil(cancelUpload.pipe(tap(() => this.cancelUpload(databag))))
    );
  }
  private handleUploadProgress(upload: HttpProgressEvent): void {
    if (
      upload.type === HttpEventType.UploadProgress &&
      upload.total !== undefined
    ) {
      const percentDone = Math.round((upload.loaded / upload.total) * 100);
      this._uploadDatabagFileProgressSubject$.next(percentDone);
    }
  }
  private cancelUpload(databag: Databag): void {
    this.deleteDatabagById(databag.id).subscribe();
  }
}
