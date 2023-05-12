import { Component } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Databag, Solution } from '../../../../build/openapi/modelmanager';
import { DatabagService } from '../../databags/services/databag.service';
import { SolutionService } from '../../solutions/services/solution.service';
import { CreateDatabagStepperComponent } from '../dialogs/create-databag-stepper/create-databag-stepper.component';
import { CreateSolutionStepperComponent } from '../dialogs/create-solution-stepper/create-solution-stepper.component';
import { HasElementsPipe } from '../../shared/pipes/has-elements.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NoDatabagsPlaceholderComponent } from '../../databags/components/no-databags-placeholder/no-databags-placeholder.component';
import { NoSolutionsPlaceholderComponent } from '../../solutions/components/no-solutions-placeholder/no-solutions-placeholder.component';
import { ButtonComponent } from '../../design/components/atoms/button/button.component';
import { ChooseDatabagComponent } from '../../databags/components/choose-databag/choose-databag.component';
import { NgIf, AsyncPipe, NgForOf } from '@angular/common';
import { DataInsightCardComponent } from '../../shared/components/organisms/data-insight-card/data-insight-card.component';
import { DataInsightItemComponent } from '../../shared/components/molecules/data-insight-item/data-insight-item.component';
import { StarRatingComponent } from '../../shared/components/molecules/star-rating/star-rating.component';
import { LocalizedDatePipe } from '../../shared/pipes/localized-date.pipe';
import { ProcessingStatusIndicatorComponent } from '../../shared/components/molecules/processing-status-indicator/processing-status-indicator.component';
import { RuntimeIndicatorComponent } from '../../shared/components/molecules/runtime-indicator/runtime-indicator.component';
import { MaterialModule } from '../../material/material.module';
import { IconButtonComponent } from '../../design/components/atoms/icon-button/icon-button.component';
import { RouterLink } from '@angular/router';
import { ShortStatusPipe } from '../../shared/pipes/short-status.pipe';
import { Os4mlDefaultTemplateComponent } from '../../shared/components/templates/os4ml-default-template/os4ml-default-template.component';
import { PipelineStatus } from '../../core/models/pipeline-status';
import { SolutionSettingComponent } from '../../solutions/components/solution-setting/solution-setting.component';
import {CreatePredictionComponent} from '../dialogs/create-prediction/create-prediction.component';

@Component({
  selector: 'app-solutions-page',
  templateUrl: './solutions-page.component.html',
  styleUrls: ['./solutions-page.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ChooseDatabagComponent,
    ButtonComponent,
    NoSolutionsPlaceholderComponent,
    NoDatabagsPlaceholderComponent,
    AsyncPipe,
    TranslateModule,
    HasElementsPipe,
    DataInsightCardComponent,
    DataInsightItemComponent,
    NgForOf,
    StarRatingComponent,
    LocalizedDatePipe,
    ProcessingStatusIndicatorComponent,
    RuntimeIndicatorComponent,
    IconButtonComponent,
    MaterialModule,
    RouterLink,
    ShortStatusPipe,
    Os4mlDefaultTemplateComponent,
  ],
})
export class SolutionsPageComponent {
  public databags$: Observable<Databag[]>;
  public selectedDatabagId$: BehaviorSubject<string> = new BehaviorSubject('');
  public solutionsInDatabag$: Observable<Solution[]>;
  public pipelineStatus = PipelineStatus;

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
  openSolutionSettingDialog(solution: Solution): void {
    this.dialog.open(SolutionSettingComponent, {
      data: { solution },
      panelClass: 'setting-dialog',
      height: '100%',
      position: {
        right: '12px',
      },
    });
  }

  openCreatePredictionDialog(solution: Solution): void {
    this.dialog.open(CreatePredictionComponent, {
      data: {
        solution: { solution },
      },
    });
  }

  selectedDatabagChanged(databagId: string): void {
    this.selectedDatabagId$.next(databagId);
  }
}
