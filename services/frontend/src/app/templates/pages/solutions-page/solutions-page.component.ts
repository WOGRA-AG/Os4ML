import { Component } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Databag, Solution } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../../databags/services/databag.service';
import { SolutionService } from '../../../solutions/services/solution.service';
import { CreateDatabagStepperComponent } from '../../dialogs/create-databag-stepper/create-databag-stepper.component';
import { CreateSolutionStepperComponent } from '../../dialogs/create-solution-stepper/create-solution-stepper.component';
import { HasElementsPipe } from '../../../shared/pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NoDatabagsPlaceholderComponent } from '../../../databags/components/no-databags-placeholder/no-databags-placeholder.component';
import { NoSolutionsPlaceholderComponent } from '../../../solutions/components/no-solutions-placeholder/no-solutions-placeholder.component';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { SolutionListComponent } from '../../../solutions/components/solution-list/solution-list.component';
import { ChooseDatabagComponent } from '../../../databags/components/choose-databag/choose-databag.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-solutions-page',
  templateUrl: './solutions-page.component.html',
  styleUrls: ['./solutions-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ChooseDatabagComponent,
    SolutionListComponent,
    ButtonComponent,
    NoSolutionsPlaceholderComponent,
    NoDatabagsPlaceholderComponent,
    AsyncPipe,
    TranslateModule,
    HasElementsPipe,
  ],
})
export class SolutionsPageComponent {
  public databags$: Observable<Databag[]>;
  public selectedDatabagId$: BehaviorSubject<string> = new BehaviorSubject('');
  public solutionsInDatabag$: Observable<Solution[]>;

  constructor(
    private databagService: DatabagService,
    private solutionService: SolutionService,
    private dialog: MatDialog
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.solutionsInDatabag$ = this.selectedDatabagId$.pipe(
      switchMap(databagId =>
        this.solutionService.getSolutionsByDatabagIdSortByCreationTime(
          databagId
        )
      )
    );
  }

  addDatabag(): void {
    this.dialog.open(CreateDatabagStepperComponent);
  }

  async addSolution(): Promise<void> {
    const databag = await firstValueFrom(
      this.databagService.getDatabagById(this.selectedDatabagId$.getValue())
    );
    this.dialog.open(CreateSolutionStepperComponent, {
      data: { databag },
    });
  }

  selectedDatabagChanged(databagId: string): void {
    this.selectedDatabagId$.next(databagId);
  }
}
