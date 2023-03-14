import { Component, Input } from '@angular/core';
import { Prediction } from 'build/openapi/modelmanager';

@Component({
  selector: 'app-predictions-list',
  templateUrl: './predictions-list.component.html',
  styleUrls: ['./predictions-list.component.scss'],
})
export class PredictionsListComponent {
  @Input() predictions: Prediction[] = [];
}
