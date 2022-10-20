import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../../../../build/openapi/jobmanager';

@Injectable({
  providedIn: 'root'
})
export class UserFacade {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>({email: '', id: '', rawToken: ''});

  private jwtToken$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly jwtTokenStorage = 'JWT_TOKEN';

  constructor(private router: Router) {
    this.jwtToken$.pipe().subscribe(
      token => {
        if (token) {
          const encodedPayload = token.split('.')[1];
          const payload = window.atob(encodedPayload);
          const kcToken = JSON.parse(payload);
          const user: User = {
            id: kcToken.sub,
            email: kcToken.email,
            firstName: kcToken.given_name,
            lastName: kcToken.family_name,
            rawToken: token
          };
          this.currentUser$.next(user);
        }
      }
    );
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
