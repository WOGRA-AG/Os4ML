import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { IconButtonComponent } from '../../shared/components/molecules/icon-button/icon-button.component';
import { Os4mlDialogTemplateComponent } from '../../shared/components/templates/os4ml-dialog-template/os4ml-dialog-template.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Databag, Solution } from '../../../../build/openapi/modelmanager';
import { DatabagService } from '../../databags/services/databag.service';
import { ButtonComponent } from '../../shared/components/molecules/button/button.component';
import { SolutionService } from '../../solutions/services/solution.service';
import { MaterialModule } from '../../shared/components/atoms/material/material.module';
import { SolutionCreateFormComponent } from '../../shared/components/organisms/solution-create-form/solution-create-form.component';
import { Router } from '@angular/router';
import { LoaderSpinningPlanetComponent } from '../../shared/components/molecules/loader-spinning-planet/loader-spinning-planet.component';

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
export class SolutionCreateDialogComponent implements OnDestroy {
  public databags$: Observable<Databag[]>;

  public submitting = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private solutionService: SolutionService,
    private databagService: DatabagService,
    public dialogRef: MatDialogRef<SolutionCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { databagId: string }
  ) {
    this.databags$ = this.databagService.getDatabagsSortByCreationTime();
  }

  submit(newSolution: Solution): void {
    this.submitting = true;
    this.solutionService
      .createSolutionNew(newSolution)
      .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
