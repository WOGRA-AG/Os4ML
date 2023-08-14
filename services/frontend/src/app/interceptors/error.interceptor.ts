import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorService: ErrorService,
    private translate: TranslateService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(err => {
        const errorMsg: string = err.error.message || err.statusText;

        if (err.status === 401 || err.status === 403) {
          window.location.reload();
        } else if (err.status === 404 && err.url.includes('/run/')) {
        } else if (err.status >= 400 && err.status <= 499) {
          this.translate.get('action.confirm').subscribe((res: string) => {
            this.errorService.reportError(errorMsg, res);
          });
        }
        return throwError(() => errorMsg);
      })
    );
  }
}
