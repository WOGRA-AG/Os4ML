import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import {
  ModelmanagerService,
  Solver,
  PipelineStep,
} from '../../../../build/openapi/modelmanager';
import { map, Observable, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolverService {
  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService
  ) {}

  get solvers$(): Observable<Solver[]> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getSolvers(token)),
      map(solvers =>
        solvers.filter(solver => solver.pipelineStep === PipelineStep.Solve)
      )
    );
  }

  getSolverByName(name: string): Observable<Solver | undefined> {
    return this.solvers$.pipe(
      map(solvers => solvers.find(solver => solver?.name === name)),
      take(1)
    );
  }
}
