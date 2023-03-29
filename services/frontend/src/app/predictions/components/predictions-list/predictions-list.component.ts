import { Component, Input } from '@angular/core';
import { Prediction } from 'build/openapi/modelmanager';
import { PredictionsListItemComponent } from '../predictions-list-item/predictions-list-item.component';
import { NgFor } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-predictions-list',
  templateUrl: './predictions-list.component.html',
  styleUrls: ['./predictions-list.component.scss'],
  standalone: true,
  imports: [MaterialModule, NgFor, PredictionsListItemComponent],
})
export class PredictionsListComponent {
  @Input() public predictions: Prediction[] = [];
}
