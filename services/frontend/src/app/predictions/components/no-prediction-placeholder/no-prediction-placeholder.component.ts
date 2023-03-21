import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-no-prediction-placeholder',
  templateUrl: './no-prediction-placeholder.component.html',
  styleUrls: ['./no-prediction-placeholder.component.scss'],
})
export class NoPredictionPlaceholderComponent {
  @Output() public addPredictionChange = new EventEmitter<void>();
}
