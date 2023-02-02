import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import {
  ApiModule as ModelmanagerApi,
  Configuration as ModelmanagerApiConfig,
} from '../../build/openapi/modelmanager';
import { DatabagsModule } from './databags/databags.module';
import { SharedModule } from './shared/shared.module';
import { SolutionsModule } from './solutions/solutions.module';
import { CoreModule } from './core/core.module';
import { FastLaneModule } from './fast-lane/fast-lane.module';
import { DatabagPageComponent } from './templates/pages/databag-page/databag-page.component';
import { NotFoundPageComponent } from './templates/pages/not-found-page/not-found-page.component';
import { DashboardPageComponent } from './templates/pages/dashboard-page/dashboard-page.component';

@NgModule({
  declarations: [
    AppComponent,
    DatabagPageComponent,
    NotFoundPageComponent,
    DashboardPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ModelmanagerApi.forRoot(
      () =>
        new ModelmanagerApiConfig({
          basePath: '',
        })
    ),
    MaterialModule,
    DatabagsModule,
    SolutionsModule,
    SharedModule,
    CoreModule,
    FastLaneModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
