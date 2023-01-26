import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, map, Observable, startWith} from 'rxjs';
import {User} from '../../../../build/openapi/modelmanager';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly currentTokenSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly jwtTokenStorage = 'JWT_TOKEN';

  constructor(private router: Router) {}

  get currentUser$(): Observable<User> {
    return this.currentTokenSubject$.pipe(
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
  }

  get currentToken$(): Observable<string> {
    return this.currentTokenSubject$.asObservable();
  }

  updateUser(jwtTokenString: string): void {
    localStorage.setItem(this.jwtTokenStorage, jwtTokenString);
    this.currentTokenSubject$.next(jwtTokenString);
  }

  logout(): void {
    localStorage.removeItem(this.jwtTokenStorage);
    this.currentTokenSubject$.next('');
    this.router.navigateByUrl('/logout');
  }
}
