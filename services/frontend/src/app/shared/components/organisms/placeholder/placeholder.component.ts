import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonTypes,
  NewButtonComponent,
} from '../../molecules/new-button/new-button.component';
import { NgClass, NgIf } from '@angular/common';
import { DatabagCreateButtonComponent } from '../databag-create-button/databag-create-button.component';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    TranslateModule,
    NewButtonComponent,
    NgClass,
    DatabagCreateButtonComponent,
    NgIf,
    SolutionCreateButtonComponent,
  ],
})
export class PlaceholderComponent {
  @Input() public type:
    | 'fallback'
    | 'noDataOnDatabags'
    | 'noDataOnSolutions'
    | 'noSolutionOnSolutions'
    | 'selectedDataHasNoSolutionsOnSolutions'
    | 'noDataNoSolutionOnPredictions'
    | 'selectedDataHasNoSolutionOnPrediction'
    | 'noPredictionsOnPredictions'
    | 'selectedSolutionHasNoPrediction' = 'fallback';

  @Output() public addDatabag = new EventEmitter<void>();
  @Output() public addSolution = new EventEmitter<void>();
  @Output() public addPrediction = new EventEmitter<void>();

  public buttonTypes = ButtonTypes;

  public onAddDatabag(): void {
    this.addDatabag.emit();
  }

  public onAddSolution(): void {
    this.addSolution.emit();
  }

  public onAddPrediction(): void {
    this.addPrediction.emit();
  }
}
