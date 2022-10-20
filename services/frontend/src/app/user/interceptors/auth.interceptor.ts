import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {UserFacade} from '../services/user-facade.service';
import {User} from '../../../../build/openapi/jobmanager';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  user: User = {id: '', email: '', rawToken: ''};

  constructor(private userFacade: UserFacade) {
    this.userFacade.currentUser$.pipe().subscribe(
      currentUser => this.user = currentUser
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type === 0) {
          return;
        }
        let token: string;
        if (httpEvent instanceof HttpResponse) {
          if (httpEvent.headers.has('x-auth-request-access-token')) {
            token = httpEvent.headers.get('x-auth-request-access-token') || '';
            if (token === this.user?.rawToken) {
              return;
            }
            this.userFacade.updateUser(token);
          }
        }
      })
    );
  }
}
