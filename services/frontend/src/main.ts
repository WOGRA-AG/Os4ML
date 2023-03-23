import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { PredictionsModule } from './app/predictions/predictions.module';
import { CoreModule } from './app/core/core.module';
import { SharedModule } from './app/shared/shared.module';
import { SolutionsModule } from './app/solutions/solutions.module';
import { DatabagsModule } from './app/databags/databags.module';
import { DesignModule } from './app/design/design.module';
import { MaterialModule } from './app/material/material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  ApiModule as ModelmanagerApi,
  Configuration as ModelmanagerApiConfig,
} from '../build/openapi/modelmanager';
import {
  withInterceptorsFromDi,
  provideHttpClient,
  HttpClient,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

if (environment.production) {
  enableProdMode();
}

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      ModelmanagerApi.forRoot(
        () =>
          new ModelmanagerApiConfig({
            basePath: '',
          })
      ),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      MaterialModule,
      DesignModule,
      DatabagsModule,
      SolutionsModule,
      SharedModule,
      CoreModule,
      PredictionsModule
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch(err => console.error(err));
