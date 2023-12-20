import { Injectable } from '@angular/core';
import {
  concatWith,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  timeout,
} from 'rxjs';
import { User } from '../../../build/openapi/modelmanager';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly jwtTokenStorage = 'JWT_TOKEN';

  private readonly rawJwtToken$: Subject<string> = new Subject<string>();
  private readonly _currentToken$: Observable<string>;

  constructor() {
    const defaultToken$ = of('').pipe(concatWith(this.rawJwtToken$));
    this._currentToken$ = this.rawJwtToken$.pipe(
      timeout({ first: 500, with: () => defaultToken$ }),
      distinctUntilChanged(),
      shareReplay(1)
    );
    this.currentToken$.subscribe(token =>
      localStorage.setItem(this.jwtTokenStorage, token)
    );
  }

  get currentToken$(): Observable<string> {
    return this._currentToken$;
  }

  get currentUser$(): Observable<User> {
    return this.currentToken$.pipe(
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
          rawToken: token,
        };
      }),
      startWith({
        email: 'john@doe.com',
        id: 'id-1234',
        rawToken: '',
        firstName: 'John',
        lastName: 'Doe',
      })
    );
  }

  addToken(jwtToken: string): void {
    this.rawJwtToken$.next(jwtToken);
  }

  logout(): void {
    localStorage.removeItem(this.jwtTokenStorage);
    this.rawJwtToken$.next('');
    window.location.href = '/logout';
  }
}
