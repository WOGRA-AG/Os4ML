import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {UploadPageComponent} from './pages/upload-page/upload-page.component';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {ApiModule, Configuration} from "../../build/openapi/objectstore";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {MainPageComponent} from './pages/main-page/main-page.component';
import {MatButtonModule} from "@angular/material/button";
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ReportPageComponent} from './pages/report-page/report-page.component';
import { UploadSolverPageComponent } from './pages/upload-solver-page/upload-solver-page.component';

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    AppComponent,
    UploadPageComponent,
    FileUploadComponent,
    MainPageComponent,
    ToolbarComponent,
    ReportPageComponent,
    UploadSolverPageComponent,
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
        MatButtonModule,
        MatToolbarModule,
        MatSnackBarModule,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
