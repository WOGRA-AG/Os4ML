import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePredictionComponent } from './components/create-prediction/create-prediction.component';
import { SharedModule } from '../shared/shared.module';
import { PredictionsListComponent } from './components/predictions-list/predictions-list.component';
import { PredictionsListItemComponent } from './components/predictions-list-item/predictions-list-item.component';

@NgModule({
  declarations: [
    CreatePredictionComponent,
    PredictionsListComponent,
    PredictionsListItemComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [CreatePredictionComponent, PredictionsListComponent],
})
export class PredictionsModule {}
