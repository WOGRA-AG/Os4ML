import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatWith,
  first,
  map,
  Observable,
  of,
  raceWith,
  shareReplay,
  switchMap,
} from 'rxjs';
import {
  Databag,
  ModelmanagerService,
  Solution,
} from '../../../../build/openapi/modelmanager';
import { UserService } from './user.service';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/core/lib/sort/sort-by-creation-time';
import { solutionWebsocketPath } from 'src/environments/environment';
export enum SolutionStatus {
  created = 'Created',
}

@Injectable({
  providedIn: 'root',
})
export class SolutionService {
  private readonly _solutionsSubject$ = new BehaviorSubject<Solution[]>([]);
  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService
  ) {
    const webSocketConnection = this.webSocketConnectionService.connect(
      solutionWebsocketPath
    );
    this.userService.currentToken$
      .pipe(
        switchMap(token => this.modelManager.getSolutions(token)),
        first(),
        concatWith(webSocketConnection),
        raceWith(webSocketConnection),
        shareReplay(1)
      )
      .subscribe(solutions => {
        this._solutionsSubject$.next(solutions);
      });
  }
  get solutions$(): Observable<Solution[]> {
    return this._solutionsSubject$.asObservable();
  }

  getSolutionsByCreationTime(): Observable<Solution[]> {
    return this.solutions$.pipe(
      map(solutions => solutions.sort(sortByCreationTime))
    );
  }

  getFilteredSolutions(databagId: string | null): Observable<Solution[]> {
    return this.solutions$.pipe(
      map(solutions =>
        solutions.filter(solution =>
          databagId ? solution.databagId === databagId : true
        )
      ),
      map(predictions => predictions.sort(sortByCreationTime))
    );
  }

  createSolutionNew(solution: Solution): Observable<Solution> {
    const solutionDTO: Solution = {
      status: SolutionStatus.created,
      name: solution.name,
      databagId: solution.databagId,
      inputFields: solution.inputFields,
      outputFields: solution.outputFields,
      solver: 'ludwig-solver',
    };
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager
          .createSolution(token, solutionDTO)
          .pipe(
            switchMap(createdSolution =>
              this.modelManager.startSolutionPipeline(
                createdSolution.id!,
                token
              )
            )
          )
      )
    );
  }

  createSolution(solution: Solution, databag: Databag): Observable<Solution> {
    solution.status = SolutionStatus.created;
    solution.databagId = databag.id;
    if (!solution.inputFields || solution.inputFields.length <= 0) {
      solution.inputFields = this.getInputFields(solution, databag);
    }
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager
          .createSolution(token, solution)
          .pipe(
            switchMap(createdSolution =>
              this.modelManager.startSolutionPipeline(
                createdSolution.id!,
                token
              )
            )
          )
      )
    );
  }

  getSolutionById(id: string): Solution | undefined {
    const solutions = this._solutionsSubject$.getValue();
    if (!solutions) {
      return undefined;
    }
    return solutions.find(solution => solution.id === id);
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

  getModelGetUlr(id: string): Observable<string> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getModelGetUrl(id, token))
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
