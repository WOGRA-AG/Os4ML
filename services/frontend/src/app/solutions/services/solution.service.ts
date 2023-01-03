import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, switchMap, tap} from 'rxjs';
import {ModelmanagerService, Solution} from '../../../../build/openapi/modelmanager';
import {UserService} from '../../core/services/user.service';
import {ErrorService} from '../../core/services/error.service';
import {webSocket} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  solutions$: Observable<Solution[]>;

  private basePath = 'model-manager.os4ml.svc.cluster.local:8000';
  private url = `ws://${this.basePath}/apis/v1beta1/model-manager/solutions`;

  constructor(private userService: UserService, private errorService: ErrorService, private modelManager: ModelmanagerService) {
    this.solutions$ = this.userService.currentUserToken$.pipe(
      map(token => `${this.url}?usertoken=${token}`),
      tap(() => console.log('connecting')),
      switchMap(url => webSocket(url)),
      tap(() => console.log('connected')),
      catchError(() => {
        this.errorService.reportError('Couldn\'t connect to the websocket');
        return of([]);
      }),
      map(data => data as Solution[]),
      tap(solutions => console.log('solutions', solutions)),
    );
  }

  getSolutionById(id: string): Observable<Solution> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.getSolutionById(id, token))
    );
  }

  deleteSolutionById(id: string): Observable<void> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.deleteSolutionById(id, token))
    );
  }

  updateSolutionById(id: string, solution: Solution): Observable<Solution> {
    return this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.updateSolutionById(id, token, solution))
    );
  }
}
