import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {combineLatest, map, Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return combineLatest([next.handle(request), this.userService.currentUser$]).pipe(
      map(([httpEvent, user]) => {
        if (httpEvent.type === 0) {
          return httpEvent;
        }
        let token: string;
        if (httpEvent instanceof HttpResponse) {
          if (httpEvent.headers.has('x-auth-request-access-token')) {
            token = httpEvent.headers.get('x-auth-request-access-token') || '';
            if (token === user?.rawToken) {
              return httpEvent;
            }
            this.userService.updateUser(token);
          }
        }
        return httpEvent;
      })
    );
  }
}
