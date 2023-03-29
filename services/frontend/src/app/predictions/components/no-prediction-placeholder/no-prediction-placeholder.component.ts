import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlaceholderComponent } from '../../../shared/components/molecules/placeholder/placeholder.component';

@Component({
  selector: 'app-no-prediction-placeholder',
  templateUrl: './no-prediction-placeholder.component.html',
  styleUrls: ['./no-prediction-placeholder.component.scss'],
  standalone: true,
  imports: [PlaceholderComponent, TranslateModule],
})
export class NoPredictionPlaceholderComponent {
  @Output() public addPredictionChange = new EventEmitter<void>();
}
