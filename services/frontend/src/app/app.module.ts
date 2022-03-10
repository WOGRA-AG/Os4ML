import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DatabagPageComponent} from './pages/databag-page/databag-page.component';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {ApiModule, Configuration} from '../../build/openapi/objectstore';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {ReportPageComponent} from './pages/report-page/report-page.component';
import {UploadSolverPageComponent} from './pages/upload-solver-page/upload-solver-page.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {MaterialModule} from './material/material.module';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {UserPageComponent} from './pages/user-page/user-page.component';
import {PageNotFoundPageComponent} from './pages/page-not-found-page/page-not-found-page.component';
import {SupportComponent} from './components/support/support.component';
import {SupportPageComponent} from './pages/support-page/support-page.component';
import {DatabagListComponent} from './components/databag-list/databag-list.component';
import {DatabagPlaceholderComponent} from './components/databag-placeholder/databag-placeholder.component';
import {DialogAddDatabagComponent} from './components/dialog-add-databag/dialog-add-databag.component';
import {DialogDefineDatabagComponent} from './components/dialog-define-databag/dialog-define-databag.component';
import {DragAndDropDirective} from './directives/drag-and-drop.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogDynamicComponent} from './components/dialog-dynamic/dialog-dynamic.component';

export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

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
    DatabagListComponent,
    DatabagPlaceholderComponent,
    DialogAddDatabagComponent,
    DialogDefineDatabagComponent,
    DragAndDropDirective,
    DialogDynamicComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ApiModule.forRoot(() => new Configuration(
        {
          basePath: ''
        }
      )),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
