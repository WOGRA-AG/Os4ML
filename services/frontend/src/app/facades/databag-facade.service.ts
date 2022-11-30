import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {UserFacade} from '../user/services/user-facade.service';
import {User} from '../../../build/openapi/modelmanager';

@Injectable({
  providedIn: 'root'
})
export class DatabagFacade {

  private basePath = 'model-manager.os4ml.svc.cluster.local:8000'; // TODO separate stages
  private url = `ws://${this.basePath}/apis/v1beta1/model-manager/databags`;
  private user: User = {id: '', email: '', rawToken: ''};

  constructor(private userFacade: UserFacade) {
    this.userFacade.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  connect(): Observable<string> {
    const queryParam = `?usertoken=${this.user.rawToken}`;
    const url = this.url + queryParam;
    const ws = new WebSocket(url);

    return new Observable(subscriber => {
      ws.onmessage = (evt) => {
        subscriber.next(evt.data);
      };
    });
  }
}
