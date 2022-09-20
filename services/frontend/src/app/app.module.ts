import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatabagPageComponent} from './pages/databag-page/databag-page.component';
import {UploadFieldComponent} from './components/shared/molecules/upload-field/upload-field.component';
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
import {DatabagChooseComponent} from './components/shared/molecules/databag-choose/databag-choose.component';
import {DatabagPlaceholderComponent} from './components/shared/molecules/databag-placeholder/databag-placeholder.component';
import {CreateDatabagComponent} from './components/shared/organisms/create-databag/create-databag.component';
import {DragAndDropDirective} from './directives/drag-and-drop.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogDynamicComponent} from './components/dialog-dynamic/dialog-dynamic.component';
import {SolutionsComponent} from './components/shared/templates/solutions/solutions.component';
import {SolutionPlaceholderComponent} from './components/shared/molecules/solution-placeholder/solution-placeholder.component';
import {SolutionsListComponent} from './components/shared/organisms/solutions-list/solutions-list.component';
import {CreateSolutionComponent} from './components/shared/organisms/create-solution/create-solution.component';
import {ToggleItemComponent} from './components/shared/molecules/toggle-item/toggle-item.component';
import {ApiModule as ObjectstoreApi, Configuration as ObjectstoreApiConfig} from '../../build/openapi/objectstore';
import {ApiModule as JobmanagerApi, Configuration as JobmanagerApiConfig} from '../../build/openapi/jobmanager';
import {SolutionListItemComponent} from './components/shared/molecules/solution-list-item/solution-list-item.component';
import {DatabagsComponent} from './components/shared/templates/databags/databags.component';
import {SettingDatabagComponent} from './components/shared/organisms/setting-databag/setting-databag.component';
import {LocalizedDatePipe} from './pipes/localized-date.pipe';
import {PopupDeleteComponent} from './components/shared/organisms/popup-delete/popup-delete.component';
import {SettingSolutionComponent} from './components/shared/organisms/setting-solution/setting-solution.component';
import {CloseButtonComponent} from './components/shared/atoms/close-button/close-button.component';
import {DialogHeaderComponent} from './components/shared/molecules/dialog-header/dialog-header.component';
import {DialogSectionComponent} from './components/shared/molecules/dialog-section/dialog-section.component';
import {DialogElementDividerComponent} from './components/shared/atoms/dialog-element-divider/dialog-element-divider.component';
import {DatabagFieldsComponent} from './components/shared/molecules/databag-fields/databag-fields.component';
import {DatabagsListComponent} from './components/shared/organisms/databags-list/databags-list.component';
import {DatabagListItemComponent} from './components/shared/molecules/databag-list-item/databag-list-item.component';

export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    DatabagPageComponent,
    UploadFieldComponent,
    MainPageComponent,
    ToolbarComponent,
    SidenavComponent,
    SettingsPageComponent,
    UserPageComponent,
    PageNotFoundPageComponent,
    SupportComponent,
    DatabagChooseComponent,
    DatabagPlaceholderComponent,
    CreateDatabagComponent,
    DragAndDropDirective,
    DialogDynamicComponent,
    SolutionsComponent,
    SolutionPlaceholderComponent,
    SolutionsListComponent,
    CreateSolutionComponent,
    ToggleItemComponent,
    SolutionListItemComponent,
    DatabagsComponent,
    SettingDatabagComponent,
    LocalizedDatePipe,
    PopupDeleteComponent,
    SettingSolutionComponent,
    CloseButtonComponent,
    DialogHeaderComponent,
    DialogSectionComponent,
    DialogElementDividerComponent,
    DatabagFieldsComponent,
    DatabagsListComponent,
    DatabagListItemComponent
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
