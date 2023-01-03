import { Injectable } from '@angular/core';
import {UserService} from '../../core/services/user.service';
import {ErrorService} from '../../core/services/error.service';
import {ModelmanagerService, Solver} from '../../../../build/openapi/modelmanager';
import {map, Observable, switchMap} from 'rxjs';
import {PipelineStep} from '../../core/models/pipeline-step';

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  solvers$: Observable<Solver[]>;

  constructor(private userService: UserService, private errorService: ErrorService, private modelManager: ModelmanagerService) {
    this.solvers$ = this.userService.currentUserToken$.pipe(
      switchMap(token => this.modelManager.getSolvers(token)),
      map(solvers => solvers.filter(solver => solver.pipelineStep === PipelineStep.solver))
    );
  }
}
