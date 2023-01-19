import { Injectable } from '@angular/core';
import { Observable, timer, map, switchMap, retry, shareReplay } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketConnectionService {
  private webSocketProtocol = location.protocol === 'http:' ? 'ws' : 'wss';

  constructor(private userService: UserService) { }

  connect(path: string): Observable<any> {
    const exponentialBackoff = (_: any, retryCount: number, base = 2) => timer(Math.pow(base, retryCount));

    return this.userService.currentToken$.pipe(
      map(token => `${this.webSocketProtocol}://${location.host}${path}?usertoken=${token}`),
      switchMap(url => webSocket(url)),
      retry({delay: exponentialBackoff}),
      shareReplay(1),
    );
  }
}
