import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import {
  Databag,
  ModelmanagerService,
  Solution,
} from '../../../../build/openapi/modelmanager';
import { UserService } from '../../core/services/user.service';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { SolutionStatus } from '../models/solution-status';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';

@Injectable({
  providedIn: 'root',
})
export class SolutionService {
  private readonly _solutions$: Observable<Solution[]>;

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService
  ) {
    const path = '/apis/v1beta1/model-manager/solutions';
    this._solutions$ = this.webSocketConnectionService.connect(path);
  }

  get solutions$(): Observable<Solution[]> {
    return this._solutions$;
  }

  getSolutionsByDatabagIdSortByCreationTime(
    databagId: string | undefined
  ): Observable<Solution[]> {
    return this.solutions$.pipe(
      map(solutions =>
        solutions.filter(solution => solution.databagId === databagId)
      ),
      map(solutions => solutions.sort(sortByCreationTime))
    );
  }

  createSolution(solution: Solution, databag: Databag): Observable<Solution> {
    solution.status = SolutionStatus.created;
    solution.metrics = [];
    solution.databagId = databag.databagId;
    solution.databagName = databag.databagName;
    if (!solution.inputFields || solution.inputFields.length <= 0) {
      solution.inputFields = this.getInputFields(solution, databag);
    }
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.createSolution(token, solution)),
      catchError(() => of({ runId: '' }))
    );
  }

  getSolutionById(id: string): Observable<Solution> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getSolutionById(id, token))
    );
  }

  deleteSolutionById(id: string | undefined): Observable<void> {
    if (!id) {
      return of(undefined);
    }
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.deleteSolutionById(id, token))
    );
  }

  updateSolutionById(id: string, solution: Solution): Observable<Solution> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.updateSolutionById(id, token, solution)
      )
    );
  }

  downloadModel(id: string): Observable<string> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.downloadModel(id, token))
    );
  }

  private getInputFields(
    solution: Solution,
    databag: Databag
  ): string[] | undefined {
    return databag.columns
      ?.map(column => column.name)
      .filter((colName): colName is string => !!colName)
      .filter(colName => colName && !solution.outputFields?.includes(colName));
  }
}
