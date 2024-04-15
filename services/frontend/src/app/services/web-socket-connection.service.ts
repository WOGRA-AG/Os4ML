import { Injectable } from '@angular/core';
import { Observable, map, switchMap, retry, shareReplay } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketConnectionService {
  private webSocketProtocol = location.protocol === 'http:' ? 'ws' : 'wss';

  constructor(private userService: UserService) {}

  connect<T>(path: string): Observable<T> {
    return this.userService.currentToken$.pipe(
      map(
        token =>
          `${this.webSocketProtocol}://${location.host}${path}?usertoken=${token}`
      ),
      switchMap(url => webSocket<T>(url)),
      retry(),
      shareReplay(1)
    );
  }
}
