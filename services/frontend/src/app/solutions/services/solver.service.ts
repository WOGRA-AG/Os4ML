import { Injectable } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import {
  ModelmanagerService,
  Solver,
} from '../../../../build/openapi/modelmanager';
import { filter, map, Observable, switchMap, take } from 'rxjs';
import { PipelineStep } from '../../core/models/pipeline-step';

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
        solvers.filter(solver => solver.pipelineStep === PipelineStep.solver)
      )
    );
  }

  getSolverByName(name: string): Observable<Solver> {
    return this.solvers$.pipe(
      map(solvers => solvers.filter(solver => solver?.name === name)),
      filter(solvers => solvers.length > 0),
      map(solvers => solvers[0]),
      take(1)
    );
  }
}
