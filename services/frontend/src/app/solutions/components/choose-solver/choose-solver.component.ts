import { Component, EventEmitter, Output } from '@angular/core';
import { Solver } from 'build/openapi/modelmanager';
import { map, Observable } from 'rxjs';
import { SolverService } from '../../services/solver.service';
import { ListItem } from '../../../shared/models/list-item';

@Component({
  selector: 'app-choose-solver',
  templateUrl: './choose-solver.component.html',
  styleUrls: ['./choose-solver.component.scss'],
})
export class ChooseSolverComponent {
  @Output() selectedSolver = new EventEmitter<Solver>();

  listItems$: Observable<ListItem[]>;

  constructor(public solverService: SolverService) {
    this.listItems$ = this.solverService.solvers$.pipe(
      map(solvers =>
        solvers.map(solver => ({
          key: solver.name || '',
          label: solver.name || '',
          description: solver.description || '',
        }))
      )
    );
  }

  selectSolver(key: string) {
    this.solverService
      .getSolverByName(key)
      .subscribe(solver => this.selectedSolver.emit(solver));
  }
}
