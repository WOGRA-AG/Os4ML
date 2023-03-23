import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Solver } from 'build/openapi/modelmanager';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { SolverService } from '../../services/solver.service';
import { ListItem } from '../../../shared/models/list-item';
import { SelectableListComponent } from '../../../design/components/organisms/selectable-list/selectable-list.component';

@Component({
  selector: 'app-choose-solver',
  templateUrl: './choose-solver.component.html',
  styleUrls: ['./choose-solver.component.scss'],
  standalone: true,
  imports: [SelectableListComponent],
})
export class ChooseSolverComponent implements OnDestroy {
  @Output() public selectedSolverChange: EventEmitter<Solver> =
    new EventEmitter<Solver>();

  public listItems$: Observable<ListItem[]>;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private solverService: SolverService) {
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

  selectSolver(key: string): void {
    this.solverService
      .getSolverByName(key)
      .pipe(
        takeUntil(this.destroy$),
        filter(solver => !!solver),
        map(solver => solver!)
      )
      .subscribe(solver => this.selectedSolverChange.emit(solver));
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
