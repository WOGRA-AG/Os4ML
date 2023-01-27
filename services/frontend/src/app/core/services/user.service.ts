import { Injectable } from '@angular/core';
import {concatWith, distinctUntilChanged, filter, map, Observable, of, shareReplay, startWith, Subject, switchMap, takeUntil, timer} from 'rxjs';
import {User} from '../../../../build/openapi/modelmanager';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly jwtTokenStorage = 'JWT_TOKEN';

  private readonly rawJwtToken$: Subject<string> = new Subject<string>();
  private readonly currentTokenPrivate$: Observable<string>;

  constructor(private router: Router) {
    const jwtToken = this.rawJwtToken$.pipe(
      shareReplay(1)
    );
    const defaultToken$ = timer(500).pipe(
      switchMap(() => of('')),
      takeUntil(jwtToken),
    );
    this.currentTokenPrivate$ = defaultToken$.pipe(
      concatWith(jwtToken),
      distinctUntilChanged(),
      shareReplay(1),
    );
    this.currentToken$.subscribe(token => localStorage.setItem(this.jwtTokenStorage, token));
  }

  get currentToken$(): Observable<string> {
    return this.currentTokenPrivate$;
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
          rawToken: token
        };
      }),
      startWith({email: '', id: '', rawToken: ''}),
    );
  }

  addToken(jwtToken: string): void {
    this.rawJwtToken$.next(jwtToken);
  }

  logout(): void {
    localStorage.removeItem(this.jwtTokenStorage);
    this.rawJwtToken$.next('');
    this.router.navigateByUrl('/logout');
  }
}
