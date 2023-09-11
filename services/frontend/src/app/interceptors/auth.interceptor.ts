import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(httpEvent => {
        if (
          httpEvent.type === 0 ||
          !(httpEvent instanceof HttpResponse) ||
          !httpEvent.headers.has('x-auth-request-access-token')
        ) {
          return;
        }
        const token =
          httpEvent.headers.get('x-auth-request-access-token') || '';
        this.userService.addToken(token);
      })
    );
  }
}
