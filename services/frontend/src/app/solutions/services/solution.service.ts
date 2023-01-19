import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import {Databag, ModelmanagerService, Solution} from '../../../../build/openapi/modelmanager';
import {UserService} from '../../core/services/user.service';
import {ErrorService} from '../../core/services/error.service';
import {webSocket} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  solutions$: Observable<Solution[]>;

  private webSocketProtocol = location.protocol === 'http:' ? 'ws' : 'wss';
  private url = `${this.webSocketProtocol}://${location.host}/apis/v1beta1/model-manager/solutions`;

  constructor(private userService: UserService, private errorService: ErrorService, private modelManager: ModelmanagerService) {
    this.solutions$ = this.userService.currentToken$.pipe(
      map(token => `${this.url}?usertoken=${token}`),
      switchMap(url => webSocket(url)),
      catchError(() => {
        this.errorService.reportError('Couldn\'t connect to the websocket');
        return of([]);
      }),
      map(data => data as Solution[]),
      tap(solutions => console.log('solutions', solutions)),
      shareReplay(1),
    );
  }

  getSolutionsByDatabagIdSortByCreationTime(databagId: string | undefined): Observable<Solution[]> {
     const sortByCreationTime = (solution1: Solution, solution2: Solution) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const date1 = new Date(solution1.creationTime!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const date2 = new Date(solution2.creationTime!);
      return date2.getTime() - date1.getTime();
    };

    return this.solutions$.pipe(
      map(solutions => solutions.filter(solution => solution.databagId === databagId)),
      map(solutions => solutions.sort(sortByCreationTime)),
    );
  }

  createSolution(solution: Solution, databag: Databag): Observable<Solution> {
    solution.status = 'Created';
    solution.metrics = [];
    solution.databagId = databag.databagId;
    solution.databagName = databag.databagName;
    if (!solution.inputFields || solution.inputFields.length <= 0) {
      solution.inputFields = this.getInputFields(solution, databag);
    }
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.createSolution(token, solution)),
      catchError(() => of({runId: ''})),
    );
  }

  getSolutionById(id: string): Observable<Solution> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getSolutionById(id, token))
    );
  }

  deleteSolutionById(id: string): Observable<void> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.deleteSolutionById(id, token))
    );
  }

  updateSolutionById(id: string, solution: Solution): Observable<Solution> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.updateSolutionById(id, token, solution))
    );
  }

  downloadModel(id: string): Observable<string> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.downloadModel(id, token))
    );
  }

  private getInputFields(solution: Solution, databag: Databag): string[] | undefined {
    return databag.columns?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(colName => colName && !solution.outputFields?.includes(colName));
  }
}
