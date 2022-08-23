import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatabagPageComponent} from './pages/databag-page/databag-page.component';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {MaterialModule} from './material/material.module';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {UserPageComponent} from './pages/user-page/user-page.component';
import {PageNotFoundPageComponent} from './pages/page-not-found-page/page-not-found-page.component';
import {SupportComponent} from './components/support/support.component';
import {DatabagListComponent} from './components/databag-list/databag-list.component';
import {DatabagPlaceholderComponent} from './components/databag-placeholder/databag-placeholder.component';
import {DialogAddDatabagComponent} from './components/dialog-add-databag/dialog-add-databag.component';
import {DialogDefineDatabagComponent} from './components/dialog-define-databag/dialog-define-databag.component';
import {DragAndDropDirective} from './directives/drag-and-drop.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogDynamicComponent} from './components/dialog-dynamic/dialog-dynamic.component';
import {SolutionsComponent} from './components/solutions/solutions.component';
import {SolutionsPlaceholderComponent} from './components/solutions-placeholder/solutions-placeholder.component';
import {SolutionsListComponent} from './components/solutions-list/solutions-list.component';
import {DialogDefineOutputComponent} from './components/dialog-define-output/dialog-define-output.component';
import {DialogDefineSolverComponent} from './components/dialog-define-solver/dialog-define-solver.component';
import {SolverListItemComponent} from './components/solver-list-item/solver-list-item.component';
import {ApiModule as ObjectstoreApi, Configuration as ObjectstoreApiConfig} from '../../build/openapi/objectstore';
import {ApiModule as JobmanagerApi, Configuration as JobmanagerApiConfig} from '../../build/openapi/jobmanager';
import {SolutionListItemComponent} from './components/solution-list-item/solution-list-item.component';
import {DatabagTableComponent} from './components/databag-table/databag-table.component';
import {DialogEditDatabagComponent} from './components/dialog-edit-databag/dialog-edit-databag.component';
import {LocalizedDatePipe} from './pipes/localized-date.pipe';
import {DialogDeleteSolutionComponent} from './components/dialog-delete-solution/dialog-delete-solution.component';
import {DialogDetailSolutionComponent} from './components/dialog-detail-solution/dialog-detail-solution.component';

export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    DatabagPageComponent,
    FileUploadComponent,
    MainPageComponent,
    ToolbarComponent,
    SidenavComponent,
    SettingsPageComponent,
    UserPageComponent,
    PageNotFoundPageComponent,
    SupportComponent,
    DatabagListComponent,
    DatabagPlaceholderComponent,
    DialogAddDatabagComponent,
    DialogDefineDatabagComponent,
    DragAndDropDirective,
    DialogDynamicComponent,
    SolutionsComponent,
    SolutionsPlaceholderComponent,
    SolutionsListComponent,
    DialogDefineOutputComponent,
    DialogDefineSolverComponent,
    SolverListItemComponent,
    SolutionListItemComponent,
    DatabagTableComponent,
    DialogEditDatabagComponent,
    LocalizedDatePipe,
    DialogDeleteSolutionComponent,
    DialogDetailSolutionComponent
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
    ObjectstoreApi.forRoot(() => new ObjectstoreApiConfig(
      {
        basePath: ''
      }
    )),
    JobmanagerApi.forRoot(() => new JobmanagerApiConfig(
      {
        basePath: ''
      }
    )),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
