import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApiModule as ModelmanagerApi, Configuration as ModelmanagerApiConfig} from '../../build/openapi/modelmanager';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DatabagTemplateComponent } from './templates/databag-template/databag-template.component';
import {DatabagsModule} from './databags/databags.module';
import {SharedModule} from './shared/shared.module';
import { NotFoundTemplateComponent } from './templates/not-found-template/not-found-template.component';
import { DashboardTemplateComponent } from './templates/dashboard-template/dashboard-template.component';
import {SolutionsModule} from './solutions/solutions.module';
import {CoreModule} from './core/core.module';

export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ModelmanagerApi.forRoot(() => new ModelmanagerApiConfig(
      {
        basePath: ''
      }
    )),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    DatabagsModule,
    SolutionsModule,
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
