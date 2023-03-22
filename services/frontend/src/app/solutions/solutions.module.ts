import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SolutionListComponent } from './components/solution-list/solution-list.component';
import { NoSolutionsPlaceholderComponent } from './components/no-solutions-placeholder/no-solutions-placeholder.component';
import { SolutionListItemComponent } from './components/solution-list-item/solution-list-item.component';
import { SolutionSettingComponent } from './components/solution-setting/solution-setting.component';
import { ChooseDatabagColumnComponent } from './components/choose-databag-column/choose-databag-column.component';
import { ChooseSolverComponent } from './components/choose-solver/choose-solver.component';

@NgModule({
  imports: [SharedModule],
  exports: [
    SolutionListComponent,
    NoSolutionsPlaceholderComponent,
    ChooseDatabagColumnComponent,
    ChooseSolverComponent,
  ],
  declarations: [
    // components
    SolutionListComponent,
    NoSolutionsPlaceholderComponent,
    SolutionListItemComponent,
    SolutionSettingComponent,
    ChooseDatabagColumnComponent,
    ChooseSolverComponent,
  ],
})
export class SolutionsModule {}
