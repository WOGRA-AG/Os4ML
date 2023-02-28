import { Injectable } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import {
  catchError,
  filter,
  map,
  Observable,
  switchMap,
  throwError,
  of,
} from 'rxjs';
import {
  Databag,
  DatasetPutUrl,
  ModelmanagerService,
} from '../../../../build/openapi/modelmanager';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from 'src/app/core/services/error.service';

@Injectable({
  providedIn: 'root',
})
export class DatabagService {
  private readonly _databags$: Observable<Databag[]>;

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService,
    private http: HttpClient,
    private errorService: ErrorService
  ) {
    const path = '/apis/v1beta1/model-manager/databags';
    this._databags$ = this.webSocketConnectionService.connect(path);
  }

  get databags$(): Observable<Databag[]> {
    return this._databags$;
  }

  getDatabagsSortByCreationTime(): Observable<Databag[]> {
    return this.databags$.pipe(
      map(databags => databags.sort(sortByCreationTime))
    );
  }

  getDatabagById(id: string): Observable<Databag> {
    return this.databags$.pipe(
      map(databags => databags.find(databag => databag.id === id)),
      filter(databag => !!databag),
      map(databag => databag!)
    );
  }

  createDatabag(databag: Databag): Observable<Databag> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.createDatabag(token, databag))
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

  getDatasetPutUrl(fileName: string): Observable<DatasetPutUrl> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getDatasetPutUrl(fileName, token))
    );
  }

  uploadDataset(file: File, databag: Databag): Observable<Databag> {
    return this.getDatasetPutUrl(file.name).pipe(
      switchMap(({ url, databagId }) => {
        databag.id = databagId;
        if (!url) {
          return throwError(() => new Error('Invalid put url for dataset'));
        }
        const headers = new HttpHeaders({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/octet-stream',
        });
        return this.http.put(url, file, { headers }).pipe(map(() => databag));
      }),
      catchError(err => {
        this.errorService.reportError(err);
        return throwError(() => err);
      })
    );
  }

  isSameDatabag(databag1: Databag, databag2: Databag): boolean {
    return databag1.id === databag2.id;
  }
}
