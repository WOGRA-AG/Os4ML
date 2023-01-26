import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {combineLatest, map, Observable, tap} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return combineLatest([next.handle(request), this.userService.currentToken$]).pipe(
      tap(([httpEvent, currentToken]) => {
        if (httpEvent.type === 0 || !(httpEvent instanceof HttpResponse) || !httpEvent.headers.has('x-auth-request-access-token')){
          return;
        }
        const token = httpEvent.headers.get('x-auth-request-access-token') || '';
        if (token !== currentToken) {
          this.userService.updateUser(token);
        }
      }),
      map(([httpEvent, _]) => httpEvent)
    );
  }
}
