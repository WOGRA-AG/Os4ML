import { NgModule } from '@angular/core';
import { GettingStartedStepperComponent } from './components/getting-started-stepper/getting-started-stepper.component';
import { SharedModule } from '../shared/shared.module';
import { DatabagsModule } from '../databags/databags.module';
import { SolutionsModule } from '../solutions/solutions.module';

@NgModule({
  declarations: [GettingStartedStepperComponent],
  exports: [GettingStartedStepperComponent],
  imports: [SharedModule, DatabagsModule, SolutionsModule],
})
export class FastLaneModule {}
