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
} from 'rxjs';
import {
  Databag,
  DatabagType,
  ModelmanagerService,
} from '../../../../build/openapi/modelmanager';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';
import { HttpClient } from '@angular/common/http';
import { databagsWebsocketPath } from 'src/environments/environment';
import { filterNotDefined } from 'src/app/shared/lib/rxjs/filter-not-defined';
import { putFileAsOctetStream } from 'src/app/shared/lib/http/http';

@Injectable({
  providedIn: 'root',
})
export class DatabagService {
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

  getDatabagsSortByCreationTime(): Observable<Databag[]> {
    return this.databags$.pipe(
      map(databags => databags.sort(sortByCreationTime))
    );
  }

  getDatabagById(id: string): Observable<Databag> {
    return this.databags$.pipe(
      map(databags => databags.find(databag => databag.id === id)),
      filterNotDefined()
    );
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

  createLocalFileDatabag(file: File, databag: Databag): Observable<Databag> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this._createLocalFileDatabag(file, databag, token))
    );
  }

  createFileUrlDatabag(url: string, databag: Databag): Observable<Databag> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this._createFileUrlDatabag(url, databag, token))
    );
  }

  private _createLocalFileDatabag(
    file: File,
    databag: Databag,
    token: string
  ): Observable<Databag> {
    databag.fileName = file.name;
    databag.databagType = DatabagType.LocalFile;
    return this.modelManager.createDatabag(token, databag).pipe(
      tap(createdDatabag => (databag = createdDatabag)),
      switchMap(() =>
        this.modelManager.createDatasetPutUrl(databag.id!, token)
      ),
      switchMap(url => putFileAsOctetStream(this.http, url, file)),
      switchMap(() =>
        this.modelManager.startDatabagPipeline(databag.id!, token)
      )
    );
  }

  private _createFileUrlDatabag(
    url: string,
    databag: Databag,
    token: string
  ): Observable<Databag> {
    databag.datasetUrl = url;
    databag.databagType = DatabagType.FileUrl;
    return this.modelManager
      .createDatabag(token, databag)
      .pipe(
        switchMap(createdDatabag =>
          this.modelManager.startDatabagPipeline(createdDatabag.id!, token)
        )
      );
  }
}
