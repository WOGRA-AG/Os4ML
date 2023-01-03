import {Injectable} from '@angular/core';
import {UserService} from '../../core/services/user.service';
import {catchError, map, Observable, of, switchMap, tap} from 'rxjs';
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
      tap(() => console.log('connected')),
      catchError(() => {
        this.errorService.reportError('Couldn\'t connect to the websocket');
        return of([]);
      }),
      map(data => data as Databag[]),
      tap(bags => console.log('databags', bags)),
    );
  }

  getDatabagById(id: string): Observable<Databag> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.getDatabagById(id, token))
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

}
