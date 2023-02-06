import { Component, EventEmitter, Output } from '@angular/core';
import { Solver } from 'build/openapi/modelmanager';
import { Observable } from 'rxjs';
import { SolverService } from '../../services/solver.service';

@Component({
  selector: 'app-choose-solver',
  templateUrl: './choose-solver.component.html',
  styleUrls: ['./choose-solver.component.scss'],
})
export class ChooseSolverComponent {
  @Output() selectedSolver = new EventEmitter<Solver>();
  lastSelectedSolver: Solver | null = null;

  solvers$: Observable<Solver[]>;

  constructor(public solverService: SolverService) {
    this.solvers$ = this.solverService.solvers$;
  }

  selectSolver(solver: Solver) {
    this.lastSelectedSolver = solver;
    this.selectedSolver.emit(solver);
  }
}
