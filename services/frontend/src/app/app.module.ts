import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material/material.module';
import {ApiModule as ModelmanagerApi, Configuration as ModelmanagerApiConfig} from '../../build/openapi/modelmanager';
import { DatabagTemplateComponent } from './templates/databag-template/databag-template.component';
import {DatabagsModule} from './databags/databags.module';
import {SharedModule} from './shared/shared.module';
import { NotFoundTemplateComponent } from './templates/not-found-template/not-found-template.component';
import { DashboardTemplateComponent } from './templates/dashboard-template/dashboard-template.component';
import {SolutionsModule} from './solutions/solutions.module';
import {CoreModule} from './core/core.module';
import { NavModule } from './nav/nav.module';


@NgModule({
  declarations: [
    AppComponent,
    DatabagTemplateComponent,
    NotFoundTemplateComponent,
    DashboardTemplateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ModelmanagerApi.forRoot(() => new ModelmanagerApiConfig(
      {
        basePath: ''
      }
    )),
    MaterialModule,
    DatabagsModule,
    SolutionsModule,
    SharedModule,
    CoreModule,
    NavModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
