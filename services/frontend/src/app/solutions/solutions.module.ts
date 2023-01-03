import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import { SolutionListComponent } from './components/solution-list/solution-list.component';
import { NoSolutionsPlaceholderComponent } from './components/no-solutions-placeholder/no-solutions-placeholder.component';
import { SolutionListItemComponent } from './components/solution-list-item/solution-list-item.component';
import { FormatTimeDiffPipe } from './pipes/format-time-diff.pipe';


@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    SolutionListComponent,
    NoSolutionsPlaceholderComponent
  ],
  declarations: [
    SolutionListComponent,
    NoSolutionsPlaceholderComponent,
    SolutionListItemComponent,
    FormatTimeDiffPipe
  ]
})
export class SolutionsModule {
}
