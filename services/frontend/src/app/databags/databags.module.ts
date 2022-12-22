import { NgModule } from '@angular/core';
import { DatabagListComponent } from './components/databag-list/databag-list.component';
import { DatabagListItemComponent } from './components/databag-list-item/databag-list-item.component';
import {SharedModule} from '../shared/shared.module';
import { NoDatabagsPlaceholderComponent } from './components/no-databags-placeholder/no-databags-placeholder.component';
import { DatabagSettingComponent } from './components/databag-setting/databag-setting.component';
import { DatabagFieldsComponent } from './components/databag-fields/databag-fields.component';



@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    NoDatabagsPlaceholderComponent,
    DatabagListComponent,
    DatabagFieldsComponent,
  ],
  declarations: [
    DatabagListComponent,
    DatabagListItemComponent,
    NoDatabagsPlaceholderComponent,
    DatabagSettingComponent,
    DatabagFieldsComponent,
  ]
})
export class DatabagsModule { }
