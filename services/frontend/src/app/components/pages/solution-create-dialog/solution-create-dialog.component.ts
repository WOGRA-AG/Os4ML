import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { Os4mlDialogTemplateComponent } from '../../templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { Observable } from 'rxjs';
import {
  Databag,
  Solution,
  TransferLearningModel,
} from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../../services/databag.service';
import { ButtonComponent } from '../../molecules/button/button.component';
import { SolutionService } from '../../../services/solution.service';
import { MaterialModule } from '../../atoms/material/material.module';
import { SolutionCreateFormComponent } from '../../organisms/solution-create-form/solution-create-form.component';
import { Router } from '@angular/router';
import { LoaderSpinningPlanetComponent } from '../../molecules/loader-spinning-planet/loader-spinning-planet.component';
import { TransferLearningService } from '../../../services/transfer-learning.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-solution-dialog',
  templateUrl: './solution-create-dialog.component.html',
  standalone: true,
  imports: [
    TranslateModule,
    NgForOf,
    Os4mlDialogTemplateComponent,
    AsyncPipe,
    NgIf,
    ButtonComponent,
    MaterialModule,
    SolutionCreateFormComponent,
    IconButtonComponent,
    LoaderSpinningPlanetComponent,
  ],
  styleUrls: ['./solution-create-dialog.component.scss'],
})
export class SolutionCreateDialogComponent {
  public databags$: Observable<Databag[]>;
  public transferLearningModels$: Observable<TransferLearningModel[]>;
  public submitting = false;
  private destroyRef = inject(DestroyRef);
  constructor(
    private router: Router,
    private solutionService: SolutionService,
    private databagService: DatabagService,
    private transferLearningService: TransferLearningService,
    public dialogRef: MatDialogRef<SolutionCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { databagId?: string }
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
    this.transferLearningModels$ =
      this.transferLearningService.transferLearningModels$;
  }
  submit(newSolution: Solution): void {
    this.submitting = true;
    this.solutionService
      .createSolution(newSolution)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(solution => {
        this.submitting = false;
        this.dialogRef.close(solution);
        this.router.navigate(['solutions'], {
          queryParams: { selectedDatabag: solution.databagId },
        });
      });
  }
  close(): void {
    this.dialogRef.close();
  }
}
