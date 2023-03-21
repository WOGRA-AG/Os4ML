import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePredictionComponent } from './components/create-prediction/create-prediction.component';
import { SharedModule } from '../shared/shared.module';
import { PredictionsListComponent } from './components/predictions-list/predictions-list.component';
import { PredictionsListItemComponent } from './components/predictions-list-item/predictions-list-item.component';
import { NoPredictionPlaceholderComponent } from './components/no-prediction-placeholder/no-prediction-placeholder.component';

@NgModule({
  declarations: [
    CreatePredictionComponent,
    PredictionsListComponent,
    PredictionsListItemComponent,
    NoPredictionPlaceholderComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    CreatePredictionComponent,
    PredictionsListComponent,
    NoPredictionPlaceholderComponent,
  ],
})
export class PredictionsModule {}
