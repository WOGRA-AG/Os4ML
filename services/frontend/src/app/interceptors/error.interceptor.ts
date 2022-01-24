import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private _snackbar: MatSnackBar,
    private translate: TranslateService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      const errorMsg: string = err.error.message || err.statusText;

      if (err.status === 401 || err.status === 403 || err.status === 404) {
        this.router.navigate(['/']);
      } else if (err.status >= 400 && err.status <= 499) {
        this.translate.get('error.confirm').subscribe((res: string) => {
          this._snackbar.open(errorMsg, res, {duration: 3000});
        })
      }
      return throwError(() => errorMsg);
    }));
  }
}
