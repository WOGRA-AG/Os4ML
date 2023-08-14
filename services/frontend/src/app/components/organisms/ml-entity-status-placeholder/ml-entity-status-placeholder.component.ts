import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SolutionCreateButtonComponent } from '../solution-create-button/solution-create-button.component';
import { DatabagCreateButtonComponent } from '../databag-create-button/databag-create-button.component';
import { PlaceholderComponent } from '../../molecules/placeholder/placeholder.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { PredictionCreateButtonComponent } from '../prediction-create-button/prediction-create-button.component';

@Component({
  selector: 'app-ml-entity-status-placeholder',
  templateUrl: './ml-entity-status-placeholder.component.html',
  styleUrls: ['./ml-entity-status-placeholder.component.scss'],
  imports: [
    SolutionCreateButtonComponent,
    DatabagCreateButtonComponent,
    PlaceholderComponent,
    TranslateModule,
    NgIf,
    PredictionCreateButtonComponent,
  ],
  standalone: true,
})
export class MlEntityStatusPlaceholderComponent {
  @Input() public hasDatabags = false;
  @Input() public hasSolutions = false;
  @Input() public hasPredictions = false;
  @Output() public addDatabag = new EventEmitter<void>();
  @Output() public addSolution = new EventEmitter<void>();
  @Output() public addPrediction = new EventEmitter<void>();

  get placeholderStatus():
    | 'noDatabagPlaceholder'
    | 'noSolutionPlaceholder'
    | 'noPredictionPlaceholder' {
    if (!this.hasDatabags) {
      return 'noDatabagPlaceholder';
    }
    if (!this.hasSolutions) {
      return 'noSolutionPlaceholder';
    }
    if (!this.hasPredictions) {
      return 'noPredictionPlaceholder';
    }
    return 'noDatabagPlaceholder';
  }

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
