import {NgModule} from '@angular/core';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {SharedModule} from '../shared/shared.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ErrorInterceptor} from './interceptors/error.interceptor';


@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  exports: [
    PageNotFoundComponent
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
})
export class CoreModule {
}
