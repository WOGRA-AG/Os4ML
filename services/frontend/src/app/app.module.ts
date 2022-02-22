import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DatabagPageComponent} from './pages/databag-page/databag-page.component';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {ApiModule, Configuration} from "../../build/openapi/objectstore";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {MainPageComponent} from './pages/main-page/main-page.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {ReportPageComponent} from './pages/report-page/report-page.component';
import { UploadSolverPageComponent } from './pages/upload-solver-page/upload-solver-page.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import {MaterialModule} from "./material/material.module";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { PageNotFoundPageComponent } from './pages/page-not-found-page/page-not-found-page.component';
import { SupportComponent } from './components/support/support.component';
import { SupportPageComponent } from './pages/support-page/support-page.component';

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    AppComponent,
    DatabagPageComponent,
    FileUploadComponent,
    MainPageComponent,
    ToolbarComponent,
    ReportPageComponent,
    UploadSolverPageComponent,
    SidenavComponent,
    SettingsPageComponent,
    UserPageComponent,
    PageNotFoundPageComponent,
    SupportComponent,
    SupportPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ApiModule.forRoot(() => {
      return new Configuration(
        {
          basePath: ''
        }
      );
    }),
    MaterialModule,
    MatListModule,
    MatIconModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
