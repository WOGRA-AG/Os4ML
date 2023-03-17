import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePredictionComponent } from './components/create-prediction/create-prediction.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CreatePredictionComponent],
  imports: [CommonModule, SharedModule],
  exports: [CreatePredictionComponent],
})
export class PredictionsModule {}
