import {Injectable} from '@angular/core';
import {UserService} from '../../core/services/user.service';
import {catchError, filter, map, Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import {Databag, ModelmanagerService} from '../../../../build/openapi/modelmanager';
import {webSocket} from 'rxjs/webSocket';
import {ErrorService} from '../../core/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class DatabagService {

  databags$: Observable<Databag[]>;

  private basePath = 'model-manager.os4ml.svc.cluster.local:8000';
  private url = `ws://${this.basePath}/apis/v1beta1/model-manager/databags`;

  constructor(private userService: UserService, private errorService: ErrorService, private modelManager: ModelmanagerService) {
    this.databags$ = this.userService.currentUserToken$.pipe(
      map(token => `${this.url}?usertoken=${token}`),
      tap(() => console.log('connecting')),
      switchMap(url => webSocket(url)),
      catchError(() => {
        this.errorService.reportError('Couldn\'t connect to the websocket');
        return of([]);
      }),
      map(data => data as Databag[]),
      tap(bags => console.log('databags', bags)),
      shareReplay(1),
    );
  }

  getDatabagsSortByCreationTime(): Observable<Databag[]> {
     const sortByCreationTime = (databag1: Databag, databag2: Databag) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const date1 = new Date(databag1.creationTime!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const date2 = new Date(databag2.creationTime!);
      return date2.getTime() - date1.getTime();
    };

    return this.databags$.pipe(
      map(databags => databags.sort(sortByCreationTime))
    );
  }

  getDatabagById(id: string): Observable<Databag> {
    return this.databags$.pipe(
      map(databags => databags.filter(databag => databag.databagId === id)),
      filter(databags => databags.length > 0),
      map(databags => databags[0]),
    );
  }

  createDatabag(databag: Databag): Observable<Databag> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.createDatabag(token, databag))
    );
  }

  deleteDatabagById(id: string): Observable<void> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.deleteDatabagById(id, token))
    );
  }

  updateDatabagById(id: string, databag: Databag): Observable<Databag> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.updateDatabagById(id, token, databag))
    );
  }

  uploadDataset(id: string, file: Blob): Observable<void> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.uploadDataset(id, token, file))
    );
  }
}
