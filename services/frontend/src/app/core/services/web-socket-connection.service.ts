import { Injectable } from '@angular/core';
import { Observable, map, switchMap, retry, shareReplay, debounceTime } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketConnectionService {
  private webSocketProtocol = location.protocol === 'http:' ? 'ws' : 'wss';

  constructor(private userService: UserService) { }

  connect(path: string): Observable<any> {
    return this.userService.currentToken$.pipe(
      debounceTime(100),
      map(token => `${this.webSocketProtocol}://${location.host}${path}?usertoken=${token}`),
      switchMap(url => webSocket(url)),
      retry(),
      shareReplay(1),
    );
  }
}
