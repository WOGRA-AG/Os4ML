import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, map, Observable, startWith, switchMap} from 'rxjs';
import {User} from '../../../../build/openapi/modelmanager';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser$: Observable<User>;
  currentUserToken$: Observable<string>;

  private jwtToken$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly jwtTokenStorage = 'JWT_TOKEN';


  constructor(private router: Router) {
    this.currentUser$ = this.jwtToken$.pipe(
      filter(token => !!token),
      map(token => {
        const encodedPayload = token.split('.')[1];
        const payload = window.atob(encodedPayload);
        const kcToken = JSON.parse(payload);
        return {
          id: kcToken.sub,
          email: kcToken.email,
          firstName: kcToken.given_name,
          lastName: kcToken.family_name,
          rawToken: token
        };
      }),
      startWith({email: '', id: '', rawToken: ''}),
    );

    this.currentUserToken$ = this.currentUser$.pipe(
      map(user => user.rawToken));
  }

  updateUser(jwtTokenString: string): void {
    localStorage.setItem(this.jwtTokenStorage, jwtTokenString);
    this.jwtToken$.next(jwtTokenString);
  }

  logout(): void {
    localStorage.removeItem(this.jwtTokenStorage);
    this.jwtToken$.next('');
    this.router.navigateByUrl('/logout');
  }

  refresh(): void {
    this.jwtToken$.next(this.jwtToken$.getValue());
  }
}
