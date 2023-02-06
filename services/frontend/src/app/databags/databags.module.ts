import { NgModule } from '@angular/core';
import { DatabagListComponent } from './components/databag-list/databag-list.component';
import { DatabagListItemComponent } from './components/databag-list-item/databag-list-item.component';
import { SharedModule } from '../shared/shared.module';
import { NoDatabagsPlaceholderComponent } from './components/no-databags-placeholder/no-databags-placeholder.component';
import { DatabagSettingComponent } from './components/databag-setting/databag-setting.component';
import { DatabagFieldsComponent } from './components/databag-fields/databag-fields.component';
import { ChooseDatabagComponent } from './components/choose-databag/choose-databag.component';
import { CreateDatabagStepperComponent } from './components/create-databag-stepper/create-databag-stepper.component';
import { CreateDatabagComponent } from './components/create-databag/create-databag.component';

@NgModule({
  imports: [SharedModule],
  exports: [
    NoDatabagsPlaceholderComponent,
    DatabagListComponent,
    DatabagFieldsComponent,
    ChooseDatabagComponent,
    CreateDatabagComponent,
  ],
  declarations: [
    DatabagListComponent,
    DatabagListItemComponent,
    NoDatabagsPlaceholderComponent,
    DatabagSettingComponent,
    DatabagFieldsComponent,
    ChooseDatabagComponent,
    CreateDatabagStepperComponent,
    CreateDatabagComponent,
  ],
})
export class DatabagsModule {}
