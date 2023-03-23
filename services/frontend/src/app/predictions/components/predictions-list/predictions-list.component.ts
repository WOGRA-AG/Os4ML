import { Component, Input } from '@angular/core';
import { Prediction } from 'build/openapi/modelmanager';
import { PredictionsListItemComponent } from '../predictions-list-item/predictions-list-item.component';
import { NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-predictions-list',
  templateUrl: './predictions-list.component.html',
  styleUrls: ['./predictions-list.component.scss'],
  standalone: true,
  imports: [MatListModule, NgFor, PredictionsListItemComponent],
})
export class PredictionsListComponent {
  @Input() public predictions: Prediction[] = [];
}
