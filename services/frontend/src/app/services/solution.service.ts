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
} from '../../../build/openapi/modelmanager';
import { UserService } from './user.service';
import { WebSocketConnectionService } from 'src/app/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/lib/sort/sort-by-creation-time';
import { solutionWebsocketPath } from 'src/environments/environment';
import { filterNotDefined } from '../lib/rxjs/filter-not-defined';
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
    const webSocketConnection = this.webSocketConnectionService.connect<
      Solution[]
    >(solutionWebsocketPath);
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
  createSolution(solution: Solution): Observable<Solution> {
    const solutionDTO: Solution = {
      status: SolutionStatus.created,
      name: solution.name,
      databagId: solution.databagId,
      inputFields: solution.inputFields,
      outputFields: solution.outputFields,
      transferLearningSettings: solution.transferLearningSettings,
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
  getSolutionById(id: string): Solution | undefined {
    const solutions = this._solutionsSubject$.getValue();
    if (!solutions) {
      return undefined;
    }
    return solutions.find(solution => solution.id === id);
  }

  getSolutionById$(id: string): Observable<Solution> {
    return this.solutions$.pipe(
      map(solutions => solutions.find(solution => solution.id === id)),
      filterNotDefined()
    );
  }

  loadSolutionById(id: string): Observable<Solution> {
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
