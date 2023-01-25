import { Injectable } from '@angular/core';
import {UserService} from '../../core/services/user.service';
import {ModelmanagerService, Solver} from '../../../../build/openapi/modelmanager';
import {map, Observable, switchMap} from 'rxjs';
import {PipelineStep} from '../../core/models/pipeline-step';

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  constructor(private userService: UserService, private modelManager: ModelmanagerService) {}

  get solvers$(): Observable<Solver[]> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.getSolvers(token)),
      map(solvers => solvers.filter(solver => solver.pipelineStep === PipelineStep.solver))
    );
  }
}
