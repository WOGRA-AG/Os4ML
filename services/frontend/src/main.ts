import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MaterialModule } from './app/components/atoms/material/material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  ApiModule as ModelmanagerApi,
  Configuration as ModelmanagerApiConfig,
} from '../build/openapi/modelmanager';
import {
  withInterceptorsFromDi,
  provideHttpClient,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app/routes';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideLottieOptions } from 'ngx-lottie';

if (environment.production) {
  enableProdMode();
}

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

bootstrapApplication(AppComponent, {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    importProvidersFrom(
      BrowserModule,
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
      RouterModule.forRoot(ROUTES, {
        onSameUrlNavigation: 'reload',
        useHash: true,
      }),
      MaterialModule
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideLottieOptions({ player: () => import('lottie-web') }),
  ],
}).catch(err => console.error(err));
