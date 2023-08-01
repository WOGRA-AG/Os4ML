import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-prediction-placeholder',
  templateUrl: './no-prediction-placeholder.component.html',
  styleUrls: ['./no-prediction-placeholder.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class NoPredictionPlaceholderComponent {
  @Output() public addPredictionChange = new EventEmitter<void>();
}
